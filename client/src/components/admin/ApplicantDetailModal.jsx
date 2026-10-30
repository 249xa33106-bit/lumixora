import React, { useState } from 'react';
import { X, FileText, Download, ExternalLink, Calendar, MapPin, Mail, Phone, Building2, GraduationCap, Compass, Code, Send, CheckCircle2, AlertCircle, Clock, Globe, ShieldCheck } from 'lucide-react';
import { LinkedinIcon, GithubIcon, InstagramIcon } from '../SocialIcons';

const STATUS_OPTIONS = [
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected'
];

export default function ApplicantDetailModal({ applicant, token, onClose, onStatusUpdated, onNoteAdded }) {
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(applicant?.status || 'Submitted');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!applicant) return null;

  const photoFilename = applicant.personal?.photo?.filename;
  const photoUrl = photoFilename
    ? `/api/admin/files/photo/${photoFilename}?token=${token}`
    : null;

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/applicants/${applicant.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      setCurrentStatus(newStatus);
      setStatusMessage({ type: 'success', text: `Status updated to ${newStatus}` });
      if (onStatusUpdated) onStatusUpdated(applicant.id, newStatus);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/admin/applicants/${applicant.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: newNote.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save internal note');

      if (!applicant.internalNotes) applicant.internalNotes = [];
      applicant.internalNotes.unshift(data.note);
      setNewNote('');
      if (onNoteAdded) onNoteAdded(applicant.id, data.note);
    } catch (err) {
      alert('Error saving note: ' + err.message);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const getDocDownloadUrl = (filename, download = false) => {
    return `/api/admin/files/doc/${filename}?token=${token}${download ? '&download=true' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={applicant.personal?.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                {applicant.personal?.fullName?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{applicant.personal?.fullName}</h2>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {applicant.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Applied for <strong className="text-indigo-600">{applicant.preferences?.preferredDomain}</strong> • {new Date(applicant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Status Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Status:</span>
              <select
                value={currentStatus}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-indigo-300 text-xs font-bold bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-xs"
              >
                {STATUS_OPTIONS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className={`px-6 py-2 text-xs font-medium ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Personal & Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Personal & Contact Information</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Email Address</span>
                <a href={`mailto:${applicant.personal?.email}`} className="font-semibold text-indigo-600 hover:underline">
                  {applicant.personal?.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Mobile Number</span>
                <span className="font-semibold text-slate-800">{applicant.personal?.mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">WhatsApp</span>
                <span className="font-semibold text-slate-800">{applicant.personal?.whatsappNumber || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date of Birth / Gender</span>
                <span className="font-semibold text-slate-800">{applicant.personal?.dob} ({applicant.personal?.gender || 'N/A'})</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block font-medium">Current Location</span>
                <span className="font-semibold text-slate-800">
                  {[applicant.personal?.city, applicant.personal?.state, applicant.personal?.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Education Profile */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Educational Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="col-span-2">
                <span className="text-slate-400 block font-medium">College / University</span>
                <span className="font-semibold text-slate-900">{applicant.education?.collegeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Campus Location</span>
                <span className="font-semibold text-slate-800">{applicant.education?.collegeLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Roll / Student ID</span>
                <span className="font-semibold text-slate-800">{applicant.education?.rollNumber || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Degree & Major</span>
                <span className="font-semibold text-slate-800">{applicant.education?.degree} - {applicant.education?.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Current Year</span>
                <span className="font-semibold text-slate-800">{applicant.education?.currentYear} {applicant.education?.currentSemester && `(${applicant.education.currentSemester})`}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Graduation Year</span>
                <span className="font-semibold text-slate-800">{applicant.education?.graduationYear}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Internship Preferences & Motivation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Internship Preferences & Motivation
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Preferred Track</span>
                  <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100 inline-block">
                    {applicant.preferences?.preferredDomain}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Secondary Choice</span>
                  <span className="font-semibold text-slate-800">{applicant.preferences?.secondaryDomain || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Arrangement & Duration</span>
                  <span className="font-semibold text-slate-800">{applicant.preferences?.workingArrangement} • {applicant.preferences?.duration}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Why join Lumixora?</span>
                <p className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 italic">
                  "{applicant.preferences?.whyJoin}"
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">What do you expect to learn?</span>
                <p className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 italic">
                  "{applicant.preferences?.expectationsToLearn}"
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Skills, Projects & Social */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Skills, Past Work & Social Portfolios
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div>
                <span className="text-slate-400 block font-medium mb-1">Technical Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {applicant.skills?.technicalSkills?.map(s => (
                    <span key={s} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-semibold border border-indigo-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {applicant.skills?.programmingLanguages?.length > 0 && (
                <div>
                  <span className="text-slate-400 block font-medium mb-1">Programming Languages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.skills.programmingLanguages.map(l => (
                      <span key={l} className="bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {applicant.skills?.projects?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block font-medium">Completed Projects:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {applicant.skills.projects.map((proj, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900">{proj.title}</strong>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px]">{proj.description}</p>
                        {proj.techStack && <span className="text-[10px] text-slate-400 block">Stack: {proj.techStack}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4">
                {applicant.social?.linkedin && (
                  <a href={applicant.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-blue-600 font-semibold hover:underline">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {applicant.social?.github && (
                  <a href={applicant.social.github} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-slate-800 font-semibold hover:underline">
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {applicant.social?.portfolio && (
                  <a href={applicant.social.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-indigo-600 font-semibold hover:underline">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio Website</span>
                  </a>
                )}
                {applicant.social?.instagram && (
                  <a href={applicant.social.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-pink-600 font-semibold hover:underline">
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Instagram Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Documents & Secure Download Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verified Candidate Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Resume */}
              {applicant.documents?.resume && (
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-900 block truncate max-w-[180px]">
                        {applicant.documents.resume.originalName || applicant.documents.resume.filename}
                      </strong>
                      <span className="text-[10px] text-slate-400">Official Resume PDF</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <a
                      href={getDocDownloadUrl(applicant.documents.resume.filename, false)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                      title="Preview in Tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={getDocDownloadUrl(applicant.documents.resume.filename, true)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Certificates */}
              {applicant.documents?.certificates && (
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-900 block truncate max-w-[180px]">
                        {applicant.documents.certificates.originalName || applicant.documents.certificates.filename}
                      </strong>
                      <span className="text-[10px] text-slate-400">Certificates & Awards</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <a
                      href={getDocDownloadUrl(applicant.documents.certificates.filename, false)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                      title="Preview in Tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={getDocDownloadUrl(applicant.documents.certificates.filename, true)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Internal Recruiter Notes */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Internal Recruiter Notes & Evaluation Logs
            </h3>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add confidential evaluation feedback or interview scheduling remarks..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmittingNote || !newNote.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2 mt-2">
              {applicant.internalNotes && applicant.internalNotes.length > 0 ? (
                applicant.internalNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">{note.author || 'Recruiter'}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{note.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No internal recruiter notes added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
