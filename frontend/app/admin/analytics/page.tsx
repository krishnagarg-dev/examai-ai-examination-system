"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  Download,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("This Semester");

  const subjects = [
    { name: "Data Structures & Algorithms", average: 82, students: 64 },
    { name: "Database Management System", average: 78, students: 58 },
    { name: "Computer Networks", average: 74, students: 72 },
    { name: "Operating Systems", average: 71, students: 61 },
    { name: "Software Engineering", average: 76, students: 55 },
  ];

  const gradeDistribution = [
    { grade: "A+", percentage: 22, count: 248 },
    { grade: "A", percentage: 28, count: 315 },
    { grade: "B+", percentage: 24, count: 270 },
    { grade: "B", percentage: 16, count: 180 },
    { grade: "C", percentage: 7, count: 79 },
    { grade: "F", percentage: 3, count: 34 },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-7 text-[#27364a]">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#547083]">
            Performance Insights
          </p>

          <h1 className="text-[34px] font-bold leading-tight text-[#26364a]">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-[#6c7b8d]">
            Analyze examination performance and student outcomes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              setPeriod(
                period === "This Semester" ? "Last Semester" : "This Semester"
              )
            }
            className="flex items-center gap-5 rounded-xl border border-[#d5dbe5] bg-white px-4 py-3.5 text-sm text-[#647488] shadow-sm"
          >
            {period}
            <ChevronDown size={17} />
          </button>

          <button className="flex items-center gap-2 rounded-2xl bg-[#5a9bb0] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(90,155,176,0.25)] transition hover:bg-[#4b8da3]">
            <Download size={17} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-[#cbd2e3] bg-[#d9d9eb] p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-[#6687aa]">
              <Users size={20} />
            </div>

            <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-[#617083]">
              +8.4%
            </span>
          </div>

          <h2 className="text-3xl font-bold">1,248</h2>
          <p className="mt-1 text-sm text-[#58697d]">Students Analyzed</p>
          <p className="mt-4 text-xs text-[#6b7b8d]">
            Across all examinations
          </p>
        </div>

        <div className="rounded-[22px] border border-[#ecd58f] bg-[#fff1c7] p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-[#c38b2d]">
              <TrendingUp size={20} />
            </div>

            <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-[#907743]">
              +4.2%
            </span>
          </div>

          <h2 className="text-3xl font-bold">78.6%</h2>
          <p className="mt-1 text-sm text-[#6f6650]">Average Score</p>
          <p className="mt-4 text-xs text-[#8a7c60]">
            Improved from last semester
          </p>
        </div>

        <div className="rounded-[22px] border border-[#b8d9df] bg-[#d5e8ec] p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-[#53869a]">
              <Award size={20} />
            </div>

            <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-[#4d7f78]">
              Strong
            </span>
          </div>

          <h2 className="text-3xl font-bold">82.3%</h2>
          <p className="mt-1 text-sm text-[#566f78]">Pass Percentage</p>
          <p className="mt-4 text-xs text-[#6a838b]">
            Overall examination result
          </p>
        </div>

        <div className="rounded-[22px] border border-[#d7dbe5] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1f3fb] text-[#7773a7]">
              <TrendingDown size={20} />
            </div>

            <span className="rounded-full bg-[#fff2f2] px-3 py-1 text-xs font-semibold text-[#c46b6b]">
              3.1%
            </span>
          </div>

          <h2 className="text-3xl font-bold">39</h2>
          <p className="mt-1 text-sm text-[#58697d]">At Risk Students</p>
          <p className="mt-4 text-xs text-[#778595]">
            Requires academic attention
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Performance Trend */}
        <div className="rounded-[24px] border border-[#d7dce6] bg-white p-6 shadow-[0_8px_25px_rgba(40,55,75,0.05)]">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#2d3b4f]">
                Performance Overview
              </h2>
              <p className="mt-1 text-sm text-[#718092]">
                Average student performance by month.
              </p>
            </div>

            <button className="rounded-xl border border-[#dce1e9] px-4 py-2 text-sm text-[#657487]">
              Semester
            </button>
          </div>

          <div className="flex h-[310px] items-end gap-7 border-b border-l border-[#e4e7ee] px-6 pb-8 pt-5">
            {[
              { month: "Jan", value: 65, color: "bg-[#7373a8]" },
              { month: "Feb", value: 72, color: "bg-[#5a99aa]" },
              { month: "Mar", value: 68, color: "bg-[#7373a8]" },
              { month: "Apr", value: 78, color: "bg-[#5a99aa]" },
              { month: "May", value: 84, color: "bg-[#f3bf4e]" },
              { month: "Jun", value: 79, color: "bg-[#5a99aa]" },
            ].map((item) => (
              <div
                key={item.month}
                className="flex flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="text-xs font-semibold text-[#607083]">
                  {item.value}%
                </div>

                <div
                  className={`w-full max-w-[52px] rounded-t-xl ${item.color}`}
                  style={{ height: `${item.value * 2.25}px` }}
                />

                <span className="text-xs text-[#778595]">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-6 text-xs text-[#718092]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7373a8]" />
              Semester Average
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#5a99aa]" />
              Improved Performance
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f3bf4e]" />
              Highest Score
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="rounded-[24px] border border-[#d7dce6] bg-white p-6 shadow-[0_8px_25px_rgba(40,55,75,0.05)]">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-[#2d3b4f]">
              Grade Distribution
            </h2>

            <p className="mt-1 text-sm text-[#718092]">
              Student grades across all exams.
            </p>
          </div>

          <div className="space-y-5">
            {gradeDistribution.map((item) => (
              <div key={item.grade}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-bold text-[#354458]">
                      {item.grade}
                    </span>

                    <span className="text-xs text-[#7a8796]">
                      {item.count} students
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-[#4f6073]">
                    {item.percentage}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[#edf0f4]">
                  <div
                    className="h-full rounded-full bg-[#5a99aa]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
        {/* Subject Performance */}
        <div className="rounded-[24px] border border-[#d7dce6] bg-white p-6 shadow-[0_8px_25px_rgba(40,55,75,0.05)]">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#2d3b4f]">
                Subject Performance
              </h2>

              <p className="mt-1 text-sm text-[#718092]">
                Average performance by examination.
              </p>
            </div>

            <BookOpen size={21} className="text-[#6d91a0]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-[#e6e9ee]">
                  <th className="pb-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#718092]">
                    Subject
                  </th>

                  <th className="pb-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#718092]">
                    Students
                  </th>

                  <th className="pb-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#718092]">
                    Average Score
                  </th>

                  <th className="pb-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#718092]">
                    Performance
                  </th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((subject) => (
                  <tr
                    key={subject.name}
                    className="border-b border-[#edf0f4] last:border-0"
                  >
                    <td className="py-4 text-sm font-semibold text-[#354458]">
                      {subject.name}
                    </td>

                    <td className="py-4 text-sm text-[#718092]">
                      {subject.students}
                    </td>

                    <td className="py-4">
                      <span className="font-bold text-[#354458]">
                        {subject.average}%
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <div className="ml-auto h-2.5 w-28 overflow-hidden rounded-full bg-[#edf0f4]">
                        <div
                          className="h-full rounded-full bg-[#5a99aa]"
                          style={{ width: `${subject.average}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="rounded-[24px] border border-[#d7dce6] bg-white p-6 shadow-[0_8px_25px_rgba(40,55,75,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef5f7] text-[#5a99aa]">
              <BarChart3 size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#2d3b4f]">
                Key Insights
              </h2>

              <p className="text-sm text-[#718092]">
                AI-generated performance summary
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#dce9df] bg-[#f3faf5] p-4">
              <p className="text-sm font-semibold text-[#456b57]">
                Strong Overall Performance
              </p>

              <p className="mt-2 text-xs leading-5 text-[#647a6c]">
                Student performance improved by 4.2% compared with the previous
                semester.
              </p>
            </div>

            <div className="rounded-2xl border border-[#f1e4be] bg-[#fff9e9] p-4">
              <p className="text-sm font-semibold text-[#8b6b30]">
                Operating Systems Needs Attention
              </p>

              <p className="mt-2 text-xs leading-5 text-[#897b59]">
                This subject has the lowest average score and may require
                additional academic support.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e1e4ef] bg-[#f6f7fb] p-4">
              <p className="text-sm font-semibold text-[#596589]">
                High Performing Students
              </p>

              <p className="mt-2 text-xs leading-5 text-[#748095]">
                50% of evaluated students achieved A or A+ grades this
                semester.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}