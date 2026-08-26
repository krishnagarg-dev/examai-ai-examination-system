"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Eye,
  GraduationCap,
  Mail,
  Search,
  UserCheck,
  Users,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "▣", label: "My Exams", href: "/teacher/exams" },
  { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
  { icon: "◉", label: "Students", href: "/teacher/students" },
  { icon: "▥", label: "Results", href: "/teacher/results" },
];

const students = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@kiet.edu",
    rollNo: "MCA2025001",
    course: "MCA",
    semester: "Semester 1",
    status: "Active",
    exams: 6,
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya.singh@kiet.edu",
    rollNo: "MCA2025002",
    course: "MCA",
    semester: "Semester 1",
    status: "Active",
    exams: 5,
  },
  {
    id: 3,
    name: "Aman Verma",
    email: "aman.verma@kiet.edu",
    rollNo: "MCA2025003",
    course: "MCA",
    semester: "Semester 1",
    status: "Active",
    exams: 6,
  },
  {
    id: 4,
    name: "Sneha Gupta",
    email: "sneha.gupta@kiet.edu",
    rollNo: "MCA2025004",
    course: "MCA",
    semester: "Semester 1",
    status: "Inactive",
    exams: 3,
  },
  {
    id: 5,
    name: "Rohit Kumar",
    email: "rohit.kumar@kiet.edu",
    rollNo: "MCA2025005",
    course: "MCA",
    semester: "Semester 1",
    status: "Active",
    exams: 6,
  },
  {
    id: 6,
    name: "Anjali Mishra",
    email: "anjali.mishra@kiet.edu",
    rollNo: "MCA2025006",
    course: "MCA",
    semester: "Semester 1",
    status: "Active",
    exams: 4,
  },
];

export default function TeacherStudentsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(search.toLowerCase());

      const matchesSemester =
        semester === "All" || student.semester === semester;

      const matchesStatus =
        status === "All" || student.status === status;

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [search, semester, status]);

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

          {/* HEADER */}
          <div>
            <p className="text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
              STUDENT MANAGEMENT
            </p>

            <h1 className="mt-[7px] text-[30px] font-bold">
              Students
            </h1>

            <p className="mt-[8px] text-[14px] text-[#7d8796]">
              View and manage students assigned to your examinations.
            </p>
          </div>

          {/* STATS */}
          <div className="mt-[30px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-3">

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                <Users size={21} />
              </div>

              <h2 className="mt-[17px] text-[30px] font-bold">1,248</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Total Students
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#eaf8ef] text-[#4e9b6b]">
                <UserCheck size={21} />
              </div>

              <h2 className="mt-[17px] text-[30px] font-bold">1,192</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Active Students
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#f5f2ff] text-[#8a75c9]">
                <GraduationCap size={21} />
              </div>

              <h2 className="mt-[17px] text-[30px] font-bold">1</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Active Class
              </p>
            </div>
          </div>

          {/* STUDENTS */}
          <div className="mt-[28px] rounded-[22px] border border-[#e8eaf0] bg-white p-[27px]">

            <div className="flex flex-col justify-between gap-[20px] xl:flex-row xl:items-center">
              <div>
                <h2 className="text-[19px] font-bold">
                  Student Directory
                </h2>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  Search and filter students by semester or account status.
                </p>
              </div>

              <div className="flex flex-col gap-[10px] lg:flex-row">

                <div className="flex items-center gap-[9px] rounded-[12px] border border-[#e1e5eb] px-[13px] py-[10px] lg:w-[250px]">
                  <Search size={17} className="text-[#8b94a3]" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#a1a8b3]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[10px] pr-[36px] text-[12px] text-[#667386] outline-none"
                  >
                    <option value="All">All Semesters</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-[11px] top-[11px] text-[#8b94a3]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[10px] pr-[36px] text-[12px] text-[#667386] outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-[11px] top-[11px] text-[#8b94a3]"
                  />
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-[26px] overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse">

                <thead>
                  <tr className="border-b border-[#eef0f4]">
                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      STUDENT
                    </th>

                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      ROLL NUMBER
                    </th>

                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      COURSE
                    </th>

                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      EXAMS
                    </th>

                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      STATUS
                    </th>

                    <th className="pb-[14px] text-right text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-[#f0f2f5] last:border-none"
                    >
                      <td className="py-[18px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#eef8fa] text-[13px] font-bold text-[#63a8b9]">
                            {student.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")}
                          </div>

                          <div>
                            <h3 className="text-[13px] font-semibold">
                              {student.name}
                            </h3>

                            <p className="mt-[3px] flex items-center gap-[5px] text-[11px] text-[#8b94a3]">
                              <Mail size={12} />
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-[18px] text-[12px] text-[#667386]">
                        {student.rollNo}
                      </td>

                      <td className="py-[18px]">
                        <p className="text-[12px] font-medium">
                          {student.course}
                        </p>

                        <p className="mt-[3px] text-[10px] text-[#8b94a3]">
                          {student.semester}
                        </p>
                      </td>

                      <td className="py-[18px]">
                        <span className="inline-flex items-center gap-[6px] text-[12px] text-[#667386]">
                          <BookOpen size={14} />
                          {student.exams}
                        </span>
                      </td>

                      <td className="py-[18px]">
                        <span
                          className={`rounded-full px-[10px] py-[5px] text-[10px] font-semibold ${
                            student.status === "Active"
                              ? "bg-[#eaf8ef] text-[#4e9b6b]"
                              : "bg-[#f1f2f5] text-[#748092]"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td className="py-[18px] text-right">
                        <button className="inline-flex items-center gap-[6px] rounded-[10px] border border-[#e1e5eb] px-[12px] py-[8px] text-[11px] font-semibold text-[#667386] hover:bg-[#f7f8fc]">
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="py-[45px] text-center">
                <Users size={30} className="mx-auto text-[#aeb5c0]" />

                <h3 className="mt-[12px] text-[15px] font-semibold">
                  No students found
                </h3>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}