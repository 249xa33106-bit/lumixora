# EduPulse — AI-Powered Test-to-Action Intelligence Platform

> **“Every test should lead to a better next step.”**

EduPulse is an EdTech SaaS platform designed for competitive-exam coaching centres, junior colleges, teachers, and academic coordinators (initiating in Kurnool, Andhra Pradesh, India). It bridges the critical divide between assessment marks and teacher actions, and measures whether those actions lead to observed student improvement.

---

## 🎯 Core Value Proposition

Educational institutions collect test marks every weekend but rely on manual spreadsheets and intuition to:
- Spot recurring concept weaknesses across cohorts.
- Group students for targeted revision problem sets.
- Schedule remedial doubt clinics and concept workshops.
- Evaluate whether interventions actually led to improved performance.

**EduPulse connects tests directly to teacher actions and verifies the outcome.**

---

## 🚀 Key Features

1. **Institution Dashboard**:
   - High-level KPIs: Enrolled students (32), tests conducted (15), overall average (56.9%), flagged topic gaps (5), pending teacher actions (5), and average observed post-intervention improvement (+19.6%).
   - Interactive charts comparing JEE, NEET, and EAPCET cohort benchmarks.
   - Real-time activity audit stream.

2. **Transparent Topic Gap Rules Engine**:
   - Calculates percentages and moving averages across assessments.
   - Distinguishes isolated single-test drops from **recurring patterns** (>= 2 assessments below threshold).
   - Flags insufficient sample sizes rather than generating unsupported claims.
   - Provides plain-English rationales: *"Batch-wide need: 10 of 12 students scored below 50% on Rotational Dynamics across 2 tests."*

3. **Teacher Action Centre (Hero Differentiator)**:
   - For every flagged gap, generates an actionable intervention card with test evidence, target student cohort, recommended strategy, faculty assignee, and due date.
   - Strategies: *Doubt Clearing Workshop*, *Targeted Practice Problem Sheet*, *1-on-1 Concept Clinic*, *Foundational Re-lecture*, *15-min Diagnostic Reassessment*.
   - Teachers can **Accept, Edit, Reject, Assign, and Complete** interventions with classroom notes.

4. **Intervention Effectiveness Tracking**:
   - Pairs baseline scores with subsequent follow-up assessment results.
   - Quantifies absolute score deltas (+18.5%, +9.2%, etc.).
   - Categorizes outcomes into *Marked Gain (>15%)*, *Moderate Gain (5-15%)*, *Stable (±5%)*, and *Needs Review (<-5%)*.
   - Strictly enforces non-causal integrity: *"Presents improvement as an observed score change, not guaranteed proof of causation."*

5. **Student Performance Profiles**:
   - 32 fictional students across 3 batches: `JEE-2026 Alpha`, `NEET-2026 Achievers`, and `EAPCET-2026 Zenith`.
   - Non-punitive terminology: Students are never labeled as "weak" or "failures" (uses *"needs additional practice"* or *"improvement opportunity"*).
   - Subject mastery bars, topic strengths, intervention logs, and test progression.

6. **Assessment CSV Import & Validation**:
   - Supports schema: `student_id, batch, test_id, subject, topic, score, maximum_score, test_date`.
   - Downloadable official template CSV (`edupulse_sample_test_results.csv`).
   - Pre-commit validation preview: row-by-row error detection, duplicate checks, and non-destructive import.

7. **Downloadable PDF & CSV Reports**:
   - **Student Diagnostic Dossier (PDF)**: Generated via ReportLab with Apex Academy Kurnool branding, subject breakdown, and coordinator signature line.
   - **Batch Performance Audit (PDF)**: Master summary for management.
   - **Intervention Efficacy Master (CSV)**: Export of paired pre/post intervention deltas.

8. **Settings & Rules Configuration**:
   - Configurable passing threshold (default: 50.0%).
   - Minimum tests required before flagging as recurring (default: 2).
   - Batch-wide alert ratio (default: 40%).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts.
- **Backend**: Python 3.11, FastAPI, SQLite (SQLAlchemy ORM), Pandas, ReportLab.
- **API**: RESTful endpoints with CORS and automated SQLite schema seeding.

---

## 🏁 Quick Start

### 1. Launch with One-Click Script (Windows)
Double-click `start_edupulse.bat` or run:
```powershell
.\start_edupulse.bat
```

### 2. Or Start Services Individually

**Backend (FastAPI)**:
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

**Frontend (Vite + React)**:
```powershell
cd frontend
npm run dev
```
Access the application at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Automated Test Verification

Run the comprehensive backend test suite:
```powershell
cd backend
python test_api.py
```
Outputs:
```text
[PASS] Health Check: OK
[PASS] Institution: Apex Academy of Sciences, Kurnool (AP)
[PASS] Batches: ['JEE-2026 Alpha', 'NEET-2026 Achievers', 'EAPCET-2026 Zenith']
[PASS] Students count: 32
[PASS] Topic Gaps detected: 5 (Top: Ionic Equilibrium, recurring: True)
[PASS] Teacher Actions count: 5
[PASS] Intervention evaluations: 10, Avg Delta: +19.6%
[PASS] Dashboard KPIs: 32 students, 15 tests, 56.9% avg score
[PASS] Student PDF Report generation: OK (3504 bytes)
[PASS] Batch Audit PDF Report generation: OK (2752 bytes)
[PASS] Downloadable sample CSV endpoint: OK
ALL BACKEND ENDPOINTS AND RULES TESTED AND PASSED SUCCESSFULLY! [100%]
```

Verify frontend build:
```powershell
cd frontend
npm run build
```
Outputs:
```text
✓ built in 409ms (Zero TypeScript errors)
```
