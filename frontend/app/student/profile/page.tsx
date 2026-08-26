"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  CalendarDays,
  UserRound,
  Pencil,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/student/dashboard" },
  { icon: "▣", label: "My Exams", href: "/student/exams" },
  { icon: "▥", label: "Results", href: "/student/results" },
];

export default function StudentProfile() {
  const pathname = usePathname();
  const router = useRouter();

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

          <div className="mt-auto">
            <div className="mb-[14px] px-[12px] text-[11px] font-bold tracking-[1.3px] text-[#8c95a4]">
              OTHER
            </div>

            <div className="space-y-[8px]">
              <Link
                href="/student/profile"
                className={`flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium transition ${
                  pathname === "/student/profile"
                    ? "bg-[#63a8b9] text-white shadow-[0_8px_20px_rgba(99,168,185,0.18)]"
                    : "text-[#667386] hover:bg-[#f6f8fb]"
                }`}
              >
                <UserRound size={17} />
                Profile
              </Link>

              <Link
                href="/student/settings"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] transition hover:bg-[#f6f8fb]"
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
              STUDENT ACCOUNT
            </p>

            <h1 className="text-[30px] font-bold">My Profile</h1>

            <p className="mt-[8px] text-[14px] text-[#7d8796]">
              Manage your personal and academic information.
            </p>
          </div>

          {/* PROFILE HEADER */}
          <div className="rounded-[24px] bg-[#263446] p-[32px] text-white">
            <div className="flex flex-col justify-between gap-[28px] md:flex-row md:items-center">
              <div className="flex items-center gap-[22px]">
                <div className="relative">
                  <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full border-4 border-white/20 bg-[#63a8b9] text-[32px] font-bold">
                    KG
                  </div>

                  <button className="absolute bottom-0 right-0 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-[#63a8b9] shadow-lg">
                    <Camera size={16} />
                  </button>
                </div>

                <div>
                  <h2 className="text-[26px] font-bold">Krishna Garg</h2>

                  <p className="mt-[5px] text-[14px] text-[#c8d0db]">
                    Master of Computer Applications
                  </p>

                  <p className="mt-[5px] text-[12px] text-[#9eabb9]">
                    Student ID: MCA2025-1042
                  </p>
                </div>
              </div>

              <button className="flex items-center justify-center gap-[9px] rounded-[13px] bg-white px-[20px] py-[12px] text-[13px] font-semibold text-[#263446] transition hover:opacity-90">
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="mt-[28px] grid grid-cols-1 gap-[28px] xl:grid-cols-[1.3fr_0.7fr]">
            {/* PERSONAL INFORMATION */}
            <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
              <div className="mb-[26px]">
                <h2 className="text-[19px] font-bold">
                  Personal Information
                </h2>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  Your basic account details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
                <div className="rounded-[15px] bg-[#f7f8fc] p-[18px]">
                  <div className="flex items-center gap-[10px] text-[#63a8b9]">
                    <UserRound size={17} />
                    <span className="text-[11px] font-semibold">
                      FULL NAME
                    </span>
                  </div>

                  <p className="mt-[10px] text-[14px] font-semibold">
                    Krishna Garg
                  </p>
                </div>

                <div className="rounded-[15px] bg-[#f7f8fc] p-[18px]">
                  <div className="flex items-center gap-[10px] text-[#63a8b9]">
                    <Mail size={17} />
                    <span className="text-[11px] font-semibold">
                      EMAIL ADDRESS
                    </span>
                  </div>

                  <p className="mt-[10px] break-all text-[14px] font-semibold">
                    gargkrishna9354@gmail.com
                  </p>
                </div>

                <div className="rounded-[15px] bg-[#f7f8fc] p-[18px]">
                  <div className="flex items-center gap-[10px] text-[#63a8b9]">
                    <Phone size={17} />
                    <span className="text-[11px] font-semibold">
                      PHONE NUMBER
                    </span>
                  </div>

                  <p className="mt-[10px] text-[14px] font-semibold">
                    +91 8826094086
                  </p>
                </div>

                <div className="rounded-[15px] bg-[#f7f8fc] p-[18px]">
                  <div className="flex items-center gap-[10px] text-[#63a8b9]">
                    <MapPin size={17} />
                    <span className="text-[11px] font-semibold">
                      LOCATION
                    </span>
                  </div>

                  <p className="mt-[10px] text-[14px] font-semibold">
                    Ghaziabad, Uttar Pradesh
                  </p>
                </div>
              </div>

              {/* ACADEMIC DETAILS */}
              <div className="mt-[32px] border-t border-[#eef0f4] pt-[28px]">
                <h2 className="text-[19px] font-bold">
                  Academic Information
                </h2>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  Current program and enrollment details
                </p>

                <div className="mt-[20px] space-y-[14px]">
                  <div className="flex items-center justify-between rounded-[15px] border border-[#eef0f4] p-[18px]">
                    <div className="flex items-center gap-[12px]">
                      <GraduationCap size={19} className="text-[#63a8b9]" />

                      <div>
                        <p className="text-[13px] font-semibold">
                          Master of Computer Applications
                        </p>

                        <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                          MCA Program
                        </p>
                      </div>
                    </div>

                    <span className="text-[12px] font-semibold text-[#63a8b9]">
                      2025–2027
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-[15px] border border-[#eef0f4] p-[18px]">
                    <div className="flex items-center gap-[12px]">
                      <CalendarDays size={19} className="text-[#63a8b9]" />

                      <div>
                        <p className="text-[13px] font-semibold">
                          Current Semester
                        </p>

                        <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                          Academic session
                        </p>
                      </div>
                    </div>

                    <span className="text-[12px] font-semibold text-[#63a8b9]">
                      Semester I
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACCOUNT STATUS */}
            <div className="space-y-[28px]">
              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[26px]">
                <div className="mb-[22px]">
                  <h2 className="text-[18px] font-bold">
                    Account Status
                  </h2>

                  <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                    Your ExamAI account status
                  </p>
                </div>

                <div className="rounded-[16px] bg-[#edf8f2] p-[18px]">
                  <div className="flex items-center gap-[10px]">
                    <ShieldCheck size={19} className="text-[#4e9b6b]" />

                    <span className="text-[13px] font-semibold text-[#4e9b6b]">
                      Verified Account
                    </span>
                  </div>

                  <p className="mt-[9px] text-[11px] leading-[1.6] text-[#6d7f73]">
                    Your account is active and verified for secure online
                    examinations.
                  </p>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[26px]">
                <h2 className="text-[18px] font-bold">
                  Examination Summary
                </h2>

                <div className="mt-[22px] space-y-[18px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#7d8796]">
                      Exams Completed
                    </span>

                    <span className="text-[15px] font-bold">
                      8
                    </span>
                  </div>

                  <div className="h-[1px] bg-[#eef0f4]" />

                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#7d8796]">
                      Upcoming Exams
                    </span>

                    <span className="text-[15px] font-bold">
                      2
                    </span>
                  </div>

                  <div className="h-[1px] bg-[#eef0f4]" />

                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#7d8796]">
                      Average Score
                    </span>

                    <span className="text-[15px] font-bold text-[#63a8b9]">
                      82%
                    </span>
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