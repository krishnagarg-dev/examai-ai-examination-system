"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Exam = {
  _id: string;
  title: string;
  code: string;
  subject?: string;
  duration: number;
  totalMarks: number;
  startTime: string;
  endTime: string;
  status: string;
};

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/student/dashboard" },
  { icon: "▣", label: "My Exams", href: "/student/exams" },
  { icon: "▥", label: "Results", href: "/student/results" },
];

export default function StudentExams() {
  const pathname = usePathname();
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("/api/exams", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch examinations",
          );
        }

        setExams(
          Array.isArray(data)
            ? data
            : data.exams || [],
        );
      } catch (error) {
        console.error("Failed to fetch student exams:", error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const upcomingExams = useMemo(() => {
    return exams.filter(
      (exam) => exam.status === "scheduled",
    );
  }, [exams]);

  const liveExams = useMemo(() => {
    return exams.filter(
      (exam) => exam.status === "live",
    );
  }, [exams]);

  const handleLogout = () => {
    localStorage.removeItem("examai-auth");
    router.push("/student/login");
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#263446]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-[#e8eaf0] bg-white px-[17px] py-[30px]">

          <div className="flex items-center gap-[14px] border-b border-[#eef0f4] pb-[30px]">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-[#63a8b9] text-[22px] text-white shadow-[0_8px_20px_rgba(99,168,185,0.25)]">
              ✦
            </div>

            <div>
              <h2 className="text-[20px] font-bold">
                ExamAI
              </h2>

              <span className="mt-[2px] block text-[10px] text-[#8b94a3]">
                Student Portal
              </span>
            </div>
          </div>

          <div className="mt-[30px] px-[12px] text-[11px] font-bold tracking-[1.3px] text-[#8c95a4]">
            MAIN MENU
          </div>

          <nav className="mt-[14px] space-y-[8px]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-[17px] rounded-[14px] px-[18px] py-[16px] text-[14px] font-medium transition-all ${
                  pathname === item.href
                    ? "bg-[#63a8b9] text-white shadow-[0_8px_20px_rgba(99,168,185,0.18)]"
                    : "text-[#687384] hover:bg-[#f4f6f9]"
                }`}
              >
                <span className="text-[18px]">
                  {item.icon}
                </span>

                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="mb-[14px] px-[12px] text-[11px] font-bold tracking-[1.3px] text-[#8c95a4]">
              OTHER
            </div>

            <div className="space-y-[8px]">
              <Link
                href="/student/profile"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] hover:bg-[#f6f8fb]"
              >
                <span>◌</span>
                Profile
              </Link>

              <Link
                href="/student/settings"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] hover:bg-[#f6f8fb]"
              >
                <span>⚙</span>
                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-left text-[14px] font-medium text-[#d66b75] hover:bg-[#fff4f5]"
              >
                <span>↪</span>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-[38px]">

          <div className="mb-[34px]">
            <p className="mb-[7px] text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
              STUDENT EXAMINATIONS
            </p>

            <h1 className="text-[30px] font-bold">
              My Exams
            </h1>

            <p className="mt-[8px] text-[14px] text-[#7d8796]">
              View your upcoming, active and completed examinations.
            </p>
          </div>

          {/* EXAM SUMMARY */}
          <div className="mb-[28px] grid grid-cols-1 gap-[20px] md:grid-cols-3">

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] text-[#8b94a3]">
                Upcoming Exams
              </p>

              <h2 className="mt-[10px] text-[30px] font-bold">
                {upcomingExams.length}
              </h2>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] text-[#8b94a3]">
                Live Exams
              </p>

              <h2 className="mt-[10px] text-[30px] font-bold">
                {liveExams.length}
              </h2>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] text-[#8b94a3]">
                Available Exams
              </p>

              <h2 className="mt-[10px] text-[30px] font-bold">
                {exams.length}
              </h2>
            </div>

          </div>

          {/* AVAILABLE EXAMS */}
          <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[26px]">

            <div className="mb-[24px]">
              <h2 className="text-[19px] font-bold">
                Available Exams
              </h2>

              <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                Your scheduled and active examinations
              </p>
            </div>

            {loading ? (
              <div className="py-[50px] text-center text-[13px] text-[#8b94a3]">
                Loading examinations...
              </div>
            ) : exams.length === 0 ? (
              <div className="py-[50px] text-center">
                <h3 className="text-[15px] font-semibold">
                  No examinations available
                </h3>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  There are currently no scheduled examinations.
                </p>
              </div>
            ) : (
              <div className="space-y-[16px]">

                {exams.map((exam) => (
                  <div
                    key={exam._id}
                    className="flex flex-col justify-between gap-[20px] rounded-[18px] border border-[#e9ecf1] p-[22px] lg:flex-row lg:items-center"
                  >
                    <div>

                      <div className="flex items-center gap-[12px]">
                        <h3 className="text-[17px] font-semibold">
                          {exam.title}
                        </h3>

                        <span className="rounded-full bg-[#eef8fa] px-[10px] py-[5px] text-[10px] font-semibold text-[#63a8b9]">
                          {exam.status === "live"
                            ? "Live"
                            : "Upcoming"}
                        </span>
                      </div>

                      <p className="mt-[8px] text-[13px] text-[#8b94a3]">
                        {exam.code}
                        {exam.subject
                          ? ` • ${exam.subject}`
                          : ""}
                      </p>

                      <div className="mt-[15px] flex flex-wrap gap-[20px] text-[13px] text-[#667386]">
                        <span>
                          📅 {formatDate(exam.startTime)}
                        </span>

                        <span>
                          🕐 {formatTime(exam.startTime)}
                        </span>

                        <span>
                          ⏱ {exam.duration} Minutes
                        </span>

                        <span>
                          ▣ {exam.totalMarks} Marks
                        </span>
                      </div>

                    </div>

                    <Link
                      href={`/student/exams/${exam._id}`}
                      className="rounded-[13px] bg-[#63a8b9] px-[22px] py-[12px] text-center text-[13px] font-semibold text-white transition hover:opacity-90"
                    >
                      View Details
                    </Link>

                  </div>
                ))}

              </div>
            )}
          </div>

        </section>
      </div>
    </main>
  );
}