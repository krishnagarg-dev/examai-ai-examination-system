"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "▣", label: "My Exams", href: "/teacher/exams" },
  { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
  { icon: "◉", label: "Students", href: "/teacher/students" },
  { icon: "▥", label: "Results", href: "/teacher/results" },
];

export default function CreateExamPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [proctoring, setProctoring] = useState(true);
  const [camera, setCamera] = useState(true);
  const [tabSwitch, setTabSwitch] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("Exam created successfully!");
    router.push("/teacher/exams");
  };

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
          <div className="flex flex-col justify-between gap-[20px] xl:flex-row xl:items-center">
            <div className="flex items-start gap-[16px]">
              <Link
                href="/teacher/exams"
                className="mt-[5px] flex h-[40px] w-[40px] items-center justify-center rounded-[12px] border border-[#e1e5eb] bg-white text-[#667386] hover:bg-[#f5f7fa]"
              >
                <ArrowLeft size={18} />
              </Link>

              <div>
                <p className="mb-[7px] text-[12px] font-semibold tracking-[1px] text-[#63a8b9]">
                  EXAMINATION MANAGEMENT
                </p>

                <h1 className="text-[30px] font-bold">
                  Create New Examination
                </h1>

                <p className="mt-[8px] text-[14px] text-[#7d8796]">
                  Configure examination details and AI monitoring settings.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                className="flex items-center gap-[8px] rounded-[12px] border border-[#dfe4eb] bg-white px-[17px] py-[12px] text-[12px] font-semibold text-[#667386] hover:bg-[#f7f8fc]"
              >
                <Save size={16} />
                Save Draft
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-[30px]">

            <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-[1fr_360px]">

              {/* LEFT */}
              <div className="space-y-[24px]">

                {/* BASIC DETAILS */}
                <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[27px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h2 className="text-[18px] font-bold">
                        Basic Examination Details
                      </h2>

                      <p className="mt-[3px] text-[12px] text-[#8b94a3]">
                        Enter the main details for your examination.
                      </p>
                    </div>
                  </div>

                  <div className="mt-[26px] grid grid-cols-1 gap-[18px] md:grid-cols-2">

                    <div className="field">
                      <label>Examination Title</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Data Structures & Algorithms"
                      />
                    </div>

                    <div className="field">
                      <label>Subject Code</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. MCA-301"
                      />
                    </div>

                    <div className="field">
                      <label>Department</label>

                      <div className="select-wrapper">
                        <select required>
                          <option value="">Select Department</option>
                          <option>MCA</option>
                          <option>BCA</option>
                          <option>B.Tech</option>
                        </select>

                        <ChevronDown size={17} />
                      </div>
                    </div>

                    <div className="field">
                      <label>Semester</label>

                      <div className="select-wrapper">
                        <select required>
                          <option value="">Select Semester</option>
                          <option>Semester 1</option>
                          <option>Semester 2</option>
                          <option>Semester 3</option>
                          <option>Semester 4</option>
                        </select>

                        <ChevronDown size={17} />
                      </div>
                    </div>

                    <div className="field">
                      <label>Examination Date</label>
                      <input required type="date" />
                    </div>

                    <div className="field">
                      <label>Start Time</label>
                      <input required type="time" />
                    </div>

                  </div>
                </div>

                {/* EXAM SETTINGS */}
                <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[27px]">

                  <div className="flex items-center gap-[12px]">
                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                      <Settings2 size={20} />
                    </div>

                    <div>
                      <h2 className="text-[18px] font-bold">
                        Examination Settings
                      </h2>

                      <p className="mt-[3px] text-[12px] text-[#8b94a3]">
                        Configure duration, marks and examination behaviour.
                      </p>
                    </div>
                  </div>

                  <div className="mt-[26px] grid grid-cols-1 gap-[18px] md:grid-cols-3">

                    <div className="field">
                      <label>Duration (Minutes)</label>
                      <input required type="number" placeholder="120" />
                    </div>

                    <div className="field">
                      <label>Total Marks</label>
                      <input required type="number" placeholder="100" />
                    </div>

                    <div className="field">
                      <label>Total Questions</label>
                      <input required type="number" placeholder="50" />
                    </div>

                  </div>
                </div>

                {/* INSTRUCTIONS */}
                <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[27px]">

                  <div className="flex items-center gap-[12px]">
                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                      <BookOpen size={20} />
                    </div>

                    <div>
                      <h2 className="text-[18px] font-bold">
                        Examination Instructions
                      </h2>

                      <p className="mt-[3px] text-[12px] text-[#8b94a3]">
                        Instructions visible to students before the examination.
                      </p>
                    </div>
                  </div>

                  <textarea
                    className="mt-[24px] min-h-[150px] w-full resize-none rounded-[14px] border border-[#e1e5eb] p-[15px] text-[13px] outline-none placeholder:text-[#a1a8b3] focus:border-[#63a8b9]"
                    placeholder="Enter examination instructions..."
                  />
                </div>

              </div>

              {/* RIGHT */}
              <div className="space-y-[24px]">

                {/* QUICK INFO */}
                <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[24px]">

                  <h2 className="text-[17px] font-bold">
                    Examination Summary
                  </h2>

                  <div className="mt-[22px] space-y-[18px]">

                    <div className="flex items-center gap-[12px]">
                      <CalendarDays size={18} className="text-[#63a8b9]" />
                      <div>
                        <p className="text-[11px] text-[#8b94a3]">Date</p>
                        <p className="mt-[2px] text-[13px] font-semibold">
                          Select examination date
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-[12px]">
                      <Clock3 size={18} className="text-[#63a8b9]" />
                      <div>
                        <p className="text-[11px] text-[#8b94a3]">Duration</p>
                        <p className="mt-[2px] text-[13px] font-semibold">
                          Configure duration
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-[12px]">
                      <Users size={18} className="text-[#63a8b9]" />
                      <div>
                        <p className="text-[11px] text-[#8b94a3]">Students</p>
                        <p className="mt-[2px] text-[13px] font-semibold">
                          Students can be assigned later
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* AI PROCTORING */}
                <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[24px]">

                  <div className="flex items-center gap-[12px]">
                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#63a8b9]">
                      <ShieldCheck size={20} />
                    </div>

                    <div>
                      <h2 className="text-[17px] font-bold">
                        AI Proctoring
                      </h2>

                      <p className="mt-[3px] text-[11px] text-[#8b94a3]">
                        Configure examination monitoring.
                      </p>
                    </div>
                  </div>

                  <div className="mt-[24px] space-y-[18px]">

                    <div className="toggle-row">
                      <div>
                        <h3>Enable AI Proctoring</h3>
                        <p>Monitor student behaviour during exam.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setProctoring(!proctoring)}
                        className={`toggle ${proctoring ? "active" : ""}`}
                      >
                        <span />
                      </button>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <h3>Camera Monitoring</h3>
                        <p>Detect multiple faces and absence.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCamera(!camera)}
                        className={`toggle ${camera ? "active" : ""}`}
                      >
                        <span />
                      </button>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <h3>Tab Switch Detection</h3>
                        <p>Detect suspicious browser activity.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTabSwitch(!tabSwitch)}
                        className={`toggle ${tabSwitch ? "active" : ""}`}
                      >
                        <span />
                      </button>
                    </div>

                  </div>
                </div>

                {/* CREATE BUTTON */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#63a8b9] py-[14px] text-[13px] font-semibold text-white shadow-[0_10px_25px_rgba(99,168,185,0.22)] transition hover:opacity-90"
                >
                  <Plus size={18} />
                  Create Examination
                </button>

              </div>
            </div>
          </form>
        </section>
      </div>

      <style jsx>{`
        .field label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #596577;
        }

        .field input,
        .field select {
          width: 100%;
          border: 1px solid #e1e5eb;
          border-radius: 12px;
          background: white;
          padding: 12px 13px;
          font-size: 12px;
          color: #263446;
          outline: none;
        }

        .field input:focus,
        .field select:focus {
          border-color: #63a8b9;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          appearance: none;
          padding-right: 40px;
        }

        .select-wrapper svg {
          position: absolute;
          right: 13px;
          top: 13px;
          pointer-events: none;
          color: #8b94a3;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-bottom: 1px solid #eef0f4;
          padding-bottom: 17px;
        }

        .toggle-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .toggle-row h3 {
          font-size: 12px;
          font-weight: 600;
        }

        .toggle-row p {
          margin-top: 4px;
          font-size: 10px;
          color: #8b94a3;
        }

        .toggle {
          display: flex;
          height: 25px;
          width: 45px;
          flex-shrink: 0;
          align-items: center;
          border-radius: 999px;
          background: #dfe4eb;
          padding: 3px;
          transition: 0.2s;
        }

        .toggle span {
          height: 19px;
          width: 19px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
          transition: 0.2s;
        }

        .toggle.active {
          justify-content: flex-end;
          background: #63a8b9;
        }
      `}</style>
    </main>
  );
}