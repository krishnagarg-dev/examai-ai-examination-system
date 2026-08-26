"use client";

import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Eye,
  Maximize2,
  Mic,
  MoreHorizontal,
  Monitor,
  Search,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

type Student = {
  id: number;
  name: string;
  rollNo: string;
  initials: string;
  status: "Normal" | "Warning" | "Alert";
  activity: string;
  time: string;
};

const students: Student[] = [
  {
    id: 1,
    name: "Rahul Kumar",
    rollNo: "MCA-2025-001",
    initials: "RK",
    status: "Normal",
    activity: "Focused on screen",
    time: "Now",
  },
  {
    id: 2,
    name: "Priya Sharma",
    rollNo: "MCA-2025-002",
    initials: "PS",
    status: "Normal",
    activity: "Answering question",
    time: "Now",
  },
  {
    id: 3,
    name: "Aman Singh",
    rollNo: "MCA-2025-003",
    initials: "AS",
    status: "Warning",
    activity: "Face not detected",
    time: "2 min ago",
  },
  {
    id: 4,
    name: "Neha Verma",
    rollNo: "MCA-2025-004",
    initials: "NV",
    status: "Normal",
    activity: "Focused on screen",
    time: "Now",
  },
];

export default function LiveProctoringPage() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    students[0]
  );
  const [notifications, setNotifications] = useState(true);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-6 py-7 text-[#2d3d50] lg:px-8">
      {/* HEADER */}
      <section className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#547080]">
            AI Examination Monitoring
          </p>

          <h1 className="font-serif text-4xl font-bold tracking-tight text-[#27364a]">
            Live Proctoring
          </h1>

          <p className="mt-2 text-sm text-[#6f7d8d]">
            Monitor ongoing examinations and detect suspicious activities in
            real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#cfe3d8] bg-[#edf8f1] px-4 py-3 text-sm font-semibold text-[#4b8d6d]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#5aaf7f]" />
            Live Monitoring Active
          </div>

          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative flex h-12 w-12 items-center justify-center rounded-xl border transition ${
              notifications
                ? "border-[#cfe1e6] bg-[#e9f4f6] text-[#4f94a5]"
                : "border-[#dbe1e8] bg-white text-[#7c8796]"
            }`}
          >
            <Bell size={19} />

            {notifications && (
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#d98a54]" />
            )}
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="mb-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={21} />}
          value="64"
          label="Students Online"
          detail="Out of 68 assigned"
          iconBg="bg-[#e8e7f6]"
          iconColor="text-[#6d6aa5]"
        />

        <StatCard
          icon={<CheckCircle2 size={21} />}
          value="58"
          label="Normal Activity"
          detail="No suspicious activity"
          iconBg="bg-[#e4f2ea]"
          iconColor="text-[#4f8c6d]"
        />

        <StatCard
          icon={<AlertTriangle size={21} />}
          value="4"
          label="Warnings"
          detail="Requires attention"
          iconBg="bg-[#fff1d6]"
          iconColor="text-[#c9912d]"
        />

        <StatCard
          icon={<CircleAlert size={21} />}
          value="2"
          label="Critical Alerts"
          detail="Immediate review needed"
          iconBg="bg-[#f9e9e9]"
          iconColor="text-[#c96d6d]"
        />
      </section>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.75fr]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* VIDEO AREA */}
          <section className="overflow-hidden rounded-[26px] border border-[#dbe2ea] bg-white shadow-[0_12px_35px_rgba(35,50,70,0.06)]">
            <div className="flex flex-col gap-4 border-b border-[#e8edf2] px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3f5] text-[#5594a3]">
                    <Video size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#2f4053]">
                      Live Camera Feed
                    </h2>

                    <p className="mt-1 text-xs text-[#7d8998]">
                      Real-time AI monitoring in progress
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#e8f4ed] px-3 py-1.5 text-xs font-semibold text-[#4e8b6c]">
                  AI Active
                </span>

                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce3ea] text-[#6e7d8d] transition hover:bg-[#f6f8fa]">
                  <Maximize2 size={17} />
                </button>
              </div>
            </div>

            {/* CAMERA MOCK */}
            <div className="relative m-5 min-h-[390px] overflow-hidden rounded-[22px] bg-[#27364a]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(91,156,173,0.18),transparent_40%)]" />

              {/* Camera visual */}
              <div className="relative flex min-h-[390px] items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[#ffffff20] bg-[#33465d]">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#40536a] text-3xl font-bold text-[#d9e8ed]">
                      {selectedStudent?.initials || "RK"}
                    </div>

                    <div className="absolute inset-[-8px] rounded-full border border-dashed border-[#6ea7b4]/60" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {selectedStudent?.name || "Select Student"}
                  </h3>

                  <p className="mt-1 text-sm text-[#aebdc9]">
                    {selectedStudent?.rollNo}
                  </p>
                </div>
              </div>

              {/* LIVE */}
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-lg bg-[#ef6b6b] px-3 py-1.5 text-xs font-bold text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                LIVE
              </div>

              {/* CAMERA INFO */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#ffffff12] px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-wider text-[#9dacb9]">
                    AI Confidence
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">98.7%</p>
                </div>

                <div className="rounded-xl bg-[#ffffff12] px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-wider text-[#9dacb9]">
                    Face Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#76c597]">
                    Detected
                  </p>
                </div>
              </div>

              <div className="absolute bottom-5 right-5 flex gap-2">
                <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffffff15] text-white backdrop-blur-sm transition hover:bg-[#ffffff25]">
                  <Mic size={18} />
                </button>

                <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffffff15] text-white backdrop-blur-sm transition hover:bg-[#ffffff25]">
                  <Camera size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* ACTIVITY */}
          <section className="rounded-[26px] border border-[#dbe2ea] bg-white p-6 shadow-[0_12px_35px_rgba(35,50,70,0.05)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#2f4053]">
                  Recent AI Activity
                </h2>

                <p className="mt-1 text-xs text-[#7d8998]">
                  Automatically detected examination events
                </p>
              </div>

              <button className="text-sm font-semibold text-[#5797a8]">
                View All
              </button>
            </div>

            <div className="space-y-3">
              <ActivityItem
                title="Face detection verified"
                description="Rahul Kumar is successfully identified."
                time="Just now"
                type="success"
              />

              <ActivityItem
                title="Face not detected"
                description="Aman Singh moved outside the camera frame."
                time="2 min ago"
                type="warning"
              />

              <ActivityItem
                title="Multiple faces detected"
                description="Additional person detected near examination screen."
                time="5 min ago"
                type="danger"
              />

              <ActivityItem
                title="Browser focus restored"
                description="Priya Sharma returned to the examination window."
                time="8 min ago"
                type="info"
              />
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          {/* EXAM INFO */}
          <section className="rounded-[26px] border border-[#dbe2ea] bg-white p-6 shadow-[0_12px_35px_rgba(35,50,70,0.05)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7c8999]">
                  Current Examination
                </p>

                <h2 className="mt-2 font-bold text-[#2f4053]">
                  Data Structures & Algorithms
                </h2>
              </div>

              <button className="text-[#7a8797]">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <InfoRow label="Exam Code" value="MCA-301" />
              <InfoRow label="Duration" value="02:00:00" />
              <InfoRow label="Time Remaining" value="01:18:42" highlight />
              <InfoRow label="Total Students" value="68" />
            </div>
          </section>

          {/* STUDENTS */}
          <section className="rounded-[26px] border border-[#dbe2ea] bg-white shadow-[0_12px_35px_rgba(35,50,70,0.05)]">
            <div className="border-b border-[#e8edf2] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#2f4053]">
                    Students Online
                  </h2>

                  <p className="mt-1 text-xs text-[#7d8998]">
                    {filteredStudents.length} students visible
                  </p>
                </div>

                <span className="rounded-full bg-[#e7f3eb] px-3 py-1 text-xs font-semibold text-[#4e8b6c]">
                  64 Live
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#dfe5eb] bg-[#fafbfd] px-3 py-3">
                <Search size={16} className="text-[#8491a0]" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student..."
                  className="w-full bg-transparent text-sm text-[#526174] outline-none placeholder:text-[#9ba6b3]"
                />
              </div>
            </div>

            <div className="max-h-[470px] overflow-y-auto">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`flex w-full items-center gap-3 border-b border-[#edf0f4] px-5 py-4 text-left transition ${
                    selectedStudent?.id === student.id
                      ? "bg-[#edf7f8]"
                      : "hover:bg-[#fafbfd]"
                  }`}
                >
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8eef2] text-sm font-bold text-[#547080]">
                      {student.initials}
                    </div>

                    <span
                      className={`absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        student.status === "Normal"
                          ? "bg-[#62b082]"
                          : student.status === "Warning"
                          ? "bg-[#e0a43d]"
                          : "bg-[#d96b6b]"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#405064]">
                      {student.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#8290a0]">
                      {student.activity}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`block text-[10px] font-bold ${
                        student.status === "Normal"
                          ? "text-[#4f926e]"
                          : student.status === "Warning"
                          ? "text-[#c58d2d]"
                          : "text-[#c96767]"
                      }`}
                    >
                      {student.status}
                    </span>

                    <span className="mt-1 block text-[10px] text-[#9aa5b1]">
                      {student.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* AI STATUS */}
          <section className="rounded-[26px] border border-[#cfe2e7] bg-[#eaf5f7] p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#5797a8] shadow-sm">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-bold text-[#2f4053]">
                  AI Monitoring Status
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#6f8190]">
                  All AI proctoring systems are running normally and monitoring
                  the examination in real time.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatusBox icon={<Eye size={16} />} label="Vision AI" value="Active" />

              <StatusBox
                icon={<Monitor size={16} />}
                label="Screen AI"
                value="Active"
              />
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
  detail,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  detail: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#dbe2ea] bg-white p-5 shadow-[0_8px_25px_rgba(35,50,70,0.05)]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-3xl font-bold text-[#304054]">{value}</h3>

      <p className="mt-1 text-sm font-semibold text-[#526174]">{label}</p>

      <p className="mt-2 text-xs text-[#8793a1]">{detail}</p>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "danger" | "info";
}) {
  const styles = {
    success: "bg-[#e5f2ea] text-[#4f8d6d]",
    warning: "bg-[#fff2d9] text-[#c9912d]",
    danger: "bg-[#f9e8e8] text-[#c96d6d]",
    info: "bg-[#e7f3f6] text-[#5495a6]",
  };

  return (
    <div className="flex gap-4 rounded-xl border border-[#edf0f4] p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[type]}`}
      >
        {type === "success" && <CheckCircle2 size={18} />}
        {type === "warning" && <AlertTriangle size={18} />}
        {type === "danger" && <CircleAlert size={18} />}
        {type === "info" && <Monitor size={18} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#435366]">{title}</p>

        <p className="mt-1 text-xs text-[#7d8998]">{description}</p>
      </div>

      <span className="whitespace-nowrap text-[11px] text-[#9aa5b1]">
        {time}
      </span>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#edf0f4] pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-[#7c8999]">{label}</span>

      <span
        className={`text-sm font-semibold ${
          highlight ? "text-[#5797a8]" : "text-[#405064]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/70 p-3">
      <div className="flex items-center gap-2 text-[#5797a8]">
        {icon}
        <span className="text-xs font-semibold text-[#637384]">{label}</span>
      </div>

      <p className="mt-2 text-sm font-bold text-[#4d8c6d]">{value}</p>
    </div>
  );
}