"use client";

import type { RefObject } from "react";

import type {
  DetectedObject,
  FaceBox,
  Point,
} from "../types";

interface ProctoringPanelProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraActive: boolean;
  cameraError: string;
  faceBox: FaceBox | null;
  landmarks: Point[];
  objects: DetectedObject[];
  faceStatus: string;
  objectStatus: string;
}

export function ProctoringPanel({
  videoRef,
  cameraActive,
  cameraError,
  faceBox,
  landmarks,
  objects,
  faceStatus,
  objectStatus,
}: ProctoringPanelProps) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />

        {!cameraActive && (
          <div className="absolute inset-0 grid place-items-center bg-black/70 text-sm text-white">
            Camera inactive
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-x-2 bottom-2 rounded-lg bg-red-600/90 px-3 py-2 text-xs text-white">
            {cameraError}
          </div>
        )}

        {faceBox && cameraActive && (
          <div
            className="pointer-events-none absolute border-2 border-green-400"
            style={{
              left: `${(faceBox.x / 1280) * 100}%`,
              top: `${(faceBox.y / 720) * 100}%`,
              width: `${(faceBox.width / 1280) * 100}%`,
              height: `${(faceBox.height / 720) * 100}%`,
            }}
          />
        )}

        {landmarks.map((point: Point, index: number) => (
          <span
            key={`landmark-${index}`}
            className="pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400"
            style={{
              left: `${(point.x / 1280) * 100}%`,
              top: `${(point.y / 720) * 100}%`,
            }}
          />
        ))}

        {objects.map(
          (object: DetectedObject, index: number) => (
            <div
              key={`object-${index}`}
              className="pointer-events-none absolute border-2 border-red-500"
              style={{
                left: `${(object.x / 1280) * 100}%`,
                top: `${(object.y / 720) * 100}%`,
                width: `${(object.width / 1280) * 100}%`,
                height: `${(object.height / 720) * 100}%`,
              }}
            >
              <span className="absolute -top-5 left-0 rounded bg-red-500 px-1.5 py-0.5 text-[9px] text-white">
                {object.label}
              </span>
            </div>
          ),
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Face
          </span>
          <span className="font-semibold">
            {faceStatus}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Objects
          </span>
          <span className="font-semibold">
            {objectStatus}
          </span>
        </div>
      </div>
    </div>
  );
}