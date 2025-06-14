import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { chatService } from "../../services/chatService";
import { Message as BaseMessage } from "../../types/chat";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Extend Message type to include optional originalText and isTyping
type Message = BaseMessage & {
  originalText?: string;
  isTyping?: boolean;
  processedText?: string;
};

// Utility function to detect and convert email addresses to mailto links
const convertEmailsToLinks = (text: string): string => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  return text.replace(emailRegex, (email) => {
    return `[${email}](mailto:${email})`;
  });
};

// Utility function to process URLs in markdown
const convertUrlsToMarkdown = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s()]+?)(?=[.,;:!?]?(?:\s|$))/g;
  return text.replace(urlRegex, (url) => {
    let displayText = '';
    if (url.endsWith('.com')) {
      const parts = url.split('.');
      displayText = parts[parts.length - 2].split('/').pop() || 'link';
    } else {
      const parts = url.split('/');
      displayText = parts[parts.length - 1] || 'link';
    }
    return `[${displayText}](${url})`;
  });
};

const emphasizeKeywords = (text: string): string => {
  const keywords = ["SecureTrack", "BizRadar", "AI Security", "Cloud Engineering", 
                    "Application Security", "Data Engineering"];
  return keywords.reduce(
    (acc, kw) => acc.replace(new RegExp(`\\b${kw}\\b`, "gi"), `**${kw}**`),
    text
  );
};

const commaListToBullets = (text: string): string => {
  // converts lines like "We offer A, B, C, and D." into bullet list
  return text.replace(
    /(?:^|[\n\r])([^*\n\r].*?:)([^*\n\r]+, .+?)\.(?:[\n\r]|$)/g,
    (_, intro, list) => {
      const items = list.split(/\s*,\s*/).map(s => `- ${s.trim()}`);
      return `\n\n${intro}\n${items.join("\n")}\n`;
    }
  );
};


// Process text to convert both emails and URLs to markdown format
const processTextToMarkdown = (text: string): string => {
  let processedText = text;
  processedText = convertEmailsToLinks(processedText);
  processedText = convertUrlsToMarkdown(processedText);
  // processedText = emphasizeKeywords(processedText);
  // processedText = commaListToBullets(processedText);
  return processedText;
};

// ───── TypeWriter component (animated + static in one) ──────────
type TWProps = {
  text: string;
  delay?: number;
  isAnimating?: boolean;
  onComplete: () => void;
};

const TypeWriter: React.FC<TWProps> = ({
  text,
  delay = 30,
  isAnimating = true,
  onComplete
}) => {
  const [display, setDisplay] = useState(isAnimating ? "" : text);
  const [idx, setIdx] = useState(0);

  /* typing loop only when animation is ON */
  useEffect(() => {
    if (!isAnimating) return;           // skip when already static
    if (idx < text.length) {
      const t = setTimeout(() => {
        setDisplay((p) => p + text[idx]);
        setIdx(idx + 1);
      }, delay);
      return () => clearTimeout(t);
    }
    onComplete();
  }, [idx, isAnimating, text, delay]);

    return (
    <div className="indrasol-markdown">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indrasol-blue font-semibold underline hover:opacity-80 transition-opacity" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="text-indrasol-blue font-bold" />
          )
        }}
      >
        {display}
      </ReactMarkdown>
    </div>
  );
};

