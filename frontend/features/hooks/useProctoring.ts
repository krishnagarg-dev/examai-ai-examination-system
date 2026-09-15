"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { FaceLandmarker } from "@mediapipe/tasks-vision";

import { loadProctoringModels } from "../models/models";
import { PROCTORING_CONFIG } from "../config";

import type {
  DetectedObject,
  FaceBox,
  Point,
} from "../types";

const IMPORTANT_LANDMARKS = [
  33,
  133,
  362,
  263,
  1,
  234,
  127,
  454,
  356,
];

type ViolationKey =
  | "NO_FACE"
  | "MULTIPLE_FACES"
  | "FACE_OBSTRUCTED"
  | "MOBILE_PHONE"
  | "SUSPICIOUS_OBJECT"
  | "TAB_SWITCH"
  | "FULLSCREEN_EXIT";

export function useProctoring(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled = true,
) {
  // -----------------------------------------
  // CAMERA / AI REFS
  // -----------------------------------------

  const streamRef =
    useRef<MediaStream | null>(null);

  const detectorRef =
    useRef<cocoSsd.ObjectDetection | null>(null);

  const landmarkerRef =
    useRef<FaceLandmarker | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const detectingRef =
    useRef(false);

  const mountedRef =
    useRef(true);

  const terminatedRef =
    useRef(false);

  const violationTimesRef =
    useRef<Partial<Record<ViolationKey, number>>>({});

  const verificationStartRef =
    useRef<number | null>(null);

  // -----------------------------------------
  // CAMERA STATE
  // -----------------------------------------

  const [cameraActive, setCameraActive] =
    useState(false);

  const [cameraStream, setCameraStream] =
    useState<MediaStream | null>(null);

  // -----------------------------------------
  // AI STATE
  // -----------------------------------------

  const [modelsReady, setModelsReady] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [verified, setVerified] =
    useState(false);

  const [verificationProgress, setVerificationProgress] =
    useState(0);

  // -----------------------------------------
  // DETECTION STATE
  // -----------------------------------------

  const [faceStatus, setFaceStatus] =
    useState("Waiting for face...");

  const [objectStatus, setObjectStatus] =
    useState("Waiting for AI...");

  const [faceBox, setFaceBox] =
    useState<FaceBox | null>(null);

  const [landmarks, setLandmarks] =
    useState<Point[]>([]);

  const [objects, setObjects] =
    useState<DetectedObject[]>([]);

  // -----------------------------------------
  // VIOLATION STATE
  // -----------------------------------------

  const [violations, setViolations] =
    useState(0);

  const [showWarning, setShowWarning] =
    useState(false);

  const [warning, setWarning] =
    useState("");

  const [terminated, setTerminated] =
    useState(false);

  // -----------------------------------------
  // CAMERA ERROR
  // -----------------------------------------

  const [cameraError, setCameraError] =
    useState("");

  // -----------------------------------------
  // STOP EVERYTHING
  // -----------------------------------------

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    setCameraStream(null);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    detectorRef.current = null;
    landmarkerRef.current = null;

    setCameraActive(false);
    setModelsReady(false);
  }, [videoRef]);

  // -----------------------------------------
  // REGISTER VIOLATION
  // -----------------------------------------

  const registerViolation = useCallback(
    (
      type: ViolationKey,
      message: string,
    ) => {
      if (
        !mountedRef.current ||
        terminatedRef.current
      ) {
        return;
      }

      const now = Date.now();

      const previousTime =
        violationTimesRef.current[type] ?? 0;

      if (now - previousTime < 3000) {
        return;
      }

      violationTimesRef.current[type] = now;

      setViolations((current) => {
        const next = current + 1;

        setWarning(message);
        setShowWarning(true);

        if (
          next >=
          PROCTORING_CONFIG.maxViolations
        ) {
          terminatedRef.current = true;
          setTerminated(true);
        }

        return next;
      });
    },
    [],
  );

  // -----------------------------------------
  // FACE QUALITY CHECK
  // -----------------------------------------

  const verifyFaceQuality = useCallback(
    (
      faceCount: number,
      box: FaceBox | null,
    ) => {
      if (faceCount === 0) {
        setFaceStatus("No face detected");

        verificationStartRef.current = null;
        setVerificationProgress(0);

        return false;
      }

      if (faceCount > 1) {
        setFaceStatus(
          "Multiple faces detected",
        );

        verificationStartRef.current = null;
        setVerificationProgress(0);

        return false;
      }

      if (!box) {
        setFaceStatus("Face not clear");

        verificationStartRef.current = null;
        setVerificationProgress(0);

        return false;
      }

      const video = videoRef.current;

      if (
        !video ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        return false;
      }

      const faceCenterX =
        box.x + box.width / 2;

      const faceCenterY =
        box.y + box.height / 2;

      const videoCenterX =
        video.videoWidth / 2;

      const videoCenterY =
        video.videoHeight / 2;

      const maxOffsetX =
        video.videoWidth *
        PROCTORING_CONFIG.face.centerOffsetX;

      const maxOffsetY =
        video.videoHeight *
        PROCTORING_CONFIG.face.centerOffsetY;

      const centered =
        Math.abs(
          faceCenterX -
          videoCenterX,
        ) <= maxOffsetX &&
        Math.abs(
          faceCenterY -
          videoCenterY,
        ) <= maxOffsetY;

      const largeEnough =
        box.width >=
        PROCTORING_CONFIG.face.minWidth &&
        box.height >=
        PROCTORING_CONFIG.face.minHeight;

      if (!centered || !largeEnough) {
        setFaceStatus(
          "Center your face in the camera",
        );

        verificationStartRef.current = null;
        setVerificationProgress(0);

        return false;
      }

      setFaceStatus("Face detected");

      return true;
    },
    [videoRef],
  );

  // -----------------------------------------
  // PROCESS ONE VIDEO FRAME
  // -----------------------------------------

  const processFrame =
    useCallback(async () => {
      if (
        !videoRef.current ||
        !detectorRef.current ||
        !landmarkerRef.current ||
        detectingRef.current ||
        terminatedRef.current
      ) {
        return;
      }

      const video =
        videoRef.current;

      if (
        video.readyState <
        HTMLMediaElement.HAVE_CURRENT_DATA ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        return;
      }

      detectingRef.current = true;

      try {
        // =====================================
        // COCO-SSD OBJECT DETECTION
        // No filter(), no map(), no type issue.
        // =====================================

        const detected =
          await detectorRef.current.detect(
            video,
          );

        const nextObjects: DetectedObject[] = [];

        for (const detection of detected) {
          if (
            detection.score <
            PROCTORING_CONFIG
              .thresholds
              .objectDetection
          ) {
            continue;
          }

          const x =
            detection.bbox[0];

          const y =
            detection.bbox[1];

          const width =
            detection.bbox[2];

          const height =
            detection.bbox[3];

          const label =
            detection.class;

          nextObjects.push({
            x,
            y,
            width,
            height,
            label,
            score: detection.score,
          });
        }

        setObjects(nextObjects);

        // =====================================
        // SUSPICIOUS OBJECT CHECK
        // =====================================

        let phoneDetected = false;
        let suspiciousDetected = false;

        for (const object of nextObjects) {
          const normalized =
            object.label.toLowerCase();

          if (
            normalized === "cell phone" ||
            normalized === "mobile phone"
          ) {
            phoneDetected = true;
            suspiciousDetected = true;
          }

          if (
            normalized === "laptop"
          ) {
            suspiciousDetected = true;
          }
        }

        if (phoneDetected) {
          setObjectStatus(
            "Mobile phone detected",
          );

          registerViolation(
            "MOBILE_PHONE",
            "Mobile phone detected.",
          );
        } else if (suspiciousDetected) {
          setObjectStatus(
            "Suspicious object detected",
          );

          registerViolation(
            "SUSPICIOUS_OBJECT",
            "Suspicious object detected.",
          );
        } else {
          setObjectStatus(
            "No suspicious object",
          );
        }

        // =====================================
        // MEDIAPIPE FACE DETECTION
        // =====================================

        const result =
          landmarkerRef.current.detectForVideo(
            video,
            performance.now(),
          );

        const faces =
          result.faceLandmarks ?? [];

        // -------------------------------------
        // NO FACE
        // -------------------------------------

        if (faces.length === 0) {
          setFaceBox(null);
          setLandmarks([]);

          setFaceStatus(
            "No face detected",
          );

          if (verified) {
            registerViolation(
              "NO_FACE",
              "Face is not visible.",
            );
          }

          verificationStartRef.current =
            null;

          setVerificationProgress(0);

          return;
        }

        // -------------------------------------
        // MULTIPLE FACES
        // -------------------------------------

        if (faces.length > 1) {
          setFaceStatus(
            "Multiple faces detected",
          );

          if (verified) {
            registerViolation(
              "MULTIPLE_FACES",
              "Multiple faces detected.",
            );
          }

          verificationStartRef.current =
            null;

          setVerificationProgress(0);

          return;
        }

        // -------------------------------------
        // SINGLE FACE
        // -------------------------------------

        const face =
          faces[0];

        const xs: number[] = [];
        const ys: number[] = [];

        for (const point of face) {
          xs.push(point.x);
          ys.push(point.y);
        }

        const minX =
          Math.min(...xs);

        const maxX =
          Math.max(...xs);

        const minY =
          Math.min(...ys);

        const maxY =
          Math.max(...ys);

        const box: FaceBox = {
          x:
            minX *
            video.videoWidth,

          y:
            minY *
            video.videoHeight,

          width:
            (maxX - minX) *
            video.videoWidth,

          height:
            (maxY - minY) *
            video.videoHeight,
        };

        setFaceBox(box);

        // -------------------------------------
        // IMPORTANT LANDMARKS
        // -------------------------------------

        const nextLandmarks: Point[] = [];

        for (
          const index of IMPORTANT_LANDMARKS
        ) {
          const point =
            face[index];

          if (!point) {
            continue;
          }

          nextLandmarks.push({
            x:
              point.x *
              video.videoWidth,

            y:
              point.y *
              video.videoHeight,
          });
        }

        setLandmarks(
          nextLandmarks,
        );

        // -------------------------------------
        // FACE QUALITY
        // -------------------------------------

        const goodFace =
          verifyFaceQuality(
            1,
            box,
          );

        if (!goodFace) {
          if (verified) {
            registerViolation(
              "FACE_OBSTRUCTED",
              "Face is not properly visible or centered.",
            );
          }

          return;
        }

        // -------------------------------------
        // 8-SECOND CONTINUOUS VERIFICATION
        // -------------------------------------

        if (!verified) {
          if (
            verificationStartRef.current ===
            null
          ) {
            verificationStartRef.current =
              Date.now();

            setVerifying(true);
          }

          const elapsedSeconds =
            (Date.now() -
              verificationStartRef.current) /
            1000;

          const progress =
            Math.min(
              (
                elapsedSeconds /
                PROCTORING_CONFIG
                  .verificationSeconds
              ) * 100,
              100,
            );

          setVerificationProgress(
            progress,
          );

          if (
            elapsedSeconds >=
            PROCTORING_CONFIG
              .verificationSeconds
          ) {
            setVerified(true);

            setVerifying(false);

            setVerificationProgress(
              100,
            );

            setFaceStatus(
              "Face verification successful",
            );
          }
        }
      } catch (error) {
        console.error(
          "[ExamAI] Frame processing error:",
          error,
        );
      } finally {
        detectingRef.current = false;
      }
    }, [
      registerViolation,
      verified,
      verifyFaceQuality,
      videoRef,
    ]);

  // -----------------------------------------
  // CLEANUP
  // -----------------------------------------

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      stop();
    };
  }, [stop]);

  // -----------------------------------------
  // CAMERA + MODELS
  // -----------------------------------------


  useEffect(() => {
  const video = videoRef.current;

  if (!video || !cameraStream) {
    return;
  }

  video.srcObject = cameraStream;
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;

  const startPreview = async () => {
    try {
      if (video.srcObject !== cameraStream) {
        video.srcObject = cameraStream;
      }

      await video.play();

      console.log("[ExamAI] LIVE VIDEO STARTED", {
        streamActive: cameraStream.active,
        videoTracks:
          cameraStream.getVideoTracks().length,
        trackState:
          cameraStream.getVideoTracks()[0]?.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        paused: video.paused,
      });
    } catch (error) {
      console.error(
        "[ExamAI] LIVE VIDEO PLAY ERROR:",
        error,
      );
    }
  };

  void startPreview();
}, [cameraStream, videoRef]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const initialize =
      async () => {
        // -----------------------------------
        // CAMERA
        // -----------------------------------

        try {
          setCameraError("");

          setFaceStatus(
            "Starting camera...",
          );

          setObjectStatus(
            "Waiting for AI...",
          );

          if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices
              .getUserMedia
          ) {
            throw new Error(
              "Camera access is not supported by this browser.",
            );
          }

          const stream =
            await navigator.mediaDevices
              .getUserMedia({
                video: {
                  width: {
                    ideal:
                      PROCTORING_CONFIG
                        .camera.width,
                  },

                  height: {
                    ideal:
                      PROCTORING_CONFIG
                        .camera.height,
                  },

                  facingMode: "user",
                },

                audio: false,
              });

          if (cancelled) {
            stream
              .getTracks()
              .forEach(
                (track) =>
                  track.stop(),
              );

            return;
          }

          streamRef.current = stream;
          setCameraStream(stream);

          // ---------------------------------
          // ATTACH STREAM TO VIDEO
          // ---------------------------------

          const video =
            videoRef.current;

          streamRef.current = stream;
          setCameraStream(stream);
          setCameraActive(true);


          setCameraActive(
            true,
          );

          console.log(
            "[ExamAI] Camera connected",
          );
        } catch (error) {
          console.error(
            "[ExamAI] CAMERA ERROR:",
            error,
          );

          setCameraError(
            error instanceof Error
              ? error.message
              : "Unable to access camera.",
          );

          setCameraActive(
            false,
          );

          return;
        }

        // -----------------------------------
        // AI MODELS
        // -----------------------------------

        try {
          setFaceStatus(
            "Loading Face AI...",
          );

          setObjectStatus(
            "Loading Object AI...",
          );

          const models =
            await loadProctoringModels();

          if (cancelled) {
            return;
          }

          detectorRef.current =
            models.objectDetector;

          landmarkerRef.current =
            models.faceLandmarker;

          setModelsReady(
            true,
          );

          setFaceStatus(
            "Face AI ready",
          );

          setObjectStatus(
            "Object AI ready",
          );
        } catch (error) {
          console.error(
            "[ExamAI] AI MODEL ERROR:",
            error,
          );

          setFaceStatus(
            error instanceof Error
              ? `Face AI error: ${error.message}`
              : "Face AI failed to load",
          );

          setObjectStatus(
            "Object AI failed to load",
          );
        }
      };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    videoRef,
  ]);

  // -----------------------------------------
  // RE-ATTACH CAMERA STREAM REACTIVELY
  // -----------------------------------------

  useEffect(() => {
    if (!cameraStream) {
      return;
    }

    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    video.srcObject =
      cameraStream;

    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    const playStream =
      async () => {
        try {
          if (
            video.srcObject !==
            cameraStream
          ) {
            video.srcObject =
              cameraStream;
          }

          await video.play();

          console.log(
            "[ExamAI] Live camera preview started",
            {
              streamActive:
                cameraStream.active,

              videoWidth:
                video.videoWidth,

              videoHeight:
                video.videoHeight,

              readyState:
                video.readyState,
            },
          );
        } catch (error) {
          console.error(
            "[ExamAI] Preview playback error:",
            error,
          );
        }
      };

    void playStream();

    return () => {
      // Do not stop camera here.
      // stop() owns stream cleanup.
    };
  }, [
    cameraStream,
    videoRef,
  ]);

  // -----------------------------------------
  // CONTINUOUS DETECTION LOOP
  // -----------------------------------------

  useEffect(() => {
    if (
      !enabled ||
      !modelsReady ||
      !cameraActive
    ) {
      return;
    }

    timerRef.current =
      setInterval(() => {
        void processFrame();
      }, PROCTORING_CONFIG.detectionIntervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current,
        );

        timerRef.current =
          null;
      }
    };
  }, [
    enabled,
    modelsReady,
    cameraActive,
    processFrame,
  ]);

  // -----------------------------------------
  // TAB + FULLSCREEN MONITORING
  // -----------------------------------------

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "hidden" &&
          verified
        ) {
          registerViolation(
            "TAB_SWITCH",
            "Tab switching is not allowed during the examination.",
          );
        }
      };

    const handleFullscreenChange =
      () => {
        if (
          document.fullscreenElement ===
          null &&
          verified
        ) {
          registerViolation(
            "FULLSCREEN_EXIT",
            "Fullscreen mode was exited.",
          );
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [
    enabled,
    verified,
    registerViolation,
  ]);

  // -----------------------------------------
  // RETURN
  // -----------------------------------------

  return {
    cameraActive,
    cameraStream,

    modelsReady,

    verifying,
    verified,
    verificationProgress,

    faceStatus,
    objectStatus,

    faceBox,
    landmarks,
    objects,

    violations,

    showWarning,
    setShowWarning,

    warning,
    setWarning,

    terminated,

    cameraError,

    stop,
  };
}