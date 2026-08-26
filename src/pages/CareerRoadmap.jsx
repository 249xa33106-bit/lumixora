import React, { useState, useEffect } from 'react';
import { Map, ChevronRight, CheckCircle, PlayCircle, BookOpen, Award, ArrowLeft, ExternalLink } from 'lucide-react';
import { ROADMAPS } from '../data/roadmapsData';

export default function CareerRoadmap({ user }) {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [subProgress, setSubProgress] = useState({});
  const [expandedStep, setExpandedStep] = useState(null);

  useEffect(() => {
    // Load progress from local storage
    if (user?.uid) {
      const savedProgress = localStorage.getItem(`lumixora_roadmap_progress_${user.uid}`);
      if (savedProgress) {
        try {
          setProgress(JSON.parse(savedProgress));
        } catch (e) {
          console.error("Failed to parse roadmap progress");
        }
      }
      
      const savedSubProgress = localStorage.getItem(`lumixora_roadmap_subprogress_${user.uid}`);
      if (savedSubProgress) {
        try {
          setSubProgress(JSON.parse(savedSubProgress));
        } catch (e) {
          console.error("Failed to parse roadmap sub progress");
        }
      }
    }
  }, [user]);

  const toggleStep = (roadmapId, stepId) => {
    if (!user?.uid) return;
    
    const newProgress = { ...progress };
    if (!newProgress[roadmapId]) {
      newProgress[roadmapId] = {};
    }
    
    newProgress[roadmapId][stepId] = !newProgress[roadmapId][stepId];
    setProgress(newProgress);
    localStorage.setItem(`lumixora_roadmap_progress_${user.uid}`, JSON.stringify(newProgress));
  };

  const toggleSubItem = (roadmapId, stepId, itemIndex) => {
    if (!user?.uid) return;
    const key = `${roadmapId}_${stepId}`;
    const newSubProgress = { ...subProgress };
    if (!newSubProgress[key]) {
      newSubProgress[key] = {};
    }
    newSubProgress[key][itemIndex] = !newSubProgress[key][itemIndex];
    setSubProgress(newSubProgress);
    localStorage.setItem(`lumixora_roadmap_subprogress_${user.uid}`, JSON.stringify(newSubProgress));
  };

  const calculateProgress = (roadmapId) => {
    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    if (!roadmap || !progress[roadmapId]) return 0;
    
    const completedSteps = Object.values(progress[roadmapId]).filter(Boolean).length;
    return Math.round((completedSteps / roadmap.steps.length) * 100);
  };

  if (selectedRoadmap) {
    const roadmap = ROADMAPS.find(r => r.id === selectedRoadmap);
    const progressPercent = calculateProgress(roadmap.id);
    const Icon = roadmap.icon;

    return (
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedRoadmap(null)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <Icon className={`w-8 h-8 ${roadmap.color}`} />
              <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-wide">{roadmap.title}</h2>
            </div>
            <p className="text-sm text-gray-400 mt-1">{roadmap.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-end mb-2 relative z-10">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Your Progress</p>
              <h3 className="text-3xl font-black text-white">{progressPercent}%</h3>
            </div>
            {progressPercent === 100 && (
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 flex items-center gap-1 shadow-lg shadow-green-500/10">
                <Award className="w-3 h-3" /> Roadmap Complete!
              </div>
            )}
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative z-10">
            <div 
              className={`h-full ${roadmap.bgColor} transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className={`absolute -right-10 -top-10 w-32 h-32 ${roadmap.bgColor} blur-[80px] opacity-20`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Steps */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-brand-teal" /> Step-by-Step Guide
            </h3>
            
            {roadmap.steps.map((step, index) => {
              const isCompleted = progress[roadmap.id]?.[step.id];
              const isExpanded = expandedStep === step.id;
              
              return (
                <div 
                  key={step.id} 
                  className={`glass-panel rounded-2xl border transition-all ${
                    isCompleted 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div 
                    className="p-5 flex gap-4 cursor-pointer"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <div 
                      className={`mt-1 flex-shrink-0 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-500 hover:text-white'}`}
                      onClick={(e) => { e.stopPropagation(); toggleStep(roadmap.id, step.id); }}
                    >
                      <CheckCircle className={`w-6 h-6 ${isCompleted ? 'fill-green-500/20' : ''}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-bold ${isCompleted ? 'text-gray-300' : 'text-white'} text-lg`}>
                          <span className="text-brand-teal text-sm mr-2">Step {index + 1}</span>
                          {step.title}
                        </h4>
                        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                      <div 
                        className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                          {step.actionItems && (
                            <ul className="mt-4 space-y-2">
                              {step.actionItems.map((item, i) => {
                                const isSubCompleted = subProgress[`${roadmap.id}_${step.id}`]?.[i];
                                return (
                                <li 
                                  key={i} 
                                  className={`text-sm flex items-center justify-between cursor-pointer transition-colors p-2 rounded-lg hover:bg-white/5 ${isSubCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}
                                  onClick={(e) => { e.stopPropagation(); toggleSubItem(roadmap.id, step.id, i); }}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 flex-shrink-0 transition-colors ${isSubCompleted ? roadmap.color : 'text-gray-600'}`}>
                                      <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span>{item.text}</span>
                                  </div>
                                  {item.url && (
                                    <a 
                                      href={item.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      onClick={(e) => e.stopPropagation()} 
                                      className="p-1.5 rounded-full hover:bg-white/10 text-brand-teal transition-colors flex-shrink-0 ml-2"
                                      title="Open Resource"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resources Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <PlayCircle className="w-5 h-5 text-brand-pink" /> Recommended Videos
              </h3>
              <div className="space-y-4">
                {roadmap.resources.videos.map((vid, idx) => (
                  <a key={idx} href={vid.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-brand-pink transition-colors flex items-start justify-between">
                      {vid.title}
                      <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <span className="text-xs text-gray-500 capitalize">{vid.type}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-brand-blue" /> Top Platforms
              </h3>
              <div className="space-y-4">
                {roadmap.resources.platforms.map((plat, idx) => (
                  <a key={idx} href={plat.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-brand-blue transition-colors flex items-start justify-between">
                      {plat.title}
                      <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{plat.desc}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" /> Key Certifications
              </h3>
              <div className="space-y-4">
                {roadmap.resources.certifications.map((cert, idx) => (
                  <a key={idx} href={cert.url} target="_blank" rel="noopener noreferrer" className="block bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 group hover:bg-yellow-500/20 transition-colors">
                    <h4 className="text-sm font-bold text-yellow-500 flex items-start justify-between">
                      {cert.title}
                      <ExternalLink className="w-3 h-3 text-yellow-500/50 group-hover:text-yellow-500 transition-colors" />
                    </h4>
                    <p className="text-xs text-yellow-500/70 mt-1">{cert.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-wide mb-2">
          Career Roadmap <Map className="inline w-6 h-6 text-brand-teal ml-2" />
        </h2>
        <p className="text-sm text-gray-400 font-medium">
          Choose a path below to see a step-by-step guide, recommended resources, and track your progress.
        </p>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ROADMAPS.map((roadmap) => {
          const Icon = roadmap.icon;
          const progressPercent = calculateProgress(roadmap.id);
          
          return (
            <div 
              key={roadmap.id}
              onClick={() => setSelectedRoadmap(roadmap.id)}
              className={`glass-panel p-6 rounded-3xl border border-white/5 transition-all duration-300 cursor-pointer group ${roadmap.borderClass} hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className={`absolute -right-10 -top-10 w-32 h-32 ${roadmap.bgColor} blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${roadmap.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="p-2 bg-white/5 rounded-full text-gray-400 group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">{roadmap.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 h-10 line-clamp-2">
                  {roadmap.description}
                </p>
              </div>

              {/* Progress summary */}
              <div className="relative z-10 mt-auto">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-400 font-medium">Your Progress</span>
                  <span className={`font-bold ${roadmap.color}`}>{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${roadmap.bgColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
