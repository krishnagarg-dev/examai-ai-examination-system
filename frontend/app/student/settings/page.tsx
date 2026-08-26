"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  LockKeyhole,
  Monitor,
  ShieldCheck,
  UserRound,
  Volume2,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/student/dashboard" },
  { icon: "▣", label: "My Exams", href: "/student/exams" },
  { icon: "▥", label: "Results", href: "/student/results" },
];

export default function StudentSettings() {
  const pathname = usePathname();
  const router = useRouter();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [examReminders, setExamReminders] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("examai-auth");
    router.push("/login");
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
              <h2 className="text-[20px] font-bold">ExamAI</h2>
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
                <UserRound size={17} />
                Profile
              </Link>

              <Link
                href="/student/settings"
                className={`flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium transition ${
                  pathname === "/student/settings"
                    ? "bg-[#63a8b9] text-white shadow-[0_8px_20px_rgba(99,168,185,0.18)]"
                    : "text-[#667386] hover:bg-[#f6f8fb]"
                }`}
              >
                <span>⚙</span>
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#d66b75] transition hover:bg-[#fff4f5]"
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
              ACCOUNT SETTINGS
            </p>

            <h1 className="text-[30px] font-bold">
              Settings
            </h1>

            <p className="mt-[8px] text-[14px] text-[#7d8796]">
              Manage your notifications, security and examination preferences.
            </p>
          </div>

          <div className="mx-auto max-w-[1000px] space-y-[28px]">

            {/* NOTIFICATIONS */}
            <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
              <div className="mb-[26px] flex items-center gap-[12px]">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                  <Bell size={20} />
                </div>

                <div>
                  <h2 className="text-[18px] font-bold">
                    Notifications
                  </h2>

                  <p className="mt-[3px] text-[12px] text-[#8b94a3]">
                    Control how you receive examination updates.
                  </p>
                </div>
              </div>

              <div className="space-y-[22px]">

                <div className="flex items-center justify-between gap-[20px]">
                  <div>
                    <h3 className="text-[14px] font-semibold">
                      Email Notifications
                    </h3>

                    <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                      Receive important account and examination updates.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setEmailNotifications(!emailNotifications)
                    }
                    className={`relative h-[28px] w-[52px] rounded-full transition ${
                      emailNotifications
                        ? "bg-[#63a8b9]"
                        : "bg-[#d9dee5]"
                    }`}
                  >
                    <span
                      className={`absolute top-[4px] h-[20px] w-[20px] rounded-full bg-white transition ${
                        emailNotifications
                          ? "left-[28px]"
                          : "left-[4px]"
                      }`}
                    />
                  </button>
                </div>

                <div className="h-[1px] bg-[#eef0f4]" />

                <div className="flex items-center justify-between gap-[20px]">
                  <div>
                    <h3 className="text-[14px] font-semibold">
                      Exam Reminders
                    </h3>

                    <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                      Get notified before your upcoming examinations.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setExamReminders(!examReminders)
                    }
                    className={`relative h-[28px] w-[52px] rounded-full transition ${
                      examReminders
                        ? "bg-[#63a8b9]"
                        : "bg-[#d9dee5]"
                    }`}
                  >
                    <span
                      className={`absolute top-[4px] h-[20px] w-[20px] rounded-full bg-white transition ${
                        examReminders
                          ? "left-[28px]"
                          : "left-[4px]"
                      }`}
                    />
                  </button>
                </div>

                <div className="h-[1px] bg-[#eef0f4]" />

                <div className="flex items-center justify-between gap-[20px]">
                  <div>
                    <h3 className="text-[14px] font-semibold">
                      Sound Alerts
                    </h3>

                    <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                      Play sound alerts during important examination events.
                    </p>
                  </div>

                  <button
                    onClick={() => setSoundAlerts(!soundAlerts)}
                    className={`relative h-[28px] w-[52px] rounded-full transition ${
                      soundAlerts
                        ? "bg-[#63a8b9]"
                        : "bg-[#d9dee5]"
                    }`}
                  >
                    <span
                      className={`absolute top-[4px] h-[20px] w-[20px] rounded-full bg-white transition ${
                        soundAlerts
                          ? "left-[28px]"
                          : "left-[4px]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* EXAM PREFERENCES */}
            <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
              <div className="mb-[26px] flex items-center gap-[12px]">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                  <Monitor size={20} />
                </div>

                <div>
                  <h2 className="text-[18px] font-bold">
                    Examination Preferences
                  </h2>

                  <p className="mt-[3px] text-[12px] text-[#8b94a3]">
                    Manage your examination environment preferences.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
                <div className="rounded-[16px] bg-[#f7f8fc] p-[18px]">
                  <Volume2 size={19} className="text-[#63a8b9]" />

                  <h3 className="mt-[12px] text-[14px] font-semibold">
                    Audio Alerts
                  </h3>

                  <p className="mt-[6px] text-[12px] leading-[1.6] text-[#8b94a3]">
                    Important system alerts and examination warnings.
                  </p>
                </div>

                <div className="rounded-[16px] bg-[#f7f8fc] p-[18px]">
                  <Monitor size={19} className="text-[#63a8b9]" />

                  <h3 className="mt-[12px] text-[14px] font-semibold">
                    Device Compatibility
                  </h3>

                  <p className="mt-[6px] text-[12px] leading-[1.6] text-[#8b94a3]">
                    Your device will be checked before starting an exam.
                  </p>
                </div>
              </div>
            </div>

            {/* SECURITY */}
            <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
              <div className="mb-[26px] flex items-center gap-[12px]">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <h2 className="text-[18px] font-bold">
                    Security
                  </h2>

                  <p className="mt-[3px] text-[12px] text-[#8b94a3]">
                    Manage your ExamAI account security.
                  </p>
                </div>
              </div>

              <div className="rounded-[17px] border border-[#eef0f4] p-[20px]">
                <div className="flex flex-col justify-between gap-[18px] md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-[9px]">
                      <ShieldCheck
                        size={19}
                        className="text-[#4e9b6b]"
                      />

                      <h3 className="text-[14px] font-semibold">
                        Password Protection
                      </h3>
                    </div>

                    <p className="mt-[8px] text-[12px] text-[#8b94a3]">
                      Change your password regularly to keep your account secure.
                    </p>
                  </div>

                  <button className="rounded-[12px] border border-[#dfe4eb] px-[18px] py-[10px] text-[12px] font-semibold text-[#667386] transition hover:bg-[#f7f8fc]">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* SAVE */}
            <div className="flex justify-end">
              <button className="rounded-[13px] bg-[#63a8b9] px-[24px] py-[13px] text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(99,168,185,0.18)] transition hover:opacity-90">
                Save Preferences
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}