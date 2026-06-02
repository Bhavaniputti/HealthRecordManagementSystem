# 🏥 HealthRecordManagementSystem – Smart Health Record Manager

AI-powered Smart Health Record Management System that helps users securely upload, manage, analyze, chat with, and share medical reports.

The platform simplifies healthcare document management by providing intelligent report analysis, AI-powered explanations, secure sharing, and centralized health record storage.

---

# 🚀 Features

## 📄 Medical Report Management
- Upload medical reports (PDF/Image)
- Store reports securely
- Categorize reports:
  - Lab
  - Radiology
  - Prescription
  - Consultation
  - Discharge
  - General

---

## 🤖 AI Report Analysis

Generate AI-powered analysis for uploaded reports:

- Report Summary
- Key Findings
- Medications Detection
- Abnormal Values Detection
- Recommendations
- Patient Friendly Explanation
- Report Type Classification

Powered using:

- Groq API
- Llama Models

---

## 💬 AI Medical Chat

Users can:

- Select specific report
- Ask questions

Example:

```txt
Explain this blood report
```

```txt
What does TSH value mean?
```

```txt
Is this report abnormal?
```

AI answers using selected report context.

---

## 📊 Smart Dashboard

Dynamic dashboard includes:

- Total Reports
- AI Analyses
- Report Categories
- Weekly Upload Trends
- AI Recommendations
- Abnormal Reports Summary

---

## 🔒 Secure Report Sharing

Users can securely share reports.

Features:

- Generate private share link
- Password protection
- Expiry time selection
- Limited attempts
- Auto-lock after failed attempts

Flow:

```txt
Create Share Link
↓
Set Password
↓
Set Expiry
↓
Copy Link
↓
Secure Access
```

---

## 👤 User Profile

Users can:

- Update profile
- Manage personal information
- Track uploaded reports

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React.js
- Tailwind CSS
- Framer Motion
- Recharts

---

## Backend

- Next.js API Routes
- Supabase

---

## Database

- Supabase Database

---

## Authentication

- Supabase Auth

---

## AI

- Groq API
- Llama 3

---

## Storage

- Supabase Storage

---

# 📂 Project Structure

```txt
app/
│
├── dashboard/
├── reports/
├── chat/
├── sharing/
├── profile/
├── api/
│
components/
│
lib/
│
store/
│
supabase/
```

---

# ⚙ Installation

Clone repository:

```bash
git clone YOUR_REPO_LINK
```

Install packages:

```bash
npm install
```

Create environment:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_GROQ_API_KEY=
```

Run:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# 🧠 AI Workflow

```txt
Upload Report
↓

Extract Text

↓

Generate Analysis

↓

Store Analysis

↓

Chat With AI

↓

Secure Share
```

---

# 🔐 Security Features

- Authentication
- Row Level Security
- Secure Sharing
- Password Protected Links
- Expiring Access
- Access Attempt Limits

---

# 📈 Future Scope

- OCR Improvements
- Doctor Collaboration
- Appointment Booking
- Health Insights
- Voice Assistant
- Multi-language Support

---

# 👩‍💻 Developed By

Bhavani

---

# ⭐ HealX

AI Powered Healthcare Record Management Platform
