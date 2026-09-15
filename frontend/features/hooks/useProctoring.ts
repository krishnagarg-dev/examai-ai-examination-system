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
  const streamRef = useRef<MediaStream | null>(null);

  const detectorRef =
    useRef<cocoSsd.ObjectDetection | null>(null);

  const landmarkerRef =
    useRef<FaceLandmarker | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const detectingRef = useRef(false);
  const mountedRef = useRef(true);
  const terminatedRef = useRef(false);

  const violationTimesRef = useRef<
    Partial<Record<ViolationKey, number>>
  >({});

  const verificationStartRef =
    useRef<number | null>(null);

  const [cameraActive, setCameraActive] =
    useState(false);
    

  const [modelsReady, setModelsReady] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [verified, setVerified] =
    useState(false);

  const [verificationProgress, setVerificationProgress] =
    useState(0);

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

  const [violations, setViolations] =
    useState(0);

  const [showWarning, setShowWarning] =
    useState(false);

  const [warning, setWarning] =
    useState("");

  const [terminated, setTerminated] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

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

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    detectorRef.current = null;
    landmarkerRef.current = null;

    setCameraActive(false);
    setModelsReady(false);
  }, [videoRef]);

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

      const lastTime =
        violationTimesRef.current[type] ?? 0;

      // Prevent repeated counting of the same
      // violation on every detection interval.
      if (now - lastTime < 3000) {
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
          faceCenterX - videoCenterX,
        ) <= maxOffsetX &&
        Math.abs(
          faceCenterY - videoCenterY,
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

  const processFrame = useCallback(
    async () => {
      if (
        !videoRef.current ||
        !detectorRef.current ||
        !landmarkerRef.current ||
        detectingRef.current ||
        terminatedRef.current
      ) {
        return;
      }

      const video = videoRef.current;

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
        // -------------------------------
        // COCO-SSD OBJECT DETECTION
        // -------------------------------
        const detectedObjects =
          await detectorRef.current.detect(
            video,
          );

        const filteredObjects: DetectedObject[] =
          detectedObjects
            .filter(
              (item) =>
                item.score >=
                PROCTORING_CONFIG.thresholds
                  .objectDetection,
            )
            .map((item) => ({
              x: item.bbox[0],
              y: item.bbox[1],
              width: item.bbox[2],
              height: item.bbox[3],
              label: item.class,
              score: item.score,
            }));

        setObjects(filteredObjects);

        const suspiciousObjects =
          filteredObjects.filter((item) =>
            [
              "cell phone",
              "mobile phone",
              "laptop",
            ].includes(
              item.label.toLowerCase(),
            ),
          );

        if (suspiciousObjects.length > 0) {
          setObjectStatus(
            "Suspicious object detected",
          );

          const phoneDetected =
            suspiciousObjects.some((item) =>
              item.label
                .toLowerCase()
                .includes("phone"),
            );

          if (phoneDetected) {
            registerViolation(
              "MOBILE_PHONE",
              "Mobile phone detected.",
            );
          } else {
            registerViolation(
              "SUSPICIOUS_OBJECT",
              "Suspicious object detected.",
            );
          }
        } else {
          setObjectStatus(
            "No suspicious object",
          );
        }

        // -------------------------------
        // MEDIAPIPE FACE DETECTION
        // -------------------------------
        const result =
          landmarkerRef.current.detectForVideo(
            video,
            performance.now(),
          );

        const faces =
          result.faceLandmarks ?? [];

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

        const face = faces[0];

        // -------------------------------
        // FACE BOUNDING BOX
        // -------------------------------
        const xs = face.map(
          (point) => point.x,
        );

        const ys = face.map(
          (point) => point.y,
        );

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);

        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

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

        // -------------------------------
        // IMPORTANT LANDMARKS
        // -------------------------------
        const detectedLandmarks: Point[] = [];

        for (const index of IMPORTANT_LANDMARKS) {
          const point = face[index];

          if (!point) {
            continue;
          }

          detectedLandmarks.push({
            x:
              point.x *
              video.videoWidth,

            y:
              point.y *
              video.videoHeight,
          });
        }

        setLandmarks(
          detectedLandmarks,
        );

        // -------------------------------
        // FACE QUALITY
        // -------------------------------
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

        // -------------------------------
        // 8-SECOND VERIFICATION
        // -------------------------------
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
              (elapsedSeconds /
                PROCTORING_CONFIG
                  .verificationSeconds) *
              100,
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
            setVerificationProgress(100);

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
    },
    [
      registerViolation,
      verified,
      verifyFaceQuality,
      videoRef,
    ],
  );

  // -----------------------------------
  // CLEANUP
  // -----------------------------------
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      stop();
    };
  }, [stop]);

  // -----------------------------------
  // CAMERA + AI MODEL INITIALIZATION
  // -----------------------------------
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const initialize = async () => {
      // ---------------------------------
      // CAMERA
      // ---------------------------------
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
          await navigator.mediaDevices.getUserMedia(
            {
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
            },
          );

        if (cancelled) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop(),
            );

          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          const video = videoRef.current;

          video.srcObject = stream;
          video.muted = true;
          video.autoplay = true;
          video.playsInline = true;

          video.setAttribute("autoplay", "");
          video.setAttribute("muted", "");
          video.setAttribute("playsinline", "");

          await new Promise<void>((resolve) => {
            if (video.readyState >= 2) {
              resolve();
              return;
            }

            const onLoadedData = () => {
              video.removeEventListener(
                "loadeddata",
                onLoadedData,
              );

              resolve();
            };

            video.addEventListener(
              "loadeddata",
              onLoadedData,
              { once: true },
            );
          });

          await video.play();
        }

        console.log(
          "[ExamAI] Camera stream attached:",
          {
            readyState: videoRef.current?.readyState,
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight,
            hasStream: Boolean(
              videoRef.current?.srcObject,
            ),
          },
        );

        setCameraActive(true);

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

        setCameraActive(false);

        return;
      }

      // ---------------------------------
      // AI MODELS
      // ---------------------------------
      try {
        setFaceStatus(
          "Loading Face AI...",
        );

        setObjectStatus(
          "Loading Object AI...",
        );

        console.log(
          "[ExamAI] Loading AI models...",
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

        setModelsReady(true);

        setFaceStatus(
          "Face AI ready",
        );

        setObjectStatus(
          "Object AI ready",
        );

        console.log(
          "[ExamAI] All AI models ready",
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
  }, [enabled, videoRef]);

  // -----------------------------------
  // CONTINUOUS AI LOOP
  // -----------------------------------
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

        timerRef.current = null;
      }
    };
  }, [
    enabled,
    modelsReady,
    cameraActive,
    processFrame,
  ]);

  // -----------------------------------
  // TAB SWITCH + FULLSCREEN
  // -----------------------------------
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

  return {
    cameraActive,
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