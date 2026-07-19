import React, { useState, useEffect } from 'react';
import { Search, Send, CheckCheck, Smile, HelpCircle, Image, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function NetworkMessages({ user }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(1);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock Conversations list
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Preeti Sharma',
      avatar: 'P',
      lastMessage: 'Got the semaphores PDF. Let me know when you want to call!',
      online: true,
      unread: false,
      timestamp: '10:45 PM',
      messages: [
        { id: 101, sender: 'Preeti', text: 'Hey! Did you get the notes?', time: '10:40 PM', read: true },
        { id: 102, sender: 'me', text: 'Yes, just downloaded them. They look super detailed.', time: '10:42 PM', read: true },
        { id: 103, sender: 'Preeti', text: 'Awesome! Got the semaphores PDF. Let me know when you want to call!', time: '10:45 PM', read: true }
      ]
    },
    {
      id: 2,
      name: 'Rohan Gupta',
      avatar: 'R',
      lastMessage: 'Let\'s team up for the Smart India Hackathon! 🚀',
      online: false,
      unread: true,
      timestamp: 'Yesterday',
      messages: [
        { id: 201, sender: 'Rohan', text: 'Hey, saw your project portfolio on React. Let\'s team up for the Smart India Hackathon! 🚀', time: 'Yesterday', read: true }
      ]
    }
  ]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMessageObj = {
      id: Date.now(),
      sender: 'me',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    // Update active chat messages
    setChats(chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: typedMessage,
          messages: [...c.messages, newMessageObj]
        };
      }
      return c;
    }));

    setTypedMessage('');

    // Trigger typing simulation & mock response
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      const mockResponse = {
        id: Date.now() + 1,
        sender: activeChat.name,
        text: `Thanks for the text! Let's connect on Zoom or Study Arena later. 👍`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      
      setChats(prevChats => prevChats.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: mockResponse.text,
            messages: [...c.messages, mockResponse]
          };
        }
        return c;
      }));
      addToast({ message: `New message from ${activeChat.name}`, type: 'info' });
    }, 3000);
  };

  const handleEmojiClick = (emoji) => {
    setTypedMessage(prev => prev + emoji);
  };

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
      
      {/* Left Pane: Conversations sidebar list */}
      <div className="md:col-span-4 border-r border-white/5 bg-black/10 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-4 flex items-center gap-3 border-b border-white/[0.02] cursor-pointer transition-colors text-left ${
                activeChatId === chat.id ? 'bg-white/5' : 'hover:bg-white/[0.01]'
              }`}
            >
              {/* Avatar online status indicator */}
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white font-extrabold text-sm">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#090910]"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-xs font-extrabold text-white truncate">{chat.name}</h4>
                  <span className="text-[9px] text-gray-500 font-semibold">{chat.timestamp}</span>
                </div>
                <p className={`text-[11px] truncate mt-0.5 ${chat.unread ? 'text-white font-bold' : 'text-gray-400 font-normal'}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Chat Window message list */}
      <div className="md:col-span-8 flex flex-col h-full bg-black/20">
        
        {/* Chat header */}
        <div className="p-4 border-b border-white/5 bg-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white font-extrabold text-xs">
              {activeChat.avatar}
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white">{activeChat.name}</h4>
              <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider">
                {activeChat.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages Timelines container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px] min-h-[300px] custom-scrollbar flex flex-col justify-end">
          <div className="space-y-4">
            {activeChat.messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div 
                  key={m.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs font-normal leading-relaxed text-left space-y-1 ${
                    isMe 
                      ? 'bg-brand-teal text-black rounded-tr-none font-semibold' 
                      : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                  }`}>
                    <p>{m.text}</p>
                    <div className="flex items-center justify-end gap-1 text-[8px] text-gray-500 font-bold uppercase mt-1">
                      <span>{m.time}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-brand-teal" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-bold italic animate-pulse">
                    {activeChat.name} is typing...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input box tools */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/10 flex items-center gap-2">
          
          <div className="flex items-center gap-1 shrink-0">
            <button 
              type="button" 
              onClick={() => handleEmojiClick('👍')} 
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              👍
            </button>
            <button 
              type="button" 
              onClick={() => handleEmojiClick('🚀')} 
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              🚀
            </button>
          </div>

          <input 
            type="text" 
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand-teal"
          />

          <button 
            type="submit"
            className="p-2.5 rounded-xl bg-brand-teal text-black hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
