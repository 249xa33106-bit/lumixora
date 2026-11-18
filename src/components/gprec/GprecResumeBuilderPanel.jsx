import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Plus, Trash2, Sparkles, CheckCircle2, ShieldCheck,
  User, GraduationCap, Code, Briefcase, Award, ArrowRight
} from 'lucide-react';

export default function GprecResumeBuilderPanel({ user, onSendToAudit, addToast }) {
  const storageKey = `gprec_ats_resume_draft_${user?.id || user?.email || 'guest'}`;

  const defaultDraft = {
    fullName: user?.name || user?.displayName || 'GPREC Student',
    email: user?.email || 'student@gprec.ac.in',
    phone: '+91 98765 43210',
    location: 'Kurnool, Andhra Pradesh',
    linkedin: 'linkedin.com/in/gprec-scholar',
    github: 'github.com/gprec-scholar',
    summary: 'Final-year B.Tech engineering undergraduate at G. Pulla Reddy Engineering College (Autonomous) skilled in Data Structures, Full-Stack Web Development, and scalable cloud applications.',
    college: 'G. Pulla Reddy Engineering College (Autonomous), Kurnool',
    degree: `B.Tech in ${user?.branch || user?.department || 'Computer Science & Engineering'}`,
    cgpa: user?.cgpa ? String(user.cgpa) : '8.6 / 10.0',
    gradYear: '2023 – 2027',
    skills: 'Java, Python, JavaScript, TypeScript, React.js, Node.js, SQL, PostgreSQL, Git, Docker, DSA, OS, DBMS, Computer Networks',
    projects: [
      {
        id: 1,
        title: 'Distributed Campus Placement Analytics Platform',
        tech: 'React, Node.js, PostgreSQL, Redis',
        bullets: 'Built real-time placement telemetry dashboard serving 1,200+ students with sub-120ms API latency.\nEngineered automated ATS resume scoring and coding assessment tracker increasing mock readiness by 34%.'
      }
    ],
    experience: [
      {
        id: 1,
        role: 'Software Engineering Intern',
        org: 'Tech Innovation Lab',
        period: 'May 2026 – Jul 2026',
        bullets: 'Developed REST APIs and automated unit test suites reducing regression bugs by 28%.'
      }
    ],
    certifications: 'AWS Cloud Practitioner • NPTEL Data Structures & Algorithms (Elite Gold) • 250+ LeetCode Problems Solved'
  };

  const [draft, setDraft] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.fullName) return { ...defaultDraft, ...parsed };
      }
    } catch (e) {}
    return defaultDraft;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch (e) {}
  }, [draft, storageKey]);

  const updateField = (key, val) => setDraft(prev => ({ ...prev, [key]: val }));

  const addProject = () => {
    setDraft(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now(), title: 'New Technical Project', tech: 'React, Python, SQL', bullets: 'Designed and deployed scalable architecture with measurable performance gains.' }
      ]
    }));
  };

  const updateProject = (id, key, val) => {
    setDraft(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, [key]: val } : p))
    }));
  };

  const removeProject = (id) => {
    setDraft(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addExperience = () => {
    setDraft(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), role: 'Engineering Intern', org: 'Company Name', period: 'Jun 2026 – Aug 2026', bullets: 'Implemented core product features and collaborated in agile sprints.' }
      ]
    }));
  };

  const updateExperience = (id, key, val) => {
    setDraft(prev => ({
      ...prev,
      experience: prev.experience.map(ex => (ex.id === id ? { ...ex, [key]: val } : ex))
    }));
  };

  const removeExperience = (id) => {
    setDraft(prev => ({ ...prev, experience: prev.experience.filter(ex => ex.id !== id) }));
  };

  const buildPlainTextResume = () => {
    const projText = draft.projects
      .map(p => `- ${p.title} (${p.tech})\n  ${p.bullets.replace(/\n/g, '\n  ')}`)
      .join('\n');
    const expText = draft.experience
      .map(e => `- ${e.role} | ${e.org} (${e.period})\n  ${e.bullets.replace(/\n/g, '\n  ')}`)
      .join('\n');
    return `${draft.fullName}
${draft.email} | ${draft.phone} | ${draft.location} | ${draft.linkedin} | ${draft.github}

SUMMARY
${draft.summary}

EDUCATION
${draft.college}
${draft.degree} | CGPA: ${draft.cgpa} | ${draft.gradYear}

TECHNICAL SKILLS
${draft.skills}

PROJECTS
${projText}

EXPERIENCE
${expText}

CERTIFICATIONS & ACHIEVEMENTS
${draft.certifications}`;
  };

  const handlePrintPdf = () => {
    const win = window.open('', '_blank', 'width=900,height=1050');
    if (!win) {
      if (addToast) addToast({ message: 'Please allow popups to export PDF.', type: 'warning' });
      return;
    }
    const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const projHtml = draft.projects.map(p => `
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:13px;">
          <span>${esc(p.title)}</span>
          <span style="font-weight:600;color:#475569;font-size:12px;">${esc(p.tech)}</span>
        </div>
        <ul style="margin:3px 0 0 18px;padding:0;font-size:12px;line-height:1.45;">
          ${p.bullets.split('\n').filter(Boolean).map(b => `<li>${esc(b.replace(/^[-•]\s*/, ''))}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const expHtml = draft.experience.map(e => `
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:13px;">
          <span>${esc(e.role)} — ${esc(e.org)}</span>
          <span style="font-weight:600;color:#475569;font-size:12px;">${esc(e.period)}</span>
        </div>
        <ul style="margin:3px 0 0 18px;padding:0;font-size:12px;line-height:1.45;">
          ${e.bullets.split('\n').filter(Boolean).map(b => `<li>${esc(b.replace(/^[-•]\s*/, ''))}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    win.document.write(`<!doctype html><html><head><title>${esc(draft.fullName)} - ATS Resume</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; max-width: 780px; margin: 24px auto; padding: 0 24px; }
        h1 { margin: 0; font-size: 24px; letter-spacing: -0.02em; }
        .contact { font-size: 11.5px; color: #334155; margin-top: 4px; }
        h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1.5px solid #0f172a; padding-bottom: 3px; margin: 14px 0 6px; color: #0f172a; }
        p { margin: 0; font-size: 12px; line-height: 1.45; }
        @media print { body { margin: 0; padding: 14px; } }
      </style></head><body>
      <h1>${esc(draft.fullName)}</h1>
      <div class="contact">${esc(draft.email)} &nbsp;|&nbsp; ${esc(draft.phone)} &nbsp;|&nbsp; ${esc(draft.location)} &nbsp;|&nbsp; ${esc(draft.linkedin)} &nbsp;|&nbsp; ${esc(draft.github)}</div>
      <h2>Professional Summary</h2>
      <p>${esc(draft.summary)}</p>
      <h2>Education</h2>
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:13px;">
        <span>${esc(draft.college)}</span>
        <span style="font-size:12px;color:#475569;">${esc(draft.gradYear)}</span>
      </div>
      <div style="font-size:12px;color:#334155;margin-top:2px;">${esc(draft.degree)} &nbsp;•&nbsp; <strong>CGPA: ${esc(draft.cgpa)}</strong></div>
      <h2>Technical Skills</h2>
      <p>${esc(draft.skills)}</p>
      <h2>Projects</h2>
      ${projHtml}
      ${draft.experience.length > 0 ? `<h2>Internships & Experience</h2>${expHtml}` : ''}
      <h2>Certifications & Achievements</h2>
      <p>${esc(draft.certifications)}</p>
      <script>window.onload = function(){ window.print(); };</script>
      </body></html>`);
    win.document.close();
    if (addToast) addToast({ message: 'ATS Resume Print / PDF export opened!', type: 'success' });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left: Editor Form */}
      <div className="xl:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-5 max-h-[820px] overflow-y-auto">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">GPREC ATS Resume Builder</h3>
            <p className="text-[11px] text-slate-500">Auto-saved locally • Clean single-column FAANG & TCS ATS format</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const txt = buildPlainTextResume();
                if (onSendToAudit) onSendToAudit(txt);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI ATS Audit</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-blue-600" /> Personal & Links</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input value={draft.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Full Name" className="p-2.5 rounded-xl border border-slate-200" />
            <input value={draft.email} onChange={e => updateField('email', e.target.value)} placeholder="Email" className="p-2.5 rounded-xl border border-slate-200" />
            <input value={draft.phone} onChange={e => updateField('phone', e.target.value)} placeholder="Phone" className="p-2.5 rounded-xl border border-slate-200" />
            <input value={draft.location} onChange={e => updateField('location', e.target.value)} placeholder="City, State" className="p-2.5 rounded-xl border border-slate-200" />
            <input value={draft.linkedin} onChange={e => updateField('linkedin', e.target.value)} placeholder="LinkedIn URL" className="p-2.5 rounded-xl border border-slate-200" />
            <input value={draft.github} onChange={e => updateField('github', e.target.value)} placeholder="GitHub URL" className="p-2.5 rounded-xl border border-slate-200" />
          </div>
          <textarea rows={2} value={draft.summary} onChange={e => updateField('summary', e.target.value)} placeholder="2-line Career Summary" className="w-full p-2.5 rounded-xl border border-slate-200" />
        </div>

        {/* Education */}
        <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
          <div className="font-bold text-slate-800 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Education</div>
          <input value={draft.college} onChange={e => updateField('college', e.target.value)} placeholder="Institution Name" className="w-full p-2.5 rounded-xl border border-slate-200" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input value={draft.degree} onChange={e => updateField('degree', e.target.value)} placeholder="Degree & Branch" className="sm:col-span-1 p-2.5 rounded-xl border border-slate-200" />
            <input value={draft.cgpa} onChange={e => updateField('cgpa', e.target.value)} placeholder="CGPA" className="p-2.5 rounded-xl border border-slate-200" />
            <input value={draft.gradYear} onChange={e => updateField('gradYear', e.target.value)} placeholder="Batch Years" className="p-2.5 rounded-xl border border-slate-200" />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
          <div className="font-bold text-slate-800 flex items-center gap-1.5"><Code className="w-3.5 h-3.5 text-emerald-600" /> Technical Skills</div>
          <textarea rows={2} value={draft.skills} onChange={e => updateField('skills', e.target.value)} placeholder="Comma-separated ATS keywords..." className="w-full p-2.5 rounded-xl border border-slate-200" />
        </div>

        {/* Projects */}
        <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Key Projects</span>
            <button type="button" onClick={addProject} className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>
          {draft.projects.map(p => (
            <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <input value={p.title} onChange={e => updateProject(p.id, 'title', e.target.value)} placeholder="Project Title" className="flex-1 p-2 rounded-lg border border-slate-200 bg-white font-semibold" />
                <button type="button" onClick={() => removeProject(p.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input value={p.tech} onChange={e => updateProject(p.id, 'tech', e.target.value)} placeholder="Tech Stack" className="w-full p-2 rounded-lg border border-slate-200 bg-white" />
              <textarea rows={2} value={p.bullets} onChange={e => updateProject(p.id, 'bullets', e.target.value)} placeholder="One bullet point per line with metrics..." className="w-full p-2 rounded-lg border border-slate-200 bg-white" />
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Internships & Experience</span>
            <button type="button" onClick={addExperience} className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Experience
            </button>
          </div>
          {draft.experience.map(ex => (
            <div key={ex.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <input value={ex.role} onChange={e => updateExperience(ex.id, 'role', e.target.value)} placeholder="Role" className="flex-1 p-2 rounded-lg border border-slate-200 bg-white font-semibold" />
                <button type="button" onClick={() => removeExperience(ex.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={ex.org} onChange={e => updateExperience(ex.id, 'org', e.target.value)} placeholder="Organization" className="p-2 rounded-lg border border-slate-200 bg-white" />
                <input value={ex.period} onChange={e => updateExperience(ex.id, 'period', e.target.value)} placeholder="Duration" className="p-2 rounded-lg border border-slate-200 bg-white" />
              </div>
              <textarea rows={2} value={ex.bullets} onChange={e => updateExperience(ex.id, 'bullets', e.target.value)} placeholder="Impact bullets..." className="w-full p-2 rounded-lg border border-slate-200 bg-white" />
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
          <div className="font-bold text-slate-800 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-500" /> Certifications & Achievements</div>
          <textarea rows={2} value={draft.certifications} onChange={e => updateField('certifications', e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200" />
        </div>
      </div>

      {/* Right: Live ATS Paper Preview */}
      <div className="xl:col-span-6 bg-slate-100 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Live Single-Column ATS Paper Preview</span>
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            100% Machine-Readable
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8 text-slate-900 space-y-4 min-h-[700px]">
          <div className="border-b-2 border-slate-900 pb-3">
            <h1 className="text-xl font-black tracking-tight text-slate-950">{draft.fullName}</h1>
            <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
              <span>{draft.email}</span>
              <span>•</span>
              <span>{draft.phone}</span>
              <span>•</span>
              <span>{draft.location}</span>
              {draft.linkedin && <><span>•</span><span>{draft.linkedin}</span></>}
              {draft.github && <><span>•</span><span>{draft.github}</span></>}
            </div>
          </div>

          {draft.summary && (
            <div>
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Summary
              </h2>
              <p className="text-[11.5px] text-slate-700 leading-relaxed">{draft.summary}</p>
            </div>
          )}

          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Education
            </h2>
            <div className="flex items-center justify-between text-xs font-bold">
              <span>{draft.college}</span>
              <span className="text-slate-500 font-semibold">{draft.gradYear}</span>
            </div>
            <div className="text-[11.5px] text-slate-700 mt-0.5">
              {draft.degree} • <span className="font-bold">CGPA: {draft.cgpa}</span>
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Technical Skills
            </h2>
            <p className="text-[11.5px] text-slate-700 leading-relaxed">{draft.skills}</p>
          </div>

          {draft.projects.length > 0 && (
            <div>
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Projects
              </h2>
              <div className="space-y-2.5">
                {draft.projects.map(p => (
                  <div key={p.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{p.title}</span>
                      <span className="text-[10.5px] font-semibold text-slate-500">{p.tech}</span>
                    </div>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-slate-700">
                      {p.bullets.split('\n').filter(Boolean).map((b, idx) => (
                        <li key={idx}>{b.replace(/^[-•]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.experience.length > 0 && (
            <div>
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Experience & Internships
              </h2>
              <div className="space-y-2.5">
                {draft.experience.map(ex => (
                  <div key={ex.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{ex.role} — {ex.org}</span>
                      <span className="text-[10.5px] font-semibold text-slate-500">{ex.period}</span>
                    </div>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-slate-700">
                      {ex.bullets.split('\n').filter(Boolean).map((b, idx) => (
                        <li key={idx}>{b.replace(/^[-•]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {draft.certifications && (
            <div>
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Certifications & Achievements
              </h2>
              <p className="text-[11.5px] text-slate-700 leading-relaxed">{draft.certifications}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
