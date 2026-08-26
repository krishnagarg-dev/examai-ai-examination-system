"use client";

import {
  Award,
  BarChart3,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

const results = [
  {
    title: "Data Structures & Algorithms",
    code: "MCA-301",
    date: "28 Aug 2026",
    students: 64,
    average: "76.4%",
    highest: "98%",
    status: "Published",
    color: "blue",
  },
  {
    title: "Database Management System",
    code: "MCA-302",
    date: "26 Aug 2026",
    students: 58,
    average: "72.8%",
    highest: "96%",
    status: "Published",
    color: "green",
  },
  {
    title: "Computer Networks",
    code: "MCA-303",
    date: "30 Aug 2026",
    students: 72,
    average: "81.2%",
    highest: "99%",
    status: "Processing",
    color: "purple",
  },
  {
    title: "Operating Systems",
    code: "MCA-304",
    date: "22 Aug 2026",
    students: 61,
    average: "68.5%",
    highest: "94%",
    status: "Published",
    color: "yellow",
  },
  {
    title: "Software Engineering",
    code: "MCA-305",
    date: "02 Sep 2026",
    students: 55,
    average: "74.6%",
    highest: "97%",
    status: "Published",
    color: "blue",
  },
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] p-8">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold tracking-[0.22em] text-[#537487]">
            EXAMINATION RESULTS
          </p>

          <h1 className="text-[34px] font-bold text-[#26384d]">
            Results
          </h1>

          <p className="mt-1 text-sm text-[#6f8091]">
            View, analyze and manage examination results.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-2xl bg-[#5d9bad] px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#4d8798]">
          <Download size={17} />
          Export Results
        </button>
      </div>

      {/* Stats */}
      <div className="mb-7 grid grid-cols-4 gap-5">
        {/* Total Results */}
        <div className="rounded-[22px] border border-[#d8ddea] bg-[#c9cbdc] p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-[#547e91]">
              <FileText size={19} />
            </div>

            <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-[#617082]">
              Total
            </span>
          </div>

          <h2 className="text-[28px] font-bold text-[#26384d]">9</h2>
          <p className="mt-1 text-sm font-medium text-[#4d6072]">
            Published Results
          </p>
          <p className="mt-4 text-xs text-[#66778a]">
            Across all examinations
          </p>
        </div>

        {/* Students Evaluated */}
        <div className="rounded-[22px] border border-[#f0d486] bg-[#fff2c9] p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-[#bd8b28]">
              <Users size={19} />
            </div>

            <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[#8c6d30]">
              +8.4%
            </span>
          </div>

          <h2 className="text-[28px] font-bold text-[#26384d]">1,126</h2>
          <p className="mt-1 text-sm font-medium text-[#4d6072]">
            Students Evaluated
          </p>
          <p className="mt-4 text-xs text-[#8b7a54]">
            From published examinations
          </p>
        </div>

        {/* Average Score */}
        <div className="rounded-[22px] border border-[#b7d4db] bg-[#c4dbe0] p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-[#4c8998]">
              <TrendingUp size={19} />
            </div>

            <span className="rounded-full bg-white/40 px-3 py-1 text-xs font-semibold text-[#4c7880]">
              +4.2%
            </span>
          </div>

          <h2 className="text-[28px] font-bold text-[#26384d]">74.8%</h2>
          <p className="mt-1 text-sm font-medium text-[#4d6072]">
            Average Score
          </p>
          <p className="mt-4 text-xs text-[#5e7880]">
            Overall examination performance
          </p>
        </div>

        {/* Top Score */}
        <div className="rounded-[22px] border border-[#dce1ea] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef0f8] text-[#6f6ba8]">
              <Award size={19} />
            </div>

            <span className="rounded-full bg-[#edf6ee] px-3 py-1 text-xs font-semibold text-[#5b8667]">
              Top
            </span>
          </div>

          <h2 className="text-[28px] font-bold text-[#26384d]">99%</h2>
          <p className="mt-1 text-sm font-medium text-[#4d6072]">
            Highest Score
          </p>
          <p className="mt-4 text-xs text-[#718092]">
            Best examination result
          </p>
        </div>
      </div>

      {/* Performance Overview */}
      <section className="mb-6 rounded-[24px] border border-[#d9deea] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2d4055]">
              Performance Overview
            </h2>
            <p className="mt-1 text-sm text-[#758496]">
              Overall examination performance statistics.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#d9deea] px-4 py-2 text-sm text-[#667789]">
            This Semester
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-2xl bg-[#f7f8fc] p-5">
            <p className="text-xs font-medium text-[#7b8998]">
              Average Performance
            </p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-3xl font-bold text-[#2d4055]">74.8%</span>
              <span className="mb-1 text-xs font-semibold text-[#4f9a78]">
                +4.2%
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e6eaf1]">
              <div className="h-full w-[75%] rounded-full bg-[#5d9bad]" />
            </div>
          </div>

          <div className="rounded-2xl bg-[#f7f8fc] p-5">
            <p className="text-xs font-medium text-[#7b8998]">
              Pass Percentage
            </p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-3xl font-bold text-[#2d4055]">89.6%</span>
              <span className="mb-1 text-xs font-semibold text-[#4f9a78]">
                +2.8%
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e6eaf1]">
              <div className="h-full w-[90%] rounded-full bg-[#6ea78a]" />
            </div>
          </div>

          <div className="rounded-2xl bg-[#f7f8fc] p-5">
            <p className="text-xs font-medium text-[#7b8998]">
              Total Examinations
            </p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-3xl font-bold text-[#2d4055]">12</span>
              <span className="mb-1 text-xs font-semibold text-[#5d9bad]">
                +3 this month
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e6eaf1]">
              <div className="h-full w-[68%] rounded-full bg-[#7b76ad]" />
            </div>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="rounded-[24px] border border-[#d9deea] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e6e9ef] p-6">
          <div>
            <h2 className="text-xl font-bold text-[#2d4055]">
              Examination Results
            </h2>
            <p className="mt-1 text-sm text-[#758496]">
              View detailed results for all examinations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#d9deea] px-4 py-3">
              <Search size={17} className="text-[#7b8998]" />
              <input
                type="text"
                placeholder="Search results..."
                className="w-48 border-none bg-transparent text-sm outline-none placeholder:text-[#9aa6b2]"
              />
            </div>

            <button className="flex items-center gap-2 rounded-xl border border-[#d9deea] px-4 py-3 text-sm text-[#637386]">
              All Exams
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1.2fr] gap-4 border-b border-[#e7eaf0] py-4 text-[10px] font-bold tracking-[0.12em] text-[#738193]">
            <span>EXAMINATION</span>
            <span>DATE</span>
            <span>STUDENTS</span>
            <span>AVERAGE</span>
            <span>HIGHEST</span>
            <span>STATUS</span>
            <span className="text-right">ACTION</span>
          </div>

          {results.map((result, index) => (
            <div
              key={result.code}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1.2fr] items-center gap-4 py-4 ${
                index !== results.length - 1
                  ? "border-b border-[#e7eaf0]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    result.color === "green"
                      ? "bg-[#edf6ee] text-[#5c9b76]"
                      : result.color === "purple"
                      ? "bg-[#f0eef9] text-[#8178ba]"
                      : result.color === "yellow"
                      ? "bg-[#fff4dc] text-[#c89b42]"
                      : "bg-[#e9f3f6] text-[#5b93a2]"
                  }`}
                >
                  <BarChart3 size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#33465a]">
                    {result.title}
                  </p>
                  <p className="mt-1 text-xs text-[#8390a0]">
                    {result.code}
                  </p>
                </div>
              </div>

              <span className="text-sm text-[#627386]">{result.date}</span>

              <span className="text-sm font-semibold text-[#425467]">
                {result.students}
              </span>

              <span className="text-sm font-semibold text-[#425467]">
                {result.average}
              </span>

              <span className="text-sm font-semibold text-[#4d9a75]">
                {result.highest}
              </span>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    result.status === "Published"
                      ? "bg-[#edf6ee] text-[#5a916b]"
                      : "bg-[#fff5dd] text-[#b98a2e]"
                  }`}
                >
                  {result.status}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 text-[#738394]">
                <button className="transition hover:text-[#5d9bad]">
                  <Eye size={17} />
                </button>

                <button className="transition hover:text-[#5d9bad]">
                  <Download size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}