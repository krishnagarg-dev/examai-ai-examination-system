"use client";

import type { RefObject } from "react";

export function PreExamVerification({
  videoRef,
  progress,
  cameraActive,
  modelsReady,
  faceStatus,
  objectStatus,
  cameraError,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  progress: number;
  cameraActive: boolean;
  modelsReady: boolean;
  faceStatus: string;
  objectStatus: string;
  cameraError: string;
}) {
  return (
    <main className="min-h-screen bg-[#f7f8fc] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-[24px] bg-white p-8 shadow-sm border border-[#e8eaf0]">
        <h1 className="text-[24px] font-bold text-[#263446]">AI Proctoring Verification</h1>
        <p className="mt-2 text-[13px] text-[#7d8796]">Keep your face visible and centered. Your examination will begin only after verification.</p>
        <div className="mt-6 relative overflow-hidden rounded-[18px] bg-[#17202b] aspect-video">
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover scale-x-[-1]" />
          {!cameraActive && <div className="absolute inset-0 flex items-center justify-center text-white text-sm">Starting camera...</div>}
          {cameraError && <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white text-sm bg-black/40">{cameraError}</div>}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]"><b>Camera</b><div className="mt-1">{cameraActive ? "Connected" : "Starting..."}</div></div>
          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]"><b>Face AI</b><div className="mt-1">{faceStatus}</div></div>
          <div className="rounded-xl bg-[#f5f7fa] p-3 text-[11px]"><b>Object AI</b><div className="mt-1">{modelsReady ? objectStatus : "Loading..."}</div></div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-[11px] font-semibold text-[#7d8796]"><span>{progress >= 100 ? "Verification complete" : "Verifying face"}</span><span>{Math.round(progress)}%</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8edf1]"><div className="h-full rounded-full bg-[#63a8b9] transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="mt-5 rounded-xl bg-[#eef8fa] p-4 text-[12px] text-[#4c7d88]">The exam timer is paused during this verification step.</div>
      </div>
    </main>
  );
}
