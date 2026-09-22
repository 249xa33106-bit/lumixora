import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, Upload, Send, Sparkles, User, CheckCircle2, 
  ChevronRight, Image as ImageIcon, X, ImageOff, MessageCircle,
  Mic, MicOff, Calculator, Code, BookOpen, Layers, RefreshCw,
  Search, ArrowRight, Zap, Check
} from 'lucide-react';
import { generateDoubtResolution } from '../services/aiService';
import { useData } from '../context/DataContext';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';
import AcademicSolutionRenderer from '../components/AcademicSolutionRenderer';

const MATH_QUICK_SYMBOLS = [
  { label: '√x', insert: '\\sqrt{x}' },
  { label: '∫', insert: '\\int_{a}^{b} f(x)\\,dx' },
  { label: 'd/dx', insert: '\\frac{d}{dx}[f(x)]' },
  { label: '∑', insert: '\\sum_{i=1}^{n}' },
  { label: 'Fraction', insert: '\\frac{a}{b}' },
  { label: 'x²', insert: 'x^2' },
  { label: 'lim', insert: '\\lim_{x \\to 0}' },
  { label: 'π', insert: '\\pi' },
  { label: 'θ', insert: '\\theta' },
  { label: 'α', insert: '\\alpha' },
  { label: '±', insert: '\\pm' },
  { label: '≈', insert: '\\approx' },
  { label: '≠', insert: '\\neq' },
  { label: 'Code Block', insert: '```python\n# write code here\n```' }
];

