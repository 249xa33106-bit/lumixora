import React, { useState, useMemo } from 'react';
import { 
  Building2, FileText, Download, Code, Clock, CheckCircle, 
  Sparkles, ExternalLink, ChevronDown, ChevronUp, Search, 
  Filter, Award, Brain, BookOpen, Copy, Check, Play, AlertCircle, ArrowRight, X, HelpCircle, CheckSquare
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { COMPANY_DRIVES_DATA } from '../data/companyDrivesData';
import { useToast } from '../context/ToastContext';

export default function CompanyPlacementPapers({ setActiveTab, user, setSelectedProblem }) {
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedDriveId, setExpandedDriveId] = useState(COMPANY_DRIVES_DATA[0].id);
  const [driveTabMap, setDriveTabMap] = useState({}); // { [driveId]: 'coding' | 'mcqs' | 'pattern' }
  const [revealedMCQs, setRevealedMCQs] = useState({});
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Filtered Drives
  const filteredDrives = useMemo(() => {
    return COMPANY_DRIVES_DATA.filter(drive => {
      const matchesSearch = 
        drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.driveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.aptitudeTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        drive.codingQuestions.some(q => q.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (drive.aptitudeMCQs && drive.aptitudeMCQs.some(m => m.question.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCompany = selectedCompany === 'All' || drive.company.toLowerCase().includes(selectedCompany.toLowerCase());
      const matchesTier = selectedTier === 'All' || drive.tier.toLowerCase().includes(selectedTier.toLowerCase());

      return matchesSearch && matchesCompany && matchesTier;
    });
  }, [searchQuery, selectedCompany, selectedTier]);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    addToast({ message: '📋 Code solution copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const toggleRevealMCQ = (mcqId) => {
    setRevealedMCQs(prev => ({
      ...prev,
      [mcqId]: !prev[mcqId]
    }));
  };

  const handleDownloadPaper = (drive) => {
    try {
      addToast({ message: `📥 Generating official ${drive.company} Question Paper PDF with solutions...`, type: 'success' });
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Header Banner
      doc.setFillColor(15, 23, 42); // Dark slate
      doc.rect(0, 0, pageWidth, 42, 'F');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(0, 245, 212); // Brand Teal
      doc.text(`${drive.company.toUpperCase()} PREVIOUS EXAM PAPER`, 14, 17);

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`${drive.driveName} (${drive.year})`, 14, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Salary Packages: ${drive.salaryPackages.map(p => `${p.cadre}: ${p.ctc}`).join(' | ')}`, 14, 33);

      // Section 1: Exam Pattern Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Official Exam Pattern & Sectional Timing', 14, 52);

      const patternRows = drive.examPattern.map(p => [
        p.section,
        String(p.questions),
        p.time,
        p.negativeMarking
      ]);

      autoTable(doc, {
        startY: 56,
        head: [['Section / Assessment Module', 'Questions', 'Duration', 'Negative Marking']],
        body: patternRows,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: [0, 245, 212], fontStyle: 'bold' },
        styles: { fontSize: 8.5, cellPadding: 3 }
      });

      let currentY = doc.lastAutoTable.finalY + 10;

      // Section 2: Must-Prepare High Yield Topics
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. High-Yield Aptitude & Technical Topics', 14, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      drive.aptitudeTopics.forEach(topic => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(`• ${topic}`, 18, currentY);
        currentY += 5;
      });

      currentY += 6;

      // Section 3: Aptitude & Technical MCQs
      if (drive.aptitudeMCQs && drive.aptitudeMCQs.length > 0) {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`3. Solved Aptitude, Reasoning & Technical MCQs (${drive.aptitudeMCQs.length} Questions)`, 14, currentY);
        currentY += 8;

        drive.aptitudeMCQs.forEach((mcq, mIdx) => {
          if (currentY > 240) {
            doc.addPage();
            currentY = 20;
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          const qText = doc.splitTextToSize(`Q${mIdx + 1} [${mcq.section}]: ${mcq.question}`, pageWidth - 28);
          doc.text(qText, 14, currentY);
          currentY += qText.length * 4.5 + 2;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          mcq.options.forEach((opt, oIdx) => {
            doc.text(`(${String.fromCharCode(65 + oIdx)}) ${opt}`, 18, currentY);
            currentY += 4.5;
          });

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(13, 148, 136); // Teal
          doc.text(`Correct Answer: ${mcq.correctAnswer}`, 14, currentY);
          currentY += 4.5;

          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          const expText = doc.splitTextToSize(`Explanation: ${mcq.explanation}`, pageWidth - 28);
          doc.text(expText, 14, currentY);
          currentY += expText.length * 4.2 + 6;
        });
      }

      // Section 4: Previous Coding Problems & Complete Solved Code
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`4. Solved Coding Problems & Source Codes (${drive.codingQuestions.length} Questions)`, 14, currentY);
      currentY += 8;

      drive.codingQuestions.forEach((q, idx) => {
        if (currentY > 230) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${q.title}`, 14, currentY);
        currentY += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        const splitDesc = doc.splitTextToSize(`Problem Statement: ${q.description}`, pageWidth - 28);
        doc.text(splitDesc, 14, currentY);
        currentY += splitDesc.length * 4.5 + 2;

        doc.setFont('helvetica', 'bold');
        doc.text(`Sample Input: ${q.sampleInput}`, 14, currentY);
        currentY += 5;
        doc.text(`Sample Output: ${q.sampleOutput}`, 14, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'italic');
        doc.setTextColor(13, 148, 136); // Teal
        doc.text(`Algorithmic Strategy: ${q.approach}`, 14, currentY);
        currentY += 7;

        // Code snippet block
        const codeLines = doc.splitTextToSize(q.javaCode, pageWidth - 34);
        const codeBoxHeight = codeLines.length * 3.6 + 6;

        if (currentY + codeBoxHeight > 275) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFillColor(241, 245, 249);
        doc.rect(14, currentY, pageWidth - 28, codeBoxHeight, 'F');
        doc.setFont('courier', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(codeLines, 17, currentY + 5);
        currentY += codeBoxHeight + 10;
      });

      // Footer numbering
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`VYOMRA Academic & Placement Engine · Official Previous Papers · Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
      }

      // Save real file
      const fileName = `${drive.company.replace(/[^a-zA-Z0-9]/g, '_')}_Drive_Paper_${drive.year.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
      addToast({ message: `✅ Successfully downloaded ${fileName}!`, type: 'success' });
    } catch (err) {
      console.error("PDF generation failed:", err);
      addToast({ message: 'Failed to generate PDF. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fade-in text-white">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-teal/30 bg-gradient-to-r from-[#0d162e] via-[#0f231e] to-[#1a1236] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Building2 className="w-3.5 h-3.5" /> Company Placement Drives & Papers
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-gray-300 text-[10px] font-mono font-bold">
                TCS · Accenture · Cognizant · Amazon · Infosys · Zoho
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Previous Years Company Placement Papers & Coding Rounds 🚀
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-medium">
              Real questions, exact exam patterns, sectional time limits, solved aptitude/reasoning MCQs, and working multi-language coding solutions across top tech recruiters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('coding-practice');
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              <Code className="w-4 h-4" /> Practice in Code Arena
            </button>
          </div>
        </div>

        {/* Aggregate KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Recruiter Drives</span>
            <div className="text-xl font-black text-white font-mono">{COMPANY_DRIVES_DATA.length} Top Companies</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Target Packages</span>
            <div className="text-xl font-black text-emerald-400 font-mono">₹3.5 - ₹34 LPA</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">All Solved Codes</span>
            <div className="text-xl font-black text-cyan-400 font-mono">100% Multi-Lang</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Eligibility Cutoffs</span>
            <div className="text-xl font-black text-amber-400 font-mono">60% - 65% Min</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search previous papers by company (TCS, Accenture), topics (Two Pointers, DP, Pointers), or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11111a] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-teal"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="All">All Companies</option>
              <option value="TCS">TCS (Ninja/Digital/Prime)</option>
              <option value="Accenture">Accenture (ASE/FSE)</option>
              <option value="Cognizant">Cognizant (GenC/Next)</option>
              <option value="Infosys">Infosys (SE/DSE/SP)</option>
              <option value="Amazon">Amazon (SDE-1 OA)</option>
              <option value="Zoho">Zoho Corporation</option>
              <option value="Wipro">Wipro (Elite/Turbo)</option>
              <option value="Qualcomm">Qualcomm Engineering</option>
            </select>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Mass">Mass & Standard Drives</option>
              <option value="Product">Product Tier-1 / FAANG</option>
              <option value="Core">Core Hardware / Semiconductor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drives Accordion List */}
      <div className="space-y-6">
        {filteredDrives.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-3xl border border-white/10 space-y-3">
            <Building2 className="w-12 h-12 text-gray-500 mx-auto opacity-50" />
            <h3 className="text-base font-bold text-white">No Company Drives Match Your Search</h3>
            <p className="text-xs text-gray-400">Try resetting the company or tier filters.</p>
          </div>
        ) : (
          filteredDrives.map((drive) => {
            const isExpanded = expandedDriveId === drive.id;
            const currentTab = driveTabMap[drive.id] || 'coding';

            return (
              <div 
                key={drive.id}
                className="glass-panel rounded-3xl border border-white/10 overflow-hidden transition-all bg-[#0e1220]/90 shadow-xl"
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => setExpandedDriveId(isExpanded ? null : drive.id)}
                  className="p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {drive.companyLogo}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-white text-base sm:text-lg">{drive.company}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30 text-[10px] font-black uppercase">
                          {drive.year}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                          {drive.tier}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 font-semibold">{drive.driveName}</p>
                      <p className="text-[11px] text-gray-400">
                        Eligibility: <strong className="text-gray-300">{drive.eligibility}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Package Brackets</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {drive.salaryPackages.map((pkg, pIdx) => (
                          <span key={pIdx} className="text-[10px] font-black font-mono bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            {pkg.cadre}: {pkg.ctc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 text-gray-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-brand-teal" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content Body */}
                {isExpanded && (
                  <div className="p-6 sm:p-8 space-y-6 bg-black/30 animate-fade-in text-xs">
                    
                    {/* Drive Sub-Navigation Tabs */}
                    <div className="flex flex-wrap items-center gap-2 p-1 bg-black/40 border border-white/10 rounded-2xl w-fit">
                      <button
                        onClick={() => setDriveTabMap(prev => ({ ...prev, [drive.id]: 'coding' }))}
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          currentTab === 'coding'
                            ? 'bg-brand-teal text-black shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5" /> Solved Coding Problems ({drive.codingQuestions.length})
                      </button>

                      {drive.aptitudeMCQs && drive.aptitudeMCQs.length > 0 && (
                        <button
                          onClick={() => setDriveTabMap(prev => ({ ...prev, [drive.id]: 'mcqs' }))}
                          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            currentTab === 'mcqs'
                              ? 'bg-brand-teal text-black shadow-md'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Brain className="w-3.5 h-3.5 text-purple-400" /> Aptitude & Technical MCQs ({drive.aptitudeMCQs.length})
                        </button>
                      )}

                      <button
                        onClick={() => setDriveTabMap(prev => ({ ...prev, [drive.id]: 'pattern' }))}
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          currentTab === 'pattern'
                            ? 'bg-brand-teal text-black shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> Exam Pattern & Cutoffs
                      </button>
                    </div>

                    {/* TAB 1: CODING PROBLEMS */}
                    {currentTab === 'coding' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                            <Code className="w-4 h-4 text-emerald-400" />
                            Official Solved Coding Problems from All Slots ({drive.codingQuestions.length})
                          </h4>
                          <span className="text-[11px] text-gray-400">Complete Java / C++ Working Codes</span>
                        </div>

                        <div className="space-y-4">
                          {drive.codingQuestions.map((q, qIdx) => (
                            <div key={qIdx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h5 className="font-extrabold text-white text-xs sm:text-sm text-brand-teal">{q.title}</h5>
                                <button
                                  onClick={() => handleCopyCode(q.javaCode, `${drive.id}_${qIdx}`)}
                                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-[10px] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                                >
                                  {copiedCodeId === `${drive.id}_${qIdx}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" /> Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy Solution Code
                                    </>
                                  )}
                                </button>
                              </div>

                              <p className="text-gray-200 leading-relaxed">{q.description}</p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                  <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Sample Input:</span>
                                  <span className="text-gray-300">{q.sampleInput}</span>
                                </div>
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                  <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Sample Output:</span>
                                  <span className="text-emerald-400 font-bold">{q.sampleOutput}</span>
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-[11px]">
                                💡 <strong>Algorithmic Strategy:</strong> {q.approach}
                              </div>

                              {/* Working Code Block */}
                              <div className="relative bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs overflow-x-auto text-gray-300 custom-scrollbar">
                                <pre><code>{q.javaCode}</code></pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 2: APTITUDE & TECHNICAL MCQS */}
                    {currentTab === 'mcqs' && drive.aptitudeMCQs && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400" />
                            Previous Years Aptitude, Reasoning & Technical MCQs ({drive.aptitudeMCQs.length})
                          </h4>
                          <span className="text-[11px] text-gray-400">Click to reveal step-by-step explanations</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {drive.aptitudeMCQs.map((mcq, mIdx) => {
                            const isRevealed = !!revealedMCQs[mcq.id];

                            return (
                              <div key={mcq.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                                    {mcq.section}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">Question {mIdx + 1}</span>
                                </div>

                                <p className="text-white font-medium text-xs sm:text-sm whitespace-pre-line">{mcq.question}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {mcq.options.map((opt, oIdx) => (
                                    <div 
                                      key={oIdx}
                                      className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                                        isRevealed && opt === mcq.correctAnswer
                                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                                          : 'bg-black/30 border-white/5 text-gray-300'
                                      }`}
                                    >
                                      <span className="font-bold text-gray-400 mr-2">({String.fromCharCode(65 + oIdx)})</span>
                                      {opt}
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5">
                                  <button
                                    onClick={() => toggleRevealMCQ(mcq.id)}
                                    className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-teal font-bold text-[11px] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    {isRevealed ? 'Hide Solution' : 'Reveal Answer & Explanation'}
                                  </button>

                                  {isRevealed && (
                                    <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5" /> Correct: {mcq.correctAnswer}
                                    </span>
                                  )}
                                </div>

                                {isRevealed && (
                                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs leading-relaxed animate-fade-in">
                                    📚 <strong>Step-by-Step Explanation:</strong> {mcq.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: EXAM PATTERN */}
                    {currentTab === 'pattern' && (
                      <div className="space-y-6 animate-fade-in">
                        {/* 1. Exam Pattern & Sectional Timing Table */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                              <Clock className="w-4 h-4 text-brand-teal" />
                              Official Exam Pattern & Sectional Timing Breakdown
                            </h4>
                            <span className="text-[11px] text-amber-300 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                              Difficulty: {drive.difficulty}
                            </span>
                          </div>

                          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-white/10 text-[10px] font-black uppercase text-gray-400 bg-white/5">
                                  <th className="p-3">Section / Module</th>
                                  <th className="p-3 text-center">No. of Questions</th>
                                  <th className="p-3 text-center">Allotted Time</th>
                                  <th className="p-3 text-center">Negative Marking</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {drive.examPattern.map((sec, sIdx) => (
                                  <tr key={sIdx} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-3 font-semibold text-gray-200">{sec.section}</td>
                                    <td className="p-3 text-center font-mono font-bold text-cyan-300">{sec.questions}</td>
                                    <td className="p-3 text-center font-mono font-bold text-white">{sec.time}</td>
                                    <td className="p-3 text-center font-mono text-gray-400">{sec.negativeMarking}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* 2. High-Yield Aptitude & Technical Topics */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5 text-purple-400" /> Must-Prepare High-Yield Aptitude & Theory Topics:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {drive.aptitudeTopics.map((topic, tIdx) => (
                              <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px] font-medium">
                                • {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Drive Action Download & Practice Bar */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                        <CheckCircle className="w-4 h-4 text-brand-teal" />
                        <span>Verified from actual {drive.year} campus drive slots</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownloadPaper(drive)}
                          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-brand-teal" /> Download Complete Paper PDF
                        </button>
                        <button
                          onClick={() => {
                            if (setActiveTab) setActiveTab('coding-practice');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" /> Open Code Arena
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
