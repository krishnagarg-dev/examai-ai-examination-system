"use client";

import { useState } from "react";

type ExamStatus = "Active" | "Scheduled" | "Completed" | "Draft";

const exams = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    code: "MCA-301",
    date: "28 Aug 2026",
    time: "10:00 AM",
    duration: "2 Hours",
    students: 64,
    status: "Scheduled" as ExamStatus,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    id: 2,
    title: "Database Management System",
    code: "MCA-302",
    date: "26 Aug 2026",
    time: "02:00 PM",
    duration: "2 Hours",
    students: 58,
    status: "Active" as ExamStatus,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 3,
    title: "Computer Networks",
    code: "MCA-303",
    date: "30 Aug 2026",
    time: "11:00 AM",
    duration: "1 Hour 30 Min",
    students: 72,
    status: "Scheduled" as ExamStatus,
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    id: 4,
    title: "Operating Systems",
    code: "MCA-304",
    date: "22 Aug 2026",
    time: "09:30 AM",
    duration: "2 Hours",
    students: 61,
    status: "Completed" as ExamStatus,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: 5,
    title: "Software Engineering",
    code: "MCA-305",
    date: "02 Sep 2026",
    time: "12:00 PM",
    duration: "2 Hours",
    students: 55,
    status: "Draft" as ExamStatus,
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
];

const statusStyles: Record<ExamStatus, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Scheduled: "bg-cyan-50 text-cyan-600",
  Completed: "bg-violet-50 text-violet-600",
  Draft: "bg-slate-100 text-slate-500",
};

export default function ExamsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Exams");

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.code.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Exams" || exam.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-7 pb-10 pt-7 lg:px-9">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#568090]">
            Examination Management
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#24354a] md:text-4xl">
            Exams
          </h1>

          <p className="mt-2 text-sm text-[#718096]">
            Create, manage and monitor all examinations from one place.
          </p>
        </div>

        <button className="rounded-2xl bg-[#58a4b7] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(88,164,183,0.25)] transition hover:bg-[#478fa2]">
          <span className="mr-2 text-lg">+</span>
          Create New Exam
        </button>
      </div>

      {/* Stats */}
      <section className="mb-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-[#d7d5ec] bg-[#dfe0f2] p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-lg text-[#5f71a7]">
              ▣
            </div>

            <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-[#5f71a7]">
              Total
            </span>
          </div>

          <h2 className="text-3xl font-bold text-[#24354a]">24</h2>
          <p className="mt-1 text-sm text-[#607084]">Total Exams</p>
          <p className="mt-4 text-xs text-[#7a8798]">Across all semesters</p>
        </div>

        <div className="rounded-[24px] border border-[#f1dfaa] bg-[#fff3cb] p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-lg text-[#d89a27]">
              ◉
            </div>

            <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-[#c58b20]">
              Upcoming
            </span>
          </div>

          <h2 className="text-3xl font-bold text-[#24354a]">12</h2>
          <p className="mt-1 text-sm text-[#607084]">Scheduled Exams</p>
          <p className="mt-4 text-xs text-[#7a8798]">Next 30 days</p>
        </div>

        <div className="rounded-[24px] border border-[#bcdde3] bg-[#d8eef2] p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-lg text-[#4b8fa0]">
              ◉
            </div>

            <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-[#4b8fa0]">
              ● Live
            </span>
          </div>

          <h2 className="text-3xl font-bold text-[#24354a]">3</h2>
          <p className="mt-1 text-sm text-[#607084]">Active Exams</p>
          <p className="mt-4 text-xs text-[#7a8798]">Currently running</p>
        </div>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f4f7] text-lg text-[#8a6dba]">
              ✓
            </div>

            <span className="rounded-full bg-[#f3f0fa] px-3 py-1 text-xs font-semibold text-[#8a6dba]">
              Finished
            </span>
          </div>

          <h2 className="text-3xl font-bold text-[#24354a]">9</h2>
          <p className="mt-1 text-sm text-[#607084]">Completed Exams</p>
          <p className="mt-4 text-xs text-[#7a8798]">Results available</p>
        </div>
      </section>

      {/* Exam Management */}
      <section className="rounded-[28px] border border-[#e2e7ee] bg-white p-5 shadow-[0_8px_30px_rgba(50,70,90,0.04)] md:p-7">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#24354a]">
              All Examinations
            </h2>
            <p className="mt-1 text-sm text-[#8491a1]">
              Manage your examination schedule and activities.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex min-w-[230px] items-center rounded-xl border border-[#dfe5ec] bg-[#fafbfc] px-4 py-3">
              <span className="mr-2 text-[#8c99a8]">⌕</span>

              <input
                type="text"
                placeholder="Search examinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-[#24354a] outline-none placeholder:text-[#9ba6b4]"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-[#dfe5ec] bg-white px-4 py-3 text-sm text-[#59697a] outline-none"
            >
              <option>All Exams</option>
              <option>Active</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f8fafc] text-left">
                <th className="rounded-l-xl px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#7b8998]">
                  Examination
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#7b8998]">
                  Schedule
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#7b8998]">
                  Duration
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#7b8998]">
                  Students
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#7b8998]">
                  Status
                </th>

                <th className="rounded-r-xl px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#7b8998]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="border-b border-[#edf0f4] transition hover:bg-[#fafcff]"
                >
                  <td className="border-b border-[#edf0f4] px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${exam.color}`}
                      >
                        ▣
                      </div>

                      <div>
                        <p className="font-semibold text-[#2d3d50]">
                          {exam.title}
                        </p>

                        <p className="mt-1 text-xs text-[#8a96a5]">
                          {exam.code}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="border-b border-[#edf0f4] px-5 py-5">
                    <p className="text-sm font-medium text-[#536273]">
                      {exam.date}
                    </p>

                    <p className="mt-1 text-xs text-[#8a96a5]">
                      {exam.time}
                    </p>
                  </td>

                  <td className="border-b border-[#edf0f4] px-5 py-5 text-sm text-[#5f6e7d]">
                    {exam.duration}
                  </td>

                  <td className="border-b border-[#edf0f4] px-5 py-5">
                    <span className="font-semibold text-[#39495b]">
                      {exam.students}
                    </span>

                    <span className="text-sm text-[#8a96a5]"> students</span>
                  </td>

                  <td className="border-b border-[#edf0f4] px-5 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[exam.status]}`}
                    >
                      {exam.status}
                    </span>
                  </td>

                  <td className="border-b border-[#edf0f4] px-5 py-5 text-right">
                    <button className="rounded-lg px-3 py-2 text-sm font-medium text-[#4b8fa0] transition hover:bg-[#eef8fa]">
                      View
                    </button>

                    <button className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-[#7a8796] transition hover:bg-[#f2f4f7]">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards */}
        <div className="space-y-4 lg:hidden">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-2xl border border-[#e6ebf0] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${exam.color}`}
                  >
                    ▣
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#2d3d50]">
                      {exam.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#8a96a5]">
                      {exam.code}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[exam.status]}`}
                >
                  {exam.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#edf0f4] pt-4 text-sm">
                <div>
                  <p className="text-xs text-[#9aa4b1]">Schedule</p>
                  <p className="mt-1 font-medium text-[#4e5e70]">
                    {exam.date}
                  </p>
                  <p className="text-xs text-[#8a96a5]">{exam.time}</p>
                </div>

                <div>
                  <p className="text-xs text-[#9aa4b1]">Students</p>
                  <p className="mt-1 font-semibold text-[#4e5e70]">
                    {exam.students}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-[#4c5c6c]">
              No examinations found
            </p>

            <p className="mt-2 text-sm text-[#8b97a5]">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}