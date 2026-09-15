"use client";

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const WASM_URL = "/mediapipe/wasm";
const FACE_MODEL_URL = "/models/face_landmarker.task";

export async function loadProctoringModels() {
  console.log("[ExamAI] Starting AI initialization...");

  // -----------------------------------------
  // TensorFlow
  // -----------------------------------------
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

  // -----------------------------------------
  // COCO-SSD
  // -----------------------------------------
  console.log(
    "[ExamAI] Loading COCO-SSD...",
  );

  const objectDetector =
    await cocoSsd.load({
      base: "mobilenet_v2",
    });

  console.log(
    "[ExamAI] COCO-SSD ready",
  );

  // -----------------------------------------
  // MediaPipe WASM
  // -----------------------------------------
  console.log(
    "[ExamAI] Loading local MediaPipe WASM...",
  );

  const vision =
    await FilesetResolver.forVisionTasks(
      WASM_URL,
    );

  console.log(
    "[ExamAI] MediaPipe WASM ready",
  );

  // -----------------------------------------
  // Face Landmarker
  // -----------------------------------------
  console.log(
    "[ExamAI] Loading local Face Landmarker...",
  );

  let faceLandmarker: FaceLandmarker;

  try {
    // CPU first for maximum browser compatibility.
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
      "[ExamAI] Face Landmarker ready with CPU",
    );
  } catch (cpuError) {
    console.warn(
      "[ExamAI] CPU Face Landmarker failed. Trying GPU...",
      cpuError,
    );

    faceLandmarker =
      await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: FACE_MODEL_URL,
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
  }

  console.log(
    "[ExamAI] All AI models initialized successfully",
  );

  return {
    objectDetector,
    faceLandmarker,
  };
}