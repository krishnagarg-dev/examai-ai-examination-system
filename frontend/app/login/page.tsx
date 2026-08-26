"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem("examai-auth", "true");

    router.push("/dashboard");
  };

  return (
    <main className="login-page">
      <section className="login-container">
        {/* LEFT SECTION */}
        <div className="login-visual">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <h1>ExamAI</h1>
              <p>AI Examination System</p>
            </div>
          </div>

          <div className="visual-content">
            <span className="eyebrow">
              <span className="live-dot" />
              SMART EXAMINATION PLATFORM
            </span>

            <h2>
              Manage examinations
              <br />
              <span>with intelligence.</span>
            </h2>

            <p>
              A unified platform to manage examinations, students, results and
              AI-powered proctoring from one secure system.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <ShieldCheck size={18} />
                <span>Secure Examination System</span>
              </div>

              <div className="feature-item">
                <Sparkles size={18} />
                <span>AI-Powered Proctoring</span>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <strong>1,248</strong>
              <span>Students</span>
            </div>

            <div className="stat-card">
              <strong>24</strong>
              <span>Exams</span>
            </div>

            <div className="stat-card">
              <strong>98.6%</strong>
              <span>AI Accuracy</span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="login-form-section">
          <div className="form-content">
            <div className="form-header">
              <span className="eyebrow">ADMIN ACCESS</span>

              <h2>Welcome back, Krishna.</h2>

              <p>
                Sign in to access your ExamAI administration dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label>Email Address</label>

                <div className="input-wrapper">
                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    defaultValue="gargkrishna9354@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Password</label>

                <div className="input-wrapper">
                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button type="button" className="forgot-password">
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="login-button">
                <Lock size={17} />
                Sign In to ExamAI
              </button>
            </form>

            <div className="security-note">
              <ShieldCheck size={16} />
              <span>Secure access to AI Examination System</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          background: #f3f5f8;
          color: #304257;
          font-family: Arial, Helvetica, sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 1200px;
          min-height: 680px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #dbe1e8;
          border-radius: 24px;
          box-shadow: 0 18px 45px rgba(55, 68, 90, 0.1);
        }

        /* LEFT */

        .login-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 48px;
          overflow: hidden;
          background: #b9bacb;
        }

        .login-visual::before {
          content: "";
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          right: -170px;
          top: -170px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
        }

        .login-visual::after {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          left: -150px;
          bottom: -150px;
          background: rgba(255, 255, 255, 0.12);
        }

        .brand {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brand-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.45);
          color: #4d7185;
          border: 1px solid rgba(255, 255, 255, 0.65);
        }

        .brand h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          letter-spacing: 0.4px;
          color: #304257;
        }

        .brand p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #53687a;
        }

        .visual-content {
          position: relative;
          z-index: 2;
          margin: auto 0;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          letter-spacing: 2px;
          font-weight: 700;
          color: #597283;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6caa91;
        }

        .visual-content h2 {
          margin: 22px 0 16px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 43px;
          line-height: 1.12;
          color: #304257;
        }

        .visual-content h2 span {
          color: #567f91;
        }

        .visual-content > p {
          max-width: 440px;
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
          color: #53687a;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin-top: 30px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #3f5668;
        }

        .feature-item :global(svg) {
          color: #567f91;
        }

        .stats-row {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .stat-card {
          padding: 16px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .stat-card strong {
          display: block;
          margin-bottom: 5px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
          color: #304257;
        }

        .stat-card span {
          font-size: 11px;
          color: #607384;
        }

        /* RIGHT */

        .login-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px;
          background: #fbfcfd;
        }

        .form-content {
          width: 100%;
          max-width: 410px;
        }

        .form-header {
          margin-bottom: 34px;
        }

        .form-header h2 {
          margin: 13px 0 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 31px;
          font-weight: 700;
          color: #304257;
        }

        .form-header p {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          color: #748394;
        }

        .field-group {
          margin-bottom: 21px;
        }

        .field-group label {
          display: block;
          margin-bottom: 9px;
          font-size: 12px;
          font-weight: 600;
          color: #4c5f70;
        }

        .input-wrapper {
          height: 53px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 15px;
          border: 1px solid #d6dde5;
          border-radius: 13px;
          background: #ffffff;
          transition: 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #789eae;
          box-shadow: 0 0 0 3px rgba(120, 158, 174, 0.1);
        }

        .input-wrapper :global(svg) {
          color: #748899;
          flex-shrink: 0;
        }

        .input-wrapper input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #304257;
          font-size: 13px;
        }

        .input-wrapper input::placeholder {
          color: #a3adb7;
        }

        .eye-button {
          display: flex;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 4px 0 27px;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #718091;
          cursor: pointer;
        }

        .remember input {
          accent-color: #638d9d;
        }

        .forgot-password {
          border: none;
          padding: 0;
          background: transparent;
          color: #5b8798;
          font-size: 12px;
          cursor: pointer;
        }

        .login-button {
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: none;
          border-radius: 13px;
          background: #5c8fa1;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(92, 143, 161, 0.18);
          transition: 0.2s ease;
        }

        .login-button:hover {
          background: #4f8395;
          transform: translateY(-1px);
        }

        .security-note {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 25px;
          font-size: 11px;
          color: #84919d;
        }

        .security-note :global(svg) {
          color: #6c9d84;
        }

        @media (max-width: 900px) {
          .login-container {
            grid-template-columns: 1fr;
            max-width: 650px;
          }

          .login-visual {
            min-height: 470px;
          }

          .login-form-section {
            padding: 50px 35px;
          }
        }

        @media (max-width: 600px) {
          .login-page {
            padding: 0;
          }

          .login-container {
            min-height: 100vh;
            border: none;
            border-radius: 0;
          }

          .login-visual {
            display: none;
          }

          .login-form-section {
            min-height: 100vh;
            padding: 30px 22px;
          }

          .form-options {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}