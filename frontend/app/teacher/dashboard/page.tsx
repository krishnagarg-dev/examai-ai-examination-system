"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("Teacher");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyTeacher = async () => {
      try {
        const response = await fetch("/api/auth/teacher-me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/teacher/login");
          return;
        }

        const data = await response.json();

        if (data.user?.role !== "teacher") {
          router.replace("/teacher/login");
          return;
        }

        setUserName(data.user?.name || "Teacher");
        setIsCheckingAuth(false);
      } catch {
        router.replace("/teacher/login");
      }
    };

    verifyTeacher();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    router.push("/teacher/login");
  };

  const navItems = [
    { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
    { icon: "▣", label: "My Exams", href: "/teacher/exams" },
    { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
    { icon: "◉", label: "Questions", href: "/teacher/questions" },
    { icon: "◉", label: "Students", href: "/teacher/students" },
    { icon: "▥", label: "Results", href: "/teacher/results" },
  ];

  if (isCheckingAuth) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-700">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="px-6 py-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6f6ca8] text-white flex items-center justify-center shadow-sm">
                ✦
              </div>

              <div>
                <h1 className="font-bold text-slate-800 text-lg">
                  ExamAI
                </h1>

                <p className="text-xs text-slate-400">
                  AI Examination System
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-6">
            <p className="px-3 text-[10px] font-semibold tracking-widest text-slate-400 mb-3">
              MAIN MENU
            </p>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left transition ${
                    item.href === "/teacher/dashboard"
                      ? "bg-[#6f6ca8]/10 text-[#6f6ca8] font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span className="w-5 text-center">
                    {item.icon}
                  </span>

                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="px-4 pt-8">
            <p className="px-3 text-[10px] font-semibold tracking-widest text-slate-400 mb-3">
              OTHER
            </p>

            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => router.push("/teacher/profile")}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <span className="w-5 text-center">◌</span>
                Profile
              </button>

              <button
                type="button"
                onClick={() => router.push("/teacher/settings")}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <span className="w-5 text-center">⚙</span>
                Settings
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-500 hover:bg-red-50 hover:text-red-500"
              >
                <span className="w-5 text-center">↪</span>
                Logout
              </button>
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs text-slate-400">
                Teacher Portal
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                Manage your examinations
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1">
          {/* Top bar */}
          <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Teacher Portal
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6f6ca8]/10 text-[#6f6ca8] flex items-center justify-center font-semibold">
                {userName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {userName}
                </p>

                <p className="text-xs text-slate-400">
                  Teacher
                </p>
              </div>
            </div>
          </header>

          <div className="p-8">
            {/* Heading */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#6f6ca8] mb-2">
                  TEACHER DASHBOARD
                </p>

                <h2 className="text-3xl font-bold text-slate-800">
                  Welcome back, {userName}! 👋
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Manage examinations, questions, students and results.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/teacher/create-exam")}
                className="px-5 py-3 rounded-xl bg-[#6f6ca8] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition"
              >
                ＋ Create New Exam
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    My Exams
                  </span>
                  <span className="text-[#6f6ca8]">▣</span>
                </div>

                <h3 className="text-3xl font-bold text-slate-800 mt-4">
                  12
                </h3>

                <p className="text-xs text-slate-400 mt-2">
                  4 scheduled
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Questions
                  </span>
                  <span className="text-[#6f6ca8]">◉</span>
                </div>

                <h3 className="text-3xl font-bold text-slate-800 mt-4">
                  186
                </h3>

                <p className="text-xs text-slate-400 mt-2">
                  Across all exams
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Students
                  </span>
                  <span className="text-[#6f6ca8]">◉</span>
                </div>

                <h3 className="text-3xl font-bold text-slate-800 mt-4">
                  324
                </h3>

                <p className="text-xs text-emerald-500 mt-2">
                  +24 this month
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Average Score
                  </span>
                  <span className="text-[#6f6ca8]">↗</span>
                </div>

                <h3 className="text-3xl font-bold text-slate-800 mt-4">
                  84.6%
                </h3>

                <p className="text-xs text-emerald-500 mt-2">
                  +6.2% improvement
                </p>
              </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              {/* Upcoming exams */}
              <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Upcoming Examinations
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Your scheduled examinations
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/teacher/exams")}
                    className="text-xs text-[#6f6ca8] font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#6f6ca8]/10 text-[#6f6ca8] flex items-center justify-center">
                        ▣
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-700">
                          Data Structures & Algorithms
                        </h4>

                        <p className="text-xs text-slate-400 mt-1">
                          MCA-301 • 28 Sep 2026 • 10:00 AM
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                      Upcoming
                    </span>
                  </div>

                  <div className="px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#6f6ca8]/10 text-[#6f6ca8] flex items-center justify-center">
                        ▣
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-700">
                          Database Management System
                        </h4>

                        <p className="text-xs text-slate-400 mt-1">
                          MCA-302 • 30 Sep 2026 • 02:00 PM
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                      Scheduled
                    </span>
                  </div>

                  <div className="px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#6f6ca8]/10 text-[#6f6ca8] flex items-center justify-center">
                        ▣
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-700">
                          Computer Networks
                        </h4>

                        <p className="text-xs text-slate-400 mt-1">
                          MCA-303 • 02 Oct 2026 • 11:00 AM
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      Draft
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white border border-slate-200 rounded-2xl">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">
                    Quick Actions
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Common teacher actions
                  </p>
                </div>

                <div className="p-5 space-y-3">
                  <button
                    type="button"
                    onClick={() => router.push("/teacher/create-exam")}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-[#6f6ca8]/30 hover:bg-[#6f6ca8]/5 transition"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      ＋ Create Examination
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Create and schedule a new exam
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/teacher/questions")}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-[#6f6ca8]/30 hover:bg-[#6f6ca8]/5 transition"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      ◉ Question Bank
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Manage your examination questions
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/teacher/results")}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-[#6f6ca8]/30 hover:bg-[#6f6ca8]/5 transition"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      ▥ View Results
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Review student examination results
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/teacher/students")}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-[#6f6ca8]/30 hover:bg-[#6f6ca8]/5 transition"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      ◉ Manage Students
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      View and monitor assigned students
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent results */}
            <div className="bg-white border border-slate-200 rounded-2xl mt-6">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Recent Results
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Latest student performance
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/teacher/results")}
                  className="text-xs text-[#6f6ca8] font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-4 font-medium">
                        Examination
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Students
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Average
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        Web Technologies
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        48
                      </td>

                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        86.4%
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                          Completed
                        </span>
                      </td>
                    </tr>

                    <tr className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        Operating Systems
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        52
                      </td>

                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        81.8%
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                          Completed
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        Database Management System
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        58
                      </td>

                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        —
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-slate-400">
              ExamAI • AI-Powered Examination System
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}