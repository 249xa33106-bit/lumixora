import React, { useState } from 'react';
import { HelpCircle, Upload, Send, Sparkles, User, CheckCircle2, ChevronRight, Image as ImageIcon, X, ImageOff, MessageCircle } from 'lucide-react';
import { generateDoubtResolution } from '../services/aiService';
import { useData } from '../context/DataContext';
import { useGamification } from '../context/GamificationContext';
import { useToast } from '../context/ToastContext';

export default function DoubtSolving() {
  const [solverMode, setSolverMode] = useState('ai'); // 'ai' or 'mentor'
  const [doubtText, setDoubtText] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  
  const { doubts, addDoubt, updateDoubt } = useData();
  const { awardXP } = useGamification();
  const { addToast } = useToast();

  const [activeDoubt, setActiveDoubt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [isFollowUpSubmitting, setIsFollowUpSubmitting] = useState(false);

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
      case 'Mathematics': return "Type your equation or calculus problem here...";
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
            author: 'Lumixora AI Assistant',
            isAI: true,
            content: aiResponse,
            timestamp: new Date().toISOString()
          }
        ];
        status = 'Resolved';
      }

      const newDoubt = {
        topic: doubtText,
        tag: subject,
        status: status,
        date: 'Just now',
        hasImage: !!imageBase64,
        imageUrl: imageBase64,
        isHumanRequest: solverMode === 'mentor',
        thread: thread
      };

      const added = await addDoubt(newDoubt);
      if (added) {
         setActiveDoubt(added);
      } else {
         setActiveDoubt({id: Date.now(), ...newDoubt}); // fallback for optimistic UI if backend fails
      }
      
      await awardXP('HELP_STUDENT');
      
      setDoubtText('');
      clearFile();

      if (solverMode === 'mentor') {
        addToast({ message: "Doubt submitted to mentors! They will reply soon.", type: "success" });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: "Error submitting doubt.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!followUpText.trim() || !activeDoubt) return;

    setIsFollowUpSubmitting(true);
    const userMessage = {
      author: 'Shaik Sowban',
      isAI: false,
      content: followUpText,
      timestamp: new Date().toISOString()
    };

    // Optimistically update the thread locally for active view
    const updatedThread = [...(activeDoubt.thread || []), userMessage];
    const tempActiveDoubt = { ...activeDoubt, thread: updatedThread };
    setActiveDoubt(tempActiveDoubt);
    
    // Save to database
    if (updateDoubt) {
       await updateDoubt(activeDoubt.id, { thread: updatedThread });
    }
    
    setFollowUpText('');

    if (activeDoubt.isHumanRequest) {
      setIsFollowUpSubmitting(false);
      addToast({ message: "Reply sent to mentor.", type: "success" });
      return;
    }

    try {
      // AI Follow up
      const chatContext = updatedThread.map(msg => ({
        role: msg.isAI ? "assistant" : "user",
        content: msg.content
      }));
      const hasBase64Image = activeDoubt.hasImage && activeDoubt.imageUrl && activeDoubt.imageUrl.startsWith('data:image');
      if (hasBase64Image) {
        chatContext.unshift({
          role: "user",
          content: [
            { type: "text", text: activeDoubt.topic || activeDoubt.question || "Explain this image" },
            { type: "image_url", image_url: { url: activeDoubt.imageUrl } }
          ]
        });
      } else {
        chatContext.unshift({ role: "user", content: activeDoubt.topic || activeDoubt.question });
      }

      const aiResponse = await generateDoubtResolution(chatContext, activeDoubt.subject || activeDoubt.tag, true, hasBase64Image ? activeDoubt.imageUrl : null);
      
      const aiMessage = {
        author: 'Lumixora AI Assistant',
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* Left Form Column (Doubt Box + History Feed List) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Ask Box */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-brand-teal" />
            <h2 className="text-base font-bold text-gray-100 tracking-wide">Submit Academic Doubt</h2>
          </div>

          <div className="flex bg-[#030712] p-1 rounded-xl mb-6">
            <button
              onClick={() => setSolverMode('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                solverMode === 'ai' ? 'bg-white/10 text-brand-teal shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Instant AI Solver
            </button>
            <button
              onClick={() => setSolverMode('mentor')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                solverMode === 'mentor' ? 'bg-white/10 text-brand-purple shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              Ask a Human Mentor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject selector */}
            <div className="flex flex-wrap gap-2">
              {['All Subjects', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry'].map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => setSubject(sub)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    subject === sub 
                      ? 'bg-brand-teal text-black font-bold shadow-sm' 
                      : 'bg-white/10 border border-white/10 hover:bg-white/20 text-gray-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Input Text Area */}
            <div className="relative">
              <textarea
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder={getPlaceholder()}
                rows="4"
                className="w-full p-4 rounded-xl glass-input text-sm resize-none pr-12 focus:border-brand-teal/50"
              ></textarea>
            </div>

            {/* Image Upload Area */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="w-full sm:w-auto">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="relative flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-2 pr-4">
                    <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                    <div className="text-left">
                      <span className="text-[10px] text-gray-500 font-bold block">Attached Problem Image</span>
                      <span className="text-xs text-gray-300 font-medium truncate max-w-[120px] block">
                        {uploadedFile?.name || 'Problem.jpg'}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={clearFile}
                      className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-brand-pink transition-colors ml-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label 
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-300 text-xs font-semibold cursor-pointer transition-all duration-300"
                  >
                    <Upload className={`w-4 h-4 ${solverMode === 'ai' ? 'text-brand-teal' : 'text-brand-purple'}`} />
                    <span>Upload textbook image/photo</span>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !doubtText.trim()}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting || !doubtText.trim()
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                    : solverMode === 'ai' 
                      ? 'bg-gradient-to-r from-brand-teal to-brand-blue text-black shadow-sm hover:opacity-90 transition-opacity'
                      : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-sm hover:opacity-90 transition-opacity'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{solverMode === 'ai' ? 'Ask Copilot' : 'Submit to Mentor'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* History Feed */}
        {doubts && doubts.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-wide uppercase pl-2">Your Recent Doubts</h3>
            {doubts.slice().reverse().map(d => (
              <div 
                key={d.id} 
                onClick={() => setActiveDoubt(d)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeDoubt?.id === d.id ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wide flex items-center gap-1 ${
                    d.isHumanRequest ? 'bg-brand-purple/20 text-brand-purple' : 'bg-brand-teal/20 text-brand-teal'
                  }`}>
                    {d.isHumanRequest ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {d.isHumanRequest ? 'Mentor' : 'AI'} • {d.tag}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    d.status === 'Resolved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-gray-300 truncate font-medium">{d.topic}</p>
                <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {d.thread?.length || 0} messages
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Right Details Thread Column (Dynamic Chat View) */}
      <div className="lg:col-span-5 h-full">
        {activeDoubt ? (
          <div className="glass-panel rounded-2xl flex flex-col h-[600px] border border-border-glass">
            
            {/* Header */}
            <div className="p-5 border-b border-border-glass flex items-center justify-between">
              <div className="space-y-1">
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold tracking-wide ${
                  activeDoubt.isHumanRequest ? 'bg-brand-purple/20 text-brand-purple' : 'bg-brand-teal/20 text-brand-teal'
                }`}>
                  {activeDoubt.tag}
                </span>
                <h4 className="text-xs font-bold text-gray-400 tracking-wide block">
                  {activeDoubt.isHumanRequest ? 'Mentor Connect Thread' : 'Active AI Resolution Thread'}
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                activeDoubt.status === 'Resolved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                {activeDoubt.status}
              </span>
            </div>

            {/* Scrollable Conversation */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              
              {/* Question bubble */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-purple/20 flex items-center justify-center font-bold text-xs text-brand-purple">
                    SS
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-200">Shaik Sowban</span>
                    <span className="text-[9px] text-gray-500 block">Asked {activeDoubt.date}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {activeDoubt.topic}
                </p>
                {activeDoubt.hasImage && (
                  <div className="rounded-lg overflow-hidden border border-white/10 mt-2 bg-black/30 max-h-[160px] flex items-center justify-center relative group">
                    <img 
                      src={activeDoubt.imageUrl} 
                      alt="Problem attached" 
                      className="max-h-[160px] w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-500 gap-2">
                      <ImageOff className="w-8 h-8 opacity-50" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Image Not Found</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Answers */}
              {activeDoubt.thread && activeDoubt.thread.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border space-y-3 ${
                    msg.isAI 
                      ? 'bg-brand-teal/5 border-white/10 shadow-sm' 
                      : msg.isMentor
                        ? 'bg-brand-purple/10 border-brand-purple/30 shadow-sm'
                        : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        msg.isAI ? 'bg-brand-teal text-black' : msg.isMentor ? 'bg-brand-purple text-white' : 'bg-gray-600 text-white'
                      }`}>
                        {msg.isAI ? 'AI' : msg.isMentor ? 'M' : 'S'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-200">{msg.author}</span>
                        {msg.isAI && (
                          <span className="text-[9px] bg-brand-teal/20 text-brand-teal px-1.5 py-0.2 rounded font-bold uppercase ml-2">Copilot</span>
                        )}
                        {msg.isMentor && (
                          <span className="text-[9px] bg-brand-purple/20 text-brand-purple px-1.5 py-0.2 rounded font-bold uppercase ml-2">Mentor</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed font-normal">
                    {msg.content}
                  </p>
                </div>
              ))}

              {activeDoubt.isHumanRequest && activeDoubt.status === 'Pending Review' && (!activeDoubt.thread || activeDoubt.thread.length === 0) && (
                <div className="text-center p-6 bg-white/[0.02] border border-white/5 rounded-xl border-dashed">
                  <User className="w-8 h-8 text-brand-purple/50 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">A mentor will review your doubt and respond here soon.</p>
                </div>
              )}

            </div>

            {/* Input Footer for further questions */}
            <div className="p-4 border-t border-border-glass bg-black/10">
              <form onSubmit={handleFollowUpSubmit} className="relative">
                <input
                  type="text"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder={activeDoubt.isHumanRequest ? "Send a message to your mentor..." : "Request secondary breakdown from AI..."}
                  disabled={isFollowUpSubmitting}
                  className="w-full py-2.5 pl-4 pr-12 rounded-xl glass-input text-xs disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isFollowUpSubmitting || !followUpText.trim()}
                  className={`absolute right-1 top-1 h-8 w-8 rounded-lg flex items-center justify-center text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeDoubt.isHumanRequest ? 'bg-brand-purple hover:bg-brand-pink text-white' : 'bg-brand-teal hover:opacity-90 text-black'
                  }`}
                >
                  {isFollowUpSubmitting ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="glass-panel rounded-2xl h-[600px] flex flex-col items-center justify-center text-center p-8 border border-border-glass">
            <HelpCircle className="w-12 h-12 text-gray-600 animate-bounce mb-3" />
            <h4 className="text-sm font-bold text-gray-300">No active thread selected</h4>
            <p className="text-xs text-gray-500 max-w-[200px] mt-1 leading-normal">Select an item from the doubts list to view the conversation.</p>
          </div>
        )}
      </div>

    </div>
  );
}
