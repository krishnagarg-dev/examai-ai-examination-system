"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Camera,
  Edit3,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

const navItems = [
  { icon: "⌂", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "▣", label: "My Exams", href: "/teacher/exams" },
  { icon: "＋", label: "Create Exam", href: "/teacher/create-exam" },
  { icon: "◉", label: "Students", href: "/teacher/students" },
  { icon: "?", label: "Questions", href: "/teacher/questions" },
  { icon: "▥", label: "Results", href: "/teacher/results" },
];

export default function TeacherProfilePage() {
  const pathname = usePathname();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@examai.edu",
    phone: "+91 98765 43210",
    department: "Computer Applications",
    designation: "Assistant Professor",
    employeeId: "FAC-2026-101",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
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
            <div className="mb-[14px] px-[12px] text-[11px] font-bold tracking-[1.3px] text-[#8c95a4]">
              OTHER
            </div>

            <Link
              href="/teacher/profile"
              className={`flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium ${
                pathname === "/teacher/profile"
                  ? "bg-[#63a8b9] text-white"
                  : "text-[#667386] hover:bg-[#f6f8fb]"
              }`}
            >
              <User size={17} />
              Profile
            </Link>

            <Link
              href="/teacher/settings"
              className="mt-[8px] flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-[14px] font-medium text-[#667386] hover:bg-[#f6f8fb]"
            >
              <span>⚙</span>
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="mt-[8px] flex w-full items-center gap-[17px] rounded-[14px] px-[18px] py-[15px] text-left text-[14px] font-medium text-[#d66b75] hover:bg-[#fff4f5]"
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
                ACCOUNT MANAGEMENT
              </p>

              <h1 className="mt-[7px] text-[30px] font-bold">
                My Profile
              </h1>

              <p className="mt-[8px] text-[14px] text-[#7d8796]">
                Manage your personal and professional information.
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-[8px] rounded-[12px] bg-[#63a8b9] px-[18px] py-[12px] text-[13px] font-semibold text-white hover:opacity-90"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-[10px]">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-[7px] rounded-[12px] border border-[#e1e5eb] bg-white px-[16px] py-[12px] text-[13px] font-semibold text-[#667386]"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-[7px] rounded-[12px] bg-[#63a8b9] px-[16px] py-[12px] text-[13px] font-semibold text-white"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="mt-[30px] grid grid-cols-1 gap-[25px] xl:grid-cols-[360px_1fr]">

            {/* PROFILE CARD */}
            <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#eef8fa] text-[36px] font-bold text-[#63a8b9]">
                    RK
                  </div>

                  {isEditing && (
                    <button className="absolute bottom-[2px] right-[2px] flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#63a8b9] text-white shadow-md">
                      <Camera size={15} />
                    </button>
                  )}
                </div>

                <h2 className="mt-[18px] text-[21px] font-bold">
                  {profile.name}
                </h2>

                <p className="mt-[5px] text-[13px] text-[#63a8b9]">
                  {profile.designation}
                </p>

                <p className="mt-[3px] text-[12px] text-[#8b94a3]">
                  {profile.department}
                </p>
              </div>

              <div className="mt-[28px] space-y-[17px] border-t border-[#eef0f4] pt-[25px]">
                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#eef8fa] text-[#63a8b9]">
                    <Mail size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-[#8b94a3]">EMAIL ADDRESS</p>
                    <p className="truncate text-[12px] font-medium">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#f5f2ff] text-[#8a75c9]">
                    <Phone size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8b94a3]">PHONE NUMBER</p>
                    <p className="text-[12px] font-medium">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#eaf8ef] text-[#4e9b6b]">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8b94a3]">EMPLOYEE ID</p>
                    <p className="text-[12px] font-medium">
                      {profile.employeeId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="space-y-[25px]">
              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
                <h2 className="text-[18px] font-bold">
                  Personal Information
                </h2>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  Update your personal details and contact information.
                </p>

                <div className="mt-[25px] grid grid-cols-1 gap-[18px] md:grid-cols-2">

                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Full Name
                    </label>

                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[12px] text-[13px] outline-none disabled:bg-[#f7f8fc]"
                    />
                  </div>

                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Email Address
                    </label>

                    <input
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[12px] text-[13px] outline-none disabled:bg-[#f7f8fc]"
                    />
                  </div>

                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Phone Number
                    </label>

                    <input
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[12px] text-[13px] outline-none disabled:bg-[#f7f8fc]"
                    />
                  </div>

                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Employee ID
                    </label>

                    <input
                      name="employeeId"
                      value={profile.employeeId}
                      disabled
                      className="w-full rounded-[12px] border border-[#e1e5eb] bg-[#f7f8fc] px-[14px] py-[12px] text-[13px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* PROFESSIONAL INFO */}
              <div className="rounded-[22px] border border-[#e8eaf0] bg-white p-[28px]">
                <h2 className="text-[18px] font-bold">
                  Professional Information
                </h2>

                <p className="mt-[5px] text-[12px] text-[#8b94a3]">
                  Manage your academic and professional details.
                </p>

                <div className="mt-[25px] grid grid-cols-1 gap-[18px] md:grid-cols-2">

                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Department
                    </label>

                    <input
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[12px] text-[13px] outline-none disabled:bg-[#f7f8fc]"
                    />
                  </div>

                  <div>
                    <label className="mb-[8px] block text-[12px] font-semibold">
                      Designation
                    </label>

                    <input
                      name="designation"
                      value={profile.designation}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-[12px] border border-[#e1e5eb] bg-white px-[14px] py-[12px] text-[13px] outline-none disabled:bg-[#f7f8fc]"
                    />
                  </div>
                </div>
              </div>

              {/* TEACHING STATS */}
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
                <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[20px]">
                  <BookOpen size={20} className="text-[#63a8b9]" />
                  <h3 className="mt-[14px] text-[26px] font-bold">24</h3>
                  <p className="text-[12px] text-[#8b94a3]">Exams Created</p>
                </div>

                <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[20px]">
                  <User size={20} className="text-[#8a75c9]" />
                  <h3 className="mt-[14px] text-[26px] font-bold">186</h3>
                  <p className="text-[12px] text-[#8b94a3]">Students</p>
                </div>

                <div className="rounded-[20px] border border-[#e8eaf0] bg-white p-[20px]">
                  <ShieldCheck size={20} className="text-[#4e9b6b]" />
                  <h3 className="mt-[14px] text-[26px] font-bold">96%</h3>
                  <p className="text-[12px] text-[#8b94a3]">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}