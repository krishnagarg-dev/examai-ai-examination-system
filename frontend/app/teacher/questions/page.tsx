"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Edit3,
  FileQuestion,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "▣", label: "My Exams", href: "/teacher/exams" },
  { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
  { icon: "◉", label: "Students", href: "/teacher/students" },
  { icon: "?", label: "Questions", href: "/teacher/questions" },
  { icon: "▥", label: "Results", href: "/teacher/results" },
];

const questions = [
  {
    id: 1,
    question: "What is the time complexity of Binary Search?",
    subject: "Data Structures",
    type: "MCQ",
    difficulty: "Easy",
    marks: 2,
  },
  {
    id: 2,
    question: "Explain the difference between stack and queue.",
    subject: "Data Structures",
    type: "Descriptive",
    difficulty: "Medium",
    marks: 5,
  },
  {
    id: 3,
    question: "What is database normalization?",
    subject: "DBMS",
    type: "Descriptive",
    difficulty: "Medium",
    marks: 5,
  },
  {
    id: 4,
    question: "Which SQL command is used to remove a table?",
    subject: "DBMS",
    type: "MCQ",
    difficulty: "Easy",
    marks: 2,
  },
  {
    id: 5,
    question: "Explain TCP and UDP protocols.",
    subject: "Computer Networks",
    type: "Descriptive",
    difficulty: "Hard",
    marks: 10,
  },
];

export default function TeacherQuestionsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(search.toLowerCase());

      const matchesSubject =
        subject === "All" || question.subject === subject;

      const matchesDifficulty =
        difficulty === "All" || question.difficulty === difficulty;

      return matchesSearch && matchesSubject && matchesDifficulty;
    });
  }, [search, subject, difficulty]);

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
                    ? "bg-[#63a8b9] text-white"
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
                QUESTION MANAGEMENT
              </p>

              <h1 className="mt-[7px] text-[30px] font-bold">
                Question Bank
              </h1>

              <p className="mt-[8px] text-[14px] text-[#7d8796]">
                Create, manage and organize questions for your examinations.
              </p>
            </div>

            <button
              onClick={() => alert("Add Question form will open here")}
              className="flex items-center justify-center gap-[8px] rounded-[12px] bg-[#63a8b9] px-[18px] py-[12px] text-[13px] font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={17} />
              Add New Question
            </button>
          </div>

          {/* STATS */}
          <div className="mt-[30px] grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <FileQuestion size={22} className="text-[#63a8b9]" />
              <h2 className="mt-[15px] text-[28px] font-bold">148</h2>
              <p className="text-[13px] text-[#7d8796]">Total Questions</p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <BookOpen size={22} className="text-[#8a75c9]" />
              <h2 className="mt-[15px] text-[28px] font-bold">86</h2>
              <p className="text-[13px] text-[#7d8796]">MCQ Questions</p>
            </div>

            <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[22px]">
              <Edit3 size={22} className="text-[#4e9b6b]" />
              <h2 className="mt-[15px] text-[28px] font-bold">62</h2>
              <p className="text-[13px] text-[#7d8796]">
                Descriptive Questions
              </p>
            </div>
          </div>

          {/* QUESTION LIST */}
          <div className="mt-[28px] rounded-[22px] border border-[#e8eaf0] bg-white p-[27px]">
            <div className="flex flex-col justify-between gap-[18px] xl:flex-row xl:items-center">
              <div>
                <h2 className="text-[19px] font-bold">All Questions</h2>
                <p className="mt-[4px] text-[12px] text-[#8b94a3]">
                  Manage your examination question bank.
                </p>
              </div>

              <div className="flex flex-col gap-[10px] lg:flex-row">
                <div className="flex items-center gap-[9px] rounded-[12px] border border-[#e1e5eb] px-[13px] py-[10px] lg:w-[280px]">
                  <Search size={17} className="text-[#8b94a3]" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full bg-transparent text-[12px] outline-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[10px] pr-[35px] text-[12px] outline-none"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="DBMS">DBMS</option>
                    <option value="Computer Networks">
                      Computer Networks
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-[10px] top-[11px]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="appearance-none rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[10px] pr-[35px] text-[12px] outline-none"
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-[10px] top-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-[25px] space-y-[14px]">
              {filteredQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-[16px] border border-[#edf0f4] p-[20px] transition hover:border-[#d7e3e7]"
                >
                  <div className="flex flex-col gap-[16px] xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex gap-[14px]">
                      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#eef8fa] text-[12px] font-bold text-[#63a8b9]">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="max-w-[720px] text-[14px] font-semibold leading-[1.5]">
                          {question.question}
                        </h3>

                        <div className="mt-[10px] flex flex-wrap gap-[8px]">
                          <span className="rounded-full bg-[#f2f4f7] px-[9px] py-[4px] text-[10px] font-medium text-[#667386]">
                            {question.subject}
                          </span>

                          <span className="rounded-full bg-[#eef8fa] px-[9px] py-[4px] text-[10px] font-medium text-[#63a8b9]">
                            {question.type}
                          </span>

                          <span
                            className={`rounded-full px-[9px] py-[4px] text-[10px] font-medium ${
                              question.difficulty === "Easy"
                                ? "bg-[#eaf8ef] text-[#4e9b6b]"
                                : question.difficulty === "Medium"
                                  ? "bg-[#fff6e8] text-[#d58a2a]"
                                  : "bg-[#fff0f1] text-[#d66b75]"
                            }`}
                          >
                            {question.difficulty}
                          </span>

                          <span className="rounded-full bg-[#f5f2ff] px-[9px] py-[4px] text-[10px] font-medium text-[#8a75c9]">
                            {question.marks} Marks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-[8px]">
                      <button
                        onClick={() => alert(`Edit: ${question.question}`)}
                        className="flex items-center gap-[6px] rounded-[10px] border border-[#e1e5eb] px-[11px] py-[8px] text-[11px] font-medium text-[#667386] hover:bg-[#f7f8fc]"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => alert(`Delete: ${question.question}`)}
                        className="flex h-[35px] w-[35px] items-center justify-center rounded-[10px] border border-[#fde3e5] text-[#d66b75] hover:bg-[#fff4f5]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredQuestions.length === 0 && (
                <div className="py-[45px] text-center text-[13px] text-[#8b94a3]">
                  No questions found.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}