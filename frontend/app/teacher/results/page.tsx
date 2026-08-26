"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Award,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Search,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "▣", label: "My Exams", href: "/teacher/exams" },
  { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
  { icon: "◉", label: "Students", href: "/teacher/students" },
  { icon: "?", label: "Questions", href: "/teacher/questions" },
  { icon: "▥", label: "Results", href: "/teacher/results" },
];

const results = [
  {
    id: 1,
    student: "Rahul Sharma",
    rollNo: "MCA2025001",
    exam: "Data Structures & Algorithms",
    totalMarks: 100,
    obtainedMarks: 86,
    percentage: 86,
    status: "Pass",
  },
  {
    id: 2,
    student: "Priya Singh",
    rollNo: "MCA2025002",
    exam: "Data Structures & Algorithms",
    totalMarks: 100,
    obtainedMarks: 91,
    percentage: 91,
    status: "Pass",
  },
  {
    id: 3,
    student: "Aman Verma",
    rollNo: "MCA2025003",
    exam: "Data Structures & Algorithms",
    totalMarks: 100,
    obtainedMarks: 72,
    percentage: 72,
    status: "Pass",
  },
  {
    id: 4,
    student: "Sneha Gupta",
    rollNo: "MCA2025004",
    exam: "Database Management System",
    totalMarks: 100,
    obtainedMarks: 42,
    percentage: 42,
    status: "Fail",
  },
  {
    id: 5,
    student: "Rohit Kumar",
    rollNo: "MCA2025005",
    exam: "Database Management System",
    totalMarks: 100,
    obtainedMarks: 78,
    percentage: 78,
    status: "Pass",
  },
];

export default function TeacherResultsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("All");

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        result.student.toLowerCase().includes(search.toLowerCase()) ||
        result.rollNo.toLowerCase().includes(search.toLowerCase());

      const matchesExam =
        examFilter === "All" || result.exam === examFilter;

      return matchesSearch && matchesExam;
    });
  }, [search, examFilter]);

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
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-left text-[14px] font-medium text-[#d66b75] hover:bg-[#fff4f5]"
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
                EXAMINATION RESULTS
              </p>

              <h1 className="mt-[7px] text-[30px] font-bold">
                Results
              </h1>

              <p className="mt-[8px] text-[14px] text-[#7d8796]">
                Monitor student performance and examination outcomes.
              </p>
            </div>

            <button
              onClick={() => alert("Result report download will be available here")}
              className="flex items-center justify-center gap-[8px] rounded-[12px] bg-[#63a8b9] px-[18px] py-[12px] text-[13px] font-semibold text-white hover:opacity-90"
            >
              <Download size={17} />
              Download Report
            </button>
          </div>

          {/* STATS */}
          <div className="mt-[30px] grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                <FileText size={21} />
              </div>

              <h2 className="mt-[17px] text-[30px] font-bold">1,248</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Total Submissions
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#eaf8ef] text-[#4e9b6b]">
                <Award size={21} />
              </div>

              <h2 className="mt-[17px] text-[30px] font-bold">78.6%</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Average Score
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#f5f2ff] text-[#8a75c9]">
                <TrendingUp size={21} />
              </div>

              <h2 className="mt-[17px] text-[30px] font-bold">92%</h2>
              <p className="mt-[4px] text-[13px] text-[#7d8796]">
                Overall Pass Rate
              </p>
            </div>
          </div>

          {/* RESULTS TABLE */}
          <div className="mt-[28px] rounded-[22px] border border-[#e8eaf0] bg-white p-[27px]">
            <div className="flex flex-col justify-between gap-[18px] xl:flex-row xl:items-center">
              <div>
                <h2 className="text-[19px] font-bold">
                  Student Results
                </h2>

                <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                  View examination performance and detailed scores.
                </p>
              </div>

              <div className="flex flex-col gap-[10px] md:flex-row">
                <div className="flex items-center gap-[9px] rounded-[12px] border border-[#e1e5eb] px-[13px] py-[10px] md:w-[260px]">
                  <Search size={17} className="text-[#8b94a3]" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search student..."
                    className="w-full bg-transparent text-[12px] outline-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={examFilter}
                    onChange={(e) => setExamFilter(e.target.value)}
                    className="appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[10px] pr-[36px] text-[12px] outline-none"
                  >
                    <option value="All">All Exams</option>
                    <option value="Data Structures & Algorithms">
                      Data Structures
                    </option>
                    <option value="Database Management System">
                      DBMS
                    </option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-[10px] top-[11px] text-[#8b94a3]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-[25px] overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse">
                <thead>
                  <tr className="border-b border-[#eef0f4]">
                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      STUDENT
                    </th>

                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      EXAM
                    </th>

                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      SCORE
                    </th>

                    <th className="pb-[14px] text-left text-[11px] font-bold tracking-[0.7px] text-[#8b94a3]">
                      PERCENTAGE
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
                  {filteredResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-[#f0f2f5] last:border-none"
                    >
                      <td className="py-[18px]">
                        <p className="text-[13px] font-semibold">
                          {result.student}
                        </p>

                        <p className="mt-[3px] text-[11px] text-[#8b94a3]">
                          {result.rollNo}
                        </p>
                      </td>

                      <td className="py-[18px] text-[12px] text-[#667386]">
                        {result.exam}
                      </td>

                      <td className="py-[18px] text-[12px] font-semibold">
                        {result.obtainedMarks} / {result.totalMarks}
                      </td>

                      <td className="py-[18px]">
                        <span className="text-[12px] font-semibold">
                          {result.percentage}%
                        </span>
                      </td>

                      <td className="py-[18px]">
                        <span
                          className={`rounded-full px-[10px] py-[5px] text-[10px] font-semibold ${
                            result.status === "Pass"
                              ? "bg-[#eaf8ef] text-[#4e9b6b]"
                              : "bg-[#fff0f1] text-[#d66b75]"
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>

                      <td className="py-[18px] text-right">
                        <button
                          onClick={() =>
                            alert(`Viewing result of ${result.student}`)
                          }
                          className="inline-flex items-center gap-[6px] rounded-[10px] border border-[#e1e5eb] px-[12px] py-[8px] text-[11px] font-semibold text-[#667386] hover:bg-[#f7f8fc]"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}