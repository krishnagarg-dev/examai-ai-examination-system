import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export async function loadProctoringModels() {
  await tf.ready();
  try {
    await tf.setBackend("webgl");
    await tf.ready();
  } catch {
    console.warn("WebGL unavailable; TensorFlow.js will use its fallback backend.");
  }

  const [objectDetector, vision] = await Promise.all([
    cocoSsd.load({ base: "mobilenet_v2" }),
    FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm",
    ),
  ]);

  const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numFaces: 2,
    minFaceDetectionConfidence: 0.6,
    minFacePresenceConfidence: 0.6,
    minTrackingConfidence: 0.6,
    outputFaceBlendshapes: true,
  });

  return { objectDetector, faceLandmarker };
}
