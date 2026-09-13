"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message[0]
            : data.message || "Invalid email or password",
        );
      }

      if (data.user?.role !== "student") {
        throw new Error(
          "This account is not authorized for the student portal.",
        );
      }

      /*
       * JWT is now stored in the secure httpOnly cookie
       * by /api/auth/student-login.
       *
       * We do NOT store the token in localStorage.
       */

      localStorage.setItem("user", JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      router.push("/student/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[1030px] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
        <div className="grid min-h-[580px] md:grid-cols-2">
          {/* =========================
              LEFT BRANDING SECTION
          ========================== */}
          <section className="relative overflow-hidden bg-[#b8b8ca] px-10 py-10 text-[#294565] md:px-10">
            {/* Decorative circles */}
            <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full border border-white/50" />
            <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/20" />
            <div className="absolute -bottom-36 -left-24 h-64 w-64 rounded-full border border-white/20" />

            <div className="relative z-10 flex h-full flex-col">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/70 bg-white/40 text-[#557d9c]">
                  <Sparkles size={21} strokeWidth={1.8} />
                </div>

                <div>
                  <h1 className="font-serif text-[21px] leading-none text-[#263f60]">
                    ExamAI
                  </h1>

                  <p className="mt-1 text-[9px] tracking-wide text-[#55718d]">
                    AI Examination System
                  </p>
                </div>
              </div>

              {/* Hero */}
              <div className="mt-16 max-w-[430px]">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[9px] font-semibold tracking-[0.22em] text-[#52748f]">
                    SMART EXAMINATION PLATFORM
                  </span>
                </div>

                <h2 className="font-serif text-[38px] font-medium leading-[1.05] tracking-tight text-[#294463]">
                  Learn and perform
                  <br />
                  <span className="text-[#6391a8]">
                    with confidence.
                  </span>
                </h2>

                <p className="mt-6 max-w-[390px] text-[12px] leading-5 text-[#45647f]">
                  Access your examinations, track your performance and
                  experience secure AI-powered assessments from one platform.
                </p>

                {/* Features */}
                <div className="mt-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      size={16}
                      strokeWidth={1.8}
                      className="text-[#5683a0]"
                    />

                    <span className="text-[11px] text-[#355673]">
                      Secure Examination System
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <WandSparkles
                      size={16}
                      strokeWidth={1.8}
                      className="text-[#5683a0]"
                    />

                    <span className="text-[11px] text-[#355673]">
                      AI-Powered Proctoring
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-auto grid grid-cols-3 gap-2 pt-10">
                <div className="rounded-xl border border-white/70 bg-white/30 px-3 py-4">
                  <p className="font-serif text-[20px] font-semibold text-[#294463]">
                    1,248
                  </p>

                  <p className="mt-1 text-[9px] text-[#49677f]">
                    Students
                  </p>
                </div>

                <div className="rounded-xl border border-white/70 bg-white/30 px-3 py-4">
                  <p className="font-serif text-[20px] font-semibold text-[#294463]">
                    24
                  </p>

                  <p className="mt-1 text-[9px] text-[#49677f]">
                    Exams
                  </p>
                </div>

                <div className="rounded-xl border border-white/70 bg-white/30 px-3 py-4">
                  <p className="font-serif text-[20px] font-semibold text-[#294463]">
                    98.6%
                  </p>

                  <p className="mt-1 text-[9px] text-[#49677f]">
                    AI Accuracy
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              RIGHT LOGIN SECTION
          ========================== */}
          <section className="flex items-center bg-white px-10 py-10 md:px-12">
            <div className="mx-auto w-full max-w-[370px]">
              {/* Heading */}
              <div className="mb-8">
                <p className="mb-4 text-[9px] font-semibold tracking-[0.24em] text-[#52738d]">
                  STUDENT ACCESS
                </p>

                <h2 className="font-serif text-[28px] font-semibold leading-tight text-[#263f5e]">
                  Welcome back, Student.
                </h2>

                <p className="mt-3 text-[11px] leading-5 text-slate-500">
                  Sign in to access your ExamAI student dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-[10px] font-semibold text-[#314b68]">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7890a4]"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="student@example.com"
                      required
                      autoComplete="email"
                      className="h-[46px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#6190a7] focus:ring-2 focus:ring-[#6190a7]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-[10px] font-semibold text-[#314b68]">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7890a4]"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="h-[46px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#6190a7] focus:ring-2 focus:ring-[#6190a7]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7890a4] transition hover:text-[#3e607a]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-[10px] text-slate-500">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      className="h-3 w-3 rounded border-slate-300 accent-[#6190a7]"
                    />

                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="text-[10px] font-medium text-[#52758f] hover:text-[#35556e]"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] leading-4 text-red-600">
                    {error}
                  </div>
                )}

                {/* Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#6090a7] text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(96,144,167,0.18)] transition hover:bg-[#527f96] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Lock size={14} strokeWidth={1.8} />

                  {loading ? "Signing in..." : "Sign In to ExamAI"}
                </button>
              </form>

              {/* Security */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-slate-400">
                <ShieldCheck
                  size={13}
                  strokeWidth={1.7}
                  className="text-emerald-500"
                />

                <span>
                  Secure access to AI Examination System
                </span>
              </div>

              {/* Other portals */}
              <div className="mt-7 text-center">
                <button
                  type="button"
                  onClick={() => router.push("/teacher/login")}
                  className="text-[10px] text-slate-400 transition hover:text-[#6090a7]"
                >
                  Teacher Login
                </button>

                <span className="mx-2 text-slate-300">•</span>

                <button
                  type="button"
                  onClick={() => router.push("/admin/login")}
                  className="text-[10px] text-slate-400 transition hover:text-[#6090a7]"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <p className="fixed bottom-3 left-0 right-0 text-center text-[9px] text-slate-400">
        ExamAI • AI-Powered Examination System
      </p>
    </main>
  );
}