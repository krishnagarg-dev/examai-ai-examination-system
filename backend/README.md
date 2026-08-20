# AI-Powered Examination System

An intelligent and secure online examination platform that combines adaptive assessment, AI-assisted proctoring, automated evaluation, explainable integrity risk analysis, and student performance analytics.

## 🚀 Overview

The AI-Powered Examination System is designed to provide a secure, scalable, and intelligent environment for conducting online examinations. Unlike traditional examination platforms, the system integrates Artificial Intelligence and Computer Vision to analyze both **student performance** and **examination integrity**.

The platform supports the complete examination lifecycle — from question creation and AI-assisted question generation to online examination, proctoring, automatic evaluation, risk analysis, and personalized performance reports.

## 🎯 Key Features

### 👨‍🎓 Student Module

* Secure registration and login
* View scheduled examinations
* Exam instructions and system checks
* Timed online examinations
* Randomized questions and options
* Automatic answer saving
* Automatic submission
* Instant results
* Performance analytics
* Personalized improvement recommendations

### 👨‍🏫 Faculty Module

* Create and schedule examinations
* Manage question bank
* Generate questions using AI
* Review and approve AI-generated questions
* Configure exam difficulty and duration
* Monitor ongoing examinations
* View student results
* Analyze question and topic performance
* Review proctoring reports

### 🤖 AI Question Generation

* Topic-based question generation
* Difficulty-based question generation
* MCQ generation with answers and explanations
* Question quality analysis
* Duplicate/similar question detection
* Faculty review before publishing

### 👁️ AI-Assisted Proctoring

The system analyzes multiple examination signals, including:

* Face presence detection
* Multiple-person detection
* Face/head orientation analysis
* Mobile phone/object detection
* Tab switching
* Fullscreen exit
* Browser activity
* Suspicious event frequency

The system records suspicious events with timestamps and confidence information.

### ⚠️ Explainable Integrity Risk Analysis

Instead of automatically declaring a student guilty of cheating, the system calculates an examination integrity risk score based on multiple detected events.

Example:

```text
Risk Score: 72/100
Risk Level: HIGH

Contributing Events:
- Multiple Face Detection
- Mobile Phone Detection
- Repeated Tab Switching
- Extended Face Absence
```

Faculty can review the evidence and make the final decision.

### 🧠 Adaptive Assessment

The examination engine can adjust question difficulty according to the student's demonstrated performance.

```text
Student Performance
        ↓
Difficulty Analysis
        ↓
Next Question Selection
        ↓
Performance Update
        ↓
Continuous Assessment
```

This creates a more personalized assessment experience.

### 📊 AI Performance Analytics

After an examination, the system analyzes:

* Overall score
* Accuracy
* Response time
* Topic-wise performance
* Difficulty-wise performance
* Strong topics
* Weak topics
* Improvement areas
* Personalized recommendations

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │        Users         │
                    │ Student / Faculty    │
                    │        / Admin       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Next.js + TypeScript │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   NestJS Backend     │
                    │      REST API        │
                    └───────┬──────┬───────┘
                            │      │
                            ▼      ▼
                       MongoDB   AI Services
                        Atlas        │
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
                     ▼                           ▼
              AI/LLM Service             Computer Vision
              Question & Report           Proctoring
              Generation                  & Detection
```

## 🛠️ Technology Stack

| Layer                   | Technology              |
| ----------------------- | ----------------------- |
| Frontend                | Next.js, TypeScript     |
| UI                      | Tailwind CSS, shadcn/ui |
| Backend                 | NestJS, Node.js         |
| Database                | MongoDB Atlas           |
| Authentication          | JWT, Refresh Tokens     |
| AI/LLM                  | OpenAI API / Gemini API |
| AI Service              | Python, FastAPI         |
| Computer Vision         | OpenCV, MediaPipe       |
| Object Detection        | YOLO                    |
| Real-Time Communication | WebSockets / Socket.IO  |
| Charts & Analytics      | Recharts / Chart.js     |
| API Testing             | Postman                 |
| Testing                 | Jest, Supertest, Pytest |
| Version Control         | Git, GitHub             |

## 📁 Project Structure

```text
ai-examination-system/
│
├── frontend/
│   └── Next.js application
│
├── backend/
│   └── NestJS application
│
├── ai-service/
│   └── Python + FastAPI AI services
│
├── README.md
└── .gitignore
```

## 🔄 Examination Flow

```text
Faculty Creates Exam
        ↓
AI-Assisted Question Generation
        ↓
Faculty Review & Approval
        ↓
Exam Scheduling
        ↓
Student Login
        ↓
System & Proctoring Check
        ↓
AI-Assisted Proctoring
        ↓
Adaptive Online Examination
        ↓
Automatic Evaluation
        ↓
Integrity Risk Analysis
        ↓
AI Performance Analysis
        ↓
Results & Reports
```

## 🔐 Security

The system is designed with security and examination integrity in mind.

Planned security mechanisms include:

* JWT-based authentication
* Role-based access control
* Secure password hashing
* Protected API endpoints
* Server-side exam validation
* Exam session management
* Question randomization
* Audit logging
* Rate limiting
* Input validation
* Environment-based secret management

## 🎯 Project USP

The primary USP of the system is the integration of **adaptive assessment and trust-aware examination monitoring**.

The platform does not simply conduct an online examination. It continuously evaluates:

**Academic Performance + Examination Behavior**

and generates:

**Performance Insights + Explainable Integrity Risk Analysis**

This provides students with personalized learning feedback while giving faculty meaningful examination and integrity analytics.

## 🗺️ Development Roadmap

* [x] Project initialization
* [x] Next.js frontend setup
* [x] NestJS backend setup
* [ ] MongoDB integration
* [ ] Authentication and RBAC
* [ ] User management
* [ ] Question bank
* [ ] Examination management
* [ ] Online examination interface
* [ ] Automatic evaluation
* [ ] AI question generation
* [ ] AI-assisted proctoring
* [ ] Suspicious activity detection
* [ ] Explainable risk scoring
* [ ] Adaptive assessment
* [ ] AI performance analysis
* [ ] Faculty analytics dashboard
* [ ] Real-time monitoring
* [ ] Testing
* [ ] Deployment

## 👥 Project Team

| Name         | Roll Number     | Role        |
| ------------ | --------------- | ----------- |
| Krishna Garg | 202510116100130 | Team Member |
| Manish Tomar | 202510116100136 | Team Member |

**Section:** C

**Project Guide:** Dr. Vipin Kumar

## 📚 Sustainable Development Goals

This project aligns with:

* **SDG 4 – Quality Education**
* **SDG 9 – Industry, Innovation and Infrastructure**

## ⚠️ Disclaimer

AI-based proctoring is intended to provide **assistance and risk indicators**, not automatically make final accusations of academic misconduct. Faculty or authorized exam administrators should review significant incidents before taking disciplinary action.

## 📌 Project Status

🚧 **Currently under development**

The project is being developed as an MCA major project with a focus on secure online assessment, artificial intelligence, computer vision, and examination analytics.
