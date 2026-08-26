"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const questions = [
  {
    id: 1,
    question: "Which SQL command is used to retrieve data from a database?",
    options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
  },
  {
    id: 2,
    question: "Which of the following is a primary key?",
    options: [
      "A field that contains duplicate values",
      "A field that uniquely identifies each record",
      "A field used only for sorting",
      "A field containing only text",
    ],
  },
  {
    id: 3,
    question: "Which normal form removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
  },
  {
    id: 4,
    question: "Which SQL clause is used to filter records?",
    options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"],
  },
  {
    id: 5,
    question: "Which command is used to remove a table from a database?",
    options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
  },
];

export default function ExamAttemptPage() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const detectionIntervalRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  const isDetectingRef = useRef(false);
  const terminatedRef = useRef(false);

  const activeIssuesRef = useRef<Set<string>>(new Set());

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [reviewQuestions, setReviewQuestions] = useState<number[]>([]);

  const [violations, setViolations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60);

  const [cameraError, setCameraError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);

  const [faceStatus, setFaceStatus] = useState(
    "Loading face detector..."
  );

  const [objectStatus, setObjectStatus] = useState(
    "Loading object detector..."
  );

  const [warning, setWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [examTerminated, setExamTerminated] = useState(false);

  const question = questions[currentQuestion];

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraActive(false);
  };

  const addViolation = (
    message: string,
    issueType: string
  ) => {
    if (terminatedRef.current) return;

    if (activeIssuesRef.current.has(issueType)) {
      return;
    }

    activeIssuesRef.current.add(issueType);

    setViolations((previous) => {
      const newViolations = previous + 1;

      if (newViolations >= 3) {
        terminatedRef.current = true;

        setExamTerminated(true);

        setWarning(
          "You have reached the maximum limit of 3 proctoring violations. Your examination has been terminated and will be submitted automatically."
        );

        setShowWarning(true);

        stopCamera();

        setTimeout(() => {
          router.push(
            `/student/exams/${examId}/submit`
          );
        }, 4000);
      } else {
        setWarning(message);
        setShowWarning(true);
      }

      return newViolations;
    });
  };

  const clearIssue = (issueType: string) => {
    activeIssuesRef.current.delete(issueType);
  };

  /* CAMERA + AI PROCTORING */
  useEffect(() => {
    let isMounted = true;

    const startProctoring = async () => {
      try {
        setCameraError("");
        setModelsLoading(true);

        /* START TENSORFLOW */
        await tf.ready();

        try {
          await tf.setBackend("webgl");
        } catch {
          console.log(
            "WebGL backend unavailable. Using default backend."
          );
        }

        /* START CAMERA */
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "user",
            },
            audio: true,
          });

        if (!isMounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await new Promise<void>((resolve) => {
            if (!videoRef.current) {
              resolve();
              return;
            }

            videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });

          await videoRef.current.play();
        }

        if (!isMounted) return;

        setCameraActive(true);

        setFaceStatus("Loading AI face detection...");
        setObjectStatus("Loading AI object detection...");

        /* LOAD COCO SSD OBJECT DETECTOR */
        const objectDetector = await cocoSsd.load({
          base: "lite_mobilenet_v2",
        });

        if (!isMounted) return;

        /* LOAD MEDIAPIPE FACE DETECTOR */
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const faceDetector =
          await FaceDetector.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
                delegate: "GPU",
              },

              runningMode: "VIDEO",

              minDetectionConfidence: 0.5,

              minSuppressionThreshold: 0.3,
            }
          );

        if (!isMounted) return;

        setModelsLoading(false);

        setFaceStatus("Scanning for faces...");
        setObjectStatus("Scanning for objects...");

        /* START DETECTION LOOP */
        detectionIntervalRef.current =
          setInterval(async () => {
            if (
              !videoRef.current ||
              videoRef.current.readyState < 3 ||
              isDetectingRef.current ||
              terminatedRef.current
            ) {
              return;
            }

            isDetectingRef.current = true;

            try {
              const video = videoRef.current;

              const now = performance.now();

              /* FACE DETECTION */
              const faceResult =
                faceDetector.detectForVideo(
                  video,
                  now
                );

              const faceCount =
                faceResult.detections.length;

              if (faceCount === 0) {
                setFaceStatus(
                  "No face detected"
                );

                addViolation(
                  "No face was detected by the proctoring system. Please remain visible in front of the camera.",
                  "NO_FACE"
                );
              } else if (faceCount > 1) {
                setFaceStatus(
                  `${faceCount} faces detected`
                );

                addViolation(
                  `Multiple faces were detected (${faceCount} people). Only the registered student is allowed.`,
                  "MULTIPLE_FACES"
                );
              } else {
                setFaceStatus(
                  "1 face detected"
                );

                clearIssue("NO_FACE");

                clearIssue(
                  "MULTIPLE_FACES"
                );
              }

              /* OBJECT DETECTION */
              const objects =
                await objectDetector.detect(
                  video
                );

              const phoneDetected =
                objects.some(
                  (object) =>
                    object.class
                      .toLowerCase() ===
                      "cell phone" &&
                    object.score > 0.4
                );

              if (phoneDetected) {
                setObjectStatus(
                  "Mobile phone detected"
                );

                addViolation(
                  "A mobile phone has been detected by the AI proctoring system.",
                  "MOBILE_PHONE"
                );
              } else {
                setObjectStatus(
                  "No suspicious object detected"
                );

                clearIssue(
                  "MOBILE_PHONE"
                );
              }
            } catch (error) {
              console.error(
                "AI detection error:",
                error
              );

              setFaceStatus(
                "Detection temporarily unavailable"
              );
            } finally {
              isDetectingRef.current =
                false;
            }
          }, 1500);
      } catch (error) {
        console.error(
          "Proctoring startup error:",
          error
        );

        if (isMounted) {
          setCameraError(
            "Camera or AI proctoring system could not be started. Please allow camera permission and refresh the page."
          );

          setCameraActive(false);
          setModelsLoading(false);
        }
      }
    };

    startProctoring();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  /* TIMER */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          if (!terminatedRef.current) {
            router.push(
              `/student/exams/${examId}/submit`
            );
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, examId]);

  /* TAB SWITCH DETECTION */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.hidden &&
        !terminatedRef.current
      ) {
        addViolation(
          "Tab switching or leaving the examination window has been detected.",
          "TAB_SWITCH"
        );
      }

      if (!document.hidden) {
        clearIssue("TAB_SWITCH");
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /* FULLSCREEN EXIT DETECTION */
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        document.visibilityState === "visible" &&
        !terminatedRef.current
      ) {
        addViolation(
          "Fullscreen mode was exited. Please return to fullscreen mode immediately.",
          "FULLSCREEN_EXIT"
        );
      }

      if (document.fullscreenElement) {
        clearIssue(
          "FULLSCREEN_EXIT"
        );
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleSelectAnswer = (
    optionIndex: number
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionIndex,
    }));
  };

  const handleMarkForReview = () => {
    setReviewQuestions((previous) =>
      previous.includes(question.id)
        ? previous.filter(
            (id) =>
              id !== question.id
          )
        : [
            ...previous,
            question.id,
          ]
    );
  };

  const handleSubmitExam = () => {
    stopCamera();

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    router.push(
      `/student/exams/${examId}/submit`
    );
  };

  const handleReturnFullscreen =
    async () => {
      try {
        await document.documentElement.requestFullscreen();

        setShowWarning(false);
        setWarning("");

        clearIssue(
          "FULLSCREEN_EXIT"
        );
      } catch {
        setWarning(
          "Fullscreen permission is required to continue the examination."
        );
      }
    };

  const handleCloseWarning = () => {
    if (examTerminated) return;

    setShowWarning(false);
    setWarning("");
  };

  const formatTime = (
    seconds: number
  ) => {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs =
      seconds % 60;

    return `${hours
      .toString()
      .padStart(
        2,
        "0"
      )}:${minutes
      .toString()
      .padStart(
        2,
        "0"
      )}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
            Database Management System
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
        {/* MAIN QUESTION AREA */}
        <section className="flex-1 p-[35px]">
          <div className="mx-auto max-w-[900px]">
            <div className="rounded-[24px] border border-[#e8eaf0] bg-white p-[32px]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#eef8fa] px-[12px] py-[6px] text-[11px] font-semibold text-[#63a8b9]">
                  Question{" "}
                  {currentQuestion + 1} of{" "}
                  {questions.length}
                </span>

                {reviewQuestions.includes(
                  question.id
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
                      key={index}
                      onClick={() =>
                        handleSelectAnswer(
                          index
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
                          65 + index
                        )}
                      </span>

                      {option}
                    </button>
                  )
                )}
              </div>

              <div className="mt-[38px] flex items-center justify-between border-t border-[#eef0f4] pt-[24px]">
                <button
                  onClick={() =>
                    setCurrentQuestion(
                      (previous) =>
                        Math.max(
                          previous - 1,
                          0
                        )
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
                    onClick={
                      handleSubmitExam
                    }
                    className="rounded-[12px] bg-[#d66b75] px-[20px] py-[11px] text-[13px] font-semibold text-white"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestion(
                        (previous) =>
                          Math.min(
                            previous + 1,
                            questions.length -
                              1
                          )
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

        {/* PROCTORING SIDEBAR */}
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

            <div className="relative overflow-hidden rounded-[16px] bg-[#17202b]">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />

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
                    Loading AI...
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
                      item.id
                    );

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setCurrentQuestion(
                          index
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
                }
              )}
            </div>

            <button
              onClick={handleSubmitExam}
              className="mt-[25px] w-full rounded-[13px] bg-[#d66b75] px-[18px] py-[13px] text-[13px] font-semibold text-white"
            >
              Submit Examination
            </button>
          </div>
        </aside>
      </div>

      {/* WARNING MODAL */}
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
                    onClick={
                      handleReturnFullscreen
                    }
                    className="flex-1 rounded-[13px] bg-[#63a8b9] px-[16px] py-[13px] text-[13px] font-semibold text-white"
                  >
                    Fullscreen
                  </button>

                  <button
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