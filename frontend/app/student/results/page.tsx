"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/student/dashboard" },
  { icon: "▣", label: "My Exams", href: "/student/exams" },
  { icon: "▥", label: "Results", href: "/student/results" },
];

const results = [
  {
    subject: "Data Structures & Algorithms",
    code: "MCA-301",
    marks: 86,
    totalMarks: 100,
    percentage: "86%",
    grade: "A",
    status: "Passed",
    date: "24 Aug 2026",
  },
  {
    subject: "Computer Networks",
    code: "MCA-304",
    marks: 78,
    totalMarks: 100,
    percentage: "78%",
    grade: "B+",
    status: "Passed",
    date: "20 Aug 2026",
  },
  {
    subject: "Software Engineering",
    code: "MCA-305",
    marks: 91,
    totalMarks: 100,
    percentage: "91%",
    grade: "A+",
    status: "Passed",
    date: "16 Aug 2026",
  },
  {
    subject: "Artificial Intelligence",
    code: "MCA-306",
    marks: 82,
    totalMarks: 100,
    percentage: "82%",
    grade: "A",
    status: "Passed",
    date: "12 Aug 2026",
  },
];

export default function StudentResults() {
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

          {/* BRAND */}
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

          {/* MAIN MENU */}
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

          {/* OTHER */}
          <div className="mt-auto">
            <div className="mb-[14px] px-[12px] text-[11px] font-bold tracking-[1.3px] text-[#8c95a4]">
              OTHER
            </div>

            <div className="space-y-[8px]">
              <Link
                href="/student/profile"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] transition hover:bg-[#f6f8fb]"
              >
                <span className="w-[14px] text-center">◌</span>
                Profile
              </Link>

              <Link
                href="/student/settings"
                className="flex items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] transition hover:bg-[#f6f8fb]"
              >
                <span className="w-[14px] text-center">⚙</span>
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#d66b75] transition hover:bg-[#fff4f5]"
              >
                <span className="w-[14px] text-center">↪</span>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-[38px]">

          {/* HEADER */}
          <div className="mb-[34px]">
            <p className="mb-[7px] text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
              STUDENT PERFORMANCE
            </p>

            <h1 className="text-[30px] font-bold">
              My Results
            </h1>

            <p className="mt-[8px] text-[14px] text-[#7d8796]">
              Review your examination performance and academic progress.
            </p>
          </div>

          {/* PERFORMANCE OVERVIEW */}
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] text-[#8b94a3]">
                Total Exams
              </p>

              <h2 className="mt-[10px] text-[30px] font-bold">
                8
              </h2>

              <p className="mt-[7px] text-[12px] text-[#63a8b9]">
                Completed this semester
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] text-[#8b94a3]">
                Average Score
              </p>

              <h2 className="mt-[10px] text-[30px] font-bold">
                82%
              </h2>

              <p className="mt-[7px] text-[12px] text-[#63a8b9]">
                Overall performance
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] text-[#8b94a3]">
                Highest Score
              </p>

              <h2 className="mt-[10px] text-[30px] font-bold">
                91%
              </h2>

              <p className="mt-[7px] text-[12px] text-[#63a8b9]">
                Software Engineering
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <p className="text-[12px] text-[#8b94a3]">
                Pass Rate
              </p>

              <h2 className="mt-[10px] text-[30px] font-bold">
                100%
              </h2>

              <p className="mt-[7px] text-[12px] text-[#63a8b9]">
                Excellent record
              </p>
            </div>
          </div>

          {/* OVERALL PERFORMANCE */}
          <div className="mt-[28px] rounded-[22px] bg-[#263446] p-[30px] text-white">
            <div className="flex flex-col justify-between gap-[24px] md:flex-row md:items-center">

              <div>
                <p className="text-[11px] font-semibold tracking-[1.2px] text-[#aab5c4]">
                  OVERALL PERFORMANCE
                </p>

                <h2 className="mt-[10px] text-[27px] font-bold">
                  Great progress, Krishna! 🎉
                </h2>

                <p className="mt-[8px] max-w-[650px] text-[14px] text-[#c8d0db]">
                  Your average performance is strong. Continue maintaining
                  consistency across upcoming examinations.
                </p>
              </div>

              <div className="rounded-[18px] bg-white/10 px-[28px] py-[20px] text-center">
                <p className="text-[11px] text-[#c8d0db]">
                  CURRENT AVERAGE
                </p>

                <p className="mt-[6px] text-[34px] font-bold">
                  82%
                </p>
              </div>
            </div>
          </div>

          {/* RESULTS TABLE */}
          <div className="mt-[28px] rounded-[22px] border border-[#e8eaf0] bg-white p-[26px]">

            <div className="mb-[24px]">
              <h2 className="text-[19px] font-bold">
                Examination Results
              </h2>

              <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                Your latest examination results and grades
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">

                <thead>
                  <tr className="border-b border-[#eef0f4] text-left">
                    <th className="pb-[14px] text-[11px] font-semibold tracking-[0.8px] text-[#8b94a3]">
                      SUBJECT
                    </th>

                    <th className="pb-[14px] text-[11px] font-semibold tracking-[0.8px] text-[#8b94a3]">
                      EXAM DATE
                    </th>

                    <th className="pb-[14px] text-[11px] font-semibold tracking-[0.8px] text-[#8b94a3]">
                      MARKS
                    </th>

                    <th className="pb-[14px] text-[11px] font-semibold tracking-[0.8px] text-[#8b94a3]">
                      SCORE
                    </th>

                    <th className="pb-[14px] text-[11px] font-semibold tracking-[0.8px] text-[#8b94a3]">
                      GRADE
                    </th>

                    <th className="pb-[14px] text-[11px] font-semibold tracking-[0.8px] text-[#8b94a3]">
                      STATUS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.code}
                      className="border-b border-[#f0f2f5] last:border-0"
                    >
                      <td className="py-[18px]">
                        <p className="text-[14px] font-semibold text-[#263446]">
                          {result.subject}
                        </p>

                        <p className="mt-[4px] text-[11px] text-[#8b94a3]">
                          {result.code}
                        </p>
                      </td>

                      <td className="py-[18px] text-[13px] text-[#667386]">
                        {result.date}
                      </td>

                      <td className="py-[18px] text-[13px] font-medium text-[#263446]">
                        {result.marks} / {result.totalMarks}
                      </td>

                      <td className="py-[18px]">
                        <span className="font-semibold text-[#63a8b9]">
                          {result.percentage}
                        </span>
                      </td>

                      <td className="py-[18px]">
                        <span className="rounded-[8px] bg-[#eef8fa] px-[10px] py-[5px] text-[11px] font-bold text-[#63a8b9]">
                          {result.grade}
                        </span>
                      </td>

                      <td className="py-[18px]">
                        <span className="rounded-full bg-[#edf8f2] px-[11px] py-[6px] text-[10px] font-semibold text-[#4e9b6b]">
                          {result.status}
                        </span>
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