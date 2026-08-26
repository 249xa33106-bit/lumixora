import React, { useState, useEffect, useRef } from 'react';
import { summarizeChatMessages, callAICompletion } from '../services/aiService';
import { 
  Send, 
  Users, 
  Pin, 
  Mic, 
  Square, 
  BarChart2, 
  Sparkles,
  MessageSquare, 
  Shield,
  Search,
  Trash2,
  Image as ImageIcon,
  Reply,
  Heart,
  X,
  Loader2,
  Settings,
  MessageCircle,
  Plus,
  Eraser,
  Check,
  CheckCheck,
  Share2,
  Smile,
  Circle
} from 'lucide-react';
import { db, storage } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, doc, setDoc, deleteDoc, updateDoc, where } from 'firebase/firestore';
import { supabase } from '../config/supabase';
import { parseProfileName } from '../services/gamificationService';
import GroupAdminSettings from '../components/GroupAdminSettings';
import MessageFormatter from '../components/MessageFormatter';

export default function CommunityPortal({ user }) {
  const getRealUid = (u) => {
    if (!u) return 'anonymous';
    return u.uid || u.id || u.user_metadata?.sub || 'user';
  };

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const isFounder = user?.role === 'founder';
  const [allGroups, setAllGroups] = useState([]);
  const [searchGroup, setSearchGroup] = useState('');
  
  // New unified activeChat state: { type: 'group' | 'dm', id: string, name?: string, recipientId?: string }
  const [activeChat, setActiveChat] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  
  const [groupMetadata, setGroupMetadata] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Advanced Features State
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [chatSummary, setChatSummary] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  
  // DM Search State
  const [showDMSearch, setShowDMSearch] = useState(false);
  const [dmSearchQuery, setDmSearchQuery] = useState('');
  const [dmSearchResults, setDmSearchResults] = useState([]);
  const [isSearchingDM, setIsSearchingDM] = useState(false);

  // Presence & Typing State
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingMap, setTypingMap] = useState({});
  const typingTimeoutRef = useRef(null);

  // In-Chat Search State
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  // Forward & Emoji Picker State
  const [forwardingMsg, setForwardingMsg] = useState(null);
  const [activeEmojiPickerMsgId, setActiveEmojiPickerMsgId] = useState(null);

  const userDept = user?.department || user?.dept || user?.user_metadata?.department || '';
  const userSec = user?.sec || user?.section || user?.user_metadata?.sec || '';
  const userYear = user?.year || user?.yearOfStudy || user?.user_metadata?.year || '';

  const userGroupId = userDept && userSec && userYear 
    ? `${userDept.toUpperCase()}-${userSec.toUpperCase()}-${userYear.replace(/\s+/g, '-')}` 
    : 'General';

  useEffect(() => {
    const myUid = getRealUid(user);
    const myEmail = user?.email ? user.email.toLowerCase().trim() : '';
    if (!myUid && !myEmail) return;

    const dmRef = collection(db, 'direct_messages');
    const sourceMap = new Map();

    const updateDMs = () => {
      const dms = Array.from(sourceMap.values())
        .sort((a, b) => (b.lastActivity?.toMillis() || 0) - (a.lastActivity?.toMillis() || 0));
      setDirectMessages(dms);
    };

    const unsubUid = onSnapshot(query(dmRef, where('participants', 'array-contains', myUid)), (snap) => {
      snap.docs.forEach(d => sourceMap.set(d.id, { id: d.id, ...d.data() }));
      updateDMs();
    });

    let unsubEmail = () => {};
    if (myEmail) {
      unsubEmail = onSnapshot(query(dmRef, where('participants', 'array-contains', myEmail)), (snap) => {
        snap.docs.forEach(d => sourceMap.set(d.id, { id: d.id, ...d.data() }));
        updateDMs();
      });
    }

    return () => {
      unsubUid();
      unsubEmail();
    };
  }, [user]);

  // Presence Tracker
  useEffect(() => {
    if (!getRealUid(user)) return;
    const userPresenceRef = doc(db, 'presence', getRealUid(user));
    setDoc(userPresenceRef, {
      uid: getRealUid(user),
      name: user.name || 'Anonymous',
      online: true,
      lastSeen: serverTimestamp()
    }, { merge: true }).catch(() => {});

    const handleUnload = () => {
      setDoc(userPresenceRef, { online: false, lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
    };
    window.addEventListener('beforeunload', handleUnload);

    const unsub = onSnapshot(collection(db, 'presence'), (snapshot) => {
      const presence = {};
      snapshot.docs.forEach(d => {
        presence[d.id] = d.data().online;
      });
      setOnlineUsers(presence);
    });

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      setDoc(userPresenceRef, { online: false, lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
      unsub();
    };
  }, [user]);

  // Typing & Chat Meta Listener
  useEffect(() => {
    if (!activeChat?.id) return;
    const docPath = activeChat.type === 'group' ? `class_groups/${activeChat.id}` : `direct_messages/${activeChat.id}`;
    const unsub = onSnapshot(doc(db, docPath), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTypingMap(data.typing || {});
      } else {
        setTypingMap({});
      }
    });
    return () => unsub();
  }, [activeChat?.id, activeChat?.type]);

  const triggerTypingStatus = () => {
    if (!activeChat?.id || !getRealUid(user)) return;
    const docPath = activeChat.type === 'group' ? `class_groups/${activeChat.id}` : `direct_messages/${activeChat.id}`;
    const parsedName = parseProfileName(user.name || 'User').name;
    
    setDoc(doc(db, docPath), {
      typing: { [getRealUid(user)]: parsedName }
    }, { merge: true }).catch(() => {});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setDoc(doc(db, docPath), {
        typing: { [getRealUid(user)]: false }
      }, { merge: true }).catch(() => {});
    }, 2500);
  };

  // Read Receipts Auto-marking
  useEffect(() => {
    if (!activeChat?.id || !getRealUid(user) || messages.length === 0) return;
    const unread = messages.filter(m => m.senderId !== getRealUid(user) && (!m.seenBy || !m.seenBy.includes(getRealUid(user))));
    if (unread.length > 0) {
      const collectionPath = activeChat.type === 'group' 
        ? `class_groups/${activeChat.id}/messages`
        : `direct_messages/${activeChat.id}/messages`;
      
      unread.forEach(m => {
        const seenBy = [...(m.seenBy || []), getRealUid(user)];
        updateDoc(doc(db, collectionPath, m.id), { seenBy }).catch(() => {});
      });
    }
  }, [messages, activeChat?.id, getRealUid(user)]);

  useEffect(() => {
    if (!activeChat?.id) return;
    setLoading(true);
    setError(null);
    setReplyingTo(null);
    cancelImage();
    
    let messagesRef;
    let unsubGroup = () => {};
    
    if (activeChat.type === 'group') {
      messagesRef = collection(db, `class_groups/${activeChat.id}/messages`);
      const groupDocRef = doc(db, 'class_groups', activeChat.id);
      unsubGroup = onSnapshot(groupDocRef, (snap) => {
        if (snap.exists()) {
          setGroupMetadata(snap.data());
        } else {
          setGroupMetadata({ name: activeChat.id, admins: [], faculty: [], addedMembers: [] });
        }
      });
    } else {
      messagesRef = collection(db, `direct_messages/${activeChat.id}/messages`);
      setGroupMetadata(null);
    }

    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetched);
      setLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    }, (err) => {
      console.error("Error fetching messages:", err);
      setError("Unable to load messages. You might not have permission.");
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubGroup();
    };
  }, [activeChat?.id, activeChat?.type]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioMessage(audioBlob);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioMessage = async (audioBlob) => {
    if (!activeChat?.id) return;
    setIsUploading(true);
    try {
      const path = activeChat.type === 'group' ? `community/${activeChat.id}/${Date.now()}.webm` : `dms/${activeChat.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage.from('academic_resources').upload(path, audioBlob, { contentType: 'audio/webm' });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('academic_resources').getPublicUrl(path);
      
      const collectionPath = activeChat.type === 'group' ? `class_groups/${activeChat.id}/messages` : `direct_messages/${activeChat.id}/messages`;
      await addDoc(collection(db, collectionPath), {
        type: 'audio',
        audioUrl: publicUrl,
        senderId: getRealUid(user),
        senderName: user.name || 'Anonymous',
        senderRole: user.role || 'user',
        timestamp: serverTimestamp(),
        reactions: {}
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send audio.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageFile) || !activeChat?.id || isUploading) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsUploading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const path = activeChat.type === 'group' ? `community/${activeChat.id}/${Date.now()}_${imageFile.name}` : `dms/${activeChat.id}/${Date.now()}_${imageFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('academic_resources')
          .upload(path, imageFile, { cacheControl: '3600', upsert: false });
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('academic_resources')
          .getPublicUrl(path);
          
        imageUrl = publicUrl;
      }

      const collectionPath = activeChat.type === 'group' 
        ? `class_groups/${activeChat.id}/messages`
        : `direct_messages/${activeChat.id}/messages`;
        
      const messagesRef = collection(db, collectionPath);
      const messageData = {
        text: messageText,
        senderId: getRealUid(user),
        senderName: user.name || 'Anonymous User',
        senderRole: user.role || 'user',
        timestamp: serverTimestamp(),
        reactions: {},
      };

      if (imageUrl) messageData.imageUrl = imageUrl;
      if (replyingTo) {
        messageData.replyTo = {
          id: replyingTo.id,
          text: replyingTo.text || "Image",
          senderName: replyingTo.senderName
        };
      }

      const isAiTrigger = messageText && (messageText.toLowerCase().includes('@ai') || messageText.toLowerCase().startsWith('@ai'));

      await addDoc(messagesRef, messageData);
      
      if (activeChat.type === 'group') {
        await setDoc(doc(db, 'class_groups', activeChat.id), {
          lastActivity: serverTimestamp(),
          name: activeChat.id
        }, { merge: true });
      } else {
        await setDoc(doc(db, 'direct_messages', activeChat.id), {
          lastActivity: serverTimestamp(),
          lastMessage: messageText || 'Sent an image'
        }, { merge: true });
      }

      if (isAiTrigger) {
        const queryText = messageText.replace(/@ai/gi, '').trim() || messageText;
        triggerAiBotResponse(queryText, collectionPath, activeChat);
      }

      cancelImage();
      setReplyingTo(null);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerAiBotResponse = async (queryText, collectionPath, chatInfo) => {
    try {
      const systemPrompt = `You are Lumixora AI Assistant, a world-class academic mentor and coding expert in a university class chat room.
Answer the user's question with extreme clarity, step-by-step logic, code blocks (wrap code in \`\`\`language ... \`\`\`), and concise formatting. Keep responses focused and readable under 300 words.`;

      const aiText = await callAICompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: queryText }
        ],
        temperature: 0.3,
        maxTokens: 1200
      });

      const aiMsg = {
        text: aiText,
        senderId: 'lumixora-ai-assistant',
        senderName: 'Lumixora AI Assistant',
        senderRole: 'ai',
        isAi: true,
        timestamp: serverTimestamp(),
        reactions: {}
      };

      await addDoc(collection(db, collectionPath), aiMsg);

      if (chatInfo.type === 'group') {
        await setDoc(doc(db, 'class_groups', chatInfo.id), {
          lastActivity: serverTimestamp(),
          name: chatInfo.id
        }, { merge: true });
      } else {
        await setDoc(doc(db, 'direct_messages', chatInfo.id), {
          lastActivity: serverTimestamp(),
          lastMessage: '🤖 ' + (aiText.substring(0, 45) + '...')
        }, { merge: true });
      }
    } catch (err) {
      console.error("AI Assistant bot response error:", err);
    }
  };

  
  const handleSendPoll = async () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) {
      alert("Please fill all poll fields.");
      return;
    }
    try {
      const collectionPath = activeChat.type === 'group' ? `class_groups/${activeChat.id}/messages` : `direct_messages/${activeChat.id}/messages`;
      await addDoc(collection(db, collectionPath), {
        type: 'poll',
        question: pollQuestion,
        options: pollOptions.filter(o => o.trim()),
        votes: {}, // { userId: optionIndex }
        senderId: getRealUid(user),
        senderName: user.name || 'Anonymous',
        senderRole: user.role || 'user',
        timestamp: serverTimestamp(),
        reactions: {}
      });
      setShowPollCreator(false);
      setPollQuestion('');
      setPollOptions(['', '']);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (messageId, currentVotes, optionIndex) => {
    const collectionPath = activeChat.type === 'group' ? `class_groups/${activeChat.id}/messages` : `direct_messages/${activeChat.id}/messages`;
    const newVotes = { ...currentVotes };
    if (newVotes[getRealUid(user)] === optionIndex) {
      delete newVotes[getRealUid(user)];
    } else {
      newVotes[getRealUid(user)] = optionIndex;
    }
    await updateDoc(doc(db, collectionPath, messageId), { votes: newVotes });
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const collectionPath = activeChat.type === 'group' 
        ? `class_groups/${activeChat.id}/messages`
        : `direct_messages/${activeChat.id}/messages`;
      await deleteDoc(doc(db, collectionPath, messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. " + err.message);
    }
  };

  const handleClearChat = async () => {
    if (!activeChat) return;
    const chatName = activeChat.name || activeChat.id;
    if (!window.confirm(`⚠️ Clear ALL messages in "${chatName}"? This cannot be undone.`)) return;
    try {
      const collectionPath = activeChat.type === 'group'
        ? `class_groups/${activeChat.id}/messages`
        : `direct_messages/${activeChat.id}/messages`;
      const snap = await getDocs(collection(db, collectionPath));
      const batchSize = snap.docs.length;
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, collectionPath, d.id))));
      alert(`✅ Cleared ${batchSize} messages.`);
    } catch (err) {
      console.error("Error clearing chat:", err);
      alert("Failed to clear chat: " + err.message);
    }
  };

  
  const handlePinMessage = async (messageId, currentPinned) => {
    const collectionPath = activeChat.type === 'group' ? `class_groups/${activeChat.id}/messages` : `direct_messages/${activeChat.id}/messages`;
    await updateDoc(doc(db, collectionPath, messageId), { isPinned: !currentPinned });
  };

  const handleReaction = async (messageId, currentReactions, emoji = '❤️') => {
    const userId = getRealUid(user);
    const reactions = { ...(currentReactions || {}) };
    
    if (reactions[userId] === emoji) {
      delete reactions[userId];
    } else {
      reactions[userId] = emoji;
    }

    try {
      const collectionPath = activeChat.type === 'group' 
        ? `class_groups/${activeChat.id}/messages`
        : `direct_messages/${activeChat.id}/messages`;
      await updateDoc(doc(db, collectionPath, messageId), { reactions });
      setActiveEmojiPickerMsgId(null);
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  };

  const handleForwardMessage = async (targetChat) => {
    if (!forwardingMsg || !targetChat) return;
    try {
      const collectionPath = targetChat.type === 'group' 
        ? `class_groups/${targetChat.id}/messages`
        : `direct_messages/${targetChat.id}/messages`;

      await addDoc(collection(db, collectionPath), {
        text: forwardingMsg.text || '',
        imageUrl: forwardingMsg.imageUrl || null,
        audioUrl: forwardingMsg.audioUrl || null,
        type: forwardingMsg.type || 'text',
        senderId: getRealUid(user),
        senderName: user.name || 'Anonymous User',
        senderRole: user.role || 'user',
        timestamp: serverTimestamp(),
        reactions: {},
        isForwarded: true,
        originalSender: parseProfileName(forwardingMsg.senderName || 'User').name
      });
      setForwardingMsg(null);
      alert(`✅ Message forwarded to ${targetChat.name || targetChat.id.replace(/-/g, ' ')}!`);
    } catch (err) {
      console.error("Forwarding failed:", err);
      alert("Failed to forward message.");
    }
  };

  
  const handleSummarize = async () => {
    if (messages.length === 0) return;
    setIsSummarizing(true);
    try {
      // get last 50 messages text
      const recentMessages = messages.slice(-50).map(m => `${m.senderName}: ${m.text || m.type || 'Media'}`).join('\n');
      const summary = await summarizeChatMessages(recentMessages);
      setChatSummary(summary);
    } catch(err) {
      console.error(err);
      alert("Summary failed.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSearchDMs = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const queryStr = dmSearchQuery.trim();
    if (!queryStr) {
      setDmSearchResults([]);
      return;
    }
    
    setIsSearchingDM(true);
    try {
      const cleanQ = queryStr.toLowerCase();
      const qPrefix = cleanQ.includes('@') ? cleanQ.split('@')[0] : cleanQ;
      const mergedMap = new Map();

      // 1. Fetch from Supabase
      const { data: sbUsers } = await supabase.from('users').select('*').range(0, 1000);
      if (sbUsers) {
        sbUsers.forEach(u => {
          const parsed = parseProfileName(u.name);
          const userId = u.id || u.uid;
          const userObj = {
            id: userId,
            uid: userId,
            name: parsed.name,
            rawName: u.name || '',
            email: u.email || '',
            college: parsed.college || u.college || 'GPREC',
            department: parsed.department || u.department || 'CSE',
            year: parsed.year || u.year || '1st Year',
            role: u.role || 'user'
          };
          mergedMap.set(userId, userObj);
          if (u.email) mergedMap.set(u.email.toLowerCase(), userObj);
        });
      }

      // 2. Fetch from Firestore
      const fbSnap = await getDocs(collection(db, 'users'));
      fbSnap.docs.forEach(doc => {
        const u = doc.data();
        const existing = mergedMap.get(doc.id) || (u.email ? mergedMap.get(u.email.toLowerCase()) : null);
        if (existing) {
          existing.name = (existing.name && existing.name !== 'Scholar') ? existing.name : parseProfileName(u.name || u.displayName).name;
          existing.email = u.email || existing.email;
        } else {
          const parsed = parseProfileName(u.name || u.displayName);
          const newObj = {
            id: doc.id,
            uid: doc.id,
            name: parsed.name,
            rawName: u.name || u.displayName || '',
            email: u.email || '',
            college: parsed.college || u.college || 'GPREC',
            department: parsed.department || u.department || 'CSE',
            year: parsed.year || u.year || '1st Year',
            role: u.role || 'user'
          };
          mergedMap.set(doc.id, newObj);
          if (u.email) mergedMap.set(u.email.toLowerCase(), newObj);
        }
      });

      const allUnique = Array.from(new Set(mergedMap.values()));
      const matches = allUnique.filter(u => {
        if (getRealUid(user) && (u.id === getRealUid(user) || u.uid === getRealUid(user))) return false;
        return (
          (u.name || '').toLowerCase().includes(cleanQ) ||
          (u.rawName || '').toLowerCase().includes(cleanQ) ||
          (u.email || '').toLowerCase().includes(cleanQ) ||
          (u.email || '').toLowerCase().includes(qPrefix) ||
          (u.id || '').toLowerCase().includes(cleanQ)
        );
      });

      setDmSearchResults(matches.slice(0, 20));
    } catch (err) {
      console.error("Advanced Search Error:", err);
    } finally {
      setIsSearchingDM(false);
    }
  };

  const startDM = async (targetUserId, targetUserName, targetEmail = '') => {
    const myUid = getRealUid(user);
    const myEmail = user?.email ? user.email.toLowerCase().trim() : '';
    const cleanTargetEmail = targetEmail ? targetEmail.toLowerCase().trim() : '';
    
    // Sort keys based on primary email or UID
    const primaryKeyA = myEmail || myUid;
    const primaryKeyB = cleanTargetEmail || targetUserId;
    const sortedKeys = [primaryKeyA, primaryKeyB].sort();
    const dmId = `dm_${sortedKeys[0].replace(/[@.]/g, '_')}_${sortedKeys[1].replace(/[@.]/g, '_')}`;

    const participants = Array.from(new Set([
      myUid, 
      myEmail, 
      targetUserId, 
      cleanTargetEmail
    ].filter(Boolean)));

    try {
      const dmRef = doc(db, 'direct_messages', dmId);
      await setDoc(dmRef, {
        participants,
        participantDetails: {
          [myUid]: { name: user.name || 'Anonymous', email: myEmail },
          [targetUserId]: { name: targetUserName || 'Anonymous', email: cleanTargetEmail }
        },
        lastActivity: serverTimestamp()
      }, { merge: true });
      
      setActiveChat({ type: 'dm', id: dmId, name: parseProfileName(targetUserName || 'User').name, recipientId: targetUserId });
      setShowDMSearch(false);
      setDmSearchQuery('');
      setDmSearchResults([]);
    } catch (err) {
      console.error("Start DM error:", err);
      alert('Failed to start conversation.');
    }
  };

  const filteredGroups = allGroups.filter(g => g.toLowerCase().includes(searchGroup.toLowerCase()));

  // Render Sidebar
  const renderSidebar = () => (
    <div className="lg:col-span-1 glass-panel rounded-3xl border border-white/10 flex flex-col overflow-hidden bg-[#111118]/80 max-h-[70vh]">
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        
        {/* Groups Section */}
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            {isFounder ? 'All Class Groups' : 'My Groups'}
          </h2>

          {isFounder ? (
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchGroup}
                onChange={(e) => setSearchGroup(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00f5d4]/50"
              />
            </div>
          ) : null}
          <div className="space-y-1 mt-2">
            {(isFounder ? filteredGroups : [userGroupId]).map(group => (
              <button
                key={group}
                onClick={() => setActiveChat({ type: 'group', id: group, name: group })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeChat?.id === group 
                    ? 'bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {group.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="p-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" />
              Direct Messages
            </h2>
            <button 
              onClick={() => setShowDMSearch(true)}
              className="p-1 bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors"
              title="New Message"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {directMessages.map(dm => {
              const otherUserId = dm.participants.find(p => p !== getRealUid(user));
              const otherUserRaw = dm.participantDetails?.[otherUserId] || { name: 'Unknown' };
              const { name: parsedOtherName } = parseProfileName(otherUserRaw.name);
              const isSelected = activeChat?.id === dm.id;
              const isOnline = onlineUsers[otherUserId];
              
              return (
                <button
                  key={dm.id}
                  onClick={() => setActiveChat({ type: 'dm', id: dm.id, name: parsedOtherName, recipientId: otherUserId })}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                      {parsedOtherName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#111118] ${isOnline ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  </div>
                  <div className="truncate flex-1">
                    <div className="truncate flex items-center justify-between">
                      <span>{parsedOtherName}</span>
                    </div>
                    {dm.lastMessage && (
                      <div className="text-[10px] text-gray-500 truncate">{dm.lastMessage}</div>
                    )}
                  </div>
                </button>
              );
            })}
            {directMessages.length === 0 && (
              <div className="text-xs text-gray-500 italic mt-2">No messages yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] to-brand-blue tracking-tight mb-2">
            Community & Messages
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Connect with your classmates and chat privately.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[70vh] min-h-[600px]">
        
        {renderSidebar()}

        <div className="lg:col-span-3 glass-panel rounded-3xl border border-white/10 flex flex-col overflow-hidden bg-[#111118]/80 relative">
          {/* Chat Header */}
          <div className="h-16 border-b border-white/5 bg-white/5 flex items-center justify-between px-6 shrink-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden ${activeChat?.type === 'dm' ? 'bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border-brand-blue/30' : 'bg-gradient-to-br from-[#00f5d4]/20 to-brand-blue/20 border-[#00f5d4]/30'}`}>
                  {activeChat?.type === 'group' && groupMetadata?.logoUrl ? (
                    <img src={groupMetadata.logoUrl} alt="logo" className="w-full h-full object-cover" />
                  ) : activeChat?.type === 'group' ? (
                    <Users className="w-5 h-5 text-[#00f5d4]" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-brand-blue" />
                  )}
                </div>
                {activeChat?.type === 'dm' && activeChat?.recipientId && (
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111118] ${onlineUsers[activeChat.recipientId] ? 'bg-emerald-400' : 'bg-gray-500'}`} title={onlineUsers[activeChat.recipientId] ? 'Online' : 'Offline'} />
                )}
              </div>
              <div>
                <h2 className="text-white font-bold tracking-wide flex items-center gap-2">
                  {activeChat?.type === 'group' 
                    ? (groupMetadata?.displayName || activeChat?.name?.replace(/-/g, ' '))
                    : activeChat?.name}
                </h2>
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  {activeChat?.type === 'group' ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse"></span> Official Group</>
                  ) : (
                    <>
                      <span className={`w-1.5 h-1.5 rounded-full ${onlineUsers[activeChat?.recipientId] ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                      {onlineUsers[activeChat?.recipientId] ? 'Online' : 'Offline'}
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {showChatSearch && (
              <div className="flex-1 max-w-xs mx-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in chat..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
                    autoFocus
                  />
                  {chatSearchQuery && (
                    <button onClick={() => setChatSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setShowChatSearch(!showChatSearch); if (showChatSearch) setChatSearchQuery(''); }}
                className={`p-2 rounded-xl border transition-colors ${showChatSearch ? 'bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4]/30' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5'}`}
                title="Search Messages"
              >
                <Search className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSummarize}
                disabled={isSummarizing || messages.length === 0}
                className="p-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 hover:from-brand-purple/30 hover:to-brand-pink/30 text-brand-pink hover:text-white transition-all border border-brand-purple/30 shadow-[0_0_15px_rgba(255,0,255,0.1)]"
                title="AI Chat Summary"
              >
                {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="text-xs font-bold hidden sm:block">AI Summary</span>
              </button>
              {(activeChat?.type === 'dm' || isFounder || groupMetadata?.admins?.includes(getRealUid(user))) && messages.length > 0 && (
                <button 
                  onClick={handleClearChat}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20 hover:border-red-400/40"
                  title="Clear All Messages"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              )}
              {activeChat?.type === 'group' && (isFounder || groupMetadata?.admins?.includes(getRealUid(user))) && (
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20"
                  title="Group Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-0">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 rounded-full border-2 border-[#00f5d4] border-t-transparent animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-3 p-4 text-center">
                <Shield className="w-12 h-12 text-red-500/50" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                <MessageSquare className="w-12 h-12 text-gray-600/50" />
                <p className="text-sm font-medium">No messages yet. Say hi!</p>
              </div>
            ) : (
              (chatSearchQuery.trim() ? messages.filter(m => m.text?.toLowerCase().includes(chatSearchQuery.toLowerCase())) : messages).map((msg, index) => {
                const isMe = msg.senderId === getRealUid(user);
                const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
                const { name: parsedName } = parseProfileName(msg.senderName || 'Anonymous');
                
                const reactionsMap = msg.reactions || {};
                const emojiCounts = {};
                Object.values(reactionsMap).forEach(emoji => {
                  if (emoji) emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
                });
                const myReaction = reactionsMap[getRealUid(user)];

                return (
                  <div key={msg.id} className={`flex gap-3 group ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && showAvatar ? (
                      <div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 flex items-center justify-center shrink-0 border border-brand-purple/30 text-xs font-bold text-brand-purple mt-1 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => activeChat?.type === 'group' && startDM(msg.senderId, parsedName)}
                        title={`Message ${parsedName}`}
                      >
                        {parsedName.charAt(0).toUpperCase()}
                      </div>
                    ) : !isMe ? (
                      <div className="w-8 shrink-0"></div>
                    ) : null}

                    <div className={`max-w-[80%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && showAvatar && (
                        <div className="flex items-center gap-2 mb-1 pl-1">
                          <span 
                            className="text-xs font-bold text-gray-300 cursor-pointer hover:text-white"
                            onClick={() => activeChat?.type === 'group' && startDM(msg.senderId, parsedName)}
                          >
                            {parsedName}
                          </span>
                          {msg.isAi || msg.senderRole === 'ai' ? (
                            <span className="text-[9px] font-black uppercase tracking-wider text-black bg-gradient-to-r from-[#00f5d4] to-brand-blue px-1.5 py-0.5 rounded-md flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Lumixora AI
                            </span>
                          ) : activeChat?.type === 'group' ? (
                            <>
                              {msg.senderRole === 'founder' ? (
                                <span className="text-[9px] font-black uppercase tracking-wider text-black bg-[#00f5d4] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                  <Shield className="w-2.5 h-2.5" /> Founder
                                </span>
                              ) : groupMetadata?.admins?.includes(msg.senderId) ? (
                                <span className="text-[9px] font-black uppercase tracking-wider text-black bg-[#00f5d4]/80 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                  <Shield className="w-2.5 h-2.5" /> Admin
                                </span>
                              ) : groupMetadata?.faculty?.includes(msg.senderId) ? (
                                <span className="text-[9px] font-black uppercase tracking-wider text-purple-900 bg-purple-400 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                  Faculty
                                </span>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      )}

                      <div className={`relative group/msg flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-center gap-2`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm flex flex-col gap-2 relative ${
                          msg.isAi || msg.senderRole === 'ai'
                            ? 'bg-gradient-to-br from-[#0c101d] via-[#10192b] to-[#151528] text-white border border-[#00f5d4]/40 shadow-lg shadow-[#00f5d4]/10 rounded-tl-sm'
                            : isMe 
                              ? 'bg-[#00f5d4] text-black rounded-tr-sm' 
                              : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-sm'
                        }`}>
                          
                          {/* Forwarded Tag */}
                          {msg.isForwarded && (
                            <div className={`text-[10px] flex items-center gap-1 italic ${isMe ? 'text-black/60' : 'text-gray-400'}`}>
                              <Share2 className="w-3 h-3" />
                              <span>Forwarded from {msg.originalSender || 'User'}</span>
                            </div>
                          )}

                          {/* Reply Context */}
                          {msg.replyTo && (
                            <div className={`text-xs pl-3 py-1 border-l-2 rounded-r-md bg-black/10 ${isMe ? 'border-black/30 text-black/70' : 'border-[#00f5d4]/50 text-gray-400'}`}>
                              <span className="font-bold block text-[10px]">{msg.replyTo.senderName}</span>
                              <span className="truncate block max-w-[200px]">{msg.replyTo.text}</span>
                            </div>
                          )}

                          {/* Poll Rendering */}
                          {msg.type === 'poll' && (
                            <div className="bg-black/20 rounded-xl p-4 mt-2 mb-2 w-full max-w-[250px] sm:max-w-sm">
                              <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-brand-blue"/> {msg.question}</h4>
                              <div className="space-y-2">
                                {msg.options.map((opt, i) => {
                                  const votesCount = Object.values(msg.votes || {}).filter(v => v === i).length;
                                  const totalVotes = Object.keys(msg.votes || {}).length || 1;
                                  const percent = Math.round((votesCount / totalVotes) * 100);
                                  const hasVoted = (msg.votes || {})[getRealUid(user)] === i;
                                  return (
                                    <button key={i} onClick={() => handleVote(msg.id, msg.votes, i)} className={`w-full text-left relative overflow-hidden rounded-lg p-2 text-xs transition-colors ${hasVoted ? 'border border-brand-blue/50 text-white' : 'border border-white/10 text-gray-300 hover:bg-white/5'}`}>
                                      <div className="absolute left-0 top-0 bottom-0 bg-brand-blue/20 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                      <div className="relative flex justify-between z-10">
                                        <span>{opt}</span>
                                        <span className="text-[10px] opacity-70">{percent}%</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="text-[9px] text-gray-500 mt-2 text-right">{Object.keys(msg.votes || {}).length} votes</div>
                            </div>
                          )}

                          {/* Audio Rendering */}
                          {msg.type === 'audio' && (
                            <div className="mt-2 mb-1">
                              <audio controls src={msg.audioUrl} className="h-8 max-w-[200px] sm:max-w-[250px] custom-audio"></audio>
                            </div>
                          )}
                          
                          {(!msg.type || msg.type === 'text') && (
                            <>
                              {msg.imageUrl && (
                                <div className="rounded-xl overflow-hidden mb-1">
                                  <img src={msg.imageUrl} alt="attachment" className="max-w-full max-h-64 object-cover" />
                                </div>
                              )}
                              
                              {msg.text && <MessageFormatter text={msg.text} />}
                            </>
                          )}
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className={`opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1 ${isMe ? 'pr-1' : 'pl-1'}`}>
                          {/* Multi-Emoji Picker Toggle */}
                          <div className="relative">
                            <button 
                              onClick={() => setActiveEmojiPickerMsgId(activeEmojiPickerMsgId === msg.id ? null : msg.id)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-yellow-400 transition-colors"
                              title="React"
                            >
                              <Smile className="w-3.5 h-3.5" />
                            </button>

                            {/* Popover Emojis */}
                            {activeEmojiPickerMsgId === msg.id && (
                              <div className={`absolute bottom-full mb-2 ${isMe ? 'right-0' : 'left-0'} bg-[#1a1a24] border border-white/10 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 z-30 animate-fade-in`}>
                                {['❤️', '👍', '😂', '😮', '😢', '🔥'].map(emoji => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReaction(msg.id, msg.reactions, emoji)}
                                    className="p-1.5 hover:bg-white/10 rounded-xl text-base transition-transform hover:scale-125"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Forward Button */}
                          <button 
                            onClick={() => setForwardingMsg(msg)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-brand-blue transition-colors"
                            title="Forward"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reply Button */}
                          <button 
                            onClick={() => setReplyingTo(msg)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                            title="Reply"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          {(isMe || isFounder || (activeChat?.type === 'group' && groupMetadata?.admins?.includes(getRealUid(user)))) && (
                            <button 
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Footer: Timestamp, Read Receipts & Reaction Badges */}
                      <div className={`flex items-center gap-2 mt-1 ${isMe ? 'flex-row-reverse' : 'flex-row'} px-1`}>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <span>
                            {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                          </span>

                          {/* Read Receipts */}
                          {isMe && (
                            <span className="ml-1" title={msg.seenBy && msg.seenBy.length > 1 ? "Seen" : "Sent"}>
                              {msg.seenBy && msg.seenBy.length > 1 ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#00f5d4] inline" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-gray-400 inline" />
                              )}
                            </span>
                          )}
                        </div>
                        
                        {/* Display Reaction Badges */}
                        {Object.keys(emojiCounts).length > 0 && (
                          <div className="flex items-center gap-1">
                            {Object.entries(emojiCounts).map(([emoji, count]) => (
                              <button 
                                key={emoji}
                                onClick={() => handleReaction(msg.id, msg.reactions, emoji)}
                                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                                  myReaction === emoji 
                                    ? 'bg-[#00f5d4]/10 border-[#00f5d4]/40 text-[#00f5d4]' 
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span className="font-bold text-[9px]">{count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Live Animated Typing Indicator */}
            {Object.keys(typingMap).some(uid => uid !== getRealUid(user) && typingMap[uid]) && (
              <div className="flex items-center gap-2.5 text-xs text-[#00f5d4] italic px-4 py-2 bg-white/5 border border-[#00f5d4]/20 rounded-2xl w-fit animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping shrink-0" />
                <span className="font-medium">
                  {Object.entries(typingMap)
                    .filter(([uid, val]) => uid !== getRealUid(user) && val)
                    .map(([_, name]) => name)
                    .join(', ')} typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>


              {/* Poll Creator UI */}
              {showPollCreator && (
                <div className="absolute bottom-full left-0 right-0 p-4 bg-[#1a1a24] border-t border-white/10 rounded-t-2xl z-20 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2"><BarChart2 className="w-4 h-4"/> Create Poll</h4>
                    <button onClick={() => setShowPollCreator(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
                  </div>
                  <input type="text" placeholder="Ask a question..." value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white mb-2" />
                  {pollOptions.map((opt, i) => (
                    <input key={i} type="text" placeholder={`Option ${i+1}`} value={opt} onChange={e => { const newOpts = [...pollOptions]; newOpts[i] = e.target.value; setPollOptions(newOpts); }} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white mb-2" />
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => setPollOptions([...pollOptions, ''])} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10">+ Option</button>
                    <div className="flex-1"></div>
                    <button onClick={handleSendPoll} className="px-4 py-1.5 rounded-lg bg-[#00f5d4] text-black text-xs font-bold hover:bg-[#00f5d4]/90">Send Poll</button>
                  </div>
                </div>
              )}

          {/* Input Area */}
          <div className="p-4 bg-black/40 border-t border-white/5 shrink-0 z-10 backdrop-blur-md flex flex-col gap-2">
            
            {replyingTo && (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2 mx-2">
                <div className="flex flex-col">
                  <span className="text-xs text-[#00f5d4] font-bold">Replying to {replyingTo.senderName}</span>
                  <span className="text-sm text-gray-400 truncate max-w-md">{replyingTo.text || 'Image'}</span>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {imagePreview && (
              <div className="relative inline-block mx-2 mt-2 self-start">
                <img src={imagePreview} alt="Preview" className="h-24 w-auto rounded-xl object-cover border border-white/10" />
                <button 
                  onClick={cancelImage} 
                  className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-end overflow-hidden focus-within:border-[#00f5d4]/50 focus-within:bg-white/10 transition-all">
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 text-gray-400 hover:text-[#00f5d4] transition-colors"
                  disabled={isUploading}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => { setNewMessage(e.target.value); triggerTypingStatus(); }}
                  placeholder={imageFile ? "Add a caption..." : "Type a message..."}
                  disabled={isUploading}
                  className="flex-1 bg-transparent px-2 py-3.5 text-sm text-white focus:outline-none placeholder:text-gray-500 min-w-0"
                />
              </div>

              <button
                type="submit"
                disabled={(!newMessage.trim() && !imageFile) || isUploading}
                className="h-[52px] w-[52px] rounded-2xl bg-[#00f5d4] text-black flex items-center justify-center shrink-0 hover:bg-[#00f5d4]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 ml-1" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {chatSummary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-brand-purple/30 rounded-2xl p-6 w-full max-w-lg shadow-[0_0_30px_rgba(255,0,255,0.15)] animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-pink" /> 
                AI Chat Summary
              </h3>
              <button onClick={() => setChatSummary(null)} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-2">Overview</h4>
                <p className="text-gray-300 leading-relaxed text-sm">{chatSummary.summary}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-brand-pink uppercase tracking-wider mb-3">Key Points & Action Items</h4>
                <ul className="space-y-2">
                  {chatSummary.keyPoints?.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-brand-pink shrink-0 mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setChatSummary(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && activeChat?.type === 'group' && (
        <GroupAdminSettings 
          activeGroupId={activeChat.id}
          groupMetadata={groupMetadata}
          user={user}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {showDMSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 relative">
            <button 
              onClick={() => setShowDMSearch(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-bold text-white mb-4">Start a Conversation</h2>
            
            <form onSubmit={handleSearchDMs} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={dmSearchQuery}
                  onChange={(e) => setDmSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue/50"
                />
              </div>
              <button 
                type="submit"
                disabled={isSearchingDM || !dmSearchQuery.trim()}
                className="px-4 py-2 bg-brand-blue text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Search
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {dmSearchResults.map(resUser => (
                <div key={resUser.id} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                      {parseProfileName(resUser.name || 'U').name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-white truncate">{parseProfileName(resUser.name || 'Anonymous').name}</p>
                      <p className="text-xs text-gray-400 truncate">{resUser.email || resUser.uid}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => startDM(resUser.id, parseProfileName(resUser.name).name, resUser.email)}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/30 transition-colors"
                  >
                    Message
                  </button>
                </div>
              ))}
              {dmSearchResults.length === 0 && dmSearchQuery && !isSearchingDM && (
                <p className="text-center text-sm text-gray-500 py-4">No users found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forward Message Modal */}
      {forwardingMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 relative">
            <button 
              onClick={() => setForwardingMsg(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#00f5d4]" /> Forward Message
            </h2>
            <p className="text-xs text-gray-400 mb-4 truncate italic border-l-2 border-[#00f5d4] pl-2">
              "{forwardingMsg.text || 'Image/Attachment'}"
            </p>

            <div className="space-y-4 max-h-72 overflow-y-auto custom-scrollbar pr-2">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Class Groups</h3>
                <div className="space-y-1">
                  {(isFounder ? allGroups : [userGroupId]).map(group => (
                    <button
                      key={group}
                      onClick={() => handleForwardMessage({ type: 'group', id: group, name: group.replace(/-/g, ' ') })}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all flex justify-between items-center bg-white/5 border border-white/5"
                    >
                      <span>{group.replace(/-/g, ' ')}</span>
                      <span className="text-xs text-[#00f5d4] font-bold">Send →</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Direct Messages</h3>
                <div className="space-y-1">
                  {directMessages.map(dm => {
                    const otherUserId = dm.participants.find(p => p !== getRealUid(user));
                    const otherUserRaw = dm.participantDetails?.[otherUserId] || { name: 'Unknown' };
                    const { name: parsedOtherName } = parseProfileName(otherUserRaw.name);
                    return (
                      <button
                        key={dm.id}
                        onClick={() => handleForwardMessage({ type: 'dm', id: dm.id, name: parsedOtherName })}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all flex justify-between items-center bg-white/5 border border-white/5"
                      >
                        <span>{parsedOtherName}</span>
                        <span className="text-xs text-brand-blue font-bold">Send →</span>
                      </button>
                    );
                  })}
                  {directMessages.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No DMs available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
