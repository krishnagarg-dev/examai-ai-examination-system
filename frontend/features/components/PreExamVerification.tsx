"use client";

import {
  useEffect,
  type RefObject,
} from "react";

interface PreExamVerificationProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  progress: number;
  cameraActive: boolean;
  modelsReady: boolean;
  faceStatus: string;
  objectStatus: string;
  cameraError: string;
}

export function PreExamVerification({
  videoRef,
  progress,
  cameraActive,
  modelsReady,
  faceStatus,
  objectStatus,
  cameraError,
}: PreExamVerificationProps) {
  useEffect(() => {
    if (!cameraActive) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const attachAndPlay = async () => {
      if (cancelled) {
        return;
      }

      const video = videoRef.current;

      if (!video) {
        if (attempts < 20) {
          attempts += 1;
          window.setTimeout(attachAndPlay, 250);
        }

        return;
      }

      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");

      try {
        if (video.srcObject) {
          if (video.readyState < 2) {
            await new Promise<void>((resolve) => {
              const onLoadedMetadata = () => {
                video.removeEventListener(
                  "loadedmetadata",
                  onLoadedMetadata,
                );
                resolve();
              };

              video.addEventListener(
                "loadedmetadata",
                onLoadedMetadata,
                { once: true },
              );
            });
          }

          await video.play();
          return;
        }
      } catch (error) {
        console.warn(
          "[ExamAI] Video preview play failed:",
          error,
        );
      }

      if (!cancelled && attempts < 20) {
        attempts += 1;
        window.setTimeout(attachAndPlay, 250);
      }
    };

    void attachAndPlay();

    return () => {
      cancelled = true;
    };
  }, [cameraActive, videoRef]);

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

          {cameraActive && !cameraError && (
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
              {cameraActive ? "Connected" : "Starting..."}
            </div>
          </div>

          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]">
            <b>Face AI</b>
            <div className="mt-1">{faceStatus}</div>
          </div>

          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]">
            <b>Object AI</b>
            <div className="mt-1">
              {modelsReady ? objectStatus : "Loading..."}
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