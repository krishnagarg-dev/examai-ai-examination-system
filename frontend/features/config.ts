export const PROCTORING_CONFIG = {
  verificationSeconds: 8,
  detectionIntervalMs: 750,
  maxViolations: 3,

  face: {
    minWidth: 120,
    minHeight: 120,
    centerOffsetX: 0.25,
    centerOffsetY: 0.25,
  },

  thresholds: {
    faceDetection: 0.5,
    objectDetection: 0.5,
  },

  camera: {
    width: 1280,
    height: 720,
  },
} as const;