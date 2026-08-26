"use client";

import {
  ChevronDown,
  Download,
  Edit3,
  Eye,
  Filter,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type Student = {
  id: number;
  initials: string;
  name: string;
  rollNo: string;
  email: string;
  course: string;
  semester: string;
  status: "Active" | "Inactive";
  exams: number;
  avatarClass: string;
};

const students: Student[] = [
  {
    id: 1,
    initials: "RK",
    name: "Rahul Kumar",
    rollNo: "MCA-2025-001",
    email: "rahul.kumar@kiet.edu",
    course: "Master of Computer Applications",
    semester: "Semester I",
    status: "Active",
    exams: 8,
    avatarClass: "bg-[#e8e7f6] text-[#67659d]",
  },
  {
    id: 2,
    initials: "PS",
    name: "Priya Sharma",
    rollNo: "MCA-2025-002",
    email: "priya.sharma@kiet.edu",
    course: "Master of Computer Applications",
    semester: "Semester I",
    status: "Active",
    exams: 7,
    avatarClass: "bg-[#fff2d4] text-[#bd8b28]",
  },
  {
    id: 3,
    initials: "AS",
    name: "Aman Singh",
    rollNo: "MCA-2025-003",
    email: "aman.singh@kiet.edu",
    course: "Master of Computer Applications",
    semester: "Semester I",
    status: "Active",
    exams: 8,
    avatarClass: "bg-[#dff0f3] text-[#4e91a0]",
  },
  {
    id: 4,
    initials: "NV",
    name: "Neha Verma",
    rollNo: "MCA-2025-004",
    email: "neha.verma@kiet.edu",
    course: "Master of Computer Applications",
    semester: "Semester I",
    status: "Active",
    exams: 6,
    avatarClass: "bg-[#f1e5f7] text-[#9561ad]",
  },
  {
    id: 5,
    initials: "RA",
    name: "Rohit Arora",
    rollNo: "MCA-2025-005",
    email: "rohit.arora@kiet.edu",
    course: "Master of Computer Applications",
    semester: "Semester II",
    status: "Inactive",
    exams: 4,
    avatarClass: "bg-[#e8eef7] text-[#5d7ea5]",
  },
  {
    id: 6,
    initials: "SK",
    name: "Sneha Kapoor",
    rollNo: "MCA-2025-006",
    email: "sneha.kapoor@kiet.edu",
    course: "Master of Computer Applications",
    semester: "Semester II",
    status: "Active",
    exams: 9,
    avatarClass: "bg-[#e3f1e9] text-[#4d9271]",
  },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All Semesters");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const matchesSemester =
        semester === "All Semesters" || student.semester === semester;

      return matchesSearch && matchesSemester;
    });
  }, [search, semester]);

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-6 pb-10 pt-6 text-[#2f3e50] lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* PAGE HEADER */}
        <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#5b7b88]">
              Student Management
            </p>

            <h1 className="font-serif text-4xl font-bold text-[#314055]">
              Students
            </h1>

            <p className="mt-2 text-sm text-[#6e7d90]">
              Manage students, enrollment details and examination access.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5797a8] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(83,148,166,0.24)] transition hover:bg-[#4b8999]">
            <Plus size={18} />
            Add New Student
          </button>
        </section>

        {/* STATS */}
        <section className="mb-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Users size={21} />}
            value="1,248"
            label="Total Students"
            subtext="Across all semesters"
            badge="Total"
            cardClass="bg-[#c9c9df]"
            iconClass="text-[#5797a8]"
            badgeClass="bg-white/45 text-[#66708d]"
          />

          <StatCard
            icon={<GraduationCap size={21} />}
            value="1,126"
            label="Active Students"
            subtext="Eligible for examinations"
            badge="90.2%"
            cardClass="bg-[#fff1c8]"
            iconClass="text-[#d49a29]"
            badgeClass="bg-white/50 text-[#a87a27]"
          />

          <StatCard
            icon={<Mail size={21} />}
            value="58"
            label="New Registrations"
            subtext="Added this month"
            badge="+12%"
            cardClass="bg-[#c8e0e6]"
            iconClass="text-[#4e94a4]"
            badgeClass="bg-white/50 text-[#4d8b74]"
          />

          <StatCard
            icon={<Users size={21} />}
            value="64"
            label="Assigned Students"
            subtext="For current examination"
            badge="Live"
            cardClass="bg-[#f2f3f7]"
            iconClass="text-[#6c6aa0]"
            badgeClass="bg-[#e9f1ee] text-[#568b72]"
          />
        </section>

        {/* STUDENT LIST */}
        <section className="overflow-hidden rounded-[24px] border border-[#d9dfea] bg-white shadow-[0_12px_32px_rgba(68,83,110,0.06)]">
          <div className="flex flex-col gap-5 border-b border-[#e6eaf0] px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#314055]">
                All Students
              </h2>
              <p className="mt-1 text-sm text-[#718093]">
                View and manage registered students.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#d8dfea] bg-[#fbfcfe] px-4 sm:w-[260px]">
                <Search size={18} className="text-[#7c8b9d]" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search students..."
                  className="w-full bg-transparent text-sm text-[#334155] outline-none placeholder:text-[#9aa5b4]"
                />
              </div>

              <div className="relative">
                <select
                  value={semester}
                  onChange={(event) => setSemester(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-[#d8dfea] bg-[#fbfcfe] px-4 pr-10 text-sm text-[#536274] outline-none sm:w-[180px]"
                >
                  <option>All Semesters</option>
                  <option>Semester I</option>
                  <option>Semester II</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#728094]"
                />
              </div>

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d8dfea] px-4 text-sm font-medium text-[#607084] transition hover:bg-[#f5f7fa]">
                <Filter size={17} />
                Filter
              </button>

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d8dfea] px-4 text-sm font-medium text-[#607084] transition hover:bg-[#f5f7fa]">
                <Download size={17} />
                Export
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead>
                <tr className="bg-[#f7f9fc] text-left">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718093]">
                    Student
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718093]">
                    Roll Number
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718093]">
                    Course
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718093]">
                    Semester
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718093]">
                    Exams
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718093]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#718093]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-[#e9edf3] transition hover:bg-[#fbfcfe]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${student.avatarClass}`}
                        >
                          {student.initials}
                        </div>

                        <div>
                          <p className="font-semibold text-[#344255]">
                            {student.name}
                          </p>
                          <p className="mt-1 text-xs text-[#8491a2]">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#526174]">
                      {student.rollNo}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#617084]">
                      {student.course}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#617084]">
                      {student.semester}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#405066]">
                        {student.exams}
                      </span>
                      <span className="ml-1 text-sm text-[#8491a2]">
                        exams
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          student.status === "Active"
                            ? "bg-[#e6f2eb] text-[#4f8b6e]"
                            : "bg-[#f1f2f5] text-[#758093]"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="View Student"
                          className="rounded-lg p-2 text-[#6b7a8c] transition hover:bg-[#edf5f7] hover:text-[#4e94a4]"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Edit Student"
                          className="rounded-lg p-2 text-[#6b7a8c] transition hover:bg-[#edf5f7] hover:text-[#4e94a4]"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          title="Delete Student"
                          className="rounded-lg p-2 text-[#6b7a8c] transition hover:bg-[#fff0f0] hover:text-[#cf6d6d]"
                        >
                          <Trash2 size={17} />
                        </button>

                        <button className="rounded-lg p-2 text-[#6b7a8c] transition hover:bg-[#f3f5f8]">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-4 border-t border-[#e6eaf0] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#7b8899]">
              Showing{" "}
              <span className="font-semibold text-[#46566a]">
                {filteredStudents.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#46566a]">
                {students.length}
              </span>{" "}
              students
            </p>

            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-[#dbe1ea] px-4 py-2 text-sm text-[#6b7a8c] transition hover:bg-[#f6f8fb]">
                Previous
              </button>

              <button className="rounded-lg bg-[#5797a8] px-4 py-2 text-sm font-semibold text-white">
                1
              </button>

              <button className="rounded-lg border border-[#dbe1ea] px-4 py-2 text-sm text-[#6b7a8c] transition hover:bg-[#f6f8fb]">
                Next
              </button>
            </div>
          </div>
        </section>

        {/* QUICK INFO */}
        <section className="mt-7 grid gap-5 lg:grid-cols-3">
          <InfoCard
            title="Student Access"
            value={`${activeStudents} Active`}
            description="Students currently eligible to take examinations."
          />

          <InfoCard
            title="Current Semester"
            value="Semester I"
            description="Primary active semester for the current examination cycle."
          />

          <InfoCard
            title="Total Registered"
            value="1,248 Students"
            description="Student records available in the examination system."
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
  subtext,
  badge,
  cardClass,
  iconClass,
  badgeClass,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  subtext: string;
  badge: string;
  cardClass: string;
  iconClass: string;
  badgeClass: string;
}) {
  return (
    <div
      className={`min-h-[176px] rounded-[24px] border border-white/50 p-5 shadow-[0_10px_25px_rgba(70,85,110,0.06)] ${cardClass}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 ${iconClass}`}
        >
          {icon}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {badge}
        </span>
      </div>

      <h3 className="mt-5 text-3xl font-bold text-[#314055]">{value}</h3>
      <p className="mt-1 text-sm font-medium text-[#506075]">{label}</p>
      <p className="mt-4 text-xs text-[#738195]">{subtext}</p>
    </div>
  );
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#dde3ec] bg-white p-6 shadow-[0_8px_22px_rgba(69,83,107,0.05)]">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8290a2]">
        {title}
      </p>

      <h3 className="mt-3 text-xl font-bold text-[#344255]">{value}</h3>

      <p className="mt-2 text-sm leading-6 text-[#748195]">{description}</p>
    </div>
  );
}