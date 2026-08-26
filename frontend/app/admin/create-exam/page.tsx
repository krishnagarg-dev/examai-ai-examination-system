"use client";

import {
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  Save,
  Settings2,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function CreateExamPage() {
  const [examTitle, setExamTitle] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [duration, setDuration] = useState("2 Hours");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [students, setStudents] = useState("");
  const [proctoring, setProctoring] = useState(true);

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-7 pb-10 pt-7 text-[#2d3d50]">
      {/* HEADER */}
      <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#507486]">
            Examination Management
          </p>

          <h1 className="font-serif text-4xl font-bold text-[#2f4053]">
            Create New Exam
          </h1>

          <p className="mt-2 text-sm text-[#728091]">
            Configure examination details, schedule and AI proctoring settings.
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-2xl bg-[#5a9db0] px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(90,157,176,0.25)] transition hover:bg-[#4d8d9f]"
          onClick={() => alert("Exam saved successfully!")}
        >
          <Save size={17} />
          Save Exam
        </button>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_0.8fr]">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* BASIC DETAILS */}
          <section className="rounded-[24px] border border-[#dfe3ec] bg-white/70 p-6 shadow-[0_8px_30px_rgba(57,76,96,0.06)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f4f7] text-[#4d95a8]">
                <FileText size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#2f4053]">
                  Basic Examination Details
                </h2>
                <p className="text-xs text-[#7d8897]">
                  Enter the primary information for your examination.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Examination Title
                </label>

                <input
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a3adba] focus:border-[#6aa5b5] focus:ring-2 focus:ring-[#d9edf2]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Subject / Course
                </label>

                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm text-[#657284] outline-none focus:border-[#6aa5b5]"
                  >
                    <option value="">Select subject</option>
                    <option>Data Structures</option>
                    <option>Database Management System</option>
                    <option>Computer Networks</option>
                    <option>Operating Systems</option>
                    <option>Software Engineering</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8390a0]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Semester
                </label>

                <div className="relative">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm text-[#657284] outline-none focus:border-[#6aa5b5]"
                  >
                    <option value="">Select semester</option>
                    <option>Semester I</option>
                    <option>Semester II</option>
                    <option>Semester III</option>
                    <option>Semester IV</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8390a0]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Exam Code
                </label>

                <input
                  placeholder="e.g. MCA-301"
                  className="w-full rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm outline-none placeholder:text-[#a3adba] focus:border-[#6aa5b5]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Examination Type
                </label>

                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm text-[#657284] outline-none focus:border-[#6aa5b5]">
                    <option>End Semester Examination</option>
                    <option>Mid Semester Examination</option>
                    <option>Internal Assessment</option>
                    <option>Practice Examination</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8390a0]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SCHEDULE */}
          <section className="rounded-[24px] border border-[#dfe3ec] bg-white/70 p-6 shadow-[0_8px_30px_rgba(57,76,96,0.06)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4d9] text-[#d69b25]">
                <CalendarDays size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#2f4053]">
                  Schedule & Duration
                </h2>
                <p className="text-xs text-[#7d8897]">
                  Set when the examination will be conducted.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Examination Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm text-[#657284] outline-none focus:border-[#6aa5b5]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm text-[#657284] outline-none focus:border-[#6aa5b5]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#435366]">
                  Duration
                </label>

                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm text-[#657284] outline-none focus:border-[#6aa5b5]"
                  >
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>1 Hour 30 Minutes</option>
                    <option>2 Hours</option>
                    <option>3 Hours</option>
                  </select>

                  <Clock3
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8390a0]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STUDENTS */}
          <section className="rounded-[24px] border border-[#dfe3ec] bg-white/70 p-6 shadow-[0_8px_30px_rgba(57,76,96,0.06)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef0ff] text-[#7572b7]">
                <Users size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#2f4053]">
                  Student Assignment
                </h2>
                <p className="text-xs text-[#7d8897]">
                  Select students eligible to take this examination.
                </p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-semibold text-[#435366]">
              Students / Class
            </label>

            <input
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              placeholder="e.g. MCA Semester I - Section A"
              className="mb-4 w-full rounded-xl border border-[#dfe3eb] bg-[#fafbfd] px-4 py-3.5 text-sm outline-none placeholder:text-[#a3adba] focus:border-[#6aa5b5]"
            />

            <div className="flex items-center justify-between rounded-xl border border-[#d9e7eb] bg-[#f5fbfc] px-4 py-4">
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="text-[#5798aa]" />

                <div>
                  <p className="text-sm font-semibold text-[#435366]">
                    Total Selected Students
                  </p>
                  <p className="text-xs text-[#8290a0]">
                    Students will receive examination access.
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-[#5798aa]">64</span>
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <aside className="space-y-6">
          {/* AI PROCTORING */}
          <section className="rounded-[24px] border border-[#cce2e8] bg-[#eaf5f7] p-6 shadow-[0_8px_30px_rgba(57,76,96,0.06)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#4d95a8] shadow-sm">
                <Settings2 size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#2f4053]">
                  AI Proctoring
                </h2>
                <p className="text-xs text-[#6d8591]">
                  Smart examination monitoring.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/70 p-4">
                <div>
                  <p className="text-sm font-semibold text-[#435366]">
                    Enable AI Proctoring
                  </p>
                  <p className="mt-1 text-xs text-[#83909e]">
                    Monitor students during examination.
                  </p>
                </div>

                <button
                  onClick={() => setProctoring(!proctoring)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    proctoring ? "bg-[#5a9db0]" : "bg-[#cbd5df]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      proctoring ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-2xl bg-white/70 p-4">
                <p className="mb-3 text-sm font-semibold text-[#435366]">
                  Monitoring Features
                </p>

                <div className="space-y-3 text-xs text-[#718092]">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 accent-[#5a9db0]"
                    />
                    Face Detection
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 accent-[#5a9db0]"
                    />
                    Multiple Face Detection
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 accent-[#5a9db0]"
                    />
                    Browser Activity Monitoring
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 accent-[#5a9db0]"
                    />
                    Suspicious Activity Detection
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* SUMMARY */}
          <section className="rounded-[24px] border border-[#dfe3ec] bg-white/70 p-6 shadow-[0_8px_30px_rgba(57,76,96,0.06)]">
            <h2 className="mb-5 text-lg font-bold text-[#2f4053]">
              Examination Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#edf0f4] pb-3 text-sm">
                <span className="text-[#84909e]">Status</span>
                <span className="rounded-full bg-[#fff4d8] px-3 py-1 text-xs font-semibold text-[#b98525]">
                  Draft
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#edf0f4] pb-3 text-sm">
                <span className="text-[#84909e]">Students</span>
                <span className="font-semibold text-[#435366]">64</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#edf0f4] pb-3 text-sm">
                <span className="text-[#84909e]">Duration</span>
                <span className="font-semibold text-[#435366]">
                  {duration}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#84909e]">AI Monitoring</span>
                <span
                  className={`font-semibold ${
                    proctoring ? "text-[#4e9581]" : "text-[#9aa5b1]"
                  }`}
                >
                  {proctoring ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </section>

          {/* CREATE BUTTON */}
          <button
            onClick={() => alert("Exam created successfully!")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5a9db0] px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(90,157,176,0.25)] transition hover:bg-[#4d8d9f]"
          >
            <FileText size={17} />
            Create Examination
          </button>
        </aside>
      </div>
    </main>
  );
}