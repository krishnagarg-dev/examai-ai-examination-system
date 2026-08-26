"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const examData = {
  "mca-302": {
    title: "Database Management System",
    code: "MCA-302",
    date: "28 Aug 2026",
    time: "10:00 AM",
    duration: "2 Hours",
    marks: 100,
    questions: 50,
  },
  "mca-303": {
    title: "Operating Systems",
    code: "MCA-303",
    date: "30 Aug 2026",
    time: "02:00 PM",
    duration: "2 Hours",
    marks: 100,
    questions: 50,
  },
};

export default function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId as string;

  const exam = examData[examId as keyof typeof examData];

  if (!exam) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-[#263446]">
            Exam Not Found
          </h1>

          <Link
            href="/student/exams"
            className="mt-[18px] inline-block rounded-[12px] bg-[#63a8b9] px-[20px] py-[12px] text-[13px] font-semibold text-white"
          >
            Back to My Exams
          </Link>
        </div>
      </main>
    );
  }

  const handleStartExam = () => {
    router.push(`/student/exams/${examId}/proctoring`);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#263446]">
      {/* TOP BAR */}
      <header className="border-b border-[#e8eaf0] bg-white px-[30px] py-[18px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link
            href="/student/exams"
            className="text-[14px] font-medium text-[#667386]"
          >
            ← Back to My Exams
          </Link>

          <div className="flex items-center gap-[10px]">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#63a8b9] text-white">
              ✦
            </div>

            <div>
              <h2 className="text-[16px] font-bold">ExamAI</h2>
              <p className="text-[9px] text-[#8b94a3]">
                AI Examination System
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1100px] px-[25px] py-[45px]">
        <div className="grid gap-[28px] lg:grid-cols-[1fr_320px]">
          {/* LEFT CONTENT */}
          <div className="space-y-[25px]">
            {/* EXAM HEADER */}
            <div className="rounded-[24px] border border-[#e8eaf0] bg-white p-[30px]">
              <p className="text-[11px] font-bold tracking-[1px] text-[#63a8b9]">
                UPCOMING EXAMINATION
              </p>

              <h1 className="mt-[10px] text-[30px] font-bold">
                {exam.title}
              </h1>

              <p className="mt-[7px] text-[14px] text-[#8b94a3]">
                {exam.code}
              </p>

              <div className="mt-[28px] grid grid-cols-2 gap-[16px] md:grid-cols-4">
                <div className="rounded-[14px] bg-[#f7f8fc] p-[16px]">
                  <p className="text-[10px] text-[#8b94a3]">DATE</p>
                  <h3 className="mt-[6px] text-[13px] font-semibold">
                    {exam.date}
                  </h3>
                </div>

                <div className="rounded-[14px] bg-[#f7f8fc] p-[16px]">
                  <p className="text-[10px] text-[#8b94a3]">TIME</p>
                  <h3 className="mt-[6px] text-[13px] font-semibold">
                    {exam.time}
                  </h3>
                </div>

                <div className="rounded-[14px] bg-[#f7f8fc] p-[16px]">
                  <p className="text-[10px] text-[#8b94a3]">DURATION</p>
                  <h3 className="mt-[6px] text-[13px] font-semibold">
                    {exam.duration}
                  </h3>
                </div>

                <div className="rounded-[14px] bg-[#f7f8fc] p-[16px]">
                  <p className="text-[10px] text-[#8b94a3]">TOTAL MARKS</p>
                  <h3 className="mt-[6px] text-[13px] font-semibold">
                    {exam.marks}
                  </h3>
                </div>
              </div>
            </div>

            {/* EXAM INSTRUCTIONS */}
            <div className="rounded-[24px] border border-[#e8eaf0] bg-white p-[30px]">
              <h2 className="text-[20px] font-bold">
                Examination Instructions
              </h2>

              <div className="mt-[22px] space-y-[16px] text-[13px] leading-[1.7] text-[#667386]">
                <p>
                  1. The examination contains {exam.questions} questions and
                  the total duration is {exam.duration}.
                </p>

                <p>
                  2. Once the examination starts, the timer cannot be paused.
                </p>

                <p>
                  3. Your webcam must remain active throughout the examination.
                </p>

                <p>
                  4. Leaving fullscreen mode may be recorded as a violation.
                </p>

                <p>
                  5. Switching browser tabs or applications may be detected.
                </p>

                <p>
                  6. Ensure that you have a stable internet connection before
                  starting.
                </p>
              </div>
            </div>

            {/* SYSTEM REQUIREMENTS */}
            <div className="rounded-[24px] border border-[#e8eaf0] bg-white p-[30px]">
              <h2 className="text-[20px] font-bold">
                System Requirements
              </h2>

              <div className="mt-[22px] grid gap-[15px] md:grid-cols-2">
                {[
                  "Working webcam",
                  "Stable internet connection",
                  "Latest Chrome or Edge browser",
                  "Camera permission enabled",
                  "Microphone permission enabled",
                  "Fullscreen mode supported",
                ].map((requirement) => (
                  <div
                    key={requirement}
                    className="flex items-center gap-[10px] rounded-[13px] bg-[#f7f8fc] p-[14px] text-[12px] font-medium"
                  >
                    <span className="text-[#63a8b9]">✓</span>
                    {requirement}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside>
            <div className="sticky top-[25px] rounded-[24px] border border-[#e8eaf0] bg-white p-[26px]">
              <span className="inline-block rounded-full bg-[#eef8fa] px-[11px] py-[6px] text-[10px] font-semibold text-[#63a8b9]">
                UPCOMING
              </span>

              <h2 className="mt-[18px] text-[19px] font-bold">
                Ready to begin?
              </h2>

              <p className="mt-[8px] text-[12px] leading-[1.7] text-[#8b94a3]">
                Before starting, we will verify your camera, microphone and
                proctoring environment.
              </p>

              <button
                onClick={handleStartExam}
                className="mt-[22px] w-full rounded-[13px] bg-[#63a8b9] px-[20px] py-[14px] text-[13px] font-semibold text-white transition hover:opacity-90"
              >
                Continue to Verification
              </button>

              <p className="mt-[14px] text-center text-[10px] text-[#a0a7b3]">
                Make sure you are ready before continuing.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}