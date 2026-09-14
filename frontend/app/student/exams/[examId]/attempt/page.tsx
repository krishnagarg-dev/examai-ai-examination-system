"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

type Exam = {
  _id: string;
  title: string;
  code: string;
  subject?: string;
  description?: string;
  duration: number;
  totalMarks: number;
  startTime: string;
  endTime: string;
  status: string;
};

type Question = {
  id: number;
  question: string;
  options: string[];
};

type FaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

type LandmarkPoint = {
  x: number;
  y: number;
};

type ObjectBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  score: number;
};

const fallbackQuestions: Question[] = [
  {
    id: 1,
    question:
      "Which technology is primarily used to provide on-demand computing resources over the internet?",
    options: [
      "Cloud Computing",
      "Operating Systems",
      "Compiler Design",
      "Data Structures",
    ],
  },
  {
    id: 2,
    question:
      "Which cloud service model provides virtual machines, storage and networking?",
    options: ["SaaS", "PaaS", "IaaS", "DBaaS"],
  },
  {
    id: 3,
    question:
      "Which cloud deployment model is dedicated to a single organization?",
    options: [
      "Public Cloud",
      "Private Cloud",
      "Hybrid Cloud",
      "Community Internet",
    ],
  },
  {
    id: 4,
    question:
      "Which characteristic allows cloud resources to increase or decrease based on demand?",
    options: [
      "Elasticity",
      "Encryption",
      "Virtualization",
      "Authentication",
    ],
  },
  {
    id: 5,
    question:
      "Which of the following is an example of a cloud storage service?",
    options: [
      "Amazon S3",
      "HTML",
      "JavaScript",
      "CSS",
    ],
  },
];

