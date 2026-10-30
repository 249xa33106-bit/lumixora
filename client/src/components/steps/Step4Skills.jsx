import React, { useState } from 'react';
import { Plus, X, Globe, ExternalLink, Code2, Cpu, Wrench } from 'lucide-react';
import { LinkedinIcon, GithubIcon, InstagramIcon } from '../SocialIcons';
import { useApplication } from '../../context/ApplicationContext';
import { DOMAINS } from '../../constants/domains';

export default function Step4Skills() {
  const {
    formData,
    errors,
    updateSkills,
    updateDomainSpecific,
    updateSocial,
    nextStep,
    prevStep
  } = useApplication();

  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newTool, setNewTool] = useState('');

  const currentDomainConfig = DOMAINS.find(d => d.id === formData.preferences.preferredDomain) || DOMAINS[0];

  // Chip management
  const addSkill = (skill) => {
    const val = (skill || newSkill).trim();
    if (val && !formData.skills.technicalSkills.includes(val)) {
      updateSkills('technicalSkills', [...formData.skills.technicalSkills, val]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    updateSkills('technicalSkills', formData.skills.technicalSkills.filter(s => s !== skill));
  };

  const addLang = () => {
    const val = newLang.trim();
    if (val && !formData.skills.programmingLanguages.includes(val)) {
      updateSkills('programmingLanguages', [...formData.skills.programmingLanguages, val]);
      setNewLang('');
    }
  };

  const removeLang = (lang) => {
    updateSkills('programmingLanguages', formData.skills.programmingLanguages.filter(l => l !== lang));
  };

  const addTool = (tool) => {
    const val = (tool || newTool).trim();
    if (val && !formData.skills.toolsAndTech.includes(val)) {
      updateSkills('toolsAndTech', [...formData.skills.toolsAndTech, val]);
      setNewTool('');
    }
  };

  const removeTool = (tool) => {
    updateSkills('toolsAndTech', formData.skills.toolsAndTech.filter(t => t !== tool));
  };

  // Projects management
  const updateProject = (index, field, value) => {
    const updated = [...formData.skills.projects];
    updated[index] = { ...updated[index], [field]: value };
    updateSkills('projects', updated);
  };

  const addProject = () => {
    if (formData.skills.projects.length < 3) {
      updateSkills('projects', [
        ...formData.skills.projects,
        { title: '', description: '', techStack: '', link: '' }
      ]);
    }
  };

  const removeProject = (index) => {
    if (formData.skills.projects.length > 1) {
      updateSkills('projects', formData.skills.projects.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Skills, Projects & Professional Links
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Showcase your technical capabilities, past works, and online portfolio presence.
        </p>
      </div>

      {/* Domain-Tailored Skills Suggestions Banner */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-indigo-900 block">
            Recommended Skills for: {currentDomainConfig.title}
          </span>
          <p className="text-xs text-indigo-700 mt-0.5">
            Click any recommended tag below to quickly add it to your skill set.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currentDomainConfig.popularSkills.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              className="text-[11px] font-semibold bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 px-2 py-1 rounded-lg transition-all cursor-pointer"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Technical Skills Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Technical Skills & Competencies <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            placeholder="Type a skill (e.g. Next.js, PyTorch, Figma) and press Enter or Add"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="button"
            onClick={() => addSkill()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            Add
          </button>
        </div>
        {errors.technicalSkills && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.technicalSkills}</p>}

        <div className="flex flex-wrap gap-2 mt-2.5">
          {formData.skills.technicalSkills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-indigo-400 hover:text-indigo-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Programming Languages */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Programming Languages
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLang(); } }}
            placeholder="e.g. Python, TypeScript, Java, C++"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="button"
            onClick={addLang}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2.5">
          {formData.skills.programmingLanguages.map(lang => (
            <span
              key={lang}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
            >
              <span>{lang}</span>
              <button
                type="button"
                onClick={() => removeLang(lang)}
                className="text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tools and Technologies */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Tools, Frameworks & Platforms
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool(); } }}
            placeholder="e.g. Docker, Git, Linux, Postman, AWS"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="button"
            onClick={() => addTool()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2.5">
          {formData.skills.toolsAndTech.map(tool => (
            <span
              key={tool}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
            >
              <span>{tool}</span>
              <button
                type="button"
                onClick={() => removeTool(tool)}
                className="text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Domain-Specific Fields */}
      {currentDomainConfig.domainFields && currentDomainConfig.domainFields.length > 0 && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {currentDomainConfig.title} Specialization Fields
          </h3>
          {currentDomainConfig.domainFields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                value={formData.skills.domainSpecific?.[field.key] || ''}
                onChange={(e) => updateDomainSpecific(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          ))}
        </div>
      )}

      {/* Relevant Previous Experience (Optional) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Relevant Previous Experience <span className="text-slate-400 font-normal">(Optional internships, hackathons, freelance work)</span>
        </label>
        <textarea
          rows={3}
          value={formData.skills.experience}
          onChange={(e) => updateSkills('experience', e.target.value)}
          placeholder="Briefly describe any past internships, club leadership, or freelance client projects..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Completed Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Highlighted Projects Completed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlight up to 3 of your most impressive technical or design projects.
            </p>
          </div>
          {formData.skills.projects.length < 3 && (
            <button
              type="button"
              onClick={addProject}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {formData.skills.projects.map((proj, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                {formData.skills.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(idx, 'title', e.target.value)}
                    placeholder="e.g. Distributed Task Queue"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tech Stack Used</label>
                  <input
                    type="text"
                    value={proj.techStack}
                    onChange={(e) => updateProject(idx, 'techStack', e.target.value)}
                    placeholder="e.g. Go, Redis, Docker, React"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Description & Outcome</label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    placeholder="Problem solved, key architectural decisions, and measured performance impact..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Live Demo / Repository URL</label>
                  <input
                    type="url"
                    value={proj.link}
                    onChange={(e) => updateProject(idx, 'link', e.target.value)}
                    placeholder="https://github.com/your-username/project-repo"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social & Professional Profiles */}
      <div className="border-t border-slate-200 pt-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Social & Professional Profiles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              LinkedIn Profile URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                <LinkedinIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={formData.social.linkedin}
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              GitHub Profile URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800">
                <GithubIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={formData.social.github}
                onChange={(e) => updateSocial('github', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Portfolio Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={formData.social.portfolio}
                onChange={(e) => updateSocial('portfolio', e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Instagram (Especially useful for Content Creation / Digital Marketing) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Instagram Profile URL
              </label>
              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                Useful for Content & Marketing
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-600">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={formData.social.instagram}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                placeholder="https://instagram.com/handle"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all cursor-pointer"
        >
          <span>Continue to Documents</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
