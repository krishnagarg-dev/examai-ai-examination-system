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
  // -----------------------------------
  // TensorFlow.js
  // -----------------------------------
  await tf.ready();

  try {
    await tf.setBackend("webgl");
    await tf.ready();
  } catch (error) {
    console.warn(
      "WebGL unavailable. Using TensorFlow.js fallback backend.",
      error,
    );
  }

  // -----------------------------------
  // Load COCO-SSD + MediaPipe runtime
  // -----------------------------------
  const [objectDetector, vision] =
    await Promise.all([
      cocoSsd.load({
        base: "mobilenet_v2",
      }),

      FilesetResolver.forVisionTasks(WASM_URL),
    ]);

  // -----------------------------------
  // Face Landmarker
  // Try GPU first, then CPU
  // -----------------------------------
  let faceLandmarker: FaceLandmarker;

  try {
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

          minFaceDetectionConfidence: 0.6,
          minFacePresenceConfidence: 0.6,
          minTrackingConfidence: 0.6,

          outputFaceBlendshapes: true,
        },
      );
  } catch (gpuError) {
    console.warn(
      "MediaPipe GPU initialization failed. Retrying with CPU.",
      gpuError,
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

          minFaceDetectionConfidence: 0.6,
          minFacePresenceConfidence: 0.6,
          minTrackingConfidence: 0.6,

          outputFaceBlendshapes: true,
        },
      );
  }

  return {
    objectDetector,
    faceLandmarker,
  };
}