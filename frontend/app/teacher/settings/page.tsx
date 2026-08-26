"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Eye,
  Globe,
  Lock,
  Monitor,
  Save,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "▣", label: "My Exams", href: "/teacher/exams" },
  { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
  { icon: "◉", label: "Students", href: "/teacher/students" },
  { icon: "?", label: "Questions", href: "/teacher/questions" },
  { icon: "▥", label: "Results", href: "/teacher/results" },
];

export default function TeacherSettingsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    exam: true,
    student: true,
    result: false,
    security: true,
  });

  const [settings, setSettings] = useState({
    language: "English",
    timezone: "Asia/Kolkata",
    theme: "Light",
  });

  const handleLogout = () => {
    localStorage.removeItem("examai-auth");
    router.push("/login");
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#263446]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-[#e8eaf0] bg-white px-[17px] py-[30px]">
          <div className="flex items-center gap-[14px] border-b border-[#eef0f4] pb-[30px]">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-[#63a8b9] text-[22px] text-white">
              ✦
            </div>

            <div>
              <h2 className="text-[20px] font-bold">ExamAI</h2>

              <span className="mt-[2px] block text-[10px] text-[#8b94a3]">
                Teacher Portal
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
                    ? "bg-[#63a8b9] text-white"
                    : "text-[#687384] hover:bg-[#f4f6f9]"
                }`}
              >
                <span className="text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="mb-[14px] px-[12px] text-[11px] font-bold tracking-[1.3px] text-[#8c95a4]">
              OTHER
            </div>

            <Link
              href="/teacher/profile"
              className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] hover:bg-[#f6f8fb]"
            >
              <User size={17} />
              Profile
            </Link>

            <Link
              href="/teacher/settings"
              className="mt-[8px] flex w-full items-center gap-[17px] rounded-[14px] bg-[#63a8b9] px-[18px] py-[15px] text-[14px] font-medium text-white"
            >
              <Settings size={17} />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="mt-[8px] flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-left text-[14px] font-medium text-[#d66b75] hover:bg-[#fff4f5]"
            >
              <span>↪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-[38px]">
          <div className="flex flex-col justify-between gap-[20px] md:flex-row md:items-center">
            <div>
              <p className="text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
                ACCOUNT SETTINGS
              </p>

              <h1 className="mt-[7px] text-[30px] font-bold">
                Settings
              </h1>

              <p className="mt-[8px] text-[14px] text-[#7d8796]">
                Manage your preferences, notifications and account settings.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-[8px] rounded-[12px] bg-[#63a8b9] px-[18px] py-[12px] text-[13px] font-semibold text-white hover:opacity-90"
            >
              <Save size={17} />
              Save Changes
            </button>
          </div>

          <div className="mt-[30px] grid grid-cols-1 gap-[25px] xl:grid-cols-[280px_1fr]">

            {/* SETTINGS MENU */}
            <div className="h-fit rounded-[22px] border border-[#e8eaf0] bg-white p-[16px]">
              <div className="rounded-[14px] bg-[#eef8fa] px-[16px] py-[14px] text-[13px] font-semibold text-[#63a8b9]">
                <div className="flex items-center gap-[11px]">
                  <Bell size={17} />
                  Notifications
                </div>
              </div>

              <div className="mt-[8px] rounded-[14px] px-[16px] py-[14px] text-[13px] font-medium text-[#667386]">
                <div className="flex items-center gap-[11px]">
                  <Globe size={17} />
                  Preferences
                </div>
              </div>

              <div className="mt-[8px] rounded-[14px] px-[16px] py-[14px] text-[13px] font-medium text-[#667386]">
                <div className="flex items-center gap-[11px]">
                  <Lock size={17} />
                  Security
                </div>
              </div>

              <div className="mt-[8px] rounded-[14px] px-[16px] py-[14px] text-[13px] font-medium text-[#667386]">
                <div className="flex items-center gap-[11px]">
                  <Monitor size={17} />
                  Appearance
                </div>
              </div>
            </div>

            <div className="space-y-[25px]">

              {/* NOTIFICATIONS */}
              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
                <div className="flex items-start gap-[14px]">
                  <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                    <Bell size={20} />
                  </div>

                  <div>
                    <h2 className="text-[18px] font-bold">
                      Notification Preferences
                    </h2>

                    <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                      Control which notifications you receive.
                    </p>
                  </div>
                </div>

                <div className="mt-[25px] divide-y divide-[#eef0f4]">
                  {[
                    {
                      key: "exam",
                      title: "Exam Notifications",
                      description: "Receive updates about your examinations.",
                    },
                    {
                      key: "student",
                      title: "Student Activity",
                      description: "Get notified about student submissions.",
                    },
                    {
                      key: "result",
                      title: "Result Updates",
                      description: "Receive alerts when results are generated.",
                    },
                    {
                      key: "security",
                      title: "Security Alerts",
                      description: "Receive important security notifications.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-[20px] py-[18px]"
                    >
                      <div>
                        <h3 className="text-[13px] font-semibold">
                          {item.title}
                        </h3>

                        <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                          {item.description}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]:
                              !prev[
                                item.key as keyof typeof notifications
                              ],
                          }))
                        }
                        className={`relative h-[26px] w-[48px] rounded-full transition ${
                          notifications[
                            item.key as keyof typeof notifications
                          ]
                            ? "bg-[#63a8b9]"
                            : "bg-[#dfe3e8]"
                        }`}
                      >
                        <span
                          className={`absolute top-[4px] h-[18px] w-[18px] rounded-full bg-white transition ${
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                              ? "left-[26px]"
                              : "left-[4px]"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PREFERENCES */}
              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
                <div className="flex items-start gap-[14px]">
                  <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#f5f2ff] text-[#8a75c9]">
                    <Globe size={20} />
                  </div>

                  <div>
                    <h2 className="text-[18px] font-bold">
                      General Preferences
                    </h2>

                    <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                      Customize your ExamAI experience.
                    </p>
                  </div>
                </div>

                <div className="mt-[25px] grid grid-cols-1 gap-[18px] md:grid-cols-2">
                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Language
                    </label>

                    <div className="relative">
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            language: e.target.value,
                          })
                        }
                        className="w-full appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[12px] text-[13px] outline-none"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-[12px] top-[13px] text-[#8b94a3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Timezone
                    </label>

                    <div className="relative">
                      <select
                        value={settings.timezone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            timezone: e.target.value,
                          })
                        }
                        className="w-full appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[12px] text-[13px] outline-none"
                      >
                        <option>Asia/Kolkata</option>
                        <option>UTC</option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-[12px] top-[13px] text-[#8b94a3]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECURITY */}
              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
                <div className="flex items-start gap-[14px]">
                  <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#eaf8ef] text-[#4e9b6b]">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <h2 className="text-[18px] font-bold">
                      Security
                    </h2>

                    <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                      Keep your ExamAI account secure.
                    </p>
                  </div>
                </div>

                <div className="mt-[25px] flex flex-col justify-between gap-[18px] rounded-[16px] border border-[#eef0f4] p-[20px] md:flex-row md:items-center">
                  <div>
                    <h3 className="text-[13px] font-semibold">
                      Change Password
                    </h3>

                    <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                      Update your password to keep your account secure.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      alert("Change password functionality will be added with backend authentication.")
                    }
                    className="flex items-center justify-center gap-[7px] rounded-[11px] border border-[#e1e5eb] px-[15px] py-[10px] text-[12px] font-semibold text-[#667386] hover:bg-[#f7f8fc]"
                  >
                    <Lock size={15} />
                    Change Password
                  </button>
                </div>

                <div className="mt-[14px] flex flex-col justify-between gap-[18px] rounded-[16px] border border-[#eef0f4] p-[20px] md:flex-row md:items-center">
                  <div>
                    <h3 className="text-[13px] font-semibold">
                      Two-Factor Authentication
                    </h3>

                    <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                      Add an extra layer of security to your account.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      alert("Two-factor authentication setup will be added later.")
                    }
                    className="flex items-center justify-center gap-[7px] rounded-[11px] border border-[#e1e5eb] px-[15px] py-[10px] text-[12px] font-semibold text-[#667386] hover:bg-[#f7f8fc]"
                  >
                    <ShieldCheck size={15} />
                    Enable
                  </button>
                </div>
              </div>

              {/* APPEARANCE */}
              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
                <div className="flex items-start gap-[14px]">
                  <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#fff6e8] text-[#d58a2a]">
                    <Eye size={20} />
                  </div>

                  <div>
                    <h2 className="text-[18px] font-bold">
                      Appearance
                    </h2>

                    <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                      Customize how ExamAI looks for you.
                    </p>
                  </div>
                </div>

                <div className="mt-[25px]">
                  <label className="mb-[10px] block text-[12px] font-semibold">
                    Theme
                  </label>

                  <div className="flex gap-[10px]">
                    {["Light", "Dark", "System"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() =>
                          setSettings({
                            ...settings,
                            theme,
                          })
                        }
                        className={`rounded-[11px] px-[18px] py-[10px] text-[12px] font-semibold ${
                          settings.theme === theme
                            ? "bg-[#63a8b9] text-white"
                            : "border border-[#e1e5eb] text-[#667386]"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}