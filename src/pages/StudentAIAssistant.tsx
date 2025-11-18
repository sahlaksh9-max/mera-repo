import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Minimal port of the provided HTML/CSS/JS into React with fixes for delete/clear
// Notes:
// - Uses localStorage key 'studyAssistantChats'
// - Fixes template literal misuse and confirm() usage
// - Delete chat and Clear All Chats fully working
// - API key now hardcoded as requested

interface UploadedFile {
  name: string;
  type: string;
  data: string; // data URL
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: UploadedFile[];
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

const STORAGE_KEY = 'studyAssistantChats';
const FEEDBACK_KEY = 'messageFeedbacks';

const AIAssistantPage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatIdCounter, setChatIdCounter] = useState(0);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Record<string, 'like' | 'dislike'>>({});
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // TTS language/voice management
  const [ttsLang, setTtsLang] = useState<'auto' | 'hi-IN' | 'en-IN' | 'en-US'>(() => (localStorage.getItem('ai-tts-lang') as any) || 'auto');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // UI feedback & rename modal state
  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastVisible, setToastVisible] = useState(false);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState<string>('');

  const API_KEY: string | undefined = 'AIzaSyBmCBMa2oYj3Gz5vD4VVbmzbQjkstrp0g4';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

  // Load available voices for TTS
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Persist TTS language
  useEffect(() => {
    localStorage.setItem('ai-tts-lang', ttsLang);
  }, [ttsLang]);

  // Load from storage
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed: Record<string, Chat> = JSON.parse(s);
        setChats(parsed);
        const maxId = Object.keys(parsed).length > 0 ? Math.max(...Object.keys(parsed).map(i => parseInt(i))) + 1 : 0;
        setChatIdCounter(maxId);
        const sorted = Object.keys(parsed).sort((a,b) => parsed[b].timestamp - parsed[a].timestamp);
        setCurrentChatId(sorted[0] || null);
      }
      const fb = localStorage.getItem(FEEDBACK_KEY);
      if (fb) setFeedbacks(JSON.parse(fb));
    } catch {}
  }, []);

  // Persist chats
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  // Helpers
  const currentChat = currentChatId ? chats[currentChatId] : undefined;

  const ensureChat = () => {
    if (currentChatId && chats[currentChatId]) return currentChatId;
    const id = String(chatIdCounter);
    const newChat: Chat = { id, title: `Study Session ${id}`, messages: [], timestamp: Date.now() };
    setChats(prev => ({ ...prev, [id]: newChat }));
    setCurrentChatId(id);
    setChatIdCounter(prev => prev + 1);
    return id;
  };

  const generateChatTitle = (text: string) => {
    const t = text.substring(0, 40).trim();
    return t.length < text.length ? `${t}...` : t;
  };

  const saveMsg = (chatId: string, msg: ChatMessage) => {
    setChats(prev => {
      const c = prev[chatId];
      const updated: Chat = { ...c, messages: [...c.messages, msg], timestamp: Date.now() };
      // auto-title on first user message
      if (msg.role === 'user' && c.messages.length === 0) {
        updated.title = generateChatTitle(msg.content);
      }
      return { ...prev, [chatId]: updated };
    });
  };

  const formatText = (text: string) => {
    let t = text;
    t = t.replace(/\n\n/g, '</p><p>');
    t = t.replace(/\n/g, '<br>');
    if (!t.includes('<p>')) t = `<p>${t}</p>`;
    // code blocks ```
    t = t.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // inline code `code`
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    // bold **text**
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italic *text*
    t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // blockquotes
    t = t.replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>');
    return t;
  };

  const scrollBottom = () => {
    requestAnimationFrame(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    });
  };

  const handleSend = async () => {
    if (!message.trim() && uploaded.length === 0) return;
    const id = ensureChat();

    // add user message
    const userMsg: ChatMessage = { role: 'user', content: message.trim(), images: uploaded, timestamp: Date.now() };
    saveMsg(id, userMsg);
    setMessage('');
    setUploaded([]);
    setIsTyping(true);
    scrollBottom();

    // prepare request
    const body: any = {
      contents: [
        { parts: [{ text: userMsg.content || 'Please analyze these images' }] }
      ],
      generationConfig: { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 2048 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ]
    };
    if (userMsg.images && userMsg.images.length) {
      for (const f of userMsg.images) {
        const base64 = f.data.split(',')[1];
        body.contents[0].parts.push({ inline_data: { mime_type: f.type, data: base64 } });
      }
    }

    try {
      if (!API_KEY) throw new Error('Missing VITE_GEMINI_API_KEY in .env');
      const res = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API request failed: ${res.status}`);
      }
      const data = await res.json();
      const aiText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
      const aiMsg: ChatMessage = { role: 'assistant', content: aiText, timestamp: Date.now() } as ChatMessage;
      saveMsg(id, aiMsg);
    } catch (e: any) {
      const aiMsg: ChatMessage = { role: 'assistant', content: `Error: ${e.message}`, timestamp: Date.now() } as ChatMessage;
      saveMsg(id, aiMsg);
    } finally {
      setIsTyping(false);
      scrollBottom();
    }
  };

  const handleDeleteChat = (chatId: string) => {
    if (!chats[chatId]) return;
    if (!confirm(`Are you sure you want to delete "${chats[chatId].title}"?`)) return;
    setChats(prev => {
      const { [chatId]: _, ...rest } = prev;
      return rest;
    });
    if (currentChatId === chatId) {
      const ids = Object.keys(chats).filter(id => id !== chatId).sort((a,b) => chats[b].timestamp - chats[a].timestamp);
      setCurrentChatId(ids[0] || null);
    }
  };

  const handleClearAll = () => {
    if (!confirm('Are you sure you want to delete all chats? This action cannot be undone.')) return;
    setChats({});
    setCurrentChatId(null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  };

  const setLike = (messageId: string, type: 'like' | 'dislike') => {
    setFeedbacks(prev => {
      const updated = { ...prev, [messageId]: type };
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const chatList = useMemo(() => Object.keys(chats).sort((a,b) => chats[b].timestamp - chats[a].timestamp), [chats]);

  // Speech synthesis for AI messages
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speech-to-text (voice input)
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const initRecognition = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    const langToUse = ttsLang === 'auto' ? 'en-IN' : ttsLang; // default for Hinglish
    rec.lang = langToUse;
    rec.onstart = () => setListening(true);
    rec.onerror = () => { setListening(false); showToast('Voice error'); };
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      if (transcript) {
        setMessage(transcript);
        const isFinal = e.results[e.results.length - 1].isFinal;
        if (isFinal) setTimeout(() => { if (transcript.trim()) handleSend(); }, 120);
      }
    };
    return rec;
  };

  const toggleVoiceInput = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { showToast('Speech input not supported'); return; }
    if (listening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setListening(false);
      return;
    }
    const rec = initRecognition();
    if (!rec) { showToast('Speech input not available'); return; }
    recognitionRef.current = rec;
    try { rec.start(); } catch { showToast('Unable to start mic'); }
  };

  const detectLang = (text: string): 'hi-IN' | 'en-IN' | 'en-US' => {
    // If Devanagari present -> Hindi
    if (/[ - ]/.test('')) { /* no-op to satisfy TS build */ }
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
    // Hinglish heuristic: common Hindi words written in Latin
    const hinglishWords = ['hai','nahi','kya','kyu','kaise','mein','hum','tum','aap','se','ko','ke','tha','thi','hoga','kr','kar','hana','hona','bhai','bahut'];
    const tokens = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    const hits = tokens.filter(t => hinglishWords.includes(t)).length;
    if (hits >= 2) return 'en-IN'; // Indian English voice suits Hinglish
    return 'en-US';
  };

  const pickVoice = (langPref: 'hi-IN' | 'en-IN' | 'en-US') => {
    if (!voices || !voices.length) return null;
    // Prefer exact lang code
    let v = voices.find(v => v.lang?.toLowerCase().startsWith(langPref.toLowerCase()));
    if (v) return v;
    // Fallbacks
    if (langPref === 'hi-IN') v = voices.find(v => /hi/i.test(v.lang));
    if (!v && langPref === 'en-IN') v = voices.find(v => /en-in/i.test(v.lang));
    if (!v && langPref === 'en-US') v = voices.find(v => /en-us/i.test(v.lang));
    // Any English
    if (!v) v = voices.find(v => /^en/i.test(v.lang));
    return v || null;
  };

  const speak = (id: string, text: string) => {
    try {
      if (!('speechSynthesis' in window)) {
        showToast('Speech not supported on this browser');
        return;
      }
      // Stop any current speech
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);

      const langToUse = ttsLang === 'auto' ? detectLang(text) : ttsLang;
      u.lang = langToUse;

      let voice = pickVoice(langToUse);
      if (!voice) {
        // Try reloading voices once
        const tryLater = () => {
          const v2 = window.speechSynthesis.getVoices();
          if (v2 && v2.length) {
            const found = pickVoice(langToUse);
            if (found) {
              u.voice = found;
              window.speechSynthesis.speak(u);
              return;
            }
          }
          window.speechSynthesis.speak(u);
        };
        setTimeout(tryLater, 150);
      } else {
        u.voice = voice;
      }

      // Slightly slower for Hindi for clarity
      u.rate = langToUse === 'hi-IN' ? 0.95 : 1.0;
      u.pitch = 1.0;
      u.onend = () => { setSpeakingId(null); utteranceRef.current = null; };
      u.onerror = () => { setSpeakingId(null); utteranceRef.current = null; showToast('Speech error'); };
      utteranceRef.current = u;
      setSpeakingId(id);
      // If voice was set later via timeout, do not double-speak
      if (voice) window.speechSynthesis.speak(u);
    } catch (e) {
      showToast('Failed to start speech');
    }
  };

  const stopSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
    utteranceRef.current = null;
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard');
    } catch {
      showToast('Copy failed');
    }
  };

  const openRename = (chatId: string) => {
    setRenamingChatId(chatId);
    setRenameTitle(chats[chatId]?.title || '');
  };

  const saveRename = () => {
    if (!renamingChatId) return;
    const title = renameTitle.trim();
    if (!title) return;
    setChats(prev => ({ ...prev, [renamingChatId]: { ...prev[renamingChatId], title } }));
    setRenamingChatId(null);
    setRenameTitle('');
    showToast('Chat renamed');
  };

  // Close upload menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = () => setMenuOpen(false);
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuOpen]);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-b border-white/10 bg-black">
        <div className="container-wide px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10" onClick={() => navigate(-1)}>← Back</Button>
            <h1 className="text-lg font-semibold text-white">Study Assistant</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              className="md:hidden px-3 py-1 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 text-sm"
              onClick={() => setMobileSidebar(true)}
            >
              Chats
            </button>
            <div className="flex items-center gap-2">
              <div className="text-sm text-white/60">Gemini 2.5 Pro</div>
              <select
                value={ttsLang}
                onChange={(e) => setTtsLang(e.target.value as any)}
                className="ml-2 bg-black/40 text-white text-xs border border-white/20 rounded px-2 py-1 hover:bg-white/10"
                title="TTS Language"
              >
                <option value="auto">TTS: Auto</option>
                <option value="hi-IN">TTS: Hindi</option>
                <option value="en-IN">TTS: English (India)</option>
                <option value="en-US">TTS: English (US)</option>
              </select>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className={`hidden md:flex flex-col w-64 bg-black text-white transition-all ${sidebarCollapsed ? '-ml-64' : ''}`}>
          <div className="p-4 border-b border-white/10">
            <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" onClick={() => {
              const id = String(chatIdCounter);
              const newChat: Chat = { id, title: `Study Session ${id}`, messages: [], timestamp: Date.now() };
              setChats(prev => ({ ...prev, [id]: newChat }));
              setCurrentChatId(id);
              setChatIdCounter(prev => prev + 1);
            }}>+ New Chat</Button>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {chatList.map(id => (
              <div key={id} className={`flex items-center justify-between px-2 py-2 rounded hover:bg-white/10 cursor-pointer ${currentChatId===id?'bg-white/10':''}`} onClick={() => setCurrentChatId(id)}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-white/80 truncate">{chats[id].title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded hover:bg-white/10" title="Rename" onClick={(e) => { e.stopPropagation(); openRename(id); }}>✏️</button>
                  <button className="w-6 h-6 rounded hover:bg-white/10" title="Delete" onClick={(e) => { e.stopPropagation(); handleDeleteChat(id); }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
            <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleClearAll}>Clear All Chats</Button>
          </div>
        </aside>

        {mobileSidebar && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-5/6 max-w-xs bg-black text-white border-r border-white/10 shadow-xl flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="font-semibold">Chats</div>
                <button
                  className="px-2 py-1 rounded border border-white/20 text-white/80 hover:bg-white/10 text-sm"
                  onClick={() => setMobileSidebar(false)}
                >
                  Close
                </button>
              </div>
              <div className="p-4 border-b border-white/10">
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    const id = String(chatIdCounter);
                    const newChat: Chat = { id, title: `Study Session ${id}`, messages: [], timestamp: Date.now() };
                    setChats(prev => ({ ...prev, [id]: newChat }));
                    setCurrentChatId(id);
                    setChatIdCounter(prev => prev + 1);
                    setMobileSidebar(false);
                  }}
                >
                  + New Chat
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-2 space-y-1">
                {chatList.map(id => (
                  <div
                    key={id}
                    className={`flex items-center justify-between px-2 py-2 rounded hover:bg-white/10 cursor-pointer ${currentChatId===id?'bg-white/10':''}`}
                    onClick={() => { setCurrentChatId(id); setMobileSidebar(false); }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white/80 truncate">{chats[id].title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="w-6 h-6 rounded hover:bg-white/10"
                        title="Rename"
                        onClick={(e) => { e.stopPropagation(); openRename(id); }}
                      >
                        ✏️
                      </button>
                      <button
                        className="w-6 h-6 rounded hover:bg-white/10"
                        title="Delete"
                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(id); }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10">
                <Button
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => { handleClearAll(); setMobileSidebar(false); }}
                >
                  Clear All Chats
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4 bg-black" ref={chatMessagesRef}>
            {!currentChat || currentChat.messages.length === 0 ? (
              <div className="max-w-2xl mx-auto h-full flex items-center justify-center text-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-white">Welcome to Your Study Assistant</h2>
                  <p className="text-white/70 mb-6">Ask questions, upload images for analysis, or explore new concepts.</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Explain photosynthesis in simple terms','Help me solve this math problem','Analyze this diagram','Create a study plan for exams'].map((p) => (
                      <button key={p} className="px-3 py-1 rounded-full border border-white/30 text-sm hover:bg-white/10" onClick={() => setMessage(p)}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {currentChat.messages.map((m, idx) => {
                  const isUser = m.role === 'user';
                  const msgId = `${currentChat.id}-${m.timestamp}`;
                  return (
                    <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
                      {!isUser && (
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">AI</div>
                      )}
                      <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
                        <div className={`${isUser ? '' : 'p-[1px] rounded-2xl bg-gradient-to-r from-sky-500/40 via-white/10 to-amber-400/40'} `}>
                          <div className={`rounded-2xl px-3 py-2 text-sm ${isUser ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow' : 'bg-neutral-950 text-white border border-white/10 shadow'} `} dangerouslySetInnerHTML={{ __html: formatText(m.content) }} />
                        </div>
                        {m.images && m.images.length>0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {m.images.map((img, i) => (
                              <img key={i} src={img.data} alt={img.name} className="w-32 h-32 object-cover rounded" />
                            ))}
                          </div>
                        )}
                        {!isUser && (
                          <div className="mt-1">
                            <div className="flex items-center gap-3 text-xs text-white/70">
                              <button onClick={() => handleCopy(m.content)} className="px-2 py-1 rounded hover:bg-white/10">📋 Copy</button>
                              <button
                                className="px-2 py-1 rounded hover:bg-white/10"
                                onClick={() => speak(msgId, m.content)}
                                disabled={speakingId === msgId}
                              >
                                🔊 {speakingId === msgId ? 'Speaking...' : 'Listen'}
                              </button>
                              <button
                                className="px-2 py-1 rounded hover:bg-white/10"
                                onClick={stopSpeaking}
                              >
                                ⏹ Stop
                              </button>
                              <button
                                className={`px-2 py-1 rounded hover:bg-white/10 ${feedbacks[msgId]==='like' ? 'text-sky-400' : ''}`}
                                onClick={() => { setLike(msgId,'like'); showToast('Thanks for your feedback'); }}
                              >
                                👍 Like
                              </button>
                              <button
                                className={`px-2 py-1 rounded hover:bg-white/10 ${feedbacks[msgId]==='dislike' ? 'text-amber-400' : ''}`}
                                onClick={() => { setLike(msgId,'dislike'); showToast('Thanks for your feedback'); }}
                              >
                                👎 Dislike
                              </button>
                            </div>
                            {feedbacks[msgId] && (
                              <div className="text-[11px] mt-1 text-amber-300">Thanks for your feedback!</div>
                            )}
                          </div>
                        )}
                      </div>
                      {isUser && (
                        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">U</div>
                      )}
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">AI</div>
                    <div className="bg-neutral-900 text-white border border-white/10 rounded-2xl px-3 py-2 text-sm">Typing...</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-3 bg-black">
            <div className="max-w-3xl mx-auto">
              {/* Uploaded thumbnails */}
              {uploaded.length>0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {uploaded.map((f, idx) => (
                    <div key={idx} className="relative w-20 h-20 border border-white/20 rounded overflow-hidden">
                      <img src={f.data} alt={f.name} className="w-full h-full object-cover" />
                      <button className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-[10px]" onClick={() => setUploaded(prev => prev.filter((_,i)=>i!==idx))}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full cursor-pointer text-black font-bold shadow-lg bg-gradient-to-br from-amber-400 via-yellow-400 to-sky-500 ring-2 ring-white/20 hover:ring-amber-400/50 hover:shadow-amber-400/30 transition"
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    ＋
                  </button>

                  {/* Hidden inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files||[]);
                      for (const file of files) {
                        if (!file.type.startsWith('image/')) continue;
                        const data = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onload = () => resolve(reader.result as string);
                          reader.readAsDataURL(file);
                        });
                        setUploaded(prev => [...prev, { name: file.name, type: file.type, data }]);
                      }
                    }}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files||[]);
                      for (const file of files) {
                        if (!file.type.startsWith('image/')) continue;
                        const data = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onload = () => resolve(reader.result as string);
                          reader.readAsDataURL(file);
                        });
                        setUploaded(prev => [...prev, { name: file.name, type: file.type, data }]);
                      }
                    }}
                  />

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.12 }}
                        className="absolute bottom-12 left-0 w-64 rounded-xl border border-white/10 bg-neutral-950 text-white shadow-xl p-1 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
                          onClick={() => { cameraInputRef.current?.click(); setMenuOpen(false); }}
                        >
                          <span className="text-lg">📷</span>
                          <span>
                            <div className="text-sm font-medium">Take Photo</div>
                            <div className="text-xs text-white/60">Use your camera to capture an image</div>
                          </span>
                        </button>
                        <button
                          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
                          onClick={() => { fileInputRef.current?.click(); setMenuOpen(false); }}
                        >
                          <span className="text-lg">🖼️</span>
                          <span>
                            <div className="text-sm font-medium">Choose from Device</div>
                            <div className="text-xs text-white/60">Select images from your device</div>
                          </span>
                        </button>
                        <button
                          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
                          onClick={() => { setMessage((m) => `Please provide a deep learning explanation with examples and detailed breakdown of concepts: ${m || ''}`); setMenuOpen(false); messageInputRef.current?.focus(); }}
                        >
                          <span className="text-lg">🧠</span>
                          <span>
                            <div className="text-sm font-medium">Deep Learning</div>
                            <div className="text-xs text-white/60">Get in-depth explanations with examples</div>
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mic button */}
                <button
                  type="button"
                  onClick={() => toggleVoiceInput()}
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-full font-bold shadow-lg ring-2 transition ${listening ? 'bg-red-500 text-white ring-red-300 animate-pulse' : 'text-black bg-gradient-to-br from-sky-500 via-blue-500 to-amber-400 ring-white/20 hover:ring-sky-400/50 hover:shadow-sky-400/30'}`}
                  title="Speak to type"
                >
                  🎤
                </button>

                <div className="relative flex-1 p-[2px] rounded-2xl bg-gradient-to-r from-amber-500/60 via-white/10 to-sky-500/60 shadow-[0_0_20px_rgba(2,132,199,0.15)]">
                  <textarea
                    ref={messageInputRef}
                    value={message}
                    onChange={(e)=> setMessage(e.target.value)}
                    rows={1}
                    onKeyDown={(e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    className="w-full resize-none border border-white/10 bg-neutral-950 text-white rounded-[0.9rem] px-3 py-2 text-sm max-h-40 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="Ask me anything or upload an image to analyze..."
                  />
                </div>
                <Button onClick={handleSend} disabled={isTyping} className="h-11 px-5 font-semibold text-white shadow-lg bg-gradient-to-r from-sky-600 via-blue-600 to-amber-500 hover:brightness-110 hover:shadow-amber-400/40 disabled:opacity-60 disabled:cursor-not-allowed">Send</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    {/* Rename Modal */}
      <AnimatePresence>
        {renamingChatId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setRenamingChatId(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-11/12 max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-4 text-white shadow-xl"
            >
              <div className="text-lg font-semibold mb-3">Rename Chat</div>
              <input
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                className="w-full bg-neutral-900 border border-white/20 rounded-lg p-2 outline-none"
                placeholder="Enter new chat name"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-1 rounded border border-white/20 hover:bg-white/10" onClick={() => setRenamingChatId(null)}>Cancel</button>
                <button className="px-3 py-1 rounded bg-gradient-to-r from-sky-600 to-amber-500 text-black font-medium" onClick={saveRename}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-sm bg-white/10 text-white border border-white/20 shadow transition ${toastVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {toastMsg}
      </div>
    </div>
  );
};

export default AIAssistantPage;
