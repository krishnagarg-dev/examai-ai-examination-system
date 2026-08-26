"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("General");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    examNotifications: true,
    securityAlerts: true,
    liveProctoringAlerts: true,
    autoSave: true,
    twoFactorAuth: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationSettings: {
    title: string;
    description: string;
    key: keyof typeof settings;
  }[] = [
    {
      title: "Email Notifications",
      description: "Receive important system updates through email.",
      key: "emailNotifications",
    },
    {
      title: "Examination Alerts",
      description: "Get notified about upcoming and active examinations.",
      key: "examNotifications",
    },
    {
      title: "Security Alerts",
      description: "Receive notifications about account security events.",
      key: "securityAlerts",
    },
    {
      title: "Live Proctoring Alerts",
      description: "Get alerts when suspicious activity is detected.",
      key: "liveProctoringAlerts",
    },
  ];

  const Toggle = ({
    enabled,
    onClick,
  }: {
    enabled: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "48px",
        height: "27px",
        borderRadius: "20px",
        border: "none",
        padding: "3px",
        background: enabled ? "#5f97a8" : "#d7dde3",
        cursor: "pointer",
        transition: "0.2s",
        display: "flex",
        justifyContent: enabled ? "flex-end" : "flex-start",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: "21px",
          height: "21px",
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px 30px 40px",
        background: "#f7f8fb",
        color: "#34465a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#5c7185",
              marginBottom: "8px",
            }}
          >
            SYSTEM SETTINGS
          </div>

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "34px",
              margin: 0,
              color: "#34465a",
            }}
          >
            Settings
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              color: "#6c7b8c",
            }}
          >
            Manage your system preferences, notifications and security settings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Settings saved successfully!")}
          style={{
            border: "none",
            borderRadius: "14px",
            padding: "16px 24px",
            fontSize: "14px",
            fontWeight: 500,
            color: "white",
            background: "#5f97a8",
            boxShadow: "0 10px 25px rgba(95,151,168,0.22)",
            cursor: "pointer",
          }}
        >
          💾 Save Changes
        </button>
      </div>

      {/* SETTINGS SUMMARY */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            icon: "⚙",
            value: "General",
            title: "System Preferences",
            text: "System configuration",
            bg: "#c4c5d9",
          },
          {
            icon: "🔔",
            value: "4",
            title: "Notifications",
            text: "Alerts currently enabled",
            bg: "#fff1c8",
          },
          {
            icon: "◉",
            value: "Active",
            title: "AI Monitoring",
            text: "Real-time protection",
            bg: "#c5dde4",
          },
          {
            icon: "🔒",
            value: "Secure",
            title: "Account Security",
            text: "Protection enabled",
            bg: "#f4f5f8",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              minHeight: "145px",
              padding: "20px",
              borderRadius: "20px",
              background: item.bg,
              border: "1px solid rgba(130,150,170,0.18)",
              boxShadow: "0 8px 25px rgba(60,80,100,0.04)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "13px",
                background: "rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "15px",
                fontSize: "17px",
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "23px",
                fontWeight: 700,
                marginBottom: "5px",
              }}
            >
              {item.value}
            </div>

            <div style={{ fontSize: "13px", marginBottom: "7px" }}>
              {item.title}
            </div>

            <div style={{ fontSize: "11px", color: "#6d7b8b" }}>
              {item.text}
            </div>
          </div>
        ))}
      </section>

      {/* MAIN SETTINGS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: "22px",
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            background: "white",
            border: "1px solid #dce2e8",
            borderRadius: "20px",
            padding: "16px",
            height: "fit-content",
            boxShadow: "0 8px 25px rgba(60,80,100,0.04)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "#7b8795",
              padding: "10px 12px",
            }}
          >
            SETTINGS MENU
          </div>

          {[
            ["⚙", "General"],
            ["🔔", "Notifications"],
            ["◉", "AI Proctoring"],
            ["🔒", "Security"],
          ].map(([icon, name]) => (
            <button
              type="button"
              key={name}
              onClick={() => setActiveSection(name)}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "12px",
                padding: "14px 12px",
                marginBottom: "5px",
                display: "flex",
                gap: "12px",
                alignItems: "center",
                cursor: "pointer",
                background:
                  activeSection === name ? "#e3f0f3" : "transparent",
                color:
                  activeSection === name ? "#4f7d8c" : "#617184",
                fontSize: "13px",
                fontWeight: activeSection === name ? 700 : 500,
              }}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </div>

        {/* GENERAL */}
        {activeSection === "General" && (
          <div
            style={{
              background: "white",
              border: "1px solid #dce2e8",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 8px 25px rgba(60,80,100,0.04)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "20px" }}>
              General Preferences
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "#748294",
                margin: "7px 0 26px",
              }}
            >
              Configure your general examination system preferences.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Institution Name
                </label>

                <input
                  defaultValue="KIET Group of Institutions"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px",
                    borderRadius: "11px",
                    border: "1px solid #d9e0e6",
                    background: "#f8f9fb",
                    color: "#435466",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Academic Session
                </label>

                <select
                  defaultValue="2025-2027"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "11px",
                    border: "1px solid #d9e0e6",
                    background: "#f8f9fb",
                    color: "#435466",
                    fontSize: "13px",
                  }}
                >
                  <option>2025-2027</option>
                  <option>2026-2028</option>
                  <option>2027-2029</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Default Semester
                </label>

                <select
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "11px",
                    border: "1px solid #d9e0e6",
                    background: "#f8f9fb",
                    color: "#435466",
                    fontSize: "13px",
                  }}
                >
                  <option>Semester I</option>
                  <option>Semester II</option>
                  <option>Semester III</option>
                  <option>Semester IV</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Time Zone
                </label>

                <select
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "11px",
                    border: "1px solid #d9e0e6",
                    background: "#f8f9fb",
                    color: "#435466",
                    fontSize: "13px",
                  }}
                >
                  <option>Asia/Kolkata (IST)</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>

            <div
              style={{
                marginTop: "25px",
                borderTop: "1px solid #e7ebef",
                paddingTop: "22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontSize: "14px" }}>Automatic Save</strong>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#778596",
                    margin: "5px 0 0",
                  }}
                >
                  Automatically save changes while managing examinations.
                </p>
              </div>

              <Toggle
                enabled={settings.autoSave}
                onClick={() => toggleSetting("autoSave")}
              />
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeSection === "Notifications" && (
          <div
            style={{
              background: "white",
              border: "1px solid #dce2e8",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 8px 25px rgba(60,80,100,0.04)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "20px" }}>
              Notification Preferences
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "#748294",
                margin: "7px 0 25px",
              }}
            >
              Choose which alerts and notifications you want to receive.
            </p>

            {notificationSettings.map(({ title, description, key }) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 0",
                  borderBottom: "1px solid #e7ebef",
                }}
              >
                <div>
                  <strong style={{ fontSize: "14px" }}>{title}</strong>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#778596",
                      margin: "6px 0 0",
                    }}
                  >
                    {description}
                  </p>
                </div>

                <Toggle
                  enabled={settings[key]}
                  onClick={() => toggleSetting(key)}
                />
              </div>
            ))}
          </div>
        )}

        {/* AI PROCTORING */}
        {activeSection === "AI Proctoring" && (
          <div
            style={{
              background: "white",
              border: "1px solid #dce2e8",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 8px 25px rgba(60,80,100,0.04)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "20px" }}>
              AI Proctoring Settings
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "#748294",
                margin: "7px 0 25px",
              }}
            >
              Configure artificial intelligence monitoring preferences.
            </p>

            {[
              [
                "Face Detection",
                "Verify student face visibility during examinations.",
              ],
              [
                "Multiple Face Detection",
                "Detect additional faces in the camera frame.",
              ],
              [
                "Browser Activity Monitoring",
                "Monitor suspicious browser activity and tab changes.",
              ],
              [
                "Suspicious Activity Detection",
                "Automatically detect unusual examination behavior.",
              ],
            ].map(([title, description]) => (
              <label
                key={title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "18px 0",
                  borderBottom: "1px solid #e7ebef",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{
                    marginTop: "2px",
                    width: "17px",
                    height: "17px",
                    accentColor: "#5f97a8",
                  }}
                />

                <div>
                  <strong style={{ fontSize: "14px" }}>{title}</strong>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#778596",
                      margin: "6px 0 0",
                    }}
                  >
                    {description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* SECURITY */}
        {activeSection === "Security" && (
          <div
            style={{
              background: "white",
              border: "1px solid #dce2e8",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 8px 25px rgba(60,80,100,0.04)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "20px" }}>
              Security Settings
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "#748294",
                margin: "7px 0 25px",
              }}
            >
              Manage administrator account security and authentication.
            </p>

            <div
              style={{
                padding: "20px 0",
                borderBottom: "1px solid #e7ebef",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontSize: "14px" }}>
                  Two-Factor Authentication
                </strong>

                <p
                  style={{
                    fontSize: "12px",
                    color: "#778596",
                    margin: "6px 0 0",
                  }}
                >
                  Add an additional layer of security to your administrator
                  account.
                </p>
              </div>

              <Toggle
                enabled={settings.twoFactorAuth}
                onClick={() => toggleSetting("twoFactorAuth")}
              />
            </div>

            <div style={{ paddingTop: "25px" }}>
              <strong style={{ fontSize: "14px" }}>Password Management</strong>

              <p
                style={{
                  fontSize: "12px",
                  color: "#778596",
                  margin: "7px 0 16px",
                }}
              >
                Your password was last updated recently.
              </p>

              <button
                type="button"
                onClick={() =>
                  alert("Password change functionality coming soon.")
                }
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "1px solid #cfd9df",
                  background: "white",
                  color: "#536b7c",
                  cursor: "pointer",
                }}
              >
                Change Password
              </button>
            </div>

            <div
              style={{
                marginTop: "25px",
                background: "#fff5f4",
                border: "1px solid #f1d9d5",
                borderRadius: "15px",
                padding: "18px",
              }}
            >
              <strong
                style={{
                  color: "#b06d64",
                  fontSize: "14px",
                }}
              >
                Active Administrator Session
              </strong>

              <p
                style={{
                  color: "#8c7773",
                  fontSize: "12px",
                  margin: "7px 0 0",
                }}
              >
                Windows • Chrome • Ghaziabad, India
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}