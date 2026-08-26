"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  const [profile, setProfile] = useState({
    name: "Krishna Garg",
    email: "krishna.garg@kiet.edu",
    phone: "+91 8826094086",
    employeeId: "ADM-2026-001",
    department: "Examination Administration",
    designation: "System Administrator",
    location: "Ghaziabad, India",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    setEditMode(false);
  };

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
          marginBottom: "26px",
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
            ACCOUNT MANAGEMENT
          </div>

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "34px",
              margin: 0,
              color: "#34465a",
            }}
          >
            Profile
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              color: "#6c7b8c",
            }}
          >
            Manage your personal information and administrator account details.
          </p>
        </div>

        <button
          onClick={() => (editMode ? saveProfile() : setEditMode(true))}
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
          {editMode ? "💾 Save Changes" : "✎ Edit Profile"}
        </button>
      </div>

      {/* PROFILE HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #bfc0d7 0%, #c8dbe1 55%, #e9edf2 100%)",
          border: "1px solid #d5dbe3",
          borderRadius: "22px",
          padding: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "25px",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(60,80,100,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
          }}
        >
          <div
            style={{
              width: "86px",
              height: "86px",
              borderRadius: "24px",
              background: "#6f6b9d",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "27px",
              fontWeight: 700,
              boxShadow: "0 10px 24px rgba(80,75,120,0.2)",
            }}
          >
            KG
          </div>

          <div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "27px",
                margin: 0,
                color: "#34465a",
              }}
            >
              Krishna Garg
            </h2>

            <p
              style={{
                margin: "7px 0",
                color: "#53677a",
                fontSize: "14px",
              }}
            >
              System Administrator
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "#e6f1eb",
                color: "#4f806b",
                padding: "7px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#5c9c7a",
                  display: "inline-block",
                }}
              />
              Account Active
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "38px",
            paddingRight: "10px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#748295",
                marginBottom: "7px",
              }}
            >
              MEMBER SINCE
            </div>
            <strong style={{ fontSize: "15px" }}>January 2026</strong>
          </div>

          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#748295",
                marginBottom: "7px",
              }}
            >
              LAST LOGIN
            </div>
            <strong style={{ fontSize: "15px" }}>Today, 02:18 AM</strong>
          </div>
        </div>
      </section>

      {/* STATS */}
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
            icon: "▣",
            number: "24",
            title: "Exams Managed",
            text: "Across all semesters",
            bg: "#c2c3d8",
          },
          {
            icon: "◉",
            number: "1,248",
            title: "Students Managed",
            text: "Registered students",
            bg: "#fff1c8",
          },
          {
            icon: "◌",
            number: "58",
            title: "Active Sessions",
            text: "Currently monitored",
            bg: "#c5dde4",
          },
          {
            icon: "✓",
            number: "99.8%",
            title: "System Accuracy",
            text: "AI monitoring score",
            bg: "#f3f5f8",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              minHeight: "160px",
              borderRadius: "20px",
              padding: "20px",
              background: item.bg,
              border: "1px solid rgba(130,150,170,0.2)",
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
                color: "#557e8d",
                marginBottom: "18px",
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "27px",
                fontWeight: 700,
                marginBottom: "5px",
              }}
            >
              {item.number}
            </div>

            <div style={{ fontSize: "13px", marginBottom: "8px" }}>
              {item.title}
            </div>

            <div style={{ fontSize: "11px", color: "#6d7b8b" }}>
              {item.text}
            </div>
          </div>
        ))}
      </section>

      {/* TABS */}
      <section
        style={{
          background: "white",
          border: "1px solid #dce2e8",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(60,80,100,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "28px",
            padding: "0 28px",
            borderBottom: "1px solid #e7ebef",
          }}
        >
          {["Profile", "Activity", "Security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "3px solid #5f97a8"
                    : "3px solid transparent",
                padding: "18px 2px",
                color: activeTab === tab ? "#456d7b" : "#718093",
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "Profile" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "28px",
              padding: "28px",
            }}
          >
            {/* PERSONAL DETAILS */}
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  margin: "0 0 6px",
                  color: "#34465a",
                }}
              >
                Personal Information
              </h2>

              <p
                style={{
                  fontSize: "12px",
                  color: "#758394",
                  margin: "0 0 22px",
                }}
              >
                Update your personal and professional account information.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "18px",
                }}
              >
                {[
                  ["Full Name", "name", "Krishna Garg"],
                  ["Email Address", "email", "krishna.garg@kiet.edu"],
                  ["Phone Number", "phone", "+91 8826094086"],
                  ["Employee ID", "employeeId", "ADM-2026-001"],
                  [
                    "Department",
                    "department",
                    "Examination Administration",
                  ],
                  ["Designation", "designation", "System Administrator"],
                  ["Location", "location", "Ghaziabad, India"],
                ].map(([label, name, value]) => (
                  <div
                    key={name}
                    style={{
                      gridColumn:
                        name === "location" ? "1 / span 2" : "auto",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 600,
                        marginBottom: "8px",
                        color: "#516274",
                      }}
                    >
                      {label}
                    </label>

                    <input
                      name={name}
                      value={profile[name as keyof typeof profile]}
                      onChange={handleChange}
                      disabled={!editMode}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "14px",
                        borderRadius: "11px",
                        border: "1px solid #d9e0e6",
                        background: editMode ? "white" : "#f7f8fa",
                        color: "#435466",
                        outline: "none",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ACCOUNT STATUS */}
            <div>
              <div
                style={{
                  background: "#f8f9fb",
                  border: "1px solid #e0e5ea",
                  borderRadius: "18px",
                  padding: "22px",
                  marginBottom: "18px",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 18px",
                    fontSize: "16px",
                    color: "#34465a",
                  }}
                >
                  Account Status
                </h3>

                {[
                  ["Account Status", "Active", "#5c9475"],
                  ["Role", "Administrator", "#5d7f91"],
                  ["Two-Factor Auth", "Enabled", "#5c9475"],
                  ["Account Created", "12 Jan 2026", "#637385"],
                ].map(([label, value, color]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "13px 0",
                      borderBottom: "1px solid #e6ebef",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "#728092" }}>{label}</span>
                    <strong style={{ color }}>{value}</strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#eef7f3",
                  border: "1px solid #d8e9e0",
                  borderRadius: "18px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#4d7c68",
                    marginBottom: "8px",
                  }}
                >
                  ✓ Profile Verified
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "#688377",
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  Your administrator account and profile information have been
                  successfully verified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "Activity" && (
          <div style={{ padding: "28px" }}>
            <h2 style={{ marginTop: 0, fontSize: "18px" }}>
              Recent Activity
            </h2>

            {[
              ["Profile accessed", "Today, 02:18 AM"],
              ["Examination created", "Yesterday, 11:40 AM"],
              ["Student records updated", "25 Aug 2026, 04:20 PM"],
              ["Results published", "24 Aug 2026, 03:10 PM"],
            ].map(([title, time]) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "18px 0",
                  borderBottom: "1px solid #e8ecef",
                }}
              >
                <strong style={{ fontSize: "14px" }}>{title}</strong>
                <span style={{ fontSize: "12px", color: "#758394" }}>
                  {time}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "Security" && (
          <div
            style={{
              padding: "28px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                border: "1px solid #e1e6eb",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Password</h3>
              <p
                style={{
                  color: "#718093",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                Keep your account secure by using a strong password.
              </p>
              <button
                style={{
                  border: "1px solid #cfd9df",
                  background: "white",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  color: "#52697a",
                }}
              >
                Change Password
              </button>
            </div>

            <div
              style={{
                border: "1px solid #e1e6eb",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Two-Factor Authentication</h3>
              <p
                style={{
                  color: "#718093",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                Two-factor authentication is currently enabled for your
                account.
              </p>
              <button
                style={{
                  border: "1px solid #cfd9df",
                  background: "white",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  color: "#52697a",
                }}
              >
                Manage Security
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}