export default function ExamAttemptPage() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const faceLandmarkerRef =
    useRef<FaceLandmarker | null>(null);

  const objectDetectorRef =
    useRef<cocoSsd.ObjectDetection | null>(null);

  const detectionIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const isDetectingRef = useRef(false);
  const terminatedRef = useRef(false);
  const activeIssuesRef = useRef<Set<string>>(new Set());

  const multiplePeopleFramesRef = useRef(0);
  const phoneFramesRef = useRef(0);
  const noFaceFramesRef = useRef(0);
  const obstructionFramesRef = useRef(0);

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] =
    useState<Question[]>(fallbackQuestions);

  const [examLoading, setExamLoading] = useState(true);
  const [examError, setExamError] = useState("");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<number, number>>({});

  const [reviewQuestions, setReviewQuestions] =
    useState<number[]>([]);

  const [violations, setViolations] = useState(0);

  const [timeLeft, setTimeLeft] =
    useState(2 * 60 * 60);

  const [cameraError, setCameraError] = useState("");
  const [cameraActive, setCameraActive] =
    useState(false);

  const [modelsLoading, setModelsLoading] =
    useState(true);

  const [faceStatus, setFaceStatus] =
    useState("Loading face AI...");

  const [objectStatus, setObjectStatus] =
    useState("Loading object AI...");

  const [faceBox, setFaceBox] =
    useState<FaceBox>(null);

  const [landmarkPoints, setLandmarkPoints] =
    useState<LandmarkPoint[]>([]);

  const [objectBoxes, setObjectBoxes] =
    useState<ObjectBox[]>([]);

  const [warning, setWarning] = useState("");
  const [showWarning, setShowWarning] =
    useState(false);

  const [examTerminated, setExamTerminated] =
    useState(false);

  const question =
    questions[currentQuestion] || fallbackQuestions[0];

  /*
   * LOAD REAL EXAM
   */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setExamLoading(true);
        setExamError("");

        const response = await fetch(
          `/api/exams/${examId}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load examination",
          );
        }

        setExam(data);

        const durationSeconds =
          Number(data.duration || 120) * 60;

        setTimeLeft(durationSeconds);
      } catch (error) {
        console.error("Exam loading error:", error);

        setExamError(
          error instanceof Error
            ? error.message
            : "Failed to load examination.",
        );
      } finally {
        setExamLoading(false);
      }
    };

    if (examId) {
      fetchExam();
    }
  }, [examId]);

  /*
   * CAMERA STOP
   */
  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
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

    faceLandmarkerRef.current = null;
    objectDetectorRef.current = null;

    setCameraActive(false);
  };

  /*
   * VIOLATIONS
   */
  const addViolation = (
    message: string,
    issueType: string,
  ) => {
    if (terminatedRef.current) {
      return;
    }

    if (
      activeIssuesRef.current.has(issueType)
    ) {
      return;
    }

    activeIssuesRef.current.add(issueType);

    setViolations((previous) => {
      const newViolations = previous + 1;

      if (newViolations >= 3) {
        terminatedRef.current = true;

        setExamTerminated(true);

        setWarning(
          "You have reached the maximum limit of 3 proctoring violations. Your examination has been terminated.",
        );

        setShowWarning(true);

        stopCamera();

        setTimeout(() => {
          router.push(
            `/student/exams/${examId}/submit`,
          );
        }, 4000);
      } else {
        setWarning(message);
        setShowWarning(true);
      }

      return newViolations;
    });
  };

  const clearIssue = (
    issueType: string,
  ) => {
    activeIssuesRef.current.delete(
      issueType,
    );
  };

  /*
   * CAMERA + AI
   */
  useEffect(() => {
    let isMounted = true;

    const startProctoring =
      async () => {
        try {
          setCameraError("");
          setModelsLoading(true);

          /*
           * CAMERA FIRST
           */
          const stream =
            await navigator.mediaDevices.getUserMedia(
              {
                video: {
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                  facingMode: "user",
                },
                audio: true,
              },
            );

          if (!isMounted) {
            stream
              .getTracks()
              .forEach((track) =>
                track.stop(),
              );
            return;
          }

          streamRef.current = stream;

          const video =
            videoRef.current;

          if (!video) {
            throw new Error(
              "Video element is unavailable.",
            );
          }

          video.srcObject = stream;

          await new Promise<void>(
            (resolve) => {
              if (
                video.readyState >= 1
              ) {
                resolve();
                return;
              }

              video.onloadedmetadata =
                () => resolve();
            },
          );

          await video.play();

          if (!isMounted) {
            return;
          }

          /*
           * CAMERA IS ACTIVE EVEN WHILE
           * AI MODELS ARE LOADING
           */
          setCameraActive(true);
          setFaceStatus(
            "Camera active • Loading face AI...",
          );
          setObjectStatus(
            "Camera active • Loading object AI...",
          );

          /*
           * INITIALIZE TFJS
           */
          await tf.ready();

          try {
            await tf.setBackend("webgl");
          } catch {
            console.warn(
              "WebGL unavailable. TensorFlow.js will use fallback backend.",
            );
          }

          /*
           * LOAD AI MODELS IN PARALLEL
           */
          const objectModelPromise =
            cocoSsd.load({
              base: "mobilenet_v2",
            });

          const visionPromise =
            FilesetResolver.forVisionTasks(
              "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
            );

          const [
            objectDetector,
            vision,
          ] = await Promise.all([
            objectModelPromise,
            visionPromise,
          ]);

          const faceLandmarker =
            await FaceLandmarker.createFromOptions(
              vision,
              {
                baseOptions: {
                  modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                  delegate: "GPU",
                },

                runningMode: "VIDEO",

                numFaces: 2,

                minFaceDetectionConfidence: 0.6,

                minFacePresenceConfidence: 0.6,

                minTrackingConfidence: 0.6,

                outputFaceBlendshapes: true,
              },
            );

          if (!isMounted) {
            return;
          }

          objectDetectorRef.current =
            objectDetector;

          faceLandmarkerRef.current =
            faceLandmarker;

          setModelsLoading(false);

          setFaceStatus(
            "AI face detection active",
          );

          setObjectStatus(
            "AI object detection active",
          );

          /*
           * START DETECTION LOOP
           */
          detectionIntervalRef.current =
            setInterval(async () => {
              if (
                !videoRef.current ||
                videoRef.current.readyState <
                  3 ||
                isDetectingRef.current ||
                terminatedRef.current
              ) {
                return;
              }

              const currentVideo =
                videoRef.current;

              if (
                !faceLandmarkerRef.current ||
                !objectDetectorRef.current
              ) {
                return;
              }

              isDetectingRef.current = true;

              try {
                /*
                 * FACE DETECTION
                 */
                const faceResult =
                  faceLandmarkerRef.current.detectForVideo(
                    currentVideo,
                    performance.now(),
                  );

                const detectedFaces =
                  faceResult.faceLandmarks;

                const faceCount =
                  detectedFaces.length;

                if (faceCount === 0) {
                  noFaceFramesRef.current += 1;

                  setFaceBox(null);
                  setLandmarkPoints([]);

                  setFaceStatus(
                    "No face detected",
                  );

                  if (
                    noFaceFramesRef.current >=
                    3
                  ) {
                    addViolation(
                      "No face is visible. Please keep your face clearly visible.",
                      "NO_FACE",
                    );
                  }
                } else {
                  noFaceFramesRef.current = 0;

                  clearIssue("NO_FACE");

                  const landmarks =
                    detectedFaces[0];

                  const xs =
                    landmarks.map(
                      (point) => point.x,
                    );

                  const ys =
                    landmarks.map(
                      (point) => point.y,
                    );

                  const minX =
                    Math.min(...xs);

                  const maxX =
                    Math.max(...xs);

                  const minY =
                    Math.min(...ys);

                  const maxY =
                    Math.max(...ys);

                  const paddingX =
                    0.03;

                  const paddingY =
                    0.05;

                  setFaceBox({
                    x: Math.max(
                      0,
                      minX - paddingX,
                    ),

                    y: Math.max(
                      0,
                      minY - paddingY,
                    ),

                    width: Math.min(
                      1 -
                        Math.max(
                          0,
                          minX -
                            paddingX,
                        ),
                      maxX -
                        minX +
                        paddingX * 2,
                    ),

                    height: Math.min(
                      1 -
                        Math.max(
                          0,
                          minY -
                            paddingY,
                        ),
                      maxY -
                        minY +
                        paddingY * 2,
                    ),
                  });

                  const importantIndexes =
                    [
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

                  const visiblePoints =
                    importantIndexes
                      .filter(
                        (index) =>
                          landmarks[
                            index
                          ] !==
                          undefined,
                      )
                      .map(
                        (index) => ({
                          x:
                            landmarks[
                              index
                            ].x,

                          y:
                            landmarks[
                              index
                            ].y,
                        }),
                      );

                  setLandmarkPoints(
                    visiblePoints,
                  );

                  if (
                    visiblePoints.length <
                    8
                  ) {
                    obstructionFramesRef.current +=
                      1;

                    setFaceStatus(
                      "Face partially blocked",
                    );

                    if (
                      obstructionFramesRef.current >=
                      3
                    ) {
                      addViolation(
                        "Your face appears partially blocked. Keep your complete face visible.",
                        "FACE_OBSTRUCTION",
                      );
                    }
                  } else {
                    obstructionFramesRef.current = 0;

                    clearIssue(
                      "FACE_OBSTRUCTION",
                    );

                    if (
                      faceCount > 1
                    ) {
                      setFaceStatus(
                        `${faceCount} faces detected`,
                      );
                    } else {
                      setFaceStatus(
                        "Face detected • Tracking active",
                      );
                    }
                  }

                  /*
                   * MULTIPLE FACES
                   */
                  if (
                    faceCount > 1
                  ) {
                    multiplePeopleFramesRef.current +=
                      1;

                    if (
                      multiplePeopleFramesRef.current >=
                      2
                    ) {
                      addViolation(
                        `Multiple faces detected (${faceCount}). Only the registered student should be visible.`,
                        "MULTIPLE_FACES",
                      );
                    }
                  } else {
                    multiplePeopleFramesRef.current = 0;

                    clearIssue(
                      "MULTIPLE_FACES",
                    );
                  }
                }

                /*
                 * OBJECT DETECTION
                 */
                const objects =
                  await objectDetectorRef.current.detect(
                    currentVideo,
                  );

                const detectedObjectBoxes =
                  objects
                    .filter(
                      (object) =>
                        object.score >=
                        0.45,
                    )
                    .map((object) => ({
                      x:
                        object.bbox[0] /
                        currentVideo.videoWidth,

                      y:
                        object.bbox[1] /
                        currentVideo.videoHeight,

                      width:
                        object.bbox[2] /
                        currentVideo.videoWidth,

                      height:
                        object.bbox[3] /
                        currentVideo.videoHeight,

                      label:
                        object.class,

                      score:
                        object.score,
                    }));

                setObjectBoxes(
                  detectedObjectBoxes,
                );

                /*
                 * PHONE DETECTION
                 */
                const phoneDetected =
                  objects.some(
                    (object) =>
                      object.class
                        .toLowerCase() ===
                        "cell phone" &&
                      object.score >=
                        0.5,
                  );

                if (phoneDetected) {
                  phoneFramesRef.current +=
                    1;

                  setObjectStatus(
                    "⚠ Mobile phone detected",
                  );

                  if (
                    phoneFramesRef.current >=
                    2
                  ) {
                    addViolation(
                      "A mobile phone has been detected by the AI proctoring system.",
                      "MOBILE_PHONE",
                    );
                  }
                } else {
                  phoneFramesRef.current = 0;

                  clearIssue(
                    "MOBILE_PHONE",
                  );

                  const visibleObjects =
                    objects.filter(
                      (object) =>
                        object.score >=
                          0.55 &&
                        object.class
                          .toLowerCase() !==
                          "person",
                    );

                  if (
                    visibleObjects.length >
                    0
                  ) {
                    setObjectStatus(
                      `Detected: ${visibleObjects
                        .slice(0, 2)
                        .map(
                          (item) =>
                            item.class,
                        )
                        .join(", ")}`,
                    );
                  } else {
                    setObjectStatus(
                      "No suspicious object detected",
                    );
                  }
                }
              } catch (error) {
                console.error(
                  "AI detection error:",
                  error,
                );

                setFaceStatus(
                  "AI face detection temporarily unavailable",
                );

                setObjectStatus(
                  "AI object detection temporarily unavailable",
                );
              } finally {
                isDetectingRef.current = false;
              }
            }, 1000);
        } catch (error) {
          console.error(
            "Proctoring startup error:",
            error,
          );

          if (isMounted) {
            setModelsLoading(false);

            setCameraError(
              "Camera or AI proctoring could not be started. Please allow camera permission and refresh the page.",
            );

            setCameraActive(false);
          }
        }
      };

    startProctoring();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [examId, router]);

  /*
   * TIMER
   */
  useEffect(() => {
    const timer =
      setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            clearInterval(timer);

            if (
              !terminatedRef.current
            ) {
              stopCamera();

              router.push(
                `/student/exams/${examId}/submit`,
              );
            }

            return 0;
          }

          return previous - 1;
        });
      }, 1000);

    return () => clearInterval(timer);
  }, [router, examId]);

  /*
   * TAB SWITCH
   */
  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.hidden &&
          !terminatedRef.current
        ) {
          addViolation(
            "Tab switching or leaving the examination window has been detected.",
            "TAB_SWITCH",
          );
        }

        if (!document.hidden) {
          clearIssue("TAB_SWITCH");
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  /*
   * FULLSCREEN
   */
  useEffect(() => {
    const handleFullscreenChange =
      () => {
        if (
          !document.fullscreenElement &&
          document.visibilityState ===
            "visible" &&
          !terminatedRef.current
        ) {
          addViolation(
            "Fullscreen mode was exited.",
            "FULLSCREEN_EXIT",
          );
        }

        if (
          document.fullscreenElement
        ) {
          clearIssue(
            "FULLSCREEN_EXIT",
          );
        }
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  const handleSelectAnswer = (
    optionIndex: number,
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionIndex,
    }));
  };

  const handleMarkForReview =
    () => {
      setReviewQuestions(
        (previous) =>
          previous.includes(
            question.id,
          )
            ? previous.filter(
                (id) =>
                  id !==
                  question.id,
              )
            : [
                ...previous,
                question.id,
              ],
      );
    };

  const handleSubmitExam = () => {
    stopCamera();

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(
        () => {},
      );
    }

    router.push(
      `/student/exams/${examId}/submit`,
    );
  };

  const handleReturnFullscreen =
    async () => {
      try {
        await document.documentElement.requestFullscreen();

        setShowWarning(false);
        setWarning("");

        clearIssue(
          "FULLSCREEN_EXIT",
        );
      } catch {
        setWarning(
          "Fullscreen permission is required to continue.",
        );
      }
    };

  const handleCloseWarning = () => {
    if (examTerminated) {
      return;
    }

    setShowWarning(false);
    setWarning("");
  };

  const formatTime = (
    seconds: number,
  ) => {
    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60,
      );

    const secs =
      seconds % 60;

    return `${hours
      .toString()
      .padStart(
        2,
        "0",
      )}:${minutes
      .toString()
      .padStart(
        2,
        "0",
      )}:${secs
      .toString()
      .padStart(
        2,
        "0")}`;
  };

  if (examLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dfe8eb] border-t-[#63a8b9]" />
          <p className="mt-4 text-[14px] text-[#7d8796]">
            Loading examination...
          </p>
        </div>
      </main>
    );
  }

  if (examError || !exam) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="max-w-[450px] rounded-[22px] bg-white p-[30px] text-center shadow-sm">
          <h1 className="text-[24px] font-bold text-[#263446]">
            Unable to Load Examination
          </h1>

          <p className="mt-[10px] text-[13px] text-[#7d8796]">
            {examError ||
              "The examination could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/student/exams",
              )
            }
            className="mt-[20px] rounded-[12px] bg-[#63a8b9] px-[20px] py-[12px] text-[13px] font-semibold text-white"
          >
            Back to My Exams
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#263446]">

      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-[#e8eaf0] bg-white px-[28px] py-[16px]">

        <div className="flex items-center gap-[12px]">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#63a8b9] text-[19px] text-white">
            ✦
          </div>

          <div>
            <h1 className="text-[16px] font-bold">
              ExamAI
            </h1>

            <p className="text-[9px] text-[#8b94a3]">
              Live Examination
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-[#8b94a3]">
            {exam.title}
          </p>

          <h2 className="mt-[3px] text-[20px] font-bold text-[#d66b75]">
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="flex items-center gap-[10px]">

          <div
            className={`h-[9px] w-[9px] rounded-full ${
              cameraActive
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span className="text-[11px] text-[#7d8796]">
            {cameraActive
              ? "Camera Active"
              : "Camera Off"}
          </span>

          <div className="rounded-full bg-[#fff4f5] px-[13px] py-[7px] text-[11px] font-semibold text-[#d66b75]">
            ⚠ {violations} / 3 Violations
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-75px)]">

        {/* QUESTION AREA */}
        <section className="flex-1 p-[35px]">

          <div className="mx-auto max-w-[900px]">

            <div className="rounded-[24px] border border-[#e8eaf0] bg-white p-[32px]">

              <div className="flex items-center justify-between">

                <span className="rounded-full bg-[#eef8fa] px-[12px] py-[6px] text-[11px] font-semibold text-[#63a8b9]">
                  Question {currentQuestion + 1} of{" "}
                  {questions.length}
                </span>

                {reviewQuestions.includes(
                  question.id,
                ) && (
                  <span className="text-[11px] font-semibold text-[#e2a93b]">
                    ★ Marked for Review
                  </span>
                )}

              </div>

              <h2 className="mt-[30px] text-[22px] font-semibold leading-[1.6]">
                {question.question}
              </h2>

              <div className="mt-[30px] space-y-[14px]">

                {question.options.map(
                  (option, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() =>
                        handleSelectAnswer(
                          index,
                        )
                      }
                      className={`flex w-full items-center gap-[15px] rounded-[15px] border p-[17px] text-left text-[14px] transition ${
                        answers[
                          question.id
                        ] === index
                          ? "border-[#63a8b9] bg-[#eef8fa]"
                          : "border-[#e8eaf0] hover:border-[#63a8b9]"
                      }`}
                    >
                      <span
                        className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[12px] font-semibold ${
                          answers[
                            question.id
                          ] === index
                            ? "border-[#63a8b9] bg-[#63a8b9] text-white"
                            : "border-[#dfe3e9] text-[#8b94a3]"
                        }`}
                      >
                        {String.fromCharCode(
                          65 + index,
                        )}
                      </span>

                      {option}
                    </button>
                  ),
                )}

              </div>

              <div className="mt-[38px] flex items-center justify-between border-t border-[#eef0f4] pt-[24px]">

                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestion(
                      (previous) =>
                        Math.max(
                          previous - 1,
                          0,
                        ),
                    )
                  }
                  disabled={
                    currentQuestion === 0
                  }
                  className="rounded-[12px] border border-[#e0e4ea] px-[18px] py-[11px] text-[13px] font-semibold disabled:opacity-40"
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  onClick={
                    handleMarkForReview
                  }
                  className="rounded-[12px] bg-[#fff7e7] px-[18px] py-[11px] text-[13px] font-semibold text-[#c38c21]"
                >
                  ☆ Mark for Review
                </button>

                {currentQuestion ===
                questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={
                      handleSubmitExam
                    }
                    className="rounded-[12px] bg-[#d66b75] px-[20px] py-[11px] text-[13px] font-semibold text-white"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestion(
                        (previous) =>
                          Math.min(
                            previous + 1,
                            questions.length -
                              1,
                          ),
                      )
                    }
                    className="rounded-[12px] bg-[#63a8b9] px-[20px] py-[11px] text-[13px] font-semibold text-white"
                  >
                    Save & Next →
                  </button>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* PROCTORING */}
        <aside className="w-[300px] border-l border-[#e8eaf0] bg-white p-[24px]">

          <div>

            <div className="mb-[12px] flex items-center justify-between">

              <h2 className="text-[14px] font-bold">
                AI Live Proctoring
              </h2>

              <span className="flex items-center gap-[5px] text-[10px] font-semibold text-green-600">
                <span className="h-[7px] w-[7px] rounded-full bg-green-500" />
                LIVE
              </span>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-[16px] bg-[#17202b]">

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />

              {/* FACE BOX */}
              {faceBox && (
                <div
                  className="pointer-events-none absolute border-2 border-[#2196f3]"
                  style={{
                    left: `${faceBox.x * 100}%`,
                    top: `${faceBox.y * 100}%`,
                    width: `${faceBox.width * 100}%`,
                    height: `${faceBox.height * 100}%`,
                  }}
                >
                  <div className="absolute -top-[20px] left-0 whitespace-nowrap bg-[#2196f3] px-[6px] py-[2px] text-[9px] font-semibold text-white">
                    👤 Face
                  </div>
                </div>
              )}

              {/* LANDMARKS */}
              {landmarkPoints.map(
                (point, index) => (
                  <div
                    key={index}
                    className="pointer-events-none absolute h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2196f3]"
                    style={{
                      left: `${point.x * 100}%`,
                      top: `${point.y * 100}%`,
                    }}
                  />
                ),
              )}

              {/* OBJECT BOXES */}
              {objectBoxes.map(
                (object, index) => (
                  <div
                    key={`${object.label}-${index}`}
                    className={`pointer-events-none absolute border ${
                      object.label
                        .toLowerCase() ===
                      "cell phone"
                        ? "border-red-500"
                        : "border-yellow-400"
                    }`}
                    style={{
                      left: `${object.x * 100}%`,
                      top: `${object.y * 100}%`,
                      width: `${object.width * 100}%`,
                      height: `${object.height * 100}%`,
                    }}
                  >
                    <span
                      className={`absolute -top-[18px] left-0 whitespace-nowrap px-[5px] py-[2px] text-[8px] font-semibold text-white ${
                        object.label
                          .toLowerCase() ===
                        "cell phone"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {object.label}{" "}
                      {Math.round(
                        object.score * 100,
                      )}
                      %
                    </span>
                  </div>
                ),
              )}

              {!cameraActive &&
                !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] text-white">
                    Starting camera...
                  </div>
                )}

              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center p-[15px] text-center text-[10px] text-white">
                  {cameraError}
                </div>
              )}

              {modelsLoading &&
                cameraActive && (
                  <div className="absolute bottom-[8px] left-[8px] rounded-full bg-black/60 px-[8px] py-[4px] text-[9px] text-white">
                    Loading AI models...
                  </div>
                )}

            </div>

            <div className="mt-[12px] space-y-[8px]">

              <div className="rounded-[10px] bg-[#f5f7fa] px-[10px] py-[9px] text-[10px]">
                <span className="font-semibold">
                  👤 Face:
                </span>{" "}
                {faceStatus}
              </div>

              <div className="rounded-[10px] bg-[#f5f7fa] px-[10px] py-[9px] text-[10px]">
                <span className="font-semibold">
                  🔍 Objects:
                </span>{" "}
                {objectStatus}
              </div>

              <div className="rounded-[10px] bg-[#f5f7fa] px-[10px] py-[9px] text-[10px]">
                <span className="font-semibold">
                  📷 Camera:
                </span>{" "}
                {cameraActive
                  ? "Active"
                  : "Inactive"}
              </div>

            </div>
          </div>

          {/* QUESTION PALETTE */}
          <div className="mt-[28px] border-t border-[#eef0f4] pt-[22px]">

            <h2 className="text-[16px] font-bold">
              Question Palette
            </h2>

            <p className="mt-[5px] text-[11px] text-[#8b94a3]">
              Navigate between questions
            </p>

            <div className="mt-[20px] grid grid-cols-4 gap-[10px]">

              {questions.map(
                (item, index) => {
                  const answered =
                    answers[item.id] !==
                    undefined;

                  const review =
                    reviewQuestions.includes(
                      item.id,
                    );

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        setCurrentQuestion(
                          index,
                        )
                      }
                      className={`flex h-[44px] items-center justify-center rounded-[11px] text-[13px] font-semibold ${
                        currentQuestion ===
                        index
                          ? "bg-[#63a8b9] text-white"
                          : review
                            ? "bg-[#fff1cc] text-[#c38c21]"
                            : answered
                              ? "bg-[#e7f6ef] text-[#4f9b70]"
                              : "bg-[#f4f6f9] text-[#7d8796]"
                      }`}
                    >
                      {item.id}
                    </button>
                  );
                },
              )}

            </div>

            <button
              type="button"
              onClick={handleSubmitExam}
              className="mt-[25px] w-full rounded-[13px] bg-[#d66b75] px-[18px] py-[13px] text-[13px] font-semibold text-white"
            >
              Submit Examination
            </button>
          </div>
        </aside>
      </div>

      {/* WARNING */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[20px]">

          <div className="w-full max-w-[440px] rounded-[24px] bg-white p-[32px] text-center shadow-2xl">

            <div className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#fff1f2] text-[28px]">
              ⚠️
            </div>

            <h2 className="mt-[18px] text-[22px] font-bold text-[#d66b75]">
              {examTerminated
                ? "Examination Terminated"
                : "Proctoring Violation Detected"}
            </h2>

            <p className="mt-[12px] text-[14px] leading-[1.7] text-[#687384]">
              {warning}
            </p>

            <div className="mt-[18px] rounded-[13px] bg-[#fff7f7] p-[12px] text-[12px] text-[#d66b75]">
              Total Violations:{" "}
              {violations} / 3
            </div>

            <div className="mt-[24px]">

              {examTerminated ? (
                <div className="rounded-[13px] bg-[#fff1f2] px-[16px] py-[13px] text-[13px] font-semibold text-[#d66b75]">
                  Examination is being
                  submitted automatically...
                </div>
              ) : (
                <div className="flex gap-[12px]">

                  <button
                    type="button"
                    onClick={
                      handleReturnFullscreen
                    }
                    className="flex-1 rounded-[13px] bg-[#63a8b9] px-[16px] py-[13px] text-[13px] font-semibold text-white"
                  >
                    Fullscreen
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCloseWarning
                    }
                    className="flex-1 rounded-[13px] border border-[#e0e4ea] px-[16px] py-[13px] text-[13px] font-semibold"
                  >
                    Continue
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </main>
  );
}