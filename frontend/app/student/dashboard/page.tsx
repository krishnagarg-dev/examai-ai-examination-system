"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  {
    icon: "⌂",
    label: "Dashboard",
    href: "/student/dashboard",
  },
  {
    icon: "▣",
    label: "My Exams",
    href: "/student/exams",
  },
  {
    icon: "▥",
    label: "Results",
    href: "/student/results",
  },
];

const upcomingExams = [
  {
    subject: "Database Management System",
    code: "MCA-302",
    date: "28 Aug 2026",
    time: "10:00 AM",
    duration: "2 Hours",
    status: "Upcoming",
  },
  {
    subject: "Operating Systems",
    code: "MCA-303",
    date: "30 Aug 2026",
    time: "02:00 PM",
    duration: "2 Hours",
    status: "Upcoming",
  },
];

const recentResults = [
  {
    subject: "Data Structures & Algorithms",
    code: "MCA-301",
    marks: "86/100",
    percentage: "86%",
    status: "Passed",
  },
  {
    subject: "Computer Networks",
    code: "MCA-304",
    marks: "78/100",
    percentage: "78%",
    status: "Passed",
  },
];

export default function StudentDashboard() {
  const pathname = usePathname();
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userName, setUserName] = useState("Krishna");

  useEffect(() => {
    const verifyStudent = async () => {
      try {
        const response = await fetch("/api/auth/student-me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/student/login");
          return;
        }

        const data = await response.json();

        if (data.user?.role !== "student") {
          router.replace("/student/login");
          return;
        }

        setUserName(data.user?.name || "Student");
        setIsCheckingAuth(false);
      } catch {
        router.replace("/student/login");
      }
    };

    verifyStudent();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    router.push("/student/login");
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#263446]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-[#e8eaf0] bg-white px-[17px] py-[30px]">
          {/* BRAND */}
          <div className="flex items-center gap-[14px] border-b border-[#eef0f4] pb-[30px]">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-[#63a8b9] text-[22px] text-white shadow-[0_8px_20px_rgba(99,168,185,0.25)]">
              ✦
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-[#263446]">
                ExamAI
              </h2>

              <span className="mt-[2px] block text-[10px] text-[#8b94a3]">
                Student Portal
              </span>
            </div>
          </div>

          {/* MAIN MENU */}
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
                <span className="text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* OTHER */}
          <div className="mt-auto">
            <div className="mb-[14px] px-[12px] text-[11px] font-bold tracking-[1.3px] text-[#8c95a4]">
              OTHER
            </div>

            <div className="space-y-[8px]">
              <Link
                href="/student/profile"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] transition hover:bg-[#f6f8fb]"
              >
                <span className="w-[14px] text-center">◌</span>
                Profile
              </Link>

              <Link
                href="/student/settings"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] transition hover:bg-[#f6f8fb]"
              >
                <span className="w-[14px] text-center">⚙</span>
                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#d66b75] transition hover:bg-[#fff4f5]"
              >
                <span className="w-[14px] text-center">↪</span>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-[38px]">
          {/* TOP HEADER */}
          <div className="mb-[34px] flex items-center justify-between">
            <div>
              <p className="mb-[7px] text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
                STUDENT DASHBOARD
              </p>

              <h1 className="text-[30px] font-bold text-[#263446]">
                Welcome back, {userName}! 👋
              </h1>

              <p className="mt-[8px] text-[14px] text-[#7d8796]">
                Track your examinations, results and academic performance.
              </p>
            </div>

            <div className="flex items-center gap-[14px]">
              <div className="rounded-[16px] border border-[#e8eaf0] bg-white px-[18px] py-[11px]">
                <p className="text-[11px] text-[#8b94a3]">
                  Student ID
                </p>

                <p className="mt-[2px] text-[14px] font-semibold text-[#263446]">
                  MCA2025-101
                </p>
              </div>

              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#263446] text-[14px] font-bold text-white">
                {userName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] font-medium text-[#8b94a3]">
                Upcoming Exams
              </p>

              <h2 className="mt-[12px] text-[30px] font-bold">
                2
              </h2>

              <p className="mt-[8px] text-[12px] text-[#63a8b9]">
                Next exam in 2 days
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] font-medium text-[#8b94a3]">
                Completed Exams
              </p>

              <h2 className="mt-[12px] text-[30px] font-bold">
                8
              </h2>

              <p className="mt-[8px] text-[12px] text-[#63a8b9]">
                This semester
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] font-medium text-[#8b94a3]">
                Average Score
              </p>

              <h2 className="mt-[12px] text-[30px] font-bold">
                82%
              </h2>

              <p className="mt-[8px] text-[12px] text-[#63a8b9]">
                Good performance
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] font-medium text-[#8b94a3]">
                Attendance
              </p>

              <h2 className="mt-[12px] text-[30px] font-bold">
                94%
              </h2>

              <p className="mt-[8px] text-[12px] text-[#63a8b9]">
                Excellent record
              </p>
            </div>
          </div>

          {/* TODAY'S EXAM */}
          <div className="mt-[28px] rounded-[22px] bg-[#263446] p-[30px] text-white">
            <div className="flex flex-col justify-between gap-[25px] lg:flex-row lg:items-center">
              <div>
                <span className="rounded-full bg-white/10 px-[12px] py-[6px] text-[11px] font-semibold tracking-[1px]">
                  UPCOMING EXAM
                </span>

                <h2 className="mt-[20px] text-[25px] font-bold">
                  Database Management System
                </h2>

                <p className="mt-[7px] text-[14px] text-[#c5ccd7]">
                  MCA-302 • 28 Aug 2026 • 10:00 AM
                </p>

                <div className="mt-[18px] flex gap-[25px] text-[13px] text-[#d7dce4]">
                  <span>⏱ 2 Hours</span>
                  <span>▣ 100 Marks</span>
                  <span>◉ AI Proctoring</span>
                </div>
              </div>

              <Link
                href="/student/exams"
                className="rounded-[14px] bg-[#63a8b9] px-[24px] py-[14px] text-center text-[14px] font-semibold text-white transition hover:opacity-90"
              >
                View Exam Details
              </Link>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div className="mt-[28px] grid grid-cols-1 gap-[24px] xl:grid-cols-[1.4fr_1fr]">
            {/* UPCOMING EXAMS */}
            <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[26px]">
              <div className="mb-[22px] flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold">
                    Upcoming Exams
                  </h2>

                  <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                    Your scheduled examinations
                  </p>
                </div>

                <Link
                  href="/student/exams"
                  className="text-[13px] font-semibold text-[#63a8b9]"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-[14px]">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.code}
                    className="flex items-center justify-between rounded-[16px] border border-[#eef0f4] p-[17px]"
                  >
                    <div>
                      <h3 className="text-[14px] font-semibold">
                        {exam.subject}
                      </h3>

                      <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                        {exam.code} • {exam.date}
                      </p>

                      <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                        {exam.time} • {exam.duration}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#eef8fa] px-[11px] py-[6px] text-[11px] font-semibold text-[#63a8b9]">
                      {exam.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT RESULTS */}
            <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[26px]">
              <div className="mb-[22px] flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold">
                    Recent Results
                  </h2>

                  <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                    Latest examination performance
                  </p>
                </div>

                <Link
                  href="/student/results"
                  className="text-[13px] font-semibold text-[#63a8b9]"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-[18px]">
                {recentResults.map((result) => (
                  <div
                    key={result.code}
                    className="border-b border-[#eef0f4] pb-[16px] last:border-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[14px] font-semibold">
                          {result.subject}
                        </h3>

                        <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                          {result.code}
                        </p>
                      </div>

                      <span className="text-[18px] font-bold text-[#63a8b9]">
                        {result.percentage}
                      </span>
                    </div>

                    <div className="mt-[10px] flex items-center justify-between">
                      <span className="text-[12px] text-[#8b94a3]">
                        {result.marks}
                      </span>

                      <span className="rounded-full bg-[#edf8f2] px-[10px] py-[4px] text-[10px] font-semibold text-[#4e9b6b]">
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}