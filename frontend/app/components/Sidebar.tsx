"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  Users,
  ScanFace,
  FileText,
  BarChart3,
  UserRound,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Sparkles,
} from "lucide-react";

const mainMenu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Exams",
    href: "/exams",
    icon: ClipboardList,
  },
  {
    label: "Create Exam",
    href: "/create-exam",
    icon: Plus,
  },
  {
    label: "Students",
    href: "/students",
    icon: Users,
  },
  {
    label: "Live Proctoring",
    href: "/live-proctoring",
    icon: ScanFace,
  },
  {
    label: "Results",
    href: "/results",
    icon: FileText,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

const otherMenu = [
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen shrink-0 border-r border-slate-200 bg-white px-4 py-5 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#6f6ca8] text-white shadow-sm">
          <Sparkles size={20} />
        </div>

        <div>
          <h1 className="text-[20px] font-bold text-slate-800">
            ExamAI
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            AI Examination System
          </p>
        </div>
      </div>

      {/* Main Menu */}
      <div>
        <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.12em] text-slate-400">
          MAIN MENU
        </p>

        <nav className="space-y-1">
          {mainMenu.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium transition ${
                  isActive
                    ? "bg-[#6f6ca8] text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Other */}
      <div className="mt-7">
        <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.12em] text-slate-400">
          OTHER
        </p>

        <nav className="space-y-1">
          {otherMenu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium transition ${
                  isActive
                    ? "bg-[#f0eff8] text-[#6f6ca8]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Bottom Profile */}
      <div className="mt-auto pt-6">
        <div className="mb-4 flex items-center gap-2 px-3 text-slate-400">
          <Search size={17} />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="w-10 h-10 rounded-xl bg-[#6f6ca8] text-white flex items-center justify-center text-[12px] font-bold">
            KG
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-slate-700">
              Krishna Garg
            </p>
            <p className="text-[10px] text-slate-400">
              Administrator
            </p>
          </div>

          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
}