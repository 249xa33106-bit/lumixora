# Lumixora Workspace Architectural Rules & Guidelines

## 1. Subdomain Strict Isolation Rule (Zero Interference Policy)
- **Original Platform Boundary (`https://lumixora.in/`)**:
  - The main domain platform (`Dashboard`, `NotesPlatform`, `BoloClassPortal`, `LearningHub`, `HackathonPortal`, `CoursesPortal`, `CommunityPortal`, `LumixoraPlacementCommander`, `LumixoraTechPulse`, `MainLayout`, etc.) is **strictly protected**.
  - **NEVER** modify, alter, override, or inject subdomain-specific code/logic/UI into the main domain platform (`lumixora.in`) without the user's explicit, direct command.
  - Subdomains such as `gprec.lumixora.in` and `tpo.lumixora.in` must remain completely isolated. Changes made to institutional subdomains (e.g., GPREC Placement Suite, TPO Command Suite) must be confined strictly to their dedicated files and route guards.

## 2. Dedicated Components Separation
- **Main Domain Placement & Radar**:
  - `src/pages/LumixoraPlacementCommander.jsx` (Original Lumixora Placement Commander)
  - `src/pages/LumixoraTechPulse.jsx` (Original Lumixora TechPulse)
- **GPREC Subdomain (`gprec.lumixora.in`)**:
  - `src/pages/AiPlacementCommander.jsx` (Dedicated GPREC Placement Suite)
  - `src/pages/TechPulsePortal.jsx` (GPREC TechPulse Portal)
- **TPO Subdomain (`tpo.lumixora.in`)**:
  - `src/pages/GprecTpoPortal.jsx`
  - `src/pages/StudentPlacementDatabase.jsx`
  - `src/pages/TpoPortalLanding.jsx`

## 3. Subdomain Detection Rule
- Subdomain detection in `src/utils/placementSubdomain.js` must be strictly based on **hostname, URL path, query params, or specific hash**.
- **Never** use user email domain or localStorage user data to determine or hijack the current subdomain mode.

## 4. Deployment Protocol
- Cloudflare Pages project: `lumixora`
- Always verify production build with `npm run build` (zero errors).
- Deploy via `npx wrangler pages deploy dist --project-name lumixora`.
- Stage, commit, and push changes to both `origin main` and `origin backup-ui-changes`.
