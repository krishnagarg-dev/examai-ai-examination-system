"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import { PreExamVerification } from "../../../../../features/components/PreExamVerification";
import { ProctoringPanel } from "../../../../../features/components/ProctoringPanel";
import { useProctoring } from "../../../../../features/hooks/useProctoring";
import { useExamTimer } from "../../../../../hooks/useExamTimer";

import type {
  Exam,
  Question,
} from "../../../../../features/types";

const fallbackQuestions: Question[] = [
  { id: 1, question: "Which technology is primarily used to provide on-demand computing resources over the internet?", options: ["Cloud Computing", "Operating Systems", "Compiler Design", "Data Structures"] },
  { id: 2, question: "Which cloud service model provides virtual machines, storage and networking?", options: ["SaaS", "PaaS", "IaaS", "DBaaS"] },
  { id: 3, question: "Which cloud deployment model is dedicated to a single organization?", options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Community Internet"] },
  { id: 4, question: "Which characteristic allows cloud resources to increase or decrease based on demand?", options: ["Elasticity", "Encryption", "Virtualization", "Authentication"] },
  { id: 5, question: "Which of the following is an example of a cloud storage service?", options: ["Amazon S3", "HTML", "JavaScript", "CSS"] },
];

const formatTime = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function ExamAttemptPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [questions] = useState<Question[]>(fallbackQuestions);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [review, setReview] = useState<number[]>([]);

  const onExpire = useCallback(() => router.push(`/student/exams/${examId}/submit`), [examId, router]);
  const proctor = useProctoring(videoRef, true);
  const timeLeft = useExamTimer((exam?.duration ?? 120) * 60, started && proctor.verified && !proctor.terminated, onExpire);

  useEffect(() => {
    fetch(`/api/exams/${examId}`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Failed to load examination");
        setExam(data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load examination"))
      .finally(() => setLoading(false));
  }, [examId]);

  const begin = useCallback(async () => {
    if (!proctor.verified || proctor.terminated) return;
    try { await document.documentElement.requestFullscreen(); } catch { /* browser may block fullscreen */ }
    setStarted(true);
  }, [proctor.terminated, proctor.verified]);

  const submit = useCallback(() => { proctor.stop(); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); router.push(`/student/exams/${examId}/submit`); }, [examId, proctor, router]);

  if (loading) return <main className="min-h-screen grid place-items-center">Loading examination...</main>;
  if (error || !exam) return <main className="min-h-screen grid place-items-center"><div className="rounded-2xl bg-white p-8">{error || "Examination unavailable"}</div></main>;
  if (!started) {
    return <div>
      <PreExamVerification videoRef={videoRef} progress={proctor.verificationProgress} cameraActive={proctor.cameraActive} modelsReady={proctor.modelsReady} faceStatus={proctor.faceStatus} objectStatus={proctor.objectStatus} cameraError={proctor.cameraError} />
      {proctor.verified && <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center"><button onClick={begin} className="rounded-xl bg-[#63a8b9] px-7 py-3 text-sm font-semibold text-white shadow-lg">Start Examination â†’</button></div>}
    </div>;
  }

  const q = questions[current];
  return <main className="min-h-screen bg-[#f7f8fc] text-[#263446]">
    <header className="flex items-center justify-between border-b bg-white px-7 py-4"><div><b>âœ¦ ExamAI</b><p className="text-[9px] text-[#8b94a3]">Live Examination</p></div><div className="text-center"><p className="text-[10px] text-[#8b94a3]">{exam.title}</p><h2 className="text-xl font-bold text-[#d66b75]">{formatTime(timeLeft)}</h2></div><div className="flex items-center gap-2 text-[11px]"><span className={`h-2 w-2 rounded-full ${proctor.cameraActive ? "bg-green-500" : "bg-red-500"}`} />{proctor.cameraActive ? "Camera Active" : "Camera Off"}<span className="rounded-full bg-[#fff4f5] px-3 py-1.5 font-semibold text-[#d66b75]">âš  {proctor.violations} / 3</span></div></header>
    <div className="flex min-h-[calc(100vh-73px)]">
      <section className="flex-1 p-8"><div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8"><div className="flex justify-between"><span className="rounded-full bg-[#eef8fa] px-3 py-1.5 text-[11px] font-semibold text-[#63a8b9]">Question {current + 1} of {questions.length}</span>{review.includes(q.id) && <span className="text-[11px] font-semibold text-[#c38c21]">â˜… Marked for Review</span>}</div><h2 className="mt-8 text-[22px] font-semibold leading-relaxed">{q.question}</h2><div className="mt-7 space-y-3">{q.options.map((option, i) => <button key={option} onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm ${answers[q.id] === i ? "border-[#63a8b9] bg-[#eef8fa]" : "border-[#e8eaf0] hover:border-[#63a8b9]"}`}><span className="grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold">{String.fromCharCode(65 + i)}</span>{option}</button>)}</div><div className="mt-8 flex justify-between border-t pt-6"><button disabled={!current} onClick={() => setCurrent((v) => v - 1)} className="rounded-xl border px-4 py-2.5 text-sm disabled:opacity-40">â† Previous</button><button onClick={() => setReview((r) => r.includes(q.id) ? r.filter((x) => x !== q.id) : [...r, q.id])} className="rounded-xl bg-[#fff7e7] px-4 py-2.5 text-sm font-semibold text-[#c38c21]">â˜† Mark for Review</button>{current === questions.length - 1 ? <button onClick={submit} className="rounded-xl bg-[#d66b75] px-5 py-2.5 text-sm font-semibold text-white">Submit Exam</button> : <button onClick={() => setCurrent((v) => v + 1)} className="rounded-xl bg-[#63a8b9] px-5 py-2.5 text-sm font-semibold text-white">Save & Next â†’</button>}</div></div></section>
      <aside className="w-[320px] border-l bg-white p-5"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-bold">AI Live Proctoring</h2><span className="text-[10px] font-semibold text-green-600">â— LIVE</span></div><ProctoringPanel videoRef={videoRef} cameraActive={proctor.cameraActive} cameraError={proctor.cameraError} faceBox={proctor.faceBox} landmarks={proctor.landmarks} objects={proctor.objects} faceStatus={proctor.faceStatus} objectStatus={proctor.objectStatus} /><div className="mt-6 border-t pt-5"><h3 className="font-bold">Question Palette</h3><p className="mt-1 text-[11px] text-[#8b94a3]">Navigate between questions</p><div className="mt-4 grid grid-cols-4 gap-2">{questions.map((item, i) => <button key={item.id} onClick={() => setCurrent(i)} className={`h-10 rounded-lg text-sm font-semibold ${current === i ? "bg-[#63a8b9] text-white" : review.includes(item.id) ? "bg-[#fff1cc] text-[#c38c21]" : answers[item.id] !== undefined ? "bg-[#e7f6ef] text-[#4f9b70]" : "bg-[#f4f6f9] text-[#7d8796]"}`}>{item.id}</button>)}</div><button onClick={submit} className="mt-5 w-full rounded-xl bg-[#d66b75] px-4 py-3 text-sm font-semibold text-white">Submit Examination</button></div></aside>
    </div>
    {proctor.showWarning && <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5"><div className="w-full max-w-md rounded-3xl bg-white p-8 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff1f2] text-2xl">âš ï¸</div><h2 className="mt-4 text-xl font-bold text-[#d66b75]">{proctor.terminated ? "Examination Terminated" : "Proctoring Violation Detected"}</h2><p className="mt-3 text-sm leading-relaxed text-[#687384]">{proctor.warning}</p><div className="mt-5 rounded-xl bg-[#fff7f7] p-3 text-xs text-[#d66b75]">Total Violations: {proctor.violations} / 3</div>{proctor.terminated ? <div className="mt-5 rounded-xl bg-[#fff1f2] p-3 text-sm font-semibold text-[#d66b75]">Examination is being submitted automatically...</div> : <button onClick={() => { proctor.setShowWarning(false); proctor.setWarning(""); }} className="mt-5 w-full rounded-xl border px-4 py-3 text-sm font-semibold">Continue</button>}</div></div>}
    {proctor.terminated && <AutoSubmit router={router} examId={examId} />}
  </main>;
}

function AutoSubmit({ router, examId }: { router: ReturnType<typeof useRouter>; examId: string }) {
  useEffect(() => {
    const id = window.setTimeout(() => router.push(`/student/exams/${examId}/submit`), 2500);
    return () => window.clearTimeout(id);
  }, [examId, router]);
  return null;
}