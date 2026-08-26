import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Search, Filter, Calendar, Users, ExternalLink, Sparkles, 
  MapPin, Clock, Tag, Plus, CheckCircle2, Bookmark, BookmarkCheck, 
  ArrowRight, ShieldCheck, Flame, Share2, MessageSquare, Lightbulb, 
  Send, UserPlus, X, Globe, Award, Laptop, Rocket, Zap, MessageCircle, 
  Briefcase, Check, UserCheck, ChevronRight, Phone, Mail, Code2, Building2,
  DollarSign, FileText, Layers, TrendingUp, GraduationCap
} from 'lucide-react';
import { 
  DEFAULT_HACKATHONS, 
  HACKATHON_CATEGORIES, 
  HACKATHON_MODES, 
  HACKATHON_PLATFORMS, 
  POPULAR_HACKATHON_PORTALS 
} from '../data/hackathonsData';
import { 
  DEFAULT_INTERNSHIPS, 
  INTERNSHIP_DOMAINS, 
  INTERNSHIP_BATCHES 
} from '../data/internshipsData';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, setDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { callAICompletion } from '../services/aiService';

export default function HackathonPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const isFounder = user?.role === 'founder' || user?.email?.toLowerCase() === 'founder@lumixora.com';
  const isFaculty = user?.role === 'faculty' || user?.role === 'mentor' || isFounder;

  // Global Tab Mode: 'hackathons', 'internships', 'squads', 'bookmarked'
  const [activeTabMode, setActiveTabMode] = useState('hackathons');
  
  // ── 1. HACKATHONS STATE ───────────────────────────────────────────
  const [hackathons, setHackathons] = useState(DEFAULT_HACKATHONS);
  const [customHackathons, setCustomHackathons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // ── 2. INTERNSHIPS STATE ──────────────────────────────────────────
  const [internships, setInternships] = useState(DEFAULT_INTERNSHIPS);
  const [customInternships, setCustomInternships] = useState([]);
  const [internshipSearchQuery, setInternshipSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');

  // ── 3. BOOKMARKED OPPORTUNITIES ───────────────────────────────────
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lumixora_bookmarked_hackathons') || '[]');
    } catch {
      return [];
    }
  });

  // ── 4. SQUAD & TALENT STATE ───────────────────────────────────────
  const [squadPosts, setSquadPosts] = useState([]);
  const [freeAgents, setFreeAgents] = useState([]);
  const [squadViewTab, setSquadViewTab] = useState('teams'); // 'teams', 'freeAgents', 'aiMatch'
  const [squadSearchQuery, setSquadSearchQuery] = useState('');
  const [squadRoleFilter, setSquadRoleFilter] = useState('All Roles');
  const [squadCollegeFilter, setSquadCollegeFilter] = useState('All Campuses');
  const [squadHackathonFilter, setSquadHackathonFilter] = useState('All Hackathons');

  // Modals
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [squadForm, setSquadForm] = useState({
    hackathonTitle: 'Smart India Hackathon (SIH)',
    teamName: '',
    requiredRoles: 'Frontend (React) & UI/UX Designer',
    skillsRequired: 'React, Tailwind, Figma, REST APIs',
    teamSize: '2 Members Needed',
    contactWhatsapp: '',
    contactEmail: '',
    preferredCollege: 'Open to All Campuses',
    description: ''
  });

  const [isFreeAgentModalOpen, setIsFreeAgentModalOpen] = useState(false);
  const [freeAgentForm, setFreeAgentForm] = useState({
    primaryRole: 'Frontend Developer',
    skillsText: 'React, Tailwind, JavaScript, Next.js',
    targetHackathons: 'Smart India Hackathon, Google Solution Challenge, Flipkart GRiD',
    portfolioLink: '',
    contactWhatsapp: '',
    bio: ''
  });

  // AI Hackathon Ideator State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSelectedHackathon, setAiSelectedHackathon] = useState(null);
  const [aiTechStack, setAiTechStack] = useState('React, Python, Tailwind, Gemini AI, Firebase');
  const [aiTargetTrack, setAiTargetTrack] = useState('AI in Healthcare & Education');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // AI Internship Pitch & Cover Letter State
  const [isInternshipAiModalOpen, setIsInternshipAiModalOpen] = useState(false);
  const [aiSelectedInternship, setAiSelectedInternship] = useState(null);
  const [aiInternSkills, setAiInternSkills] = useState('Java, Python, Data Structures, React, SQL');
  const [aiInternGenerating, setAiInternGenerating] = useState(false);
  const [aiInternResult, setAiInternResult] = useState(null);

  // AI Smart Squad Matcher State
  const [aiMatching, setAiMatching] = useState(false);
  const [aiMatchResult, setAiMatchResult] = useState(null);

  // Founder/Faculty Create Opportunities Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState('hackathon'); // 'hackathon' or 'internship'
  
  const [newHackathon, setNewHackathon] = useState({
    title: '',
    organizer: '',
    platform: 'Custom / Campus',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    mode: 'Online',
    category: 'AI / ML',
    tagsText: 'AI, Web, Campus',
    deadline: '',
    startDate: '',
    prizePool: '₹50,000+',
    firstPrize: '₹25,000',
    teamSize: '2 - 4 Members',
    eligibility: 'All College Students',
    location: 'Virtual / Campus Center',
    applyUrl: '',
    description: ''
  });

  const [newInternship, setNewInternship] = useState({
    title: '',
    company: '',
    domain: 'Software Engineering',
    role: 'SDE Intern',
    stipend: '₹50,000 / month',
    duration: '2 - 6 Months',
    location: 'Bengaluru (Hybrid)',
    batchesText: '2026 Batch, 2027 Batch',
    skillsText: 'Java, Python, React, SQL',
    deadline: '',
    applyUrl: '',
    description: ''
  });

  const cleanUserName = user?.name ? user.name.split('{')[0].trim() : (user?.email?.split('@')[0] || 'Scholar');
  const userCollege = user?.college || 'GPREC';

  // 1. Sync custom hackathons from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'hackathons'), (snap) => {
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setCustomHackathons(list);
      }, (e) => console.warn('Custom hackathons load error:', e));

      return () => unsub();
    } catch (e) {}
  }, []);

  // 2. Sync custom internships from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'internships'), (snap) => {
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setCustomInternships(list);
      }, (e) => console.warn('Custom internships load error:', e));

      return () => unsub();
    } catch (e) {}
  }, []);

  // 3. Sync Squad Posts from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'hackathon_squads'), (snap) => {
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setSquadPosts(list);
      }, (e) => console.warn('Squad posts load error:', e));

      return () => unsub();
    } catch (e) {}
  }, []);

  // 4. Sync Free Agents from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'hackathon_free_agents'), (snap) => {
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setFreeAgents(list);
      }, (e) => console.warn('Free agents load error:', e));

      return () => unsub();
    } catch (e) {}
  }, []);

  // Merge default + custom hackathons & internships
  const allHackathons = useMemo(() => {
    const customIds = new Set(customHackathons.map(h => h.id));
    const mergedDefaults = DEFAULT_HACKATHONS.filter(h => !customIds.has(h.id));
    return [...customHackathons, ...mergedDefaults];
  }, [customHackathons]);

  const allInternships = useMemo(() => {
    const customIds = new Set(customInternships.map(i => i.id));
    const mergedDefaults = DEFAULT_INTERNSHIPS.filter(i => !customIds.has(i.id));
    return [...customInternships, ...mergedDefaults];
  }, [customInternships]);

  // Toggle Bookmark
  const toggleBookmark = (id) => {
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(item => item !== id);
      addToast({ message: 'Removed from your bookmarks.', type: 'info' });
    } else {
      updated = [...bookmarkedIds, id];
      addToast({ message: 'Saved to your career watchlist!', type: 'success' });
    }
    setBookmarkedIds(updated);
    localStorage.setItem('lumixora_bookmarked_hackathons', JSON.stringify(updated));
  };

  // Filtered Hackathons
  const filteredHackathons = useMemo(() => {
    return allHackathons.filter(h => {
      if (activeTabMode === 'bookmarked' && !bookmarkedIds.includes(h.id)) return false;
      if (selectedCategory !== 'All' && h.category !== selectedCategory) return false;
      if (selectedPlatform !== 'All Platforms' && h.platform !== selectedPlatform) return false;
      if (selectedMode !== 'All' && h.mode !== selectedMode) return false;
      if (selectedStatus !== 'All' && h.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = h.title?.toLowerCase().includes(q);
        const matchOrg = h.organizer?.toLowerCase().includes(q);
        const matchCategory = h.category?.toLowerCase().includes(q);
        const matchPlatform = h.platform?.toLowerCase().includes(q);
        const matchTags = (h.tags || []).some(t => t.toLowerCase().includes(q));
        const matchLoc = h.location?.toLowerCase().includes(q);
        return matchTitle || matchOrg || matchCategory || matchPlatform || matchTags || matchLoc;
      }

      return true;
    });
  }, [allHackathons, activeTabMode, bookmarkedIds, selectedCategory, selectedPlatform, selectedMode, selectedStatus, searchQuery]);

  // Filtered Internships
  const filteredInternships = useMemo(() => {
    return allInternships.filter(i => {
      if (activeTabMode === 'bookmarked' && !bookmarkedIds.includes(i.id)) return false;
      if (selectedDomain !== 'All Domains' && i.domain !== selectedDomain) return false;
      if (selectedBatch !== 'All Batches') {
        const hasBatch = (i.batches || []).some(b => b.toLowerCase().includes(selectedBatch.toLowerCase()));
        if (!hasBatch) return false;
      }

      if (internshipSearchQuery.trim()) {
        const q = internshipSearchQuery.toLowerCase();
        const matchTitle = i.title?.toLowerCase().includes(q);
        const matchComp = i.company?.toLowerCase().includes(q);
        const matchDomain = i.domain?.toLowerCase().includes(q);
        const matchRole = i.role?.toLowerCase().includes(q);
        const matchSkills = (i.skills || []).some(s => s.toLowerCase().includes(q));
        const matchLoc = i.location?.toLowerCase().includes(q);
        return matchTitle || matchComp || matchDomain || matchRole || matchSkills || matchLoc;
      }

      return true;
    });
  }, [allInternships, activeTabMode, bookmarkedIds, selectedDomain, selectedBatch, internshipSearchQuery]);

  // Filtered Squad Posts
  const filteredSquadPosts = useMemo(() => {
    return squadPosts.filter(sq => {
      if (squadRoleFilter !== 'All Roles') {
        const rFilter = squadRoleFilter.toLowerCase();
        const roles = (sq.requiredRoles || '').toLowerCase();
        const skills = (sq.skillsRequired || '').toLowerCase();
        if (!roles.includes(rFilter) && !skills.includes(rFilter)) return false;
      }

      if (squadCollegeFilter !== 'All Campuses') {
        const cFilter = squadCollegeFilter.toLowerCase();
        const authorCol = (sq.authorCollege || '').toLowerCase();
        const prefCol = (sq.preferredCollege || '').toLowerCase();
        if (!authorCol.includes(cFilter) && !prefCol.includes(cFilter) && !prefCol.includes('open')) return false;
      }

      if (squadHackathonFilter !== 'All Hackathons') {
        if (!sq.hackathonTitle?.toLowerCase().includes(squadHackathonFilter.toLowerCase())) return false;
      }

      if (squadSearchQuery.trim()) {
        const q = squadSearchQuery.toLowerCase();
        const matchTitle = sq.hackathonTitle?.toLowerCase().includes(q);
        const matchTeam = sq.teamName?.toLowerCase().includes(q);
        const matchRoles = sq.requiredRoles?.toLowerCase().includes(q);
        const matchSkills = sq.skillsRequired?.toLowerCase().includes(q);
        const matchAuthor = sq.authorName?.toLowerCase().includes(q);
        const matchCol = sq.authorCollege?.toLowerCase().includes(q);
        return matchTitle || matchTeam || matchRoles || matchSkills || matchAuthor || matchCol;
      }

      return true;
    });
  }, [squadPosts, squadRoleFilter, squadCollegeFilter, squadHackathonFilter, squadSearchQuery]);

  // Filtered Free Agents
  const filteredFreeAgents = useMemo(() => {
    return freeAgents.filter(fa => {
      if (squadRoleFilter !== 'All Roles') {
        const rFilter = squadRoleFilter.toLowerCase();
        const role = (fa.primaryRole || '').toLowerCase();
        const skills = (fa.skillsText || '').toLowerCase();
        if (!role.includes(rFilter) && !skills.includes(rFilter)) return false;
      }

      if (squadCollegeFilter !== 'All Campuses') {
        const cFilter = squadCollegeFilter.toLowerCase();
        const col = (fa.authorCollege || '').toLowerCase();
        if (!col.includes(cFilter)) return false;
      }

      if (squadSearchQuery.trim()) {
        const q = squadSearchQuery.toLowerCase();
        const matchName = fa.authorName?.toLowerCase().includes(q);
        const matchRole = fa.primaryRole?.toLowerCase().includes(q);
        const matchSkills = fa.skillsText?.toLowerCase().includes(q);
        const matchTargets = fa.targetHackathons?.toLowerCase().includes(q);
        const matchCol = fa.authorCollege?.toLowerCase().includes(q);
        return matchName || matchRole || matchSkills || matchTargets || matchCol;
      }

      return true;
    });
  }, [freeAgents, squadRoleFilter, squadCollegeFilter, squadSearchQuery]);

  // Handle Post Squad
  const handlePostSquad = async (e) => {
    e.preventDefault();
    if (!squadForm.hackathonTitle || !squadForm.requiredRoles || (!squadForm.contactWhatsapp && !squadForm.contactEmail)) {
      addToast({ message: 'Please specify the hackathon, roles needed, and at least one contact method.', type: 'warning' });
      return;
    }

    const squadData = {
      ...squadForm,
      authorName: cleanUserName,
      authorEmail: user?.email || '',
      authorCollege: userCollege,
      authorRole: user?.role || 'student',
      status: 'Recruiting',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'hackathon_squads'), squadData);
      addToast({ message: 'Squad teammate request published! Campus peers can now apply.', type: 'success' });
      setIsSquadModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to post squad request.', type: 'error' });
    }
  };

  // Handle Post Free Agent
  const handlePostFreeAgent = async (e) => {
    e.preventDefault();
    if (!freeAgentForm.primaryRole || !freeAgentForm.skillsText || !freeAgentForm.contactWhatsapp) {
      addToast({ message: 'Primary role, skills, and contact WhatsApp number are required.', type: 'warning' });
      return;
    }

    const agentData = {
      ...freeAgentForm,
      authorName: cleanUserName,
      authorEmail: user?.email || '',
      authorCollege: userCollege,
      authorRole: user?.role || 'student',
      status: 'Available',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'hackathon_free_agents'), agentData);
      addToast({ message: 'Your Free Agent profile is live! Team leaders can now recruit you.', type: 'success' });
      setIsFreeAgentModalOpen(false);
      setSquadViewTab('freeAgents');
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to post free agent profile.', type: 'error' });
    }
  };

  // Handle Post New Internship (Founder / Faculty)
  const handleCreateInternship = async (e) => {
    e.preventDefault();
    if (!newInternship.title || !newInternship.company || !newInternship.applyUrl) {
      addToast({ message: 'Title, company, and official apply URL are required.', type: 'warning' });
      return;
    }

    const batches = newInternship.batchesText.split(',').map(b => b.trim()).filter(Boolean);
    const skills = newInternship.skillsText.split(',').map(s => s.trim()).filter(Boolean);

    const internData = {
      ...newInternship,
      batches,
      skills,
      status: 'Actively Hiring',
      logo: '💼',
      postedBy: cleanUserName,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'internships'), internData);
      addToast({ message: `Internship at "${newInternship.company}" published!`, type: 'success' });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to post internship.', type: 'error' });
    }
  };

  // Handle Post New Campus Hackathon
  const handleCreateHackathon = async (e) => {
    e.preventDefault();
    if (!newHackathon.title || !newHackathon.organizer || !newHackathon.applyUrl) {
      addToast({ message: 'Title, organizing club/dept, and registration URL are required.', type: 'warning' });
      return;
    }

    const tags = (newHackathon.tagsText || 'Campus Hackathon, College').split(',').map(t => t.trim()).filter(Boolean);
    const hackathonData = {
      ...newHackathon,
      tags,
      status: 'Open',
      featured: true,
      postedBy: cleanUserName,
      postedByCollege: userCollege,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'hackathons'), hackathonData);
      addToast({ message: `Campus Hackathon "${newHackathon.title}" published successfully!`, type: 'success' });
      setIsCreateModalOpen(false);
      setNewHackathon({
        title: '',
        organizer: `${userCollege} Tech Club`,
        platform: userCollege,
        banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        mode: 'Offline',
        category: 'AI / ML',
        tagsText: 'Campus Hackathon, Coding, College Fest',
        deadline: '',
        startDate: '',
        prizePool: '₹25,000+',
        firstPrize: '₹15,000',
        teamSize: '2 - 4 Members',
        eligibility: 'All College Students',
        location: `${userCollege} Campus / Lab`,
        applyUrl: '',
        description: ''
      });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to publish campus hackathon.', type: 'error' });
    }
  };

  // Run AI Smart Squad Matcher
  const handleRunAiSmartMatch = async () => {
    setAiMatching(true);
    setAiMatchResult(null);

    const userProfileSummary = `Scholar: ${cleanUserName}, College: ${userCollege}, Branch: ${user?.department || 'CSE'}, Role: ${user?.role || 'Student'}`;
    const openSquadsSnippet = squadPosts.slice(0, 8).map((sq, i) => `${i+1}. [${sq.hackathonTitle}] Team: "${sq.teamName || 'Squad'}" needs: ${sq.requiredRoles} | Skills: ${sq.skillsRequired} | College: ${sq.authorCollege}`).join('\n');

    const prompt = `You are Lumixora AI Squad Formation Engine.
Based on the student's profile:
${userProfileSummary}

And the current open hackathon squads looking for teammates:
${openSquadsSnippet || '1. Smart India Hackathon: Needs UI/UX & Backend\n2. Google Solution Challenge: Needs Flutter & Firebase\n3. Flipkart GRiD: Needs GenAI & High Scale'}

Analyze compatibility and provide a top 3 smart match recommendations in Markdown with:
1. 🎯 **Top 3 Recommended Squads with Compatibility % (e.g. 96% Match)**
2. 💡 **Why You Complement This Team**
3. 🚀 **Recommended Pitch to Team Leader** (Ready to copy-paste into WhatsApp).`;

    try {
      const response = await callAICompletion({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });
      setAiMatchResult(response);
    } catch (err) {
      setAiMatchResult(`### 🤖 AI Smart Match Analysis\n\n**1. Smart India Hackathon (95% Match)**\n* Reason: Strong complementary skill match for rapid MVP prototyping.\n* Suggested Pitch: *"Hi! I saw your SIH squad on Lumixora. I can handle full frontend architecture & deployment."*`);
    } finally {
      setAiMatching(false);
    }
  };

  // Handle AI Internship Application Co-Pilot
  const handleGenerateInternshipPitch = async () => {
    if (!aiSelectedInternship) return;
    setAiInternGenerating(true);
    setAiInternResult(null);

    const prompt = `You are an Elite Tech Career Recruiter & Google/Amazon Interview Coach.
I am applying for the internship: "${aiSelectedInternship.title}" at "${aiSelectedInternship.company}".
Role: "${aiSelectedInternship.role}" | Domain: "${aiSelectedInternship.domain}"
My Skills: "${aiInternSkills}"
My College: "${userCollege}"

Generate a high-converting candidate application kit in clean Markdown with:
1. ✉️ **High-Impact Recruiter Cold InMail / Email Message** (Concise, punchy, demonstrating direct impact)
2. 🎯 **3 Tailored Resume Bullet Points** (Using Google XYZ formula: Accomplished [X] as measured by [Y] by doing [Z])
3. 🧠 **Top 5 Interview & Coding Questions** frequently asked by ${aiSelectedInternship.company} for this specific role.`;

    try {
      const response = await callAICompletion({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });
      setAiInternResult(response);
    } catch (err) {
      console.error(err);
      setAiInternResult(`### 📄 Recruiter Pitch Kit for ${aiSelectedInternship.company}\n\n**Subject:** Application for ${aiSelectedInternship.role} - ${cleanUserName}\n\nHi [Recruiter Name],\n\nI noticed ${aiSelectedInternship.company} is hiring for ${aiSelectedInternship.role}. With hands-on experience in ${aiInternSkills}, I built high-concurrency systems that handle real-time workloads with sub-50ms latency. I'd love to contribute to your engineering team.`);
    } finally {
      setAiInternGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fade-in text-[var(--text-main)] px-4 sm:px-6">
      
      {/* ── Top Hero Showcase ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-black/80 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4" /> Global Innovation & Career Launchpad
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Hackathons, SDE Internships & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-blue to-brand-purple">
                Elite Hiring Radar
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Discover verified high-stipend software engineering internships (Google, Amazon, Goldman Sachs, DE Shaw), 25+ national hackathons (SIH, Flipkart, ETHIndia), and form multi-campus squads across GPREC & Ashoka College.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-brand-teal" />
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Top Tier Internships</span>
                  <span className="text-base font-black text-white">{allInternships.length} Actively Hiring</span>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Active Hackathons</span>
                  <span className="text-base font-black text-white">{allHackathons.length} Live Tracks</span>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Max Stipend Pool</span>
                  <span className="text-base font-black text-emerald-400">Up to ₹2,00,000/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveTabMode('internships')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4" /> Browse Elite Internships
            </button>

            <button
              onClick={() => {
                setActiveTabMode('squads');
                setSquadViewTab('teams');
              }}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-400" /> 🔍 Advanced Team Search
            </button>

            <button
              onClick={() => {
                setCreateType('hackathon');
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/20 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> + Post College Hackathon / Fest
            </button>
          </div>
        </div>
      </div>

      {/* ── Direct Hackathon Aggregators Quick Launch Bar ────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400 font-bold px-1">
          <span className="flex items-center gap-1.5 text-gray-300">
            <Globe className="w-3.5 h-3.5 text-brand-teal" /> Official Career & Hackathon Ecosystems
          </span>
          <span className="text-[11px] text-gray-500 hidden sm:inline">1-Click Direct Application Platforms</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {POPULAR_HACKATHON_PORTALS.map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel p-3 rounded-2xl border border-white/10 hover:border-brand-teal/50 hover:bg-white/[0.06] transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{portal.logo}</span>
                <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-brand-teal transition-colors" />
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold text-white group-hover:text-brand-teal transition-colors line-clamp-1">
                  {portal.name}
                </h4>
                <span className="text-[10px] text-gray-400 font-medium">{portal.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Top Level View Mode (Hackathons vs Internships vs Squads vs Watchlist) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTabMode('hackathons')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'hackathons'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md scale-[1.02]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" /> 🏆 Hackathons & Challenges ({allHackathons.length})
          </button>

          <button
            onClick={() => setActiveTabMode('internships')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'internships'
                ? 'bg-gradient-to-r from-brand-teal to-brand-blue text-black shadow-md scale-[1.02]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> 💼 Elite SDE Internships ({allInternships.length})
          </button>

          <button
            onClick={() => setActiveTabMode('squads')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'squads'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> 👥 Team Search & Squad Matcher ({squadPosts.length + freeAgents.length})
          </button>

          <button
            onClick={() => setActiveTabMode('bookmarked')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'bookmarked'
                ? 'bg-white text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved ({bookmarkedIds.length})
          </button>
        </div>

        {/* Dynamic Search & Actions */}
        {activeTabMode === 'hackathons' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hackathons, stack, host..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <button
              onClick={() => {
                setCreateType('hackathon');
                setIsCreateModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Post Hackathon
            </button>
          </div>
        )}

        {activeTabMode === 'internships' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={internshipSearchQuery}
              onChange={(e) => setInternshipSearchQuery(e.target.value)}
              placeholder="Search companies, skills, roles..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-teal transition-colors"
            />
          </div>
        )}
      </div>

      {/* ── SECTION 1: HACKATHONS VIEW ───────────────────────────────── */}
      {activeTabMode === 'hackathons' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                {HACKATHON_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-black shadow-sm scale-[1.02]'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mode:</span>
                {HACKATHON_MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMode(m)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedMode === m ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider whitespace-nowrap mr-1">Host / Platform:</span>
              {HACKATHON_PLATFORMS.map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedPlatform === plat ? 'bg-purple-600 text-white font-bold shadow-sm' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Hackathons Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((h) => {
              const isBookmarked = bookmarkedIds.includes(h.id);
              const isUrgent = h.status === 'Closing Soon';

              return (
                <div
                  key={h.id}
                  className="glass-panel rounded-3xl border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg relative"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-black/40">
                    <img
                      src={h.banner}
                      alt={h.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-md ${
                        h.mode === 'Online' ? 'bg-blue-500/80 text-white' : h.mode === 'Offline' ? 'bg-purple-500/80 text-white' : 'bg-emerald-500/80 text-white'
                      }`}>
                        {h.mode}
                      </span>

                      <button
                        onClick={() => toggleBookmark(h.id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                          isBookmarked ? 'bg-amber-400 text-black' : 'bg-black/60 text-white hover:bg-black/80'
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-amber-300 text-[11px] font-bold">
                        {h.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span>{h.organizer}</span>
                      </p>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
                        {h.title}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
                        {h.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(h.tags || []).slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-300 font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" /> Prize Pool:
                        </span>
                        <span className="font-extrabold text-emerald-400">{h.prizePool}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-purple-400" /> Team Size:
                        </span>
                        <span className="font-semibold text-gray-200">{h.teamSize}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" /> Register By:
                        </span>
                        <span className={`font-bold ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-gray-200'}`}>
                          {h.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAiSelectedHackathon(h);
                        setIsAiModalOpen(true);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-400/20 text-amber-300 border border-white/10 transition-all"
                      title="AI Project Pitch & Ideator"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTabMode('squads');
                        setSquadViewTab('teams');
                        setSquadHackathonFilter(h.title);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-600/20 text-purple-300 border border-white/10 transition-all"
                      title="Find Teammates for this Hackathon"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>

                    <a
                      href={h.applyUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-md"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECTION 2: ELITE INTERNSHIPS VIEW ────────────────────────── */}
      {activeTabMode === 'internships' && (
        <div className="space-y-6">
          {/* Domain & Batch Filters */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                {INTERNSHIP_DOMAINS.map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedDomain === dom
                        ? 'bg-brand-teal text-black shadow-sm scale-[1.02]'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Eligible Batch:</span>
                {INTERNSHIP_BATCHES.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBatch(b)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedBatch === b ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Internships Grid */}
          {filteredInternships.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-white/10 space-y-4">
              <Briefcase className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-xl font-bold text-white">No Internships Match Your Filter</h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto">
                Try selecting "All Domains" or "All Batches" to explore all available tech internships.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((intern) => {
                const isBookmarked = bookmarkedIds.includes(intern.id);

                return (
                  <div
                    key={intern.id}
                    className="glass-panel rounded-3xl border border-white/10 hover:border-brand-teal/50 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg"
                  >
                    <div className="p-6 space-y-4">
                      {/* Top Company Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                            {intern.logo || '🏢'}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-white group-hover:text-brand-teal transition-colors">
                              {intern.company}
                            </h4>
                            <span className="text-[11px] text-gray-400 font-medium">📍 {intern.location}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleBookmark(intern.id)}
                          className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                            isBookmarked ? 'bg-amber-400 text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Title & Role */}
                      <div>
                        <h3 className="text-base font-black text-white line-clamp-1 mb-1">
                          {intern.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {intern.description}
                        </p>
                      </div>

                      {/* Key Meta Badges */}
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Stipend:
                          </span>
                          <span className="font-black text-emerald-400">{intern.stipend}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Duration:
                          </span>
                          <span className="font-semibold text-gray-200">{intern.duration}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Batches:
                          </span>
                          <span className="font-bold text-purple-300">{(intern.batches || []).join(', ')}</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {(intern.skills || []).slice(0, 4).map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-300 font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setAiSelectedInternship(intern);
                          setIsInternshipAiModalOpen(true);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-brand-teal/20 text-brand-teal border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="AI Recruiter Pitch & Cover Letter"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden sm:inline">AI Pitch Kit</span>
                      </button>

                      <a
                        href={intern.applyUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-md"
                      >
                        <span>Apply Official</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 3: ADVANCED SQUAD MATCHER ────────────────────────── */}
      {activeTabMode === 'squads' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black/60 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" /> Multi-Campus Squad Intelligence Engine
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Advanced Team Search & Recruitment
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Connect complementary skillsets across GPREC & Ashoka College. Recruit developers, UI/UX designers, and ML engineers or join an active squad with 1 click.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setIsSquadModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> + Post Open Squad
                </button>

                <button
                  onClick={() => setIsFreeAgentModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" /> + Join as Free Agent
                </button>

                <button
                  onClick={handleRunAiSmartMatch}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-brand-teal border border-brand-teal/40 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> AI Smart Match
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 pt-4 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setSquadViewTab('teams')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  squadViewTab === 'teams' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> 🛡️ Open Squads Seeking Members ({squadPosts.length})
              </button>

              <button
                onClick={() => setSquadViewTab('freeAgents')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  squadViewTab === 'freeAgents' ? 'bg-brand-teal text-black shadow-md font-black' : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> 🌟 Free Agent Talent Pool ({freeAgents.length})
              </button>

              <button
                onClick={() => {
                  setSquadViewTab('aiMatch');
                  if (!aiMatchResult) handleRunAiSmartMatch();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  squadViewTab === 'aiMatch' ? 'bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-md' : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> 🤖 AI Squad Matcher
              </button>
            </div>
          </div>

          {/* Squad Filters */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={squadSearchQuery}
                  onChange={(e) => setSquadSearchQuery(e.target.value)}
                  placeholder="Search by skill, role, team, college..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <select
                  value={squadHackathonFilter}
                  onChange={(e) => setSquadHackathonFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="All Hackathons">All Target Hackathons</option>
                  <option value="Smart India Hackathon">Smart India Hackathon (SIH)</option>
                  <option value="Google Solution Challenge">Google Solution Challenge</option>
                  <option value="Flipkart GRiD">Flipkart GRiD</option>
                  <option value="ETHIndia">ETHIndia Global</option>
                  <option value="Walmart Sparkathon">Walmart Sparkathon</option>
                </select>
              </div>

              <div>
                <select
                  value={squadCollegeFilter}
                  onChange={(e) => setSquadCollegeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="All Campuses">All Campuses / Networks</option>
                  <option value="GPREC">G. Pulla Reddy Engineering College (GPREC)</option>
                  <option value="Ashoka">Ashoka Women's Engineering College</option>
                  <option value="Open">Open to Inter-College Collaborations</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teams / Free Agents View */}
          {squadViewTab === 'teams' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSquadPosts.map((sq) => {
                const waLink = sq.contactWhatsapp 
                  ? `https://wa.me/${sq.contactWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${sq.authorName}, I saw your squad post on Lumixora for "${sq.hackathonTitle}". I'd love to join your team!`)}`
                  : null;

                return (
                  <div
                    key={sq.id}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2.5 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[10px] font-black uppercase tracking-wider">
                            🏆 {sq.hackathonTitle}
                          </span>
                          <h3 className="text-lg font-black text-white mt-2 group-hover:text-purple-300 transition-colors">
                            {sq.teamName ? `Team: ${sq.teamName}` : `Squad by ${sq.authorName}`}
                          </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-black text-purple-300 shrink-0">
                          ⚡ {sq.teamSize}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400 font-semibold shrink-0">🎯 Roles:</span>
                          <span className="font-extrabold text-amber-300">{sq.requiredRoles}</span>
                        </div>
                        {sq.skillsRequired && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 font-semibold shrink-0">🛠️ Skills:</span>
                            <span className="text-gray-300 font-mono text-[11px]">{sq.skillsRequired}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                        {sq.description || 'Looking for skilled developers and UI/UX designers to collaborate, prototype, and submit a winning hackathon solution.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center font-black text-brand-teal text-sm">
                          {sq.authorName?.[0] || 'S'}
                        </div>
                        <div>
                          <span className="block font-bold text-white text-xs">{sq.authorName}</span>
                          <span className="text-[11px] text-gray-400">🏛️ {sq.authorCollege}</span>
                        </div>
                      </div>

                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <a
                          href={`mailto:${sq.contactEmail || sq.authorEmail}`}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Lead</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {squadViewTab === 'freeAgents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreeAgents.map((fa) => {
                const waLink = fa.contactWhatsapp 
                  ? `https://wa.me/${fa.contactWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${fa.authorName}, I saw your Free Agent profile on Lumixora. We would love to invite you to our hackathon team!`)}`
                  : null;

                return (
                  <div
                    key={fa.id}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-brand-teal/50 transition-all flex flex-col justify-between space-y-4 group shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center font-black text-brand-teal text-base">
                            {fa.authorName?.[0] || 'S'}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-white text-sm">{fa.authorName}</h3>
                            <span className="text-[11px] text-gray-400">🏛️ {fa.authorCollege}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-400">
                          🟢 Available
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                        <p className="text-xs font-bold text-brand-teal">
                          🚀 {fa.primaryRole}
                        </p>
                        <p className="text-[11px] text-gray-300 font-mono line-clamp-2">
                          🛠️ {fa.skillsText}
                        </p>
                      </div>

                      {fa.targetHackathons && (
                        <p className="text-[11px] text-gray-400">
                          🎯 <strong className="text-gray-300">Targeting:</strong> {fa.targetHackathons}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      {fa.portfolioLink ? (
                        <a
                          href={fa.portfolioLink.startsWith('http') ? fa.portfolioLink : `https://${fa.portfolioLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-teal hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Code2 className="w-3.5 h-3.5" /> Portfolio
                        </a>
                      ) : <div />}

                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Recruit to Team
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {squadViewTab === 'aiMatch' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Personalized Squad Recommendations for {cleanUserName}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    AI analyzes your branch ({user?.department || 'CSE'}), campus ({userCollege}), and current team gaps to match you with top squads.
                  </p>
                </div>

                <button
                  onClick={handleRunAiSmartMatch}
                  disabled={aiMatching}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-extrabold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-lg shrink-0"
                >
                  {aiMatching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>{aiMatching ? 'Matching Algorithms...' : 'Re-Run AI Match'}</span>
                </button>
              </div>

              {aiMatchResult && (
                <div className="p-6 rounded-2xl bg-black/50 border border-brand-pink/30 space-y-4">
                  <div className="text-gray-200 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-mono bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    {aiMatchResult}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL 1: AI Internship Recruiter Pitch & Cover Letter ──────── */}
      {isInternshipAiModalOpen && aiSelectedInternship && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setIsInternshipAiModalOpen(false); }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111122] to-[#0c0c14] shadow-2xl custom-scrollbar space-y-6">
            <button
              onClick={() => setIsInternshipAiModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Recruiter Application Kit
              </div>
              <h2 className="text-2xl font-black text-white">
                Application Kit for <span className="text-brand-teal">{aiSelectedInternship.company}</span>
              </h2>
              <p className="text-gray-400 text-xs">
                Role: {aiSelectedInternship.title} | Stipend: {aiSelectedInternship.stipend}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Your Core Skills & Projects</label>
                <input
                  type="text"
                  value={aiInternSkills}
                  onChange={(e) => setAiInternSkills(e.target.value)}
                  placeholder="e.g. Java, Python, React, Data Structures, FastAPI"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                />
              </div>

              <button
                onClick={handleGenerateInternshipPitch}
                disabled={aiInternGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                {aiInternGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Tailored Pitch & Technical Questions...</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Generate Cold Email, Resume Bullets & Top 5 Questions</span>
                  </>
                )}
              </button>
            </div>

            {aiInternResult && (
              <div className="p-5 rounded-2xl bg-black/50 border border-brand-teal/30 space-y-3">
                <div className="text-gray-200 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-mono bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {aiInternResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 2: AI Hackathon Co-Pilot & Project Ideator ─────────── */}
      {isAiModalOpen && aiSelectedHackathon && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setIsAiModalOpen(false); }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111122] to-[#0c0c14] shadow-2xl custom-scrollbar space-y-6">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Lumixora AI Hackathon Co-Pilot
              </div>
              <h2 className="text-2xl font-black text-white">
                Winning Project Ideator for <span className="text-amber-300">{aiSelectedHackathon.title}</span>
              </h2>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Target Track / Theme</label>
                <input
                  type="text"
                  value={aiTargetTrack}
                  onChange={(e) => setAiTargetTrack(e.target.value)}
                  placeholder="e.g. Generative AI in Healthcare, Smart Campus"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Your Team's Preferred Tech Stack</label>
                <input
                  type="text"
                  value={aiTechStack}
                  onChange={(e) => setAiTechStack(e.target.value)}
                  placeholder="e.g. React, Node.js, Python, Supabase, Tailwind, Gemini"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleGenerateAiIdea}
                disabled={aiGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                {aiGenerating ? 'Generating Strategy...' : 'Generate Winning Pitch & Roadmap'}
              </button>
            </div>

            {aiResult && (
              <div className="p-5 rounded-2xl bg-black/50 border border-amber-400/30 space-y-3">
                <div className="text-gray-200 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-mono bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {aiResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 3: Create Squad Post Modal ────────────────────────── */}
      {isSquadModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setIsSquadModalOpen(false); }}
        >
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111122] to-[#0c0c14] shadow-2xl space-y-6">
            <button
              onClick={() => setIsSquadModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-teal" /> Post Open Squad Requirement
            </h2>

            <form onSubmit={handlePostSquad} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Target Hackathon</label>
                <input
                  type="text"
                  required
                  value={squadForm.hackathonTitle}
                  onChange={(e) => setSquadForm(prev => ({ ...prev, hackathonTitle: e.target.value }))}
                  placeholder="e.g. Smart India Hackathon (SIH)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Roles Needed</label>
                  <input
                    type="text"
                    required
                    value={squadForm.requiredRoles}
                    onChange={(e) => setSquadForm(prev => ({ ...prev, requiredRoles: e.target.value }))}
                    placeholder="e.g. UI/UX Designer & Python Dev"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={squadForm.contactWhatsapp}
                    onChange={(e) => setSquadForm(prev => ({ ...prev, contactWhatsapp: e.target.value }))}
                    placeholder="e.g. 919346476055"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Description & Project Plan</label>
                <textarea
                  rows={3}
                  value={squadForm.description}
                  onChange={(e) => setSquadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your idea or team workflow..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" /> Publish Squad Requirement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Free Agent Profile Modal ────────────────────────── */}
      {isFreeAgentModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setIsFreeAgentModalOpen(false); }}
        >
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111122] to-[#0c0c14] shadow-2xl space-y-6">
            <button
              onClick={() => setIsFreeAgentModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-brand-teal" /> Join as Free Agent
            </h2>

            <form onSubmit={handlePostFreeAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Primary Role</label>
                <input
                  type="text"
                  required
                  value={freeAgentForm.primaryRole}
                  onChange={(e) => setFreeAgentForm(prev => ({ ...prev, primaryRole: e.target.value }))}
                  placeholder="e.g. Frontend Developer (React / Next.js)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Top Skills</label>
                <input
                  type="text"
                  required
                  value={freeAgentForm.skillsText}
                  onChange={(e) => setFreeAgentForm(prev => ({ ...prev, skillsText: e.target.value }))}
                  placeholder="e.g. React, Tailwind, Python, FastAPI"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={freeAgentForm.contactWhatsapp}
                  onChange={(e) => setFreeAgentForm(prev => ({ ...prev, contactWhatsapp: e.target.value }))}
                  placeholder="e.g. 919346476055"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <UserCheck className="w-4 h-4" /> Publish Free Agent Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 5: Post Opportunity / Campus Hackathon / Internship ── */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setIsCreateModalOpen(false); }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111122] to-[#0c0c14] shadow-2xl custom-scrollbar space-y-6">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-brand-teal" /> Post Opportunity / Campus Event
              </h2>
              <p className="text-gray-400 text-xs">
                Publish internal college hackathons, technical fest challenges, or campus hiring drives to Lumixora.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateType('hackathon')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    createType === 'hackathon' ? 'bg-amber-400 text-black shadow-md scale-[1.02]' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  🏆 Campus Hackathon / Fest
                </button>
                <button
                  type="button"
                  onClick={() => setCreateType('internship')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    createType === 'internship' ? 'bg-brand-teal text-black shadow-md scale-[1.02]' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  💼 SDE Internship
                </button>
              </div>
            </div>

            {/* ── 1. CAMPUS HACKATHON FORM ─────────────────────────────── */}
            {createType === 'hackathon' && (
              <form onSubmit={handleCreateHackathon} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Hackathon Title *</label>
                    <input
                      type="text"
                      required
                      value={newHackathon.title}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. GPREC CodeStorm 2026 / Ashoka InnovateX"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Organizing Club / College / Dept *</label>
                    <input
                      type="text"
                      required
                      value={newHackathon.organizer}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, organizer: e.target.value }))}
                      placeholder="e.g. Coding Club GPREC / CSE Dept"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Category</label>
                    <select
                      value={newHackathon.category}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="AI / ML">AI / ML</option>
                      <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                      <option value="Open Innovation">Open Innovation</option>
                      <option value="Competitive Programming">Competitive Programming</option>
                      <option value="E-Commerce & Robotics">E-Commerce & Robotics</option>
                      <option value="Cybersecurity & Cloud">Cybersecurity & Cloud</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Mode</label>
                    <select
                      value={newHackathon.mode}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, mode: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Offline">Offline (Campus Lab / Center)</option>
                      <option value="Online">Online / Virtual</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Team Size</label>
                    <input
                      type="text"
                      value={newHackathon.teamSize}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, teamSize: e.target.value }))}
                      placeholder="e.g. 2 - 4 Members"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Total Prize Pool</label>
                    <input
                      type="text"
                      value={newHackathon.prizePool}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, prizePool: e.target.value }))}
                      placeholder="e.g. ₹25,000 + Certificates"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">1st Prize Cash Award</label>
                    <input
                      type="text"
                      value={newHackathon.firstPrize}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, firstPrize: e.target.value }))}
                      placeholder="e.g. ₹15,000 Cash + Trophy"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Registration Deadline</label>
                    <input
                      type="date"
                      value={newHackathon.deadline}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Event Start Date</label>
                    <input
                      type="date"
                      value={newHackathon.startDate}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Venue / Campus Location</label>
                    <input
                      type="text"
                      value={newHackathon.location}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. CSE Seminar Hall / Lab 3"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Registration Link (Google Form / Unstop / Portal) *</label>
                  <input
                    type="url"
                    required
                    value={newHackathon.applyUrl}
                    onChange={(e) => setNewHackathon(prev => ({ ...prev, applyUrl: e.target.value }))}
                    placeholder="https://forms.gle/... or https://unstop.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Banner Image URL</label>
                    <input
                      type="text"
                      value={newHackathon.banner}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, banner: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={newHackathon.tagsText}
                      onChange={(e) => setNewHackathon(prev => ({ ...prev, tagsText: e.target.value }))}
                      placeholder="e.g. Campus Hackathon, GPREC, Cash Prize"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Description & Problem Themes</label>
                  <textarea
                    rows={3}
                    value={newHackathon.description}
                    onChange={(e) => setNewHackathon(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the themes, judging guidelines, and eligibility for college students..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-95 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Publish College Hackathon
                </button>
              </form>
            )}

            {/* ── 2. INTERNSHIP FORM ───────────────────────────────────── */}
            {createType === 'internship' && (
              <form onSubmit={handleCreateInternship} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Internship Title *</label>
                    <input
                      type="text"
                      required
                      value={newInternship.title}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Software Engineering Intern"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={newInternship.company}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Lumixora Labs / Partner Startup"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Domain</label>
                    <select
                      value={newInternship.domain}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, domain: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="FinTech & Quant">FinTech & Quant</option>
                      <option value="Cloud & AI">Cloud & AI</option>
                      <option value="Space Tech, IoT & Embedded">Space Tech, IoT & Embedded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Monthly Stipend</label>
                    <input
                      type="text"
                      value={newInternship.stipend}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, stipend: e.target.value }))}
                      placeholder="e.g. ₹50,000 / month"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Duration</label>
                    <input
                      type="text"
                      value={newInternship.duration}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g. 2 - 6 Months"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Eligible Batches (Comma Separated)</label>
                    <input
                      type="text"
                      value={newInternship.batchesText}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, batchesText: e.target.value }))}
                      placeholder="e.g. 2026 Batch, 2027 Batch"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={newInternship.location}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Remote / Bengaluru (Hybrid)"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Official Apply Link *</label>
                  <input
                    type="url"
                    required
                    value={newInternship.applyUrl}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, applyUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Job Description</label>
                  <textarea
                    rows={3}
                    value={newInternship.description}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe role responsibilities and perks..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-95 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Publish Internship Drive
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
