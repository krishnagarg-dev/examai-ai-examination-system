"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "▣", label: "Exams", href: "/admin/exams" },
  { icon: "＋", label: "Create Exam", href: "/admin/create-exam" },
  { icon: "◉", label: "Students", href: "/admin/students" },
  {
    icon: "◉",
    label: "Live Proctoring",
    href: "/admin/live-proctoring",
  },
  { icon: "▥", label: "Results", href: "/admin/results" },
  { icon: "◇", label: "Analytics", href: "/admin/analytics" },
];

const exams = [
  {
    title: "Data Structures & Algorithms",
    code: "MCA-301",
    date: "28 Aug 2026",
    time: "10:00 AM",
    students: 64,
    status: "Upcoming",
  },
  {
    title: "Database Management System",
    code: "MCA-302",
    date: "26 Aug 2026",
    time: "02:00 PM",
    students: 58,
    status: "Live",
  },
  {
    title: "Computer Networks",
    code: "MCA-303",
    date: "24 Aug 2026",
    time: "11:00 AM",
    students: 72,
    status: "Completed",
  },
];

export default function Dashboard() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    router.push("/admin/login");
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/admin/login");
          return;
        }

        const data = await response.json();

        if (data.user?.role !== "admin") {
          router.replace("/admin/login");
          return;
        }

        setIsCheckingAuth(false);
      } catch {
        router.replace("/admin/login");
      }
    };

    verifyAdmin();
  }, [router]);

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
              <h2 className="text-[20px] font-bold tracking-[0.2px] text-[#263446]">
                ExamAI
              </h2>

              <span className="mt-[2px] block text-[10px] text-[#8b94a3]">
                AI Examination System
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
                className={`relative flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[16px] text-left text-[14px] font-medium transition-all duration-200 ${
                  activeItem === item.label
                    ? "bg-[#63a8b9] text-white shadow-[0_8px_20px_rgba(99,168,185,0.18)]"
                    : "text-[#687384] hover:bg-[#f4f6f9]"
                }`}
                onClick={() => setActiveItem(item.label)}
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
                href="/admin/profile"
                className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] transition hover:bg-[#f6f8fb]"
              >
                <span className="w-[14px] text-center">◌</span>
                Profile
              </Link>

              <Link
                href="/admin/settings"
                className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] transition hover:bg-[#f6f8fb]"
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
        <section className="min-w-0 flex-1 px-[38px] pb-[40px] xl:px-[42px]">
          {/* TOPBAR */}
          <header className="flex h-[96px] items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-[48px] w-[330px] items-center gap-[11px] rounded-[15px] border border-[#dfe3ea] bg-white px-[17px] text-[#8b95a4] shadow-[0_5px_18px_rgba(35,46,70,0.03)]">
                <span className="text-[20px]">⌕</span>

                <input
                  placeholder="Search exams, students..."
                  className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-[#9ca5b1]"
                />
              </div>
            </div>

            <div className="flex items-center gap-[12px]">
              <button className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-[#dfe3ea] bg-white text-[#657285] shadow-[0_5px_18px_rgba(35,46,70,0.03)]">
                ◌
              </button>

              <button className="relative flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-[#dfe3ea] bg-white text-[#657285] shadow-[0_5px_18px_rgba(35,46,70,0.03)]">
                ♟

                <span className="absolute right-[13px] top-[12px] h-[5px] w-[5px] rounded-full bg-[#ef6f7d]" />
              </button>

              <div className="ml-[5px] flex items-center gap-[12px] border-l border-[#e3e6eb] pl-[20px]">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-[#7772b6] text-[12px] font-bold text-white">
                  KG
                </div>

                <div>
                  <strong className="block text-[13px] font-semibold text-[#334154]">
                    Krishna Garg
                  </strong>

                  <span className="mt-[2px] block text-[11px] text-[#8e97a5]">
                    Administrator
                  </span>
                </div>

                <span className="ml-[4px] text-[14px] text-[#87909d]">
                  ⌄
                </span>
              </div>
            </div>
          </header>

          {/* PAGE HEADING */}
          <div className="mb-[28px] flex items-center justify-between">
            <div>
              <p className="mb-[10px] text-[11px] font-bold tracking-[1.4px] text-[#4d8fa2]">
                EXAMINATION OVERVIEW
              </p>

              <h1 className="text-[32px] font-medium text-[#27384d]">
                Welcome back, Krishna! 👋
              </h1>

              <p className="mt-[8px] text-[14px] text-[#7d8795]">
                Monitor examinations, students and AI proctoring activity from
                one place.
              </p>
            </div>

            <button className="flex items-center gap-[10px] rounded-[16px] bg-[#63a8b9] px-[24px] py-[16px] text-[14px] font-semibold text-white shadow-[0_10px_25px_rgba(99,168,185,0.22)] transition hover:-translate-y-[2px] hover:bg-[#528f9f]">
              <span className="text-[19px]">＋</span>
              Create New Exam
            </button>
          </div>

          {/* STATS */}
          <div className="mb-[26px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-h-[170px] rounded-[22px] border border-[#d9dcf0] bg-[#dcdcf0] p-[22px] shadow-[0_8px_25px_rgba(35,46,70,0.04)]">
              <div className="flex items-center justify-between">
                <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-white/60 text-[20px] text-[#5f93a4]">
                  ▣
                </span>

                <span className="rounded-full bg-[#d4eadf] px-[10px] py-[6px] text-[11px] font-bold text-[#5b9b7b]">
                  ↗ 12%
                </span>
              </div>

              <h2 className="mt-[14px] text-[34px] font-medium text-[#27384d]">
                24
              </h2>

              <p className="mt-[1px] text-[13px] text-[#5f6c7c]">
                Total Exams
              </p>

              <span className="mt-[11px] block text-[11px] text-[#788493]">
                4 scheduled today
              </span>
            </div>

            <div className="min-h-[170px] rounded-[22px] border border-[#f2e5b2] bg-[#fff0bd] p-[22px] shadow-[0_8px_25px_rgba(35,46,70,0.04)]">
              <div className="flex items-center justify-between">
                <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-white/60 text-[20px] text-[#5f93a4]">
                  ◉
                </span>

                <span className="rounded-full bg-[#e7edcf] px-[10px] py-[6px] text-[11px] font-bold text-[#6b9a6f]">
                  ↗ 8%
                </span>
              </div>

              <h2 className="mt-[14px] text-[34px] font-medium text-[#27384d]">
                1,248
              </h2>

              <p className="mt-[1px] text-[13px] text-[#5f6c7c]">
                Registered Students
              </p>

              <span className="mt-[11px] block text-[11px] text-[#788493]">
                +96 this month
              </span>
            </div>

            <div className="min-h-[170px] rounded-[22px] border border-[#c9e0e6] bg-[#d6edf2] p-[22px] shadow-[0_8px_25px_rgba(35,46,70,0.04)]">
              <div className="flex items-center justify-between">
                <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-white/60 text-[20px] text-[#5f93a4]">
                  ◉
                </span>

                <span className="rounded-full bg-[#c8e4e4] px-[10px] py-[6px] text-[11px] font-bold text-[#438494]">
                  ● Live
                </span>
              </div>

              <h2 className="mt-[14px] text-[34px] font-medium text-[#27384d]">
                58
              </h2>

              <p className="mt-[1px] text-[13px] text-[#5f6c7c]">
                Students Monitored
              </p>

              <span className="mt-[11px] block text-[11px] text-[#788493]">
                AI proctoring active
              </span>
            </div>

            <div className="min-h-[170px] rounded-[22px] border border-[#e3e4e8] bg-white p-[22px] shadow-[0_8px_25px_rgba(35,46,70,0.04)]">
              <div className="flex items-center justify-between">
                <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-[#fff8e9] text-[19px] text-[#e2a526]">
                  ⚠
                </span>

                <span className="rounded-full bg-[#fff0f2] px-[10px] py-[6px] text-[11px] font-bold text-[#e36d78]">
                  ↗ 3%
                </span>
              </div>

              <h2 className="mt-[14px] text-[34px] font-medium text-[#27384d]">
                17
              </h2>

              <p className="mt-[1px] text-[13px] text-[#5f6c7c]">
                Suspicious Activities
              </p>

              <span className="mt-[11px] block text-[11px] text-[#788493]">
                Requires review
              </span>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="mb-[22px] grid grid-cols-1 gap-[22px] xl:grid-cols-[1.35fr_1fr]">
            {/* EXAMINATION ACTIVITY */}
            <div className="rounded-[22px] border border-[#e7e9ef] bg-white p-[24px] shadow-[0_8px_25px_rgba(35,46,70,0.035)]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#314154]">
                    Examination Activity
                  </h3>

                  <p className="mt-[5px] text-[11px] text-[#8b95a3]">
                    Weekly examination overview
                  </p>
                </div>

                <select className="rounded-[12px] border border-[#e0e4e9] bg-white px-[14px] py-[10px] text-[12px] text-[#657284] outline-none">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div className="mt-[26px] flex h-[245px]">
                <div className="flex w-[38px] flex-col justify-between pb-[25px] text-[10px] text-[#9aa3b0]">
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>
                </div>

                <div className="relative flex-1 border-b border-l border-[#edf0f3]">
                  <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-[#edf0f3]" />
                  <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-[#edf0f3]" />

                  <div className="relative z-10 flex h-full items-end justify-around px-[25px] pb-[25px]">
                    <Bar color="bg-[#7d79b9]" height="45%" day="Mon" />
                    <Bar color="bg-[#5aa6b8]" height="65%" day="Tue" />
                    <Bar color="bg-[#f3c650]" height="85%" day="Wed" />
                    <Bar color="bg-[#7d79b9]" height="55%" day="Thu" />
                    <Bar color="bg-[#5aa6b8]" height="75%" day="Fri" />
                  </div>
                </div>
              </div>

              <div className="mt-[16px] flex gap-[22px] text-[11px] text-[#667386]">
                <span className="flex items-center gap-[6px]">
                  <i className="h-[7px] w-[7px] rounded-full bg-[#7d79b9]" />
                  Exams Conducted
                </span>

                <span className="flex items-center gap-[6px]">
                  <i className="h-[7px] w-[7px] rounded-full bg-[#5aa6b8]" />
                  Students Attended
                </span>
              </div>
            </div>

            {/* LIVE PROCTORING */}
            <div className="rounded-[22px] border border-[#e7e9ef] bg-white p-[24px] shadow-[0_8px_25px_rgba(35,46,70,0.035)]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#314154]">
                    Live AI Proctoring
                  </h3>

                  <p className="mt-[5px] text-[11px] text-[#8b95a3]">
                    Real-time monitoring status
                  </p>
                </div>

                <button className="rounded-[12px] border border-[#e0e4e9] bg-white px-[14px] py-[9px] text-[11px] font-semibold text-[#4f8ea0]">
                  View All
                </button>
              </div>

              <div className="mt-[32px] flex items-center gap-[24px]">
                <div className="relative flex h-[120px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e6f6f7]">
                  <div className="absolute h-[56px] w-[56px] rounded-full border border-[#9fd0da]" />
                  <div className="absolute h-[92px] w-[92px] rounded-full border border-[#9fd0da]" />
                  <div className="absolute left-1/2 top-1/2 h-[2px] w-[60px] origin-left rotate-[-30deg] bg-[#f1c348]" />
                  <div className="relative z-10 h-[26px] w-[26px] rounded-full bg-[#5aa6b8] shadow-[0_0_0_10px_rgba(90,166,184,0.12)]" />
                </div>

                <div>
                  <span className="flex items-center gap-[7px] text-[11px] font-semibold text-[#5b9b7b]">
                    <i className="h-[6px] w-[6px] rounded-full bg-[#58a878]" />
                    AI Monitoring Active
                  </span>

                  <h2 className="mt-[14px] text-[26px] font-medium text-[#2f4054]">
                    58 Students
                  </h2>

                  <p className="mt-[5px] text-[11px] text-[#7e8998]">
                    Currently taking exams
                  </p>
                </div>
              </div>

              <div className="mt-[32px] grid grid-cols-3 gap-[10px]">
                <InfoBox title="Face Detection" value="98.6%" />
                <InfoBox title="Focus Score" value="94.2%" />
                <InfoBox title="Risk Alerts" value="17" warning />
              </div>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div className="grid grid-cols-1 gap-[22px] xl:grid-cols-[1.35fr_1fr]">
            {/* RECENT EXAMS */}
            <div className="rounded-[22px] border border-[#e7e9ef] bg-white p-[24px] shadow-[0_8px_25px_rgba(35,46,70,0.035)]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#314154]">
                    Recent Examinations
                  </h3>

                  <p className="mt-[5px] text-[11px] text-[#8b95a3]">
                    Latest examination activity
                  </p>
                </div>

                <button className="text-[11px] font-bold text-[#4f8ea0]">
                  View All
                </button>
              </div>

              <div className="mt-[15px]">
                {exams.map((exam) => (
                  <div
                    key={exam.code}
                    className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-[12px] border-b border-[#f0f0f4] py-[14px] last:border-none"
                  >
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] bg-[#e8f5f7] text-[#5d9fad]">
                      ▣
                    </div>

                    <div className="flex flex-col">
                      <strong className="text-[11px] text-[#314154]">
                        {exam.title}
                      </strong>

                      <span className="mt-[4px] text-[9px] text-[#929aa7]">
                        {exam.code} • {exam.date}
                      </span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-[#687486]">
                        {exam.time}
                      </span>

                      <small className="mt-[3px] text-[8px] text-[#9ca4af]">
                        {exam.students} Students
                      </small>
                    </div>

                    <span
                      className={`rounded-full px-[10px] py-[6px] text-[9px] font-bold ${
                        exam.status === "Upcoming"
                          ? "bg-[#eaf4ff] text-[#5798c8]"
                          : exam.status === "Live"
                            ? "bg-[#e6f8ef] text-[#50b37f]"
                            : "bg-[#f0f0f4] text-[#868a98]"
                      }`}
                    >
                      {exam.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI SECURITY ALERTS */}
            <div className="rounded-[22px] border border-[#e7e9ef] bg-white p-[24px] shadow-[0_8px_25px_rgba(35,46,70,0.035)]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#314154]">
                    AI Security Alerts
                  </h3>

                  <p className="mt-[5px] text-[11px] text-[#8b95a3]">
                    Recent suspicious activities
                  </p>
                </div>

                <span className="rounded-full bg-[#fff0f2] px-[10px] py-[6px] text-[9px] font-bold text-[#e36d78]">
                  3 New
                </span>
              </div>

              <div className="mt-[20px] space-y-[16px]">
                <AlertItem
                  color="red"
                  title="Multiple Face Detected"
                  description="Rahul Sharma • DSA Examination"
                  time="2 minutes ago"
                />

                <AlertItem
                  color="yellow"
                  title="Student Looking Away"
                  description="Priya Singh • DBMS Examination"
                  time="8 minutes ago"
                />

                <AlertItem
                  color="purple"
                  title="Mobile Device Detected"
                  description="Aman Verma • Computer Networks"
                  time="15 minutes ago"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Bar({
  color,
  height,
  day,
}: {
  color: string;
  height: string;
  day: string;
}) {
  return (
    <div className="relative flex h-full w-[38px] flex-col items-center justify-end">
      <div
        className={`w-[28px] rounded-t-[8px] transition hover:scale-y-105 hover:opacity-80 ${color}`}
        style={{ height }}
      />

      <span className="absolute -bottom-[20px] text-[10px] text-[#9ca0ad]">
        {day}
      </span>
    </div>
  );
}

function InfoBox({
  title,
  value,
  warning = false,
}: {
  title: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-[14px] bg-[#f6f7fa] px-[14px] py-[14px]">
      <span className="block text-[9px] text-[#8e98a6]">{title}</span>

      <strong
        className={`mt-[7px] block text-[14px] ${
          warning ? "text-[#d29335]" : "text-[#314154]"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

function AlertItem({
  color,
  title,
  description,
  time,
}: {
  color: "red" | "yellow" | "purple";
  title: string;
  description: string;
  time: string;
}) {
  const colorClasses = {
    red: "bg-[#fff0f2] text-[#e36d78]",
    yellow: "bg-[#fff6dc] text-[#d7a22b]",
    purple: "bg-[#f0effa] text-[#8582c8]",
  };

  return (
    <div className="flex gap-[11px]">
      <div
        className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[9px] text-[14px] font-bold ${colorClasses[color]}`}
      >
        !
      </div>

      <div>
        <strong className="block text-[11px] text-[#314154]">
          {title}
        </strong>

        <p className="mt-[3px] text-[9px] text-[#929aa7]">
          {description}
        </p>

        <span className="mt-[3px] block text-[8px] text-[#b4b7c1]">
          {time}
        </span>
      </div>
    </div>
  );
}