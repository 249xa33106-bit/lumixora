import React, { useState } from 'react';
import { Image, FileText, Send, Sparkles, Heart, MessageSquare, Bookmark, Share2, AlertCircle, Plus, Vote } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function NetworkFeed({ user, dbNotes = [], dbDoubts = [], dbUsers = [] }) {
  const { addToast } = useToast();
  const [newPostText, setNewPostText] = useState('');
  const [newPostAttachment, setNewPostAttachment] = useState('');
  const [attachmentType, setAttachmentType] = useState('none'); // 'none', 'image', 'pdf'
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Interactive Poll state in stories
  const [pollVotes, setPollVotes] = useState({ optionA: 28, optionB: 12 });
  const [hasVoted, setHasVoted] = useState(false);

  const [localPosts, setLocalPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [postComments, setPostComments] = useState({});

  // Dynamic builder combining real database items
  const getMergedPosts = () => {
    let combined = [...localPosts];

    // Map real notes
    if (dbNotes && dbNotes.length > 0) {
      dbNotes.forEach((note, index) => {
        const authorUser = dbUsers?.find(u => u.name === note.author || u.id === note.user_id) || {
          name: note.author || 'Contributor Student',
          college: 'LUMIXORA Network',
          avatarUrl: ''
        };

        combined.push({
          id: `note-${note.id || index}`,
          name: authorUser.name,
          avatar: authorUser.name.charAt(0).toUpperCase(),
          college: authorUser.college,
          timestamp: note.lastEdited ? new Date(note.lastEdited).toLocaleDateString() : 'Active Study Period',
          text: `Shared new academic materials: "${note.title || 'Revision Notes'}" for exam revision. Check out the document below! 📖✨`,
          type: 'PDF Document',
          attachmentName: `${note.title || 'Course_Notes'}.pdf`,
          attachmentUrl: note.fileUrl || '#',
          likes: 8 + (index % 5),
          comments: [],
          likedByUser: false,
          savedByUser: false
        });
      });
    }

    // Map real doubts
    if (dbDoubts && dbDoubts.length > 0) {
      dbDoubts.forEach((doubt, index) => {
        const authorUser = dbUsers?.find(u => u.name === doubt.studentName || u.id === doubt.userId) || {
          name: doubt.studentName || 'Student Peer',
          college: 'LUMIXORA Hub',
          avatarUrl: ''
        };

        combined.push({
          id: `doubt-${doubt.id || index}`,
          name: authorUser.name,
          avatar: authorUser.name.charAt(0).toUpperCase(),
          college: authorUser.college,
          timestamp: doubt.timestamp ? new Date(doubt.timestamp).toLocaleDateString() : 'Doubt solver queue',
          text: `Asked a concept doubt: "${doubt.question || 'Topic query'}" under subject ${doubt.subject || 'CSE'}. Can anyone help resolve this? 🤔`,
          type: null,
          attachmentName: null,
          attachmentUrl: null,
          likes: 4 + (index % 3),
          comments: doubt.replies ? doubt.replies.map((rep, rIdx) => ({ id: rIdx, name: rep.senderName || 'Mentor', text: rep.text })) : [],
          likedByUser: false,
          savedByUser: false
        });
      });
    }

    // Default mock list if combined list has no records
    if (combined.length === 0) {
      return [
        {
          id: 1,
          name: 'Mohammed Sowban',
          avatar: 'M',
          college: 'GPREC',
          timestamp: 'Just now',
          text: 'Welcome to the Nexora Social Network! Start sharing revision study materials, coding goals, and placement milestones live! 🚀🔥',
          type: null,
          attachmentName: null,
          attachmentUrl: null,
          likes: 15,
          comments: [],
          likedByUser: false,
          savedByUser: false
        }
      ];
    }

    return combined;
  };

  const posts = getMergedPosts().map(p => ({
    ...p,
    likes: likedPosts[p.id] ? p.likes + 1 : p.likes,
    likedByUser: !!likedPosts[p.id],
    savedByUser: !!savedPosts[p.id],
    comments: postComments[p.id] ? [...p.comments, ...postComments[p.id]] : p.comments
  }));

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      name: user?.name || 'Scholar Student',
      avatar: (user?.name || 'S').charAt(0).toUpperCase(),
      college: 'LUMIXORA University of Tech',
      timestamp: 'Just now',
      text: newPostText,
      type: attachmentType === 'pdf' ? 'PDF Document' : attachmentType === 'image' ? 'Image File' : null,
      attachmentName: attachmentType !== 'none' ? (newPostAttachment.split('\\').pop() || 'attached_asset') : null,
      likes: 0,
      comments: [],
      likedByUser: false,
      savedByUser: false
    };

    setLocalPosts([newPost, ...localPosts]);
    setNewPostText('');
    setNewPostAttachment('');
    setAttachmentType('none');
    addToast({ message: 'Post published successfully!', type: 'success' });
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const nextState = !prev[postId];
      addToast({ 
        message: nextState ? 'Post saved to bookmarks!' : 'Post removed from bookmarks', 
        type: 'info' 
      });
      return {
        ...prev,
        [postId]: nextState
      };
    });
  };

  const handleAddComment = (postId) => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: user?.name || 'Scholar Student',
      text: newCommentText
    };
    setPostComments(prev => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment]
    }));
    setNewCommentText('');
    addToast({ message: 'Comment added!', type: 'success' });
  };

  const handleVotePoll = (option) => {
    if (hasVoted) return;
    setPollVotes(prev => ({
      ...prev,
      [option]: prev[option] + 1
    }));
    setHasVoted(true);
    addToast({ message: 'Vote registered in story poll!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section: Student Stories & Interactive Poll */}
      <div className="glass-panel p-4 rounded-3xl space-y-4">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">24h Student Stories</span>
        
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 hover:border-brand-teal hover:text-brand-teal transition-colors bg-white/5">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[9px] text-gray-500 font-bold uppercase">Add Story</span>
          </div>

          {/* Interactive Poll Story */}
          <div className="w-56 h-14 shrink-0 rounded-2xl bg-gradient-to-r from-brand-pink/15 to-brand-purple/15 border border-brand-pink/25 p-2 flex items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <span className="text-[9px] font-black text-brand-pink uppercase tracking-wider block">Campus Poll</span>
              <span className="text-[10px] font-bold text-gray-200 block truncate max-w-[120px]">React vs Flutter?</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={() => handleVotePoll('optionA')}
                disabled={hasVoted}
                className={`px-2 py-1 rounded-lg text-[9px] font-extrabold transition-all border ${
                  hasVoted ? 'bg-white/5 border-white/10 text-gray-500' : 'bg-brand-pink/20 border-brand-pink/30 text-brand-pink hover:bg-brand-pink/30'
                }`}
              >
                React ({hasVoted ? Math.round((pollVotes.optionA / (pollVotes.optionA + pollVotes.optionB)) * 100) + '%' : pollVotes.optionA})
              </button>
              <button 
                onClick={() => handleVotePoll('optionB')}
                disabled={hasVoted}
                className={`px-2 py-1 rounded-lg text-[9px] font-extrabold transition-all border ${
                  hasVoted ? 'bg-white/5 border-white/10 text-gray-500' : 'bg-brand-purple/20 border-brand-purple/30 text-brand-purple hover:bg-brand-purple/30'
                }`}
              >
                Flutter ({hasVoted ? Math.round((pollVotes.optionB / (pollVotes.optionA + pollVotes.optionB)) * 100) + '%' : pollVotes.optionB})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Post Form */}
      <div className="glass-panel p-5 rounded-3xl bg-black/25">
        <form onSubmit={handleCreatePost} className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal font-extrabold text-xs">
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share text, study notes, internship wins, or code projects..."
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 outline-none resize-none pt-2"
              rows="2"
              required
            />
          </div>

          {attachmentType !== 'none' && (
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
              <span className="text-[11px] font-bold text-gray-300 truncate">
                Attached: {newPostAttachment || 'Notes_file.pdf'}
              </span>
              <button 
                type="button" 
                onClick={() => { setAttachmentType('none'); setNewPostAttachment(''); }}
                className="text-[10px] text-red-400 font-extrabold uppercase"
              >
                Remove
              </button>
            </div>
          )}

          <div className="h-[1px] bg-white/5"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setAttachmentType('image'); setNewPostAttachment('IMG_HackathonMemory.png'); }}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  attachmentType === 'image' ? 'bg-brand-pink/15 border-brand-pink/20 text-brand-pink' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
              </button>

              <button
                type="button"
                onClick={() => { setAttachmentType('pdf'); setNewPostAttachment('DSA_Notes_Sem3.pdf'); }}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  attachmentType === 'pdf' ? 'bg-brand-blue/15 border-brand-blue/20 text-brand-blue' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">PDF Note</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-teal text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90"
            >
              <span>Post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-panel p-6 rounded-3xl text-left space-y-4">
            
            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white font-extrabold text-sm">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">{post.name}</h4>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">{post.college}</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-semibold">{post.timestamp}</span>
            </div>

            {/* Post Content */}
            <p className="text-xs text-gray-300 leading-relaxed font-normal">{post.text}</p>

            {/* Attached file/card if any */}
            {post.attachmentName && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-200 block truncate max-w-[200px]">{post.attachmentName}</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">{post.type}</span>
                  </div>
                </div>
                <a 
                  href={post.attachmentUrl}
                  onClick={(e) => { e.preventDefault(); addToast({ message: 'File download initiated.', type: 'info' }); }}
                  className="text-[10px] font-black uppercase text-brand-blue hover:underline"
                >
                  Download
                </a>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-4">
                {/* Like */}
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    post.likedByUser ? 'text-brand-pink' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4.5 h-4.5 ${post.likedByUser ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                {/* Comment Toggle */}
                <button 
                  onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Save */}
                <button 
                  onClick={() => handleSave(post.id)}
                  className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${
                    post.savedByUser ? 'text-brand-teal' : 'text-gray-500'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-4 h-4 ${post.savedByUser ? 'fill-current' : ''}`} />
                </button>

                {/* Share */}
                <button 
                  onClick={() => addToast({ message: 'Direct post link copied to clipboard!', type: 'success' })}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  title="Share Post"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Comments Area drawer */}
            {activeCommentsPostId === post.id && (
              <div className="border-t border-white/5 pt-4 space-y-4 animate-fade-in">
                {post.comments.length > 0 && (
                  <div className="space-y-3 bg-[#030712]/30 p-4 rounded-2xl border border-white/5">
                    {post.comments.map((c) => (
                      <div key={c.id} className="text-left space-y-0.5">
                        <span className="text-[10px] font-extrabold text-white block">{c.name}</span>
                        <p className="text-[11px] text-gray-400 font-normal leading-normal">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Comment input box */}
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand-teal"
                  />
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="p-2.5 rounded-xl bg-brand-teal text-black hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
