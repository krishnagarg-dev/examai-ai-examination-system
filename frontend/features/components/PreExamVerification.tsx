"use client";

import {
  useEffect,
  type RefObject,
} from "react";

interface PreExamVerificationProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  progress: number;
  cameraActive: boolean;
  modelsReady: boolean;
  faceStatus: string;
  objectStatus: string;
  cameraError: string;
}

export function PreExamVerification({
  videoRef,
  stream,
  progress,
  cameraActive,
  modelsReady,
  faceStatus,
  objectStatus,
  cameraError,
}: PreExamVerificationProps) {
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream) {
      return;
    }

    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const startPlayback = async () => {
      try {
        if (video.srcObject !== stream) {
          video.srcObject = stream;
        }

        await video.play();

        console.log("[ExamAI] Verification preview started", {
          streamActive: stream.active,
          videoTracks: stream.getVideoTracks().length,
          trackState:
            stream.getVideoTracks()[0]?.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          paused: video.paused,
        });
      } catch (error) {
        console.error(
          "[ExamAI] Verification preview error:",
          error,
        );
      }
    };

    void startPlayback();

    const retryTimer = window.setInterval(() => {
      if (
        video.videoWidth === 0 ||
        video.videoHeight === 0 ||
        video.paused
      ) {
        void startPlayback();
      }
    }, 1000);

    return () => {
      window.clearInterval(retryTimer);
    };
  }, [stream, videoRef]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] p-6">
      <div className="w-full max-w-2xl rounded-[24px] border border-[#e8eaf0] bg-white p-8 shadow-sm">
        <h1 className="text-[24px] font-bold text-[#263446]">
          AI Proctoring Verification
        </h1>

        <p className="mt-2 text-[13px] text-[#7d8796]">
          Keep your face visible and centered. Your examination
          will begin only after verification.
        </p>

        <div className="relative mt-6 aspect-video overflow-hidden rounded-[18px] bg-[#17202b]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover scale-x-[-1]"
          />

          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
              Starting camera...
            </div>
          )}

          {cameraActive && stream && !cameraError && (
            <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/50 px-3 py-1.5 text-[10px] font-semibold text-white">
              Camera Live
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-8 text-center text-sm text-white">
              {cameraError}
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]">
            <b>Camera</b>

            <div className="mt-1">
              {cameraActive
                ? "Connected"
                : "Starting..."}
            </div>
          </div>

          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]">
            <b>Face AI</b>

            <div className="mt-1">
              {faceStatus}
            </div>
          </div>

          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]">
            <b>Object AI</b>

            <div className="mt-1">
              {modelsReady
                ? objectStatus
                : "Loading..."}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-[11px] font-semibold text-[#7d8796]">
            <span>
              {progress >= 100
                ? "Verification complete"
                : "Verifying face"}
            </span>

            <span>
              {Math.round(progress)}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8edf1]">
            <div
              className="h-full rounded-full bg-[#63a8b9] transition-all duration-300"
              style={{
                width: `${Math.min(
                  Math.max(progress, 0),
                  100,
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-[#eef8fa] p-4 text-[12px] text-[#4c7d88]">
          The exam timer is paused during this verification step.
        </div>
      </div>
    </main>
  );
}