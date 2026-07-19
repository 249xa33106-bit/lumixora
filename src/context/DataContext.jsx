import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [hubSubjects, setHubSubjects] = useState([]);
  const [hubMaterials, setHubMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default Mock Data for Seeding
  const defaultSubjects = [
    { id: "cs301", branch: 'CSE', semester: 'Sem 3', name: 'Data Structures & Algorithms', credits: 4, difficulty: 'Hard', code: 'CS301' },
    { id: "cs302", branch: 'CSE', semester: 'Sem 3', name: 'Object Oriented Programming', credits: 3, difficulty: 'Medium', code: 'CS302' },
    { id: "cs303", branch: 'CSE', semester: 'Sem 3', name: 'Digital Logic Design', credits: 3, difficulty: 'Medium', code: 'CS303' },
    { id: "ai301", branch: 'AI & ML', semester: 'Sem 3', name: 'Intro to Machine Learning', credits: 4, difficulty: 'Hard', code: 'AI301' },
    { id: "ec401", branch: 'ECE', semester: 'Sem 4', name: 'Analog Electronics', credits: 4, difficulty: 'Hard', code: 'EC401' }
  ];

  const defaultMaterialsTemplate = {
    playlists: {
      pass: {
        featured: { title: `One Shot Revision`, channel: 'Code Help', videos: 12, duration: '8h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000' },
        alternatives: []
      },
      complete: {
        featured: { title: `Complete Playlist`, channel: 'Neso Academy', videos: 45, duration: '32h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000' },
        alternatives: []
      },
      industry: {
        featured: { title: `Advanced for Placements`, channel: 'Striver', videos: 80, duration: '55h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000' },
        alternatives: []
      }
    },
    resources: [
      { id: 1, label: 'Subject Notes (PDF)', type: 'FileText', color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
      { id: 2, label: 'Previous Year Papers', type: 'Download', color: 'text-brand-pink', bg: 'bg-brand-pink/10' }
    ]
  };

  // Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          { data: tasksSnap, error: tErr },
          { data: notesSnap, error: nErr },
          { data: doubtsSnap, error: dErr },
          { data: subjectsSnap, error: sErr },
          { data: materialsSnap, error: mErr }
        ] = await Promise.all([
          supabase.from('tasks').select('*'),
          supabase.from('notes').select('*'),
          supabase.from('doubts').select('*'),
          supabase.from('hub_subjects').select('*'),
          supabase.from('hub_materials').select('*')
        ]);
        
        if (tErr) console.error("Error tasks:", tErr);
        if (nErr) console.error("Error notes:", nErr);
        if (dErr) console.error("Error doubts:", dErr);
        if (sErr) console.error("Error subjects:", sErr);
        if (mErr) console.error("Error materials:", mErr);

        setTasks(tasksSnap || []);
        const formattedNotes = (notesSnap || []).map(n => {
          let extra = {};
          try {
            if (n.content && n.content.trim().startsWith('{')) {
              extra = JSON.parse(n.content);
            }
          } catch (e) {
            console.error("Failed to parse note content JSON:", e);
          }
          return {
            id: n.id,
            title: n.title,
            ...extra,
            lastEdited: n.last_edited
          };
        });
        setNotes(formattedNotes);
        setDoubts(doubtsSnap || []);

        let subjectsData = subjectsSnap || [];
        let materialsData = materialsSnap || [];

        // Auto-seed if empty
        if (subjectsData.length === 0) {
          console.log("Seeding default subjects to Supabase...");
          for (const sub of defaultSubjects) {
            const { error: subErr } = await supabase.from('hub_subjects').insert([sub]);
            if (!subErr) {
              subjectsData.push(sub);
              const matObj = { id: sub.id, ...defaultMaterialsTemplate };
              await supabase.from('hub_materials').insert([matObj]);
              materialsData.push(matObj);
            } else {
              console.error("Seeding sub error:", subErr);
            }
          }
        }

        setHubSubjects(subjectsData);
        setHubMaterials(materialsData);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Helper to format a single notes database row
    const formatNote = (n) => {
      let extra = {};
      try {
        if (n.content && n.content.trim().startsWith('{')) {
          extra = JSON.parse(n.content);
        }
      } catch (e) {
        console.error("Failed to parse note content JSON:", e);
      }
      return {
        id: n.id,
        title: n.title,
        ...extra,
        lastEdited: n.last_edited
      };
    };

    // Supabase Realtime Subscription for Doubts
    const doubtsSubscription = supabase
      .channel('public:doubts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'doubts' }, payload => {
        setDoubts(prev => {
          // Prevent duplicates if the user themselves added it and local state already updated
          if (prev.find(d => d.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'doubts' }, payload => {
        setDoubts(prev => prev.map(d => d.id === payload.new.id ? payload.new : d));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'doubts' }, payload => {
        setDoubts(prev => prev.filter(d => d.id !== payload.old.id));
      })
      .subscribe();

    // Helper to trigger browser & in-app notifications
    const triggerNoteNotification = (note, actionType) => {
      const title = note.title || 'Untitled Notes';
      const text = `New notes ${actionType}: "${title}" by ${note.contributedBy || 'Scholar'}`;
      const notificationId = Date.now();
      
      // 1. Save to local storage notification history
      try {
        const saved = localStorage.getItem('lumixora_notifications');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift({
          id: notificationId,
          text,
          unread: true,
          time: 'Just now'
        });
        localStorage.setItem('lumixora_notifications', JSON.stringify(list.slice(0, 30)));
        window.dispatchEvent(new Event('lumixora_notifications_updated'));
      } catch (e) {
        console.error("Failed to save notification:", e);
      }

      // 2. Trigger standard Web Notification API if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('LUMIXORA Notes Update', {
          body: text,
          icon: '/lumixora_logo.jpg'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('LUMIXORA Notes Update', {
              body: text,
              icon: '/lumixora_logo.jpg'
            });
          }
        });
      }
      
      // 3. Dispatch global app notification event
      const appNotificationEvent = new CustomEvent('lumixora_app_notification', {
        detail: { message: text, type: 'info' }
      });
      window.dispatchEvent(appNotificationEvent);
    };

    // Supabase Realtime Subscription for Notes
    const notesSubscription = supabase
      .channel('public:notes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notes' }, payload => {
        setNotes(prev => {
          if (prev.find(n => n.id === payload.new.id)) return prev;
          const formatted = formatNote(payload.new);
          triggerNoteNotification(formatted, 'uploaded');
          return [...prev, formatted];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notes' }, payload => {
        setNotes(prev => {
          const formatted = formatNote(payload.new);
          triggerNoteNotification(formatted, 'updated');
          return prev.map(n => n.id === payload.new.id ? formatted : n);
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'notes' }, payload => {
        setNotes(prev => prev.filter(n => n.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(doubtsSubscription);
      supabase.removeChannel(notesSubscription);
    };
  }, []);

  // Generic helper for adding items
  const addItem = async (colName, item) => {
    try {
      const { data, error } = await supabase.from(colName).insert([item]).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error(`Error adding to ${colName}:`, error);
      // Fallback for local/offline mode
      return { ...item, id: Date.now().toString() };
    }
  };

  // Generic helper for updating items
  const updateItem = async (colName, id, updates) => {
    try {
      const { data, error } = await supabase.from(colName).update(updates).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error(`Error updating in ${colName}:`, error);
      // Fallback
      return { id, ...updates };
    }
  };

  // Generic helper for deleting items
  const deleteItem = async (colName, id) => {
    try {
      const { error } = await supabase.from(colName).delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting from ${colName}:`, error);
    }
  };

  // Specific Actions
  const addTask = async (task) => {
    const newItem = await addItem('tasks', task);
    if (newItem) {
      setTasks(prev => [...prev, newItem]);
      return newItem;
    }
  };
  const updateTask = async (id, updates) => {
    const updated = await updateItem('tasks', id, updates);
    if (updated) setTasks(prev => prev.map(item => item.id === id ? updated : item));
  };
  const deleteTask = async (id) => {
    await deleteItem('tasks', id);
    setTasks(prev => prev.filter(item => item.id !== id));
  };

  const addNote = async (note) => {
    const { lastEdited, title, ...extra } = note;
    const newItem = await addItem('notes', { 
      title, 
      content: JSON.stringify(extra), 
      last_edited: new Date().toISOString() 
    });
    if (newItem) {
      let parsedExtra = {};
      try {
        if (newItem.content && newItem.content.trim().startsWith('{')) {
          parsedExtra = JSON.parse(newItem.content);
        }
      } catch (e) {
        console.error("Error parsing content:", e);
      }
      const formatted = {
        id: newItem.id,
        title: newItem.title,
        ...parsedExtra,
        lastEdited: newItem.last_edited
      };
      setNotes(prev => [...prev, formatted]);
      return formatted;
    }
  };
  const updateNote = async (id, updates) => {
    const existing = notes.find(item => item.id === id);
    if (!existing) return;
    
    const merged = { ...existing, ...updates };
    const { id: _, title, lastEdited, ...extra } = merged;
    
    // Optimistic UI update
    setNotes(prev => prev.map(item => item.id === id ? merged : item));
    
    const updated = await updateItem('notes', id, {
      title, 
      content: JSON.stringify(extra), 
      last_edited: new Date().toISOString() 
    });
    if (updated) {
      let parsedExtra = {};
      try {
        if (updated.content && updated.content.trim().startsWith('{')) {
          parsedExtra = JSON.parse(updated.content);
        }
      } catch (e) {}
      const formatted = {
        id: updated.id,
        title: updated.title,
        ...parsedExtra,
        lastEdited: updated.last_edited
      };
      setNotes(prev => prev.map(item => item.id === id ? formatted : item));
    }
  };
  const deleteNote = async (id) => {
    await deleteItem('notes', id);
    setNotes(prev => prev.filter(item => item.id !== id));
  };

  const addDoubt = async (doubt) => {
    const newItem = await addItem('doubts', { ...doubt, timestamp: new Date().toISOString() });
    if (newItem) setDoubts(prev => [...prev, newItem]);
  };

  // Learning Hub Actions
  const addHubSubject = async (subject) => {
    try {
      if (!subject.id) {
        subject.id = (subject.code || 'sub').toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      }
      
      const { data: subData, error: subErr } = await supabase.from('hub_subjects').insert([subject]).select();
      if (subErr) throw subErr;
      const newSubject = subData[0];
      setHubSubjects(prev => [...prev, newSubject]);
      
      // Initialize with default materials to keep "real or live" playlists
      const matObj = { id: newSubject.id, ...defaultMaterialsTemplate };
      const { data: matData, error: matErr } = await supabase.from('hub_materials').insert([matObj]).select();
      if (matErr) throw matErr;
      setHubMaterials(prev => [...prev, matData[0]]);
      return newSubject;
    } catch (error) {
      console.error(error);
    }
  };

  const updateHubSubject = async (id, updates) => {
    const updated = await updateItem('hub_subjects', id, updates);
    if (updated) setHubSubjects(prev => prev.map(item => item.id === id ? updated : item));
  };
  
  const deleteHubSubject = async (id) => {
    try {
      await supabase.from('hub_subjects').delete().eq('id', id);
      await supabase.from('hub_materials').delete().eq('id', id);
      setHubSubjects(prev => prev.filter(s => s.id !== id));
      setHubMaterials(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateHubMaterials = async (subjectId, materials) => {
    try {
      const { error } = await supabase.from('hub_materials').upsert({ id: subjectId, ...materials });
      if (error) throw error;
      setHubMaterials(prev => prev.map(m => m.id === subjectId ? { id: subjectId, ...materials } : m));
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async (path, file) => {
    try {
      const cleanPath = path.replace(/\\/g, '/');
      const { data, error } = await supabase.storage
        .from('academic_resources')
        .upload(cleanPath, file, {
          cacheControl: '3600',
          upsert: true
        });
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('academic_resources')
        .getPublicUrl(cleanPath);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading to Supabase:", error);
      throw error;
    }
  };

  const value = {
    tasks, addTask, updateTask, deleteTask,
    notes, addNote, updateNote, deleteNote,
    doubts, addDoubt,
    hubSubjects, addHubSubject, updateHubSubject, deleteHubSubject,
    hubMaterials, updateHubMaterials,
    uploadFile,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
