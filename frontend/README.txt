EXAMAI MODULAR PROCTORING REFACTOR

Place these files under frontend/:

lib/proctoring/types.ts
lib/proctoring/config.ts
lib/proctoring/models.ts
hooks/useProctoring.ts
hooks/useExamTimer.ts
components/exam/PreExamVerification.tsx
components/exam/ProctoringPanel.tsx
app/student/exams/[examId]/attempt/page.tsx

IMPORTANT:
- The attempt page path is app/student/exams/[examId]/attempt/page.tsx.
- The current code keeps the existing fallback Cloud Computing questions until the Question backend is implemented.
- AI features included: camera startup, MediaPipe face detection/landmarks, single-face verification for 8 seconds, multiple-face detection, no-face monitoring, partial-face obstruction detection, COCO-SSD object detection, cell-phone detection, live overlays, tab-switch detection, fullscreen-exit detection, three-violation termination.
- The exam timer starts only after successful pre-exam verification and after the student clicks Start Examination.
