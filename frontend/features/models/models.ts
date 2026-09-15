"use client";

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";

const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export async function loadProctoringModels() {
  console.log("[ExamAI] Starting model initialization...");

  // TensorFlow
  await tf.ready();

  try {
    await tf.setBackend("webgl");
    await tf.ready();
    console.log(
      "[ExamAI] TensorFlow backend:",
      tf.getBackend(),
    );
  } catch (error) {
    console.warn(
      "[ExamAI] WebGL unavailable:",
      error,
    );
  }

  // Load independently so one model doesn't hide the other.
  console.log("[ExamAI] Loading COCO-SSD...");

  const objectDetector =
    await cocoSsd.load({
      base: "mobilenet_v2",
    });

  console.log("[ExamAI] COCO-SSD ready");

  console.log(
    "[ExamAI] Loading MediaPipe WASM...",
  );

  const vision =
    await FilesetResolver.forVisionTasks(
      WASM_URL,
    );

  console.log(
    "[ExamAI] MediaPipe WASM ready",
  );

  let faceLandmarker: FaceLandmarker;

  // CPU first = more reliable on Vercel/browser production.
  try {
    console.log(
      "[ExamAI] Loading Face Landmarker with CPU...",
    );

    faceLandmarker =
      await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: FACE_MODEL_URL,
            delegate: "CPU",
          },

          runningMode: "VIDEO",
          numFaces: 2,

          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,

          outputFaceBlendshapes: true,
        },
      );

    console.log(
      "[ExamAI] Face Landmarker ready",
    );
  } catch (cpuError) {
    console.error(
      "[ExamAI] CPU Face Landmarker failed:",
      cpuError,
    );

    // GPU fallback only if CPU fails.
    try {
      console.log(
        "[ExamAI] Retrying Face Landmarker with GPU...",
      );

      faceLandmarker =
        await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                FACE_MODEL_URL,
              delegate: "GPU",
            },

            runningMode: "VIDEO",
            numFaces: 2,

            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,

            outputFaceBlendshapes: true,
          },
        );

      console.log(
        "[ExamAI] Face Landmarker ready with GPU",
      );
    } catch (gpuError) {
      console.error(
        "[ExamAI] GPU Face Landmarker failed:",
        gpuError,
      );

      throw new Error(
        "Face AI model could not be initialized.",
      );
    }
  }

  return {
    objectDetector,
    faceLandmarker,
  };
}