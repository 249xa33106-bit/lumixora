# Lumixora Internship Application Portal & Recruitment Management System

A complete, production-ready, secure, and professional recruitment system built for **Lumixora**. This platform allows prospective interns to apply through a multi-step form with mandatory profile photo upload, resume/document verification, and duplicate submission prevention, while providing authorized talent administrators with a complete dashboard to review candidates, inspect portfolios, update recruitment statuses, take internal notes, and export data.

---

## Key Features Implemented

### 1. Comprehensive Candidate Application Form (6 Steps)
- **Step 1: Personal Details & Profile Photo**
  - Full Name, Date of Birth, Gender (optional)
  - Validated Email Address, Mobile Number with country code, WhatsApp Number (with "Same as Mobile Number" shortcut)
  - Current City, State, Country
  - **Mandatory Profile Photo Upload**:
    - Supports JPG, JPEG, PNG, WEBP (Max 5 MB)
    - Instant client-side & server-side validation
    - Circular/Square crop live preview
    - Options to change or remove photo before submission
    - **Secure Storage**: Stored on disk storage; **never stored as Base64 in the database**
- **Step 2: Educational Details**
  - College / University Name
  - Degree (B.Tech, B.E., BCA, MCA, B.Sc, M.Sc, B.Des, etc.)
  - Major / Department / Branch
  - Year of Study (1st, 2nd, 3rd, 4th Year, Post-Grad, Recent Grad)
  - Semester (optional)
  - Expected / Actual Graduation Year (2024–2029)
  - College Location (City, State)
  - College Roll Number / Student ID (optional)
- **Step 3: Internship Preferences & Motivation**
  - **Strictly 8 Approved Lumixora Tracks**:
    1. AI & Machine Learning
    2. Full-Stack Web Development
    3. Software Testing & Quality Assurance
    4. UI/UX & Product Design
    5. Digital Marketing & Growth
    6. Content Creation & Social Media
    7. Business Development & College Partnerships
    8. Research & Product Strategy
  - Secondary Preferred Domain (optional)
  - "Why do you want to join Lumixora?" (validated min length)
  - "What do you expect to learn?" (validated min length)
  - Preferred Duration (1 Month, 2 Months, 3 Months, 6 Months)
  - Expected Joining Date (date picker)
  - Working Arrangement (Remote / Hybrid / On-site)
- **Step 4: Skills, Projects & Professional Profiles**
  - Interactive skill tags (Technical skills, Programming languages, Tools)
  - One-click track-tailored skill recommendations
  - Domain-specific fields (e.g., HuggingFace URL for AI, Figma links for UI/UX, Deployed URLs for Web)
  - Relevant Previous Experience
  - Completed Projects (up to 3 projects with Title, Description, Tech Stack, and Link)
  - Social Profiles: LinkedIn, GitHub, Portfolio Website, Instagram (highlighted for Content & Marketing)
- **Step 5: Resume & Supporting Documents**
  - Resume / CV (Mandatory, PDF format, Max 5MB)
  - Certificates (Optional, PDF format, Max 5MB)
  - Project Portfolio Document (Optional, PDF format, Max 5MB)
  - Additional Supporting Document (Optional, PDF format, Max 5MB)
  - Displays uploaded filenames and byte sizes with remove controls
- **Step 6: Review & Consent**
  - Full application summary with "Edit" shortcuts to previous steps
  - **Three Mandatory Checkboxes (not preselected)**:
    1. Confirmation of accurate information
    2. Consent to processing recruitment data
    3. Agreement to Internship Terms & Privacy Policy
  - Auto-save draft capability (persists progress in `localStorage`)

### 2. Application Submission & Tracking
- **Server Validation**: Full multipart upload validation on all mandatory inputs and file types.
- **Duplicate Prevention**: Rejects duplicate submissions with the same registered email address (returns HTTP 409 Conflict with existing Application ID).
- **Unique Application ID**: Generates an official `LMX-YYYY-XXXXX` format (e.g. `LMX-2026-48192`).
- **Confirmation Notification**: Automated email confirmation dispatched via Nodemailer.
- **Celebratory Success Screen**: Confetti celebration, copyable Application ID, next steps timeline, and printable summary receipt.
- **Status Tracker**: Dedicated tracking modal (`/track`) where candidates enter Application ID and Email to inspect their pipeline status (`Submitted` → `Under Review` → `Shortlisted` → `Interview Scheduled` → `Selected`).

