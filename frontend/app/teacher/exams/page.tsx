"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Plus,
  Search,
  Users,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "▣", label: "My Exams", href: "/teacher/exams" },
  { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
  { icon: "◉", label: "Students", href: "/teacher/students" },
  { icon: "▥", label: "Results", href: "/teacher/results" },
];

const exams = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    code: "MCA-301",
    date: "28 Aug 2026",
    time: "10:00 AM",
    duration: "2 Hours",
    students: 64,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Database Management System",
    code: "MCA-302",
    date: "26 Aug 2026",
    time: "02:00 PM",
    duration: "2 Hours",
    students: 58,
    status: "Live",
  },
  {
    id: 3,
    title: "Computer Networks",
    code: "MCA-303",
    date: "24 Aug 2026",
    time: "11:00 AM",
    duration: "2 Hours",
    students: 72,
    status: "Completed",
  },
  {
    id: 4,
    title: "Operating Systems",
    code: "MCA-304",
    date: "02 Sep 2026",
    time: "09:30 AM",
    duration: "2 Hours",
    students: 46,
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Software Engineering",
    code: "MCA-305",
    date: "18 Aug 2026",
    time: "01:00 PM",
    duration: "2 Hours",
    students: 51,
    status: "Completed",
  },
];

export default function TeacherExams() {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        exam.code.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || exam.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus]);

  const handleLogout = () => {
    localStorage.removeItem("examai-auth");
    router.push("/login");
  };

  const getStatusClass = (status: string) => {
    if (status === "Live") {
      return "bg-[#eaf8ef] text-[#4e9b6b]";
    }

    if (status === "Upcoming") {
      return "bg-[#eef8fa] text-[#4f9eb0]";
    }

    return "bg-[#f1f2f5] text-[#748092]";
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
                href="/teacher/profile"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] hover:bg-[#f6f8fb]"
              >
                <span>◌</span>
                Profile
              </Link>

              <Link
                href="/teacher/settings"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] hover:bg-[#f6f8fb]"
              >
                <span>⚙</span>
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#d66b75] hover:bg-[#fff4f5]"
              >
                <span>↪</span>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-[38px]">

          {/* HEADER */}
          <div className="flex flex-col justify-between gap-[20px] lg:flex-row lg:items-center">
            <div>
              <p className="mb-[7px] text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
                EXAMINATION MANAGEMENT
              </p>

              <h1 className="text-[30px] font-bold">
                My Examinations
              </h1>

              <p className="mt-[8px] text-[14px] text-[#7d8796]">
                Manage and monitor all examinations created by you.
              </p>
            </div>

            <Link
              href="/teacher/create-exam"
              className="flex items-center justify-center gap-[8px] rounded-[13px] bg-[#63a8b9] px-[20px] py-[13px] text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(99,168,185,0.18)]"
            >
              <Plus size={17} />
              Create New Exam
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-[30px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[21px]">
              <div className="flex h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                <ClipboardList size={20} />
              </div>

              <h2 className="mt-[17px] text-[29px] font-bold">8</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Total Exams
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[21px]">
              <div className="flex h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                <CalendarDays size={20} />
              </div>

              <h2 className="mt-[17px] text-[29px] font-bold">3</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Upcoming
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[21px]">
              <div className="flex h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-[#eaf8ef] text-[#4e9b6b]">
                <span className="h-[9px] w-[9px] rounded-full bg-[#4e9b6b]" />
              </div>

              <h2 className="mt-[17px] text-[29px] font-bold">1</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Live Exam
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[21px]">
              <div className="flex h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-[#f1f2f5] text-[#748092]">
                <FileText size={20} />
              </div>

              <h2 className="mt-[17px] text-[29px] font-bold">4</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Completed
              </p>
            </div>
          </div>

          {/* EXAMS LIST */}
          <div className="mt-[28px] rounded-[22px] border border-[#e8eaf0] bg-white p-[26px]">

            <div className="flex flex-col justify-between gap-[18px] xl:flex-row xl:items-center">
              <div>
                <h2 className="text-[19px] font-bold">
                  All Examinations
                </h2>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  View and manage your examination records.
                </p>
              </div>

              <div className="flex flex-col gap-[12px] sm:flex-row">
                <div className="flex w-full items-center gap-[10px] rounded-[12px] border border-[#e1e5eb] px-[13px] py-[10px] sm:w-[250px]">
                  <Search size={17} className="text-[#8b94a3]" />

                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#a1a8b3]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[10px] pr-[38px] text-[12px] font-medium text-[#667386] outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-[12px] top-[11px] text-[#8b94a3]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-[25px] space-y-[14px]">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-col gap-[18px] rounded-[18px] border border-[#eef0f4] p-[20px] transition hover:bg-[#fafbfc] 2xl:flex-row 2xl:items-center 2xl:justify-between"
                >
                  <div className="flex items-start gap-[15px]">
                    <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] bg-[#eef8fa] text-[#63a8b9]">
                      <FileText size={21} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-[10px]">
                        <h3 className="text-[15px] font-semibold">
                          {exam.title}
                        </h3>

                        <span
                          className={`rounded-full px-[10px] py-[4px] text-[10px] font-semibold ${getStatusClass(
                            exam.status
                          )}`}
                        >
                          {exam.status}
                        </span>
                      </div>

                      <p className="mt-[6px] text-[12px] text-[#8b94a3]">
                        {exam.code}
                      </p>

                      <div className="mt-[13px] flex flex-wrap gap-x-[18px] gap-y-[8px] text-[11px] text-[#748092]">
                        <span className="flex items-center gap-[5px]">
                          <CalendarDays size={14} />
                          {exam.date}
                        </span>

                        <span className="flex items-center gap-[5px]">
                          <Clock3 size={14} />
                          {exam.time}
                        </span>

                        <span className="flex items-center gap-[5px]">
                          <Clock3 size={14} />
                          {exam.duration}
                        </span>

                        <span className="flex items-center gap-[5px]">
                          <Users size={14} />
                          {exam.students} Students
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-[10px]">
                    <button className="flex items-center gap-[7px] rounded-[11px] border border-[#dfe4eb] px-[14px] py-[10px] text-[11px] font-semibold text-[#667386] hover:bg-[#f7f8fc]">
                      <Eye size={15} />
                      View
                    </button>

                    {exam.status !== "Completed" && (
                      <button className="flex items-center gap-[7px] rounded-[11px] bg-[#eef8fa] px-[14px] py-[10px] text-[11px] font-semibold text-[#63a8b9] hover:opacity-80">
                        <Edit3 size={15} />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredExams.length === 0 && (
                <div className="py-[50px] text-center">
                  <Search size={28} className="mx-auto text-[#aeb5c0]" />

                  <h3 className="mt-[12px] text-[15px] font-semibold">
                    No examinations found
                  </h3>

                  <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}