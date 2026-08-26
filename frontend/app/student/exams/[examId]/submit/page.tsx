"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function SubmitPage() {
  const params = useParams();
  const examId = params.examId;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] p-6">
      <div className="w-full max-w-[520px] rounded-[24px] border border-[#e8eaf0] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#e7f6ef] text-[32px]">
          ✓
        </div>

        <p className="mt-6 text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
          EXAMINATION COMPLETED
        </p>

        <h1 className="mt-3 text-[28px] font-bold text-[#263446]">
          Exam Submitted Successfully
        </h1>

        <p className="mt-4 text-[14px] leading-6 text-[#7d8796]">
          Your examination has been submitted successfully and your responses
          have been recorded.
        </p>

        <div className="mt-6 rounded-[16px] bg-[#f5f7fa] p-4 text-left">
          <p className="text-[11px] text-[#8b94a3]">
            Exam ID
          </p>

          <p className="mt-1 text-[14px] font-semibold text-[#263446]">
            {examId}
          </p>
        </div>

        <Link
          href="/student/dashboard"
          className="mt-7 inline-flex rounded-[13px] bg-[#63a8b9] px-6 py-3 text-[13px] font-semibold text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}