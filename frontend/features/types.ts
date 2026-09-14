export type Exam = {
  _id: string;
  title: string;
  code: string;
  subject?: string;
  description?: string;
  duration: number;
  totalMarks: number;
  startTime: string;
  endTime: string;
  status: string;
};

export type Question = {
  id: number;
  question: string;
  options: string[];
};

export type FaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

export type Point = { x: number; y: number };

export type DetectedObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  score: number;
};

export type ProctoringState = {
  cameraActive: boolean;
  modelsReady: boolean;
  verifying: boolean;
  verified: boolean;
  verificationProgress: number;
  faceCount: number;
  faceStatus: string;
  objectStatus: string;
  cameraError: string;
  faceBox: FaceBox;
  landmarks: Point[];
  objects: DetectedObject[];
  violations: number;
  warning: string;
  showWarning: boolean;
  terminated: boolean;
};
