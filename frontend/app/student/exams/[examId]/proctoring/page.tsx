"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ProctoringVerificationPage() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId as string;

  const videoRef = useRef<HTMLVideoElement>(null);

  const [cameraStatus, setCameraStatus] = useState("Checking...");
  const [microphoneStatus, setMicrophoneStatus] = useState("Checking...");
  const [faceStatus, setFaceStatus] = useState("Waiting for camera...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVerification = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraStatus("Camera connected");
        setMicrophoneStatus("Microphone connected");
        setFaceStatus("Face detected");
        setLoading(false);
      } catch (err) {
        setError(
          "Camera or microphone access was denied. Please allow permissions and try again."
        );

        setCameraStatus("Camera unavailable");
        setMicrophoneStatus("Microphone unavailable");
        setFaceStatus("Unable to verify");
        setLoading(false);
      }
    };

    startVerification();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartExam = async () => {
    try {
      await document.documentElement.requestFullscreen();

      router.push(`/student/exams/${examId}/attempt`);
    } catch {
      router.push(`/student/exams/${examId}/attempt`);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#263446]">
      {/* HEADER */}
      <header className="border-b border-[#e8eaf0] bg-white px-[30px] py-[18px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link
            href={`/student/exams/${examId}`}
            className="text-[14px] font-medium text-[#667386]"
          >
            ← Back to Exam Details
          </Link>

          <div className="flex items-center gap-[10px]">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#63a8b9] text-white">
              ✦
            </div>

            <div>
              <h2 className="text-[16px] font-bold">ExamAI</h2>
              <p className="text-[9px] text-[#8b94a3]">
                AI Proctoring Verification
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-[25px] py-[45px]">
        <div className="mb-[32px] text-center">
          <p className="text-[11px] font-bold tracking-[1px] text-[#63a8b9]">
            PRE-EXAM VERIFICATION
          </p>

          <h1 className="mt-[10px] text-[30px] font-bold">
            AI Proctoring Check
          </h1>

          <p className="mt-[8px] text-[14px] text-[#7d8796]">
            Please verify your camera, microphone and examination environment
            before starting.
          </p>
        </div>

        <div className="grid gap-[28px] lg:grid-cols-[1.1fr_0.9fr]">
          {/* CAMERA PREVIEW */}
          <div className="rounded-[24px] border border-[#e8eaf0] bg-white p-[24px]">
            <div className="mb-[18px] flex items-center justify-between">
              <div>
                <h2 className="text-[19px] font-bold">
                  Camera Preview
                </h2>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  Make sure your face is clearly visible.
                </p>
              </div>

              <span className="rounded-full bg-[#eef8fa] px-[11px] py-[6px] text-[10px] font-semibold text-[#63a8b9]">
                LIVE
              </span>
            </div>

            <div className="relative overflow-hidden rounded-[20px] bg-[#17202b]">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#17202b] text-[13px] text-white">
                  Connecting to camera...
                </div>
              )}

              {!loading && error && (
                <div className="absolute inset-0 flex items-center justify-center p-[30px] text-center text-[13px] text-white">
                  {error}
                </div>
              )}
            </div>

            <p className="mt-[15px] text-center text-[11px] text-[#8b94a3]">
              Your camera feed will be monitored during the examination.
            </p>
          </div>

          {/* VERIFICATION STATUS */}
          <div className="rounded-[24px] border border-[#e8eaf0] bg-white p-[26px]">
            <h2 className="text-[19px] font-bold">
              Verification Status
            </h2>

            <p className="mt-[6px] text-[12px] text-[#8b94a3]">
              Complete all checks before continuing.
            </p>

            <div className="mt-[24px] space-y-[14px]">
              <div className="flex items-center justify-between rounded-[15px] bg-[#f7f8fc] p-[16px]">
                <div>
                  <h3 className="text-[13px] font-semibold">
                    Camera
                  </h3>

                  <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                    Webcam connection
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-[#63a8b9]">
                  {cameraStatus}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[15px] bg-[#f7f8fc] p-[16px]">
                <div>
                  <h3 className="text-[13px] font-semibold">
                    Microphone
                  </h3>

                  <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                    Audio monitoring
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-[#63a8b9]">
                  {microphoneStatus}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[15px] bg-[#f7f8fc] p-[16px]">
                <div>
                  <h3 className="text-[13px] font-semibold">
                    Face Detection
                  </h3>

                  <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                    AI identity verification
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-[#63a8b9]">
                  {faceStatus}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[15px] bg-[#f7f8fc] p-[16px]">
                <div>
                  <h3 className="text-[13px] font-semibold">
                    Environment
                  </h3>

                  <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                    Secure examination setup
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-[#63a8b9]">
                  Ready
                </span>
              </div>
            </div>

            {error && (
              <button
                onClick={() => window.location.reload()}
                className="mt-[20px] w-full rounded-[13px] border border-[#63a8b9] px-[20px] py-[12px] text-[13px] font-semibold text-[#63a8b9]"
              >
                Retry Verification
              </button>
            )}

            {!error && !loading && (
              <button
                onClick={handleStartExam}
                className="mt-[24px] w-full rounded-[13px] bg-[#63a8b9] px-[20px] py-[14px] text-[13px] font-semibold text-white transition hover:opacity-90"
              >
                Start Examination
              </button>
            )}

            <p className="mt-[14px] text-center text-[10px] leading-[1.6] text-[#a0a7b3]">
              Starting the examination means you agree to AI proctoring and
              activity monitoring during the exam.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}