export default function DoubtSolving() {
  const [solverMode, setSolverMode] = useState('ai'); // 'ai' or 'mentor'
  const [doubtText, setDoubtText] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [showMathBar, setShowMathBar] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  
  const { doubts, addDoubt, updateDoubt } = useData();
  const { awardXP } = useGamification();
  const { addToast } = useToast();

  const [activeDoubt, setActiveDoubt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [isFollowUpSubmitting, setIsFollowUpSubmitting] = useState(false);

  const textareaRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Auto-scroll chat to bottom when activeDoubt thread updates
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeDoubt?.thread, isFollowUpSubmitting]);

  // Voice speech-to-text
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast({ message: "Voice input is not supported in this browser. Please use Chrome/Edge.", type: "warning" });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setDoubtText(prev => prev ? `${prev} ${transcript}` : transcript);
          addToast({ message: "Voice captured!", type: "success" });
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  const handleInsertSymbol = (symText) => {
    if (!textareaRef.current) {
      setDoubtText(prev => prev + ' ' + symText);
      return;
    }
    const elem = textareaRef.current;
    const start = elem.selectionStart || 0;
    const end = elem.selectionEnd || 0;
    const newText = doubtText.substring(0, start) + symText + doubtText.substring(end);
    setDoubtText(newText);
    setTimeout(() => {
      elem.focus();
      elem.setSelectionRange(start + symText.length, start + symText.length);
    }, 50);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setImageBase64('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const getPlaceholder = () => {
    if (solverMode === 'mentor') return "Explain your doubt in detail to our mentors...";
    switch (subject) {
      case 'All Subjects': return "Paste your question, equation, or describe what you're stuck on...";
      case 'Computer Science': return "Paste your code, pseudocode, or CS theory question here...";
      case 'Mathematics': return "Type your equation or calculus problem here (e.g. \\int x^2 dx)...";
      case 'Physics': return "Describe your physics problem or concept here...";
      case 'Chemistry': return "Enter your chemical equation or reaction query here...";
      default: return "Paste your question, equation, or describe what you're stuck on...";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    setIsSubmitting(true);
    
    try {
      let thread = [];
      let status = 'Pending Review';

      if (solverMode === 'ai') {
        const aiResponse = await generateDoubtResolution(doubtText, subject, false, imageBase64);
        thread = [
          {
            author: 'Vyomra AI Assistant',
            isAI: true,
            content: aiResponse,
            timestamp: new Date().toISOString()
          }
        ];
        status = 'Resolved';
      }

      const newDoubt = {
        id: `doubt_${Date.now()}`,
        topic: doubtText,
        tag: subject,
        status: status,
        date: 'Just now',
        hasImage: !!imageBase64,
        imageUrl: imageBase64,
        isHumanRequest: solverMode === 'mentor',
        thread: thread
      };

      // Display doubt resolution immediately
      setActiveDoubt(newDoubt);

      try {
        if (addDoubt) {
          const added = await addDoubt(newDoubt);
          if (added && added.id) setActiveDoubt(added);
        }
      } catch (dbErr) {
        console.warn("Database doubt save note:", dbErr);
      }
      
      try {
        if (awardXP) await awardXP('HELP_STUDENT');
      } catch (e) {}
      
      setDoubtText('');
      clearFile();

      if (solverMode === 'mentor') {
        addToast({ message: "Doubt submitted to mentors! They will reply soon.", type: "success" });
      } else {
        addToast({ message: "AI resolution generated with textbook-grade formulas!", type: "success" });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: "Error generating resolution.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick follow up handler triggered by buttons
  const handleQuickFollowUp = async (customPrompt) => {
    if (!customPrompt || !activeDoubt || isFollowUpSubmitting) return;

    setIsFollowUpSubmitting(true);
    const userMessage = {
      author: 'Shaik Sowban',
      isAI: false,
      content: customPrompt,
      timestamp: new Date().toISOString()
    };

    const updatedThread = [...(activeDoubt.thread || []), userMessage];
    setActiveDoubt(prev => ({ ...prev, thread: updatedThread }));

    try {
      const chatContext = updatedThread.map(msg => ({
        role: msg.isAI ? "assistant" : "user",
        content: msg.content
      }));

      const aiResponse = await generateDoubtResolution(chatContext, activeDoubt.tag || 'Academic', true, null);
      
      const aiMessage = {
        author: 'Vyomra AI Assistant',
        isAI: true,
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      const finalThread = [...updatedThread, aiMessage];
      const finalActiveDoubt = { ...activeDoubt, thread: finalThread };
      
      setActiveDoubt(finalActiveDoubt);
      if (updateDoubt) {
        await updateDoubt(activeDoubt.id, { thread: finalThread });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: "Error getting AI response.", type: "error" });
    } finally {
      setIsFollowUpSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!followUpText.trim() || !activeDoubt) return;

    const query = followUpText.trim();
    setFollowUpText('');
    await handleQuickFollowUp(query);
  };

  // Filtered doubts history
  const filteredDoubts = (doubts || []).filter(d => {
    const q = searchHistoryQuery.toLowerCase().trim();
    if (!q) return true;
    return (d.topic && d.topic.toLowerCase().includes(q)) || (d.tag && d.tag.toLowerCase().includes(q));
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-gray-100 font-sans">
      
      {/* Left Column (Doubt Submission Form + Recent History Feed) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Ask Box */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-[#0c1322] via-[#09101d] to-[#080d18]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-wide">Academic Doubt Solver</h2>
                <p className="text-[11px] text-gray-400 font-medium">Textbook-grade step-by-step derivations & code</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMathBar(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                showMathBar 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
              title="Toggle Math & Code symbols toolbar"
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>Math Toolbar</span>
            </button>
          </div>

          {/* Solver Mode Switcher */}
          <div className="flex bg-[#030712]/90 p-1.5 rounded-2xl mb-5 border border-white/5 gap-1">
            <button
              type="button"
              onClick={() => setSolverMode('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                solverMode === 'ai' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg font-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant AI Master Solver</span>
            </button>
            <button
              type="button"
              onClick={() => setSolverMode('mentor')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                solverMode === 'mentor' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg font-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Ask Human Mentor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Select Domain</span>
              <div className="flex flex-wrap gap-1.5">
                {['All Subjects', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics', 'Aptitude'].map((sub) => (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => setSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      subject === sub 
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Math Symbols Insert Drawer */}
            {showMathBar && (
              <div className="p-3 bg-black/50 border border-cyan-500/30 rounded-2xl space-y-2 animate-fade-in">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase block">
                  Click to insert LaTeX math symbol or code:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {MATH_QUICK_SYMBOLS.map((sym, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleInsertSymbol(sym.insert)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
                    >
                      {sym.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Textarea Input */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder={getPlaceholder()}
                rows="4"
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-500/60 transition-colors font-sans shadow-inner"
              ></textarea>

              {/* Voice input mic button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-3 top-3 p-2 rounded-xl transition-all cursor-pointer border ${
                  isListening 
                    ? 'bg-rose-500 text-white border-rose-400 animate-ping' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-300 border-white/10'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to dictate doubt with voice'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Image Upload & Action Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
              <div className="w-full sm:w-auto">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="relative flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-2 pr-4">
                    <img src={previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded-xl border border-white/10" />
                    <div className="text-left">
                      <span className="text-[10px] text-cyan-400 font-bold block">Attached Problem</span>
                      <span className="text-xs text-gray-300 font-medium truncate max-w-[120px] block">
                        {uploadedFile?.name || 'Problem.jpg'}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={clearFile}
                      className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-rose-400 transition-colors ml-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label 
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold cursor-pointer transition-all duration-300"
                  >
                    <Upload className={`w-4 h-4 ${solverMode === 'ai' ? 'text-cyan-400' : 'text-purple-400'}`} />
                    <span>Upload textbook image</span>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !doubtText.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isSubmitting || !doubtText.trim()
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                    : solverMode === 'ai' 
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:opacity-95 text-black shadow-[0_0_25px_rgba(6,182,212,0.4)]' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-95 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Resolving Step-by-Step...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{solverMode === 'ai' ? 'Solve Academic Doubt' : 'Send to Mentor'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Doubts History Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
              Recent Doubts ({filteredDoubts.length})
            </span>
            
            <div className="relative w-44">
              <Search className="w-3 h-3 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-2 py-1 text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredDoubts.slice().reverse().map(d => (
              <div 
                key={d.id} 
                onClick={() => setActiveDoubt(d)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeDoubt?.id === d.id 
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-md' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 ${
                    d.isHumanRequest ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {d.isHumanRequest ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {d.isHumanRequest ? 'Mentor' : 'AI'} • {d.tag}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    d.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-gray-200 truncate font-semibold">{d.topic}</p>
                <div className="text-[10px] text-gray-500 mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {d.thread?.length || 0} explanations
                  </span>
                  <span>{d.date || 'Active'}</span>
                </div>
              </div>
            ))}

            {filteredDoubts.length === 0 && (
              <div className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-gray-400">No doubts recorded yet. Ask a question to start!</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right Details Thread Column (Interactive Live Resolution Canvas) */}
      <div className="lg:col-span-7 h-full">
        {activeDoubt ? (
          <div className="glass-panel rounded-3xl flex flex-col h-[720px] border border-cyan-500/30 bg-[#090f1d]/90 shadow-2xl overflow-hidden backdrop-blur-2xl">
            
            {/* Thread Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                    activeDoubt.isHumanRequest ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {activeDoubt.tag}
                  </span>
                  <span className="text-xs font-black text-white">
                    {activeDoubt.isHumanRequest ? 'Mentor Connect Thread' : 'Active AI Resolution Thread'}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                activeDoubt.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {activeDoubt.status}
              </span>
            </div>

            {/* Scrollable Conversation Thread */}
            <div ref={chatScrollRef} className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar">
              
              {/* Question Card */}
              <div className="bg-white/[0.04] border border-white/10 p-4 rounded-2xl space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-black text-xs text-purple-300">
                      Q
                    </div>
                    <div>
                      <span className="text-xs font-black text-white">Academic Question</span>
                      <span className="text-[10px] text-gray-500 block">{activeDoubt.date}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-semibold">
                  {activeDoubt.topic}
                </p>

                {activeDoubt.hasImage && activeDoubt.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-white/10 mt-2 bg-black/40 max-h-[180px] flex items-center justify-center">
                    <img 
                      src={activeDoubt.imageUrl} 
                      alt="Problem attached" 
                      className="max-h-[180px] w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Answers & AI Resolutions with KaTeX & Markdown Rendering */}
              {activeDoubt.thread && activeDoubt.thread.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border space-y-3.5 shadow-lg ${
                    msg.isAI 
                      ? 'bg-gradient-to-b from-[#0b1424] via-[#09101d] to-[#070c17] border-cyan-500/30' 
                      : msg.isMentor
                        ? 'bg-purple-950/20 border-purple-500/30'
                        : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        msg.isAI ? 'bg-cyan-500 text-black shadow-md' : msg.isMentor ? 'bg-purple-500 text-white' : 'bg-gray-700 text-white'
                      }`}>
                        {msg.isAI ? 'AI' : msg.isMentor ? 'M' : 'S'}
                      </div>
                      <div>
                        <span className="text-xs font-black text-white">{msg.author}</span>
                        {msg.isAI && (
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-black uppercase ml-2">
                            Master Tutor
                          </span>
                        )}
                        {msg.isMentor && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-black uppercase ml-2">
                            Mentor
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* BEAUTIFUL KATEX MATH & MARKDOWN RENDERER */}
                  {(msg.isAI || msg.author?.toLowerCase().includes('ai') || msg.author?.toLowerCase().includes('vyomra') || msg.author?.toLowerCase().includes('assistant')) ? (
                    <AcademicSolutionRenderer 
                      content={msg.content} 
                      onAskFollowUp={handleQuickFollowUp}
                      author={msg.author}
                    />
                  ) : (
                    <div className="text-xs text-gray-200 whitespace-pre-line leading-relaxed font-normal">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}

              {/* Shimmer loading state during follow up query */}
              {isFollowUpSubmitting && (
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-3 animate-pulse">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                  <span className="text-xs text-cyan-300 font-bold">Computing textbook derivation & solution...</span>
                </div>
              )}

              {activeDoubt.isHumanRequest && activeDoubt.status === 'Pending Review' && (!activeDoubt.thread || activeDoubt.thread.length === 0) && (
                <div className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl border-dashed space-y-2">
                  <User className="w-8 h-8 text-purple-400/60 mx-auto" />
                  <p className="text-xs text-gray-300 font-bold">A verified academic mentor will review and solve your query soon.</p>
                </div>
              )}

            </div>

            {/* Input Footer for further questions */}
            <div className="p-4 border-t border-white/10 bg-black/50">
              <form onSubmit={handleFollowUpSubmit} className="relative">
                <input
                  type="text"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder={activeDoubt.isHumanRequest ? "Send a follow-up message to your mentor..." : "Ask follow-up question or request simpler breakdown..."}
                  disabled={isFollowUpSubmitting}
                  className="w-full py-3 pl-4 pr-12 rounded-2xl bg-white/5 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 transition-colors disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isFollowUpSubmitting || !followUpText.trim()}
                  className={`absolute right-1.5 top-1.5 h-9 w-9 rounded-xl flex items-center justify-center text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                    activeDoubt.isHumanRequest ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                  }`}
                >
                  {isFollowUpSubmitting ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="glass-panel rounded-3xl h-[680px] flex flex-col items-center justify-center text-center p-8 border border-white/10 bg-gradient-to-b from-[#0b1324]/40 to-[#070c17]/40 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 animate-bounce">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-white">No active doubt thread selected</h4>
            <p className="text-xs text-gray-400 max-w-[260px] mt-1.5 leading-relaxed">
              Select a question from your history or ask a new doubt on the left to receive an instant step-by-step resolution.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