### 3. Administrator Dashboard & Recruitment Suite
- **Secure Authentication**: Admin login with bcrypt password hashing and JWT sessions.
- **Live Metrics**: Total applicants, status distribution (Under Review, Shortlisted, Interview Scheduled, Selected, Rejected), domain breakdown.
- **Filtering & Search**:
  - Live search by Name, Email, Application ID, College
  - Filter by Domain (all 8 tracks)
  - Filter by Status (all 6 statuses)
  - Filter by Degree & Graduation Year
- **Applicants Table**: Shows photo thumbnails, contact details, applied track, university, and inline status dropdown.
- **Candidate Profile Drawer / Modal**:
  - High-res Profile Photo (served via authenticated route)
  - Complete personal, education, and internship preference details
  - Skills and project demo links
  - Securely preview or download Resume and Certificates
  - Change status with immediate save
  - **Internal Recruiter Notes**: Add confidential notes with timestamps and author signatures.
- **CSV Export**: RFC-4180 compliant CSV generator exporting full applicant details.

### 4. Security & Privacy Safeguards
- **Zero Sensitive Unnecessary Data**: No Aadhaar numbers, PAN numbers, or passwords collected from applicants.
- **Non-Public Storage**: Private upload directories (`server/storage/photos` and `server/storage/documents`) accessible only via authorized token endpoints.
- **No Base64 in Database**: Profile photos and resumes stored purely as file path references.
- **Privacy Policy & Terms**: Dedicated accessible modal detailing recruitment data retention (12-month policy, deletion rights).

---

## Default Administrator Credentials

| Field | Value |
|---|---|
| **Admin Email** | `admin@lumixora.com` |
| **Password** | `LumixoraAdmin2026!` |
| **Access** | Click **"Admin Portal"** in the top navigation |

---

## Installation & Running

### Requirements
- Node.js (v18+)
- npm (v9+)

### Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Run Tests**:
   ```bash
   npm test
   ```
   *Runs 19 automated tests validating API health, auth, multipart uploads, duplicate prevention, non-Base64 storage, and CSV export.*

3. **Start Development Server** (both Express API and Vite React frontend concurrently):
   ```bash
   npm run dev
   ```
   - Frontend runs at: `http://localhost:3000`
   - Backend API runs at: `http://localhost:5000`

4. **Production Build & Unified Run**:
   ```bash
   npm run build
   npm start
   ```
   - Serves unified SPA and API from `http://localhost:5000`

---

## Architecture

```
proud-lovelace/
├── server/
│   ├── config/config.js           # Configuration, paths, approved domains
│   ├── db/
│   │   ├── database.js            # Persistent JSON database with atomic writes
│   │   └── initStorage.js         # Initial sample storage asset generator
│   ├── middleware/
│   │   ├── auth.js                # JWT admin route authentication
│   │   └── upload.js              # Multer upload with 5MB & MIME validation
│   ├── controllers/
│   │   ├── applicationController.js # Application submission & tracking
│   │   ├── adminController.js     # Admin applicants, notes, status, CSV, secure file serving
│   │   └── authController.js      # Admin login & session verification
│   ├── services/
│   │   └── emailService.js        # Confirmation email dispatcher & outbox logger
│   ├── routes/
│   │   ├── applications.js        # Public candidate endpoints
│   │   ├── admin.js               # Protected recruiter endpoints
│   │   └── auth.js                # Admin auth endpoints
│   ├── storage/
│   │   ├── photos/                # Secure candidate photo vault
│   │   └── documents/             # Secure resume & certificate vault
│   ├── data/
│   │   └── database.json          # Applicant records and audit trails
│   ├── test.js                    # Comprehensive automated test suite
│   └── server.js                  # Express application entrypoint
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── steps/
│   │   │   │   ├── Step1Personal.jsx     # Photo upload with preview, contact info
│   │   │   │   ├── Step2Education.jsx    # University, degree, branch, grad year
│   │   │   │   ├── Step3Preferences.jsx  # 8 Domains, motivation, arrangement
│   │   │   │   ├── Step4Skills.jsx       # Skills chips, projects, social links
│   │   │   │   ├── Step5Documents.jsx    # Resume PDF, certificates
│   │   │   │   └── Step6Review.jsx       # Summary review, 3 mandatory checkboxes
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ApplicantDetailModal.jsx
│   │   │   │   └── MetricsCards.jsx
│   │   │   ├── ApplicationSuccess.jsx
│   │   │   ├── TrackStatusModal.jsx
│   │   │   ├── PrivacyModal.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── ApplicationContext.jsx   # Form state, draft auto-save, file handling
│   │   ├── constants/domains.js         # 8 approved domains specification
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
└── package.json
```