// Helper function to convert URLs into hyperlinks (fixed regex to exclude punctuation)
const convertLinksToHyperlinks = (text: string): string => {
  // Updated regex to exclude trailing punctuation marks
  return text.replace(/(https?:\/\/[^\s()]+?)(?=[.,;:!?]?(?:\s|$))/g, (url) => {
    let displayText = '';
    if (url.endsWith('.com')) {
      const parts = url.split('.');
      displayText = parts[parts.length - 2].split('/').pop() || 'link';
    } else {
      const parts = url.split('/');
      displayText = parts[parts.length - 1] || 'link';
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${displayText}</a>`;
  });
};

// Predefined suggestions for real-time filtering
const TYPING_SUGGESTIONS = [
  "What products and services do you offer?",
  "Where are your global locations?",
  "Tell me about your AI and security solutions",
  "What is SecureTrack?",
  "What is BizRadar?",
  "How can I contact your sales team?",
  "What industries do you serve?",
  "Tell me about your cloud engineering services",
  "What are your data engineering capabilities?",
  "Do you have case studies?",
  "What whitepapers do you have available?",
  "Tell me about your company history",
  "What makes Indrasol different?",
  "How do I get started with your services?",
  "What is your pricing model?"
];

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [chatHeight, setChatHeight] = useState<number>(450);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Reset chat when closed and reopened
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setNewMessage("");
      setIsTyping(false);
    }
  }, [isOpen]);

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dynamically adjust chat window height
  useEffect(() => {
    if (isOpen && chatContentRef.current) {
      const updateHeight = () => {
        const contentHeight = chatContentRef.current?.scrollHeight || 0;
        
        // Different min heights based on whether we're showing initial suggestions
        const isShowingInitialSuggestions = messages.length === 0 && !waiting;
        
        if (isShowingInitialSuggestions) {
          // Calculate height needed for initial suggestions
          // Header (80px) + Welcome content (250px) + 3 suggestions (240px) + Input (80px) + padding (80px)
          const suggestionsHeight = 730;
          const maxHeight = window.innerHeight * 0.9; // Increased max height
          setChatHeight(Math.min(suggestionsHeight, maxHeight));
        } else {
          // Normal dynamic height for conversations
          const minHeight = 450;
          const maxHeight = window.innerHeight * 0.85;
          const newHeight = Math.min(Math.max(contentHeight + 120, minHeight), maxHeight);
          setChatHeight(newHeight);
        }
      };
      
      // Small delay to ensure content is rendered
      setTimeout(updateHeight, 100);
      
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [isOpen, messages, waiting]);

  /* ─── helper: flip one message out of “typing” mode ─── */
  const handleTypeDone = (id: number) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isTyping: false } : m))
    );

     /* ───────────── send helpers (timer removed) ────────── */
  const pushBotMessage = (raw: string) => {
    const id   = Date.now();
    const txt  = processTextToMarkdown(raw);
    const row: Message = { id, text: txt, originalText: raw, isTyping: true, sender: "bot" };
    setMessages((p) => [...p, row]);
    return id;
  };

  const handleSend = async (text: string, optimistic: Message[]) => {
    try {
      const { botReply } = await chatService.sendMessage(text, optimistic);
      const botId = pushBotMessage(botReply.text);
      setWaiting(false);                  // global dots off
      /* row will self-finalise via TypeWriter.onComplete */
    } catch (error) {
      console.error('Error sending message:', error);
      setWaiting(false);
      // Add error message
      const errorMessage: Message = {
        id: Date.now(),
        text: 'Sorry! Something went wrong. Please try again.',
        sender: 'bot'
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  /* ───────────── onSubmit / onSuggestion ─────────────── */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newMessage.trim();
    if (!clean) return;
    const userRow: Message = { id: Date.now(), text: clean, sender: "user" };
    const optimistic = [...messages, userRow];
    setMessages(optimistic);
    setNewMessage("");
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setWaiting(true);
    await handleSend(clean, optimistic);
  };

  const handleSuggestion = async (s: string) => {
    const userRow: Message = { id: Date.now(), text: s, sender: "user" };
    const optimistic = [...messages, userRow];
    setMessages(optimistic);
    setNewMessage("");
    setShowSuggestions(false);
    setWaiting(true);
    await handleSend(s, optimistic);
  };

  // Handle input change with real-time suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    if (value.trim().length > 1) {
      const filtered = TYPING_SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  // Handle sending a message
  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newMessage.trim() === '') return;
  
  //   /* 1️⃣  Build user message & optimistic UI update */
  //   const userMessage: Message = {
  //     id: Date.now(),          // unique enough for UI
  //     text: newMessage.trim(),
  //     sender: 'user'
  //   };
  //   const optimisticHistory = [...messages, userMessage];
  //   setMessages(optimisticHistory);
  //   setNewMessage('');
  //   setIsTyping(true);
  
  //   try {
  //     /* 2️⃣  Call backend with full history so far            *
  //      *     chatService will return { botReply, newHistory }  */
  //     const { botReply, newHistory } = await chatService.sendMessage(
  //       newMessage.trim(),
  //       optimisticHistory        // pass the current transcript
  //     );
  
  //     /* 3️⃣  Markdown-link processing for bot text */
  //     const botId        = Date.now();  
  //     const processedText = processTextToMarkdown(botReply.text);
  //     const typingBotMessage: Message = {
  //       ...botReply,
  //       id:   botId,
  //       originalText: botReply.text,
  //       text: processedText,
  //       isTyping: true
  //     };
  
  //     /* 4️⃣  Show “typing” bubble, then settle */
  //     setMessages([...optimisticHistory, typingBotMessage]);
  
  //     const msPerChar = 30;
  //     const minDelay  = 500;
  //     // const delay     = Math.max(minDelay, processedText.length * msPerChar);
  //     // use processed length to compute delay
  //     const delay = Math.max(500, processedText.length * 30);
  
  //     setTimeout(() => {
  //       setMessages((prev) =>
  //         prev.map((msg) =>
  //           msg.id === botId ? { ...msg, isTyping: false } : msg
  //         )
  //       );
  //     }, delay);
  //   } catch (err) {
  //     console.error(err);
  //     /* 5️⃣  Network / server failure fallback */
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now() + 1,
  //         text: 'Sorry! Something went wrong. Please try again.',
  //         sender: 'bot'
  //       }
  //     ]);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };

  // // Handle suggestion click
  // const handleSuggestion = async (suggestionText: string): Promise<void> => {
  //   /* 1️⃣  Push the suggestion as a user message immediately */
  //   const userMsg: Message = {
  //     id: Date.now(),
  //     text: suggestionText,
  //     sender: 'user'
  //   };
  //   const optimistic = [...messages, userMsg];
  //   setMessages(optimistic);
  //   setIsTyping(true);
  
  //   try {
  //     /* 2️⃣  Send full history to backend */
  //     const { botReply, newHistory } = await chatService.sendMessage(
  //       suggestionText,
  //       optimistic
  //     );
  
  //     /* 3️⃣  Convert URLs/emails in bot text */
  //     const botId        = Date.now(); 
  //     const processedText = processTextToMarkdown(botReply.text);
  //     const typingBotMsg: Message = {
  //       ...botReply,
  //       id:   botId, 
  //       originalText: botReply.text,
  //       text: processedText,
  //       isTyping: true
  //     };
  
  //     /* 4️⃣  Show typing bubble */
  //     setMessages([...optimistic, typingBotMsg]);
  //     setIsTyping(false); 
  
  //     const msPerChar = 30;
  //     const minDelay  = 500;
  //     // const delay     = Math.max(minDelay, processedText.length * msPerChar);
  //     // const delay = Math.max(500, processedText.length * 30);
  
  //     // setTimeout(() => {
  //     //   setMessages((prev) =>
  //     //     prev.map((m) =>
  //     //       m.id ===  botId ? { ...m, isTyping: false } : m
  //     //     )
  //     //   );
  //     // }, delay);
  //   } catch (err) {
  //     console.error(err);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now() + 1,
  //         text: 'Sorry! Something went wrong. Please try again.',
  //         sender: 'bot'
  //       }
  //     ]);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };

  return (
    <>
      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" />
          <div className="absolute bottom-6 right-6 flex flex-row items-end gap-6 z-50">
            {/* Chat Window */}
            <div
              className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] max-w-4xl bg-white/95 backdrop-blur-md border border-blue-100 shadow-2xl rounded-3xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out blue-chat-window animate-scaleUp"
              style={{ height: `${chatHeight}px` }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-5 text-white flex items-center rounded-t-3xl shadow-md border-b border-blue-200">
                <div className="flex items-center">
                  <img
                    src="/lovable-uploads/indrabot-mascot.png"
                    alt="IndraBot"
                    className="w-8 h-8 mr-0 drop-shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-lg flex items-center">
                      IndraBot 
                      <span className="ml-2 flex items-center">
                        <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block mr-1.5"></span>
                        <span className="text-sm font-normal">| Ready to assist you</span>
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div 
                ref={chatContentRef}
                className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-gray-50/95"
              >
                <div className="space-y-4 pb-2 relative">
                  {messages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
                      <div className="mb-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 animate-pulse-slow">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <h4 className="text-gray-700 font-semibold mb-2 text-lg">How can I help you today?</h4>
                        <p className="text-gray-500 text-sm mb-4">Select an option below or type your question</p>
                      </div>
                      <div className="grid gap-4 w-full max-w-lg mx-auto">
                        <button 
                          onClick={() => handleSuggestion("What products and services do you offer?")}
                          className="suggestion-btn group bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-4 text-left transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 mr-4 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">Products & Services</h4>
                            <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700">Explore our comprehensive solutions</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handleSuggestion("Where are your global locations?")}
                          className="suggestion-btn group bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-400 hover:from-emerald-100 hover:to-teal-100 rounded-2xl p-4 text-left transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-3 mr-4 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">Global Locations</h4>
                            <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700">Find our offices worldwide</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handleSuggestion("Tell me about your AI and security solutions")}
                          className="suggestion-btn group bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 hover:from-purple-100 hover:to-pink-100 rounded-2xl p-4 text-left transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-3 mr-4 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-lg group-hover:text-purple-700 transition-colors">AI & Security</h4>
                            <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700">Advanced AI-powered security solutions</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  {messages.length > 0 && messages.map((message) => (
                    <div
                      key={message.id}
                      className={`animate-slideIn ${
                        message.sender === "user" ? "flex justify-end" : "flex justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 mt-1 mr-2 flex-shrink-0">
                          <img
                            src="/lovable-uploads/indrabot-mascot.png"
                            alt="Bot"
                            className="w-full h-full"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] px-5 py-4 shadow-sm transition-all ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none"
                        }`}
                      >
                        <div className="text-base md:text-lg leading-relaxed">
                          {message.sender === "bot" && (
                            <>
                              {/* TypeWriter handles both animated & static phases */}
                              <TypeWriter
                                text={message.text}
                                isAnimating={message.isTyping}
                                delay={30}
                                onComplete={() => handleTypeDone(message.id)}
                              />
                              {message.isTyping && (
                                <span className="typing-cursor animate-blink">|</span>
                              )}
                            </>
                          )}

                          {message.sender === "user" && message.text}
                        </div>


                        {/* <div className="text-sm md:text-base leading-relaxed">
                          {message.sender === "bot" && message.isTyping ? (
                            <>
                              <TypeWriter text={message.text} />
                              <span className="typing-cursor animate-blink">|</span>
                            </>
                          ) : message.sender === "bot" ? (
                            <div className="markdown">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: ({ node, ...props }) => (
                                  <a 
                                    {...props} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={`${message.sender === "user" ? "text-white" : "text-blue-500"} underline hover:opacity-80`}
                                  />
                                )
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                            </div>
                          ) : (
                            message.text
                          )}
                        </div> */}
                      </div>
                    </div>
                  ))}
                  {waiting && (
                    <div className="flex justify-start animate-fadeIn">
                      <div className="w-8 h-8 mt-1 mr-2 flex-shrink-0">
                        <img
                          src="/lovable-uploads/indrabot-mascot.png"
                          alt="Bot"
                          className="w-full h-full animate-pulse"
                        />
                      </div>
                      <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                          <span className="text-xs text-gray-500 animate-pulse">IndraBot is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
                            {/* Input */}
              <div className="border-t border-gray-200 bg-white rounded-b-3xl">
                {/* Real-time suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="px-5 py-3 border-b border-gray-100 max-h-48 overflow-y-auto suggestions-container">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Suggestions:</div>
                    <div className="space-y-1">
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 flex items-center group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="truncate">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="p-5 flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base transition-all duration-300 bg-gray-50"
                      value={newMessage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                    disabled={newMessage.trim() === ""}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
            
            {/* Mascot */}
            <div className="relative flex flex-col items-center animate-scaleUp">
              <img
                src="/lovable-uploads/indrabot-mascot.png"
                alt="IndraBot"
                className="w-56 h-56 md:w-80 md:h-80 transition-all duration-500 drop-shadow-2xl"
              />
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md transform transition-transform hover:rotate-90"
                onClick={setIsOpen.bind(null, false)}
              >
                <X className="w-6 h-6 md:w-7 md:h-7 stroke-2 text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mascot Button (Closed State) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className="relative cursor-pointer group"
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {hovering && (
              <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-4 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-blue-100 flex items-center gap-2 animate-fadeIn pointer-events-none select-none min-w-[210px]">
                <img src='/lovable-uploads/indrabot-mascot.png' alt='IndraBot' className='w-7 h-7 mr-2 drop-shadow' />
                <span className="text-gray-700 font-medium text-sm">Hi, I'm <span className="text-blue-600 font-bold">IndraBot</span>!<br/><span className="text-xs font-normal text-gray-500">Click to chat with me.</span></span>
              </div>
            )}
            <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-blue-500/30 to-sky-400/30 animate-pulse-slow-large"></div>
            <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-blue-500/40 to-sky-400/40 animate-pulse-medium group-hover:animate-none"></div>
            <div className="absolute -top-1 -right-1 flex">
              <div className="relative">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-white"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                </span>
              </div>
            </div>
            <img
              src="/lovable-uploads/indrabot-mascot.png"
              alt="Chat Bot"
              className={`w-16 h-16 md:w-24 md:h-24 transition-all duration-300 ${
                hovering ? 'transform scale-110 translate-y-[-5px]' : ''
              } drop-shadow-lg`}
            />
          </div>
        </div>
      )}
      
      {/* Scroll to Top Button */}
      <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-60">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none opacity-0 pointer-events-none"
          id="scrollTopBtn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleUp { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-subtle-bounce { animation: subtle-bounce 3s ease-in-out infinite; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(59, 130, 246, 0.5);
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        @keyframes pulse-slow-large {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse-slow-large {
          animation: pulse-slow-large 3s ease-in-out infinite;
        }
        
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-medium {
          animation: pulse-medium 2.5s ease-in-out infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.7s infinite;
        }
        
        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
        }
        
        .blue-chat-window {
          box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.3);
          transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .suggestion-btn {
          transform: translateY(0);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .suggestion-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* Real-time suggestions animations */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .suggestions-container {
          animation: slideDown 0.2s ease-out;
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }
        
        /* Indrasol Brand Colors */
        .text-indrasol-blue {
          color: #1e40af; /* Indrasol brand blue - adjust this hex code to match your exact brand color */
        }
        
        .indrasol-markdown strong {
          color: #1e40af !important;
          font-weight: 700;
        }
        
        .indrasol-markdown a {
          color: #1e40af !important;
          font-weight: 600;
          text-decoration: underline;
          transition: opacity 0.2s ease;
        }
        
        .indrasol-markdown a:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
};