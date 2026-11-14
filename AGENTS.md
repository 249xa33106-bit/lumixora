# Lumixora Workspace Architectural Rules & Guidelines — LOCKED SYSTEM POLICY

## 1. Universal Zero-Interference Rule (Across ALL Portals, Components & Code)
- **Original Main Platform (`https://lumixora.in/`) is PERMANENTLY LOCKED & PROTECTED**:
  - This policy applies to **ALL** pages, portals, components, modules, layouts, styles, data, assets, and logic across the entire platform:
    - `Dashboard`
    - `NotesPlatform` & all subject/curriculum viewers
    - `BoloClassPortal` / AI Classrooms
    - `LearningHub` & Video Lectures
    - `HackathonPortal` & Contests
    - `CoursesPortal` & Diplomas
    - `CommunityPortal` & Student Squads
    - `LumixoraPlacementCommander` (Original Placement Suite)
    - `LumixoraTechPulse` (Original TechPulse Radar)
    - `AiMockInterviewRoom`, `CodingPractice`, `CodeEditorPage`
    - `TaskManager`, `DoubtSolving`, `SimulationPortal`, `MyAcademics`
    - `ProofOfSkillCertificates`, `ResumeCreator`, `InternshipPortal`
    - `MainLayout`, top navigation, sidebar, 3D emblems, themes, badges, modals, and tour guides.
  - **ABSOLUTE LOCK**: When working on, modifying, styling, debugging, or adding features to ANY subdomain (including `gprec.lumixora.in`, `tpo.lumixora.in`, or any other current/future subdomain), you are **STRICTLY FORBIDDEN** from modifying, overriding, altering, or injecting code into any file, portal, or behavior of `lumixora.in` without an explicit, unambiguous, direct command from the user specifically instructing a change to `lumixora.in`.

## 2. Strict Subdomain Isolation & Dedicated Components
- **Main Domain (`https://lumixora.in/`)**:
  - `src/pages/LumixoraPlacementCommander.jsx` (Original Lumixora Placement Commander)
  - `src/pages/LumixoraTechPulse.jsx` (Original Lumixora TechPulse)
  - `src/layouts/MainLayout.jsx` (Full original Lumixora layout with all standard portals)
- **GPREC Subdomain (`https://gprec.lumixora.in/`)**:
  - Confined strictly to dedicated files: `src/pages/AiPlacementCommander.jsx`, `src/pages/TechPulsePortal.jsx`, `src/components/GprecPlacementLanding.jsx`, `src/components/GprecPlacementLoginModal.jsx`.
- **TPO Subdomain (`https://tpo.lumixora.in/`)**:
  - Confined strictly to dedicated files: `src/pages/GprecTpoPortal.jsx`, `src/pages/StudentPlacementDatabase.jsx`, `src/pages/TpoPortalLanding.jsx`.

## 3. Subdomain Detection Guard
- Detection in `src/utils/placementSubdomain.js` must be strictly based on **hostname, URL path, query params, or specific hash**.
- **NEVER** use user email domain (`@gprec.ac.in`) or localStorage data to determine, alter, or hijack subdomain routing or layout modes.

## 4. Verification & Deployment Protocol
- Cloudflare Pages project: `lumixora`
- Verify production build with `npm run build` (zero errors).
- Deploy via `npx wrangler pages deploy dist --project-name lumixora`.
- Stage, commit, and push all changes to both `origin main` and `origin backup-ui-changes`.
