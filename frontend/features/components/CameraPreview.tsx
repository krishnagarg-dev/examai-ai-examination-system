"use client";

import { useEffect, type RefObject } from "react";

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  className?: string;
  mirror?: boolean;
}

export function CameraPreview({
  videoRef,
  stream,
  className = "h-full w-full object-cover",
  mirror = false,
}: CameraPreviewProps) {
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

        console.log("[ExamAI] Camera preview attached", {
          streamActive: stream.active,
          trackState:
            stream.getVideoTracks()[0]?.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          paused: video.paused,
        });
      } catch (error) {
        console.error(
          "[ExamAI] Camera preview playback failed:",
          error,
        );
      }
    };

    void startPlayback();

    const handleLoadedMetadata = () => {
      void startPlayback();
    };

    const handleLoadedData = () => {
      void startPlayback();
    };

    video.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
    );

    video.addEventListener(
      "loadeddata",
      handleLoadedData,
    );

    const retryTimer =
      window.setInterval(() => {
        if (
          video.srcObject !== stream ||
          video.paused ||
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          void startPlayback();
        }
      }, 1000);

    return () => {
      window.clearInterval(retryTimer);

      video.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );

      video.removeEventListener(
        "loadeddata",
        handleLoadedData,
      );
    };
  }, [stream, videoRef]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className={`${className} ${
        mirror ? "scale-x-[-1]" : ""
      }`}
    />
  );
}