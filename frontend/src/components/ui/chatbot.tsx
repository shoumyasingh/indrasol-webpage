// import React, { useState, useEffect, useRef } from "react";
// import { X, Send } from "lucide-react";
// import { chatService } from "../../services/chatService";
// import { Message } from "../../types/chat";

// const TypeWriter: React.FC<{ text: string; delay?: number; onComplete?: () => void }> = ({
//   text,
//   delay = 30,
//   onComplete
// }) => {
//   const [displayText, setDisplayText] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (currentIndex < text.length) {
//       const timeout = setTimeout(() => {
//         setDisplayText(prev => prev + text[currentIndex]);
//         setCurrentIndex(currentIndex + 1);
//       }, delay);
//       return () => clearTimeout(timeout);
//     } else if (onComplete) {
//       onComplete();
//     }
//   }, [currentIndex, text, delay, onComplete]);

//   return <>{displayText}</>;
// };

// export const ChatBot: React.FC = () => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [hovering, setHovering] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState<string>("");
//   const [isTyping, setIsTyping] = useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const chatContentRef = useRef<HTMLDivElement>(null);
//   const [chatHeight, setChatHeight] = useState<number>(450);

//   // Reset chat when closed and reopened
//   useEffect(() => {
//     if (!isOpen) {
//       setMessages([]);
//       setNewMessage("");
//       setIsTyping(false);
//     }
//   }, [isOpen]);

//   const toggleChat = (): void => {
//     setIsOpen(!isOpen);
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (isOpen && chatContentRef.current) {
//       const updateHeight = () => {
//         const contentHeight = chatContentRef.current?.scrollHeight || 0;
//         const minHeight = 450;
//         const maxHeight = window.innerHeight * 0.8;
//         const newHeight = Math.min(Math.max(contentHeight + 100, minHeight), maxHeight);
//         setChatHeight(newHeight);
//       };
      
//       updateHeight();
      
//       window.addEventListener('resize', updateHeight);
//       return () => window.removeEventListener('resize', updateHeight);
//     }
//   }, [isOpen, messages]);

//   const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     if (newMessage.trim() === "") return;

//     const userMessage: Message = {
//       id: messages.length + 1,
//       text: newMessage,
//       sender: "user"
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setNewMessage("");
//     setIsTyping(true);

//     try {
//       const botResponse = await chatService.sendMessage(newMessage);
//       console.log("Response from server:", botResponse);
      
//       // Set isTyping for typewriter effect
//       const typingResponse: Message = {
//         ...botResponse,
//         isTyping: true
//       };

//       setMessages(prev => [...prev, typingResponse]);

//       // Remove typing indicator after animation completes
//       setTimeout(() => {
//         setMessages(prev =>
//           prev.map(msg =>
//             msg.id === botResponse.id ? { ...msg, isTyping: false } : msg
//           )
//         );
//       }, botResponse.text.length * 30 + 500);
//     } catch (error) {
//       setMessages(prev => [
//         ...prev,
//         {
//           id: messages.length + 2,
//           text: "Sorry! Something went wrong. Please try again.",
//           sender: "bot"
//         }
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Handle suggestion click
//   const handleSuggestion = (text: string): void => {
//     // Add user message with the suggestion text
//     const userMessage: Message = {
//       id: messages.length + 1,
//       text: text,
//       sender: "user"
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setIsTyping(true);
    
//     // Simulate bot response
//     setTimeout(() => {
//       setIsTyping(false);
//       const botResponse: Message = {
//         id: messages.length + 2,
//         text: `Thank you for asking about ${text}. I'd be happy to tell you more about this. What specific information are you looking for?`,
//         sender: "bot"
//       };
//       setMessages(prev => [...prev, botResponse]);
//     }, 1500);
//   };

//   return (
//     <>
//       {/* Modal Overlay and Mascot/Chat (bottom-right) */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50">
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" />
//           {/* Mascot and Chat window, bottom-right aligned, row flex */}
//           <div className="absolute bottom-6 right-6 flex flex-row items-end gap-6 z-50">
//             {/* Chat Window (left of mascot) - with dynamic height */}
//             <div
//               className="w-[90vw] max-w-md bg-white/95 backdrop-blur-md border border-blue-100 shadow-2xl rounded-3xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out blue-chat-window animate-scaleUp"
//               style={{ height: `${chatHeight}px` }}
//             >
//               {/* Header - blue gradient with IndraBot title */}
//               <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-5 text-white flex items-center rounded-t-3xl shadow-md border-b border-blue-200">
//                 <div className="flex items-center">
//                   <img
//                     src="/lovable-uploads/indrabot-mascot.png"
//                     alt="IndraBot"
//                     className="w-8 h-8 mr-0 drop-shadow-sm"
//                   />
//                   <div>
//                     <h3 className="font-bold text-lg flex items-center">
//                       IndraBot 
//                       <span className="ml-2 flex items-center">
//                         <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block mr-1.5"></span>
//                         <span className="text-sm font-normal">| Ready to assist you</span>
//                       </span>
//                     </h3>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Messages - with placeholder and suggestions before first user message */}
//               <div 
//                 ref={chatContentRef}
//                 className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-gray-50/95"
//               >
//                 <div className="space-y-4 pb-2 relative">
//                   {/* Placeholder and suggestions if no user messages */}
//                   {messages.length === 0 && !isTyping && (
//                     <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
//                       <div className="mb-6 flex flex-col items-center">
//                         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 animate-pulse-slow">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
//                             <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                           </svg>
//                         </div>
//                         <h4 className="text-gray-700 font-semibold mb-2 text-lg">How can I help you today?</h4>
//                         <p className="text-gray-500 text-sm mb-4">Select an option below or type your question</p>
//                       </div>
//                       <div className="grid gap-3 w-full max-w-xs mx-auto">
//                         <button 
//                           onClick={() => handleSuggestion("What products do you offer?")}
//                           className="suggestion-btn bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
//                         >
//                           <span className="bg-blue-100 rounded-full p-2 mr-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
//                             </svg>
//                           </span>
//                           <div>
//                             <h4 className="font-medium text-gray-800">What products do you offer?</h4>
//                             <p className="text-xs text-gray-500 mt-1">Explore our product range</p>
//                           </div>
//                         </button>
//                         <button 
//                           onClick={() => handleSuggestion("Where are your locations?")}
//                           className="suggestion-btn bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
//                         >
//                           <span className="bg-green-100 rounded-full p-2 mr-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
//                               <circle cx="12" cy="9" r="2.5" />
//                             </svg>
//                           </span>
//                           <div>
//                             <h4 className="font-medium text-gray-800">Where are your locations?</h4>
//                             <p className="text-xs text-gray-500 mt-1">Find our offices and branches</p>
//                           </div>
//                         </button>
//                         <button 
//                           onClick={() => handleSuggestion("What services are available?")}
//                           className="suggestion-btn bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
//                         >
//                           <span className="bg-purple-100 rounded-full p-2 mr-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21l3-1.5L15 21l-.75-4M4 4h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm0 0V2a2 2 0 012-2h12a2 2 0 012 2v2" />
//                             </svg>
//                           </span>
//                           <div>
//                             <h4 className="font-medium text-gray-800">What services are available?</h4>
//                             <p className="text-xs text-gray-500 mt-1">See what we can do for you</p>
//                           </div>
//                         </button>
//                         <button 
//                           onClick={() => handleSuggestion("What are your main offerings?")}
//                           className="suggestion-btn bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
//                         >
//                           <span className="bg-orange-100 rounded-full p-2 mr-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V6c0-2.21 3.59-4 8-4s8 1.79 8 4v8c0 2.21-3.59 4-8 4z" />
//                             </svg>
//                           </span>
//                           <div>
//                             <h4 className="font-medium text-gray-800">What are your main offerings?</h4>
//                             <p className="text-xs text-gray-500 mt-1">Get an overview of our solutions</p>
//                           </div>
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                   {/* Render messages and typing dots after first user message */}
//                   {messages.length > 0 && messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`animate-slideIn ${
//                         message.sender === "user" ? "flex justify-end" : "flex justify-start"
//                       }`}
//                     >
//                       {message.sender === "bot" && (
//                         <div className="w-8 h-8 mt-1 mr-2 flex-shrink-0">
//                           <img
//                             src="/lovable-uploads/indrabot-mascot.png"
//                             alt="Bot"
//                             className="w-full h-full"
//                           />
//                         </div>
//                       )}
//                       <div
//                         className={`max-w-[80%] px-4 py-3 shadow-sm transition-all ${
//                           message.sender === "user"
//                             ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-none"
//                             : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none"
//                         }`}
//                       >
//                         <p className="text-sm md:text-base leading-relaxed">
//                           {message.sender === "bot" && message.isTyping ? (
//                             <>
//                               <TypeWriter text={message.text} />
//                               <span className="typing-cursor animate-blink">|</span>
//                             </>
//                           ) : (
//                             message.text
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   {/* Typing dots */}
//                   {isTyping && (
//                     <div className="flex justify-start">
//                       <div className="w-8 h-8 mt-1 mr-2 flex-shrink-0">
//                         <img
//                           src="/lovable-uploads/indrabot-mascot.png"
//                           alt="Bot"
//                           className="w-full h-full"
//                         />
//                       </div>
//                       <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%] shadow-sm">
//                         <div className="flex space-x-2">
//                           <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
//                           <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
//                           <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>
//               </div>
              
//               {/* Input */}
//               <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex items-center bg-white gap-2 rounded-b-3xl">
//                 <input
//                   type="text"
//                   placeholder="Type your message..."
//                   className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm md:text-base transition-all duration-300 bg-gray-50"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white rounded-full p-2.5 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
//                   disabled={newMessage.trim() === ""}
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </form>
//             </div>
            
//             {/* Mascot */}
//             <div className="relative flex flex-col items-center animate-scaleUp">
//               <img
//                 src="/lovable-uploads/indrabot-mascot.png"
//                 alt="Chat Bot"
//                 className="w-56 h-56 md:w-80 md:h-80 transition-all duration-500 drop-shadow-2xl"
//               />
//               <button
//                 className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md transform transition-transform hover:rotate-90"
//                 onClick={setIsOpen.bind(null, false)}
//               >
//                 <X className="w-6 h-6 md:w-7 md:h-7 stroke-2 text-blue-500" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Mascot Button with Pulse Effect (when closed) */}
//       {!isOpen && (
//         <div className="fixed bottom-6 right-6 z-50">
//           <div
//             className="relative cursor-pointer group"
//             onClick={() => setIsOpen(true)}
//             onMouseEnter={() => setHovering(true)}
//             onMouseLeave={() => setHovering(false)}
//           >
//             {/* Hover card */}
//             {hovering && (
//               <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-4 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-blue-100 flex items-center gap-2 animate-fadeIn pointer-events-none select-none min-w-[210px]">
//                 <img src='/lovable-uploads/indrabot-mascot.png' alt='IndraBot' className='w-7 h-7 mr-2 drop-shadow' />
//                 <span className="text-gray-700 font-medium text-sm">Hi, I'm <span className="text-blue-600 font-bold">IndraBot</span>!<br/><span className="text-xs font-normal text-gray-500">Click to chat with me.</span></span>
//               </div>
//             )}
//             {/* Pulsing gradient circles */}
//             <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-blue-500/30 to-sky-400/30 animate-pulse-slow-large"></div>
//             <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-blue-500/40 to-sky-400/40 animate-pulse-medium group-hover:animate-none"></div>
//             {/* Online indicator */}
//             <div className="absolute -top-1 -right-1 flex">
//               <div className="relative">
//                 <span className="absolute inline-flex h-3 w-3 rounded-full bg-white"></span>
//                 <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                 </span>
//               </div>
//             </div>
//             {/* Mascot image */}
//             <img
//               src="/lovable-uploads/indrabot-mascot.png"
//               alt="Chat Bot"
//               className={`w-16 h-16 md:w-24 md:h-24 transition-all duration-300 ${
//                 hovering ? 'transform scale-110 translate-y-[-5px]' : ''
//               } drop-shadow-lg`}
//             />
//           </div>
//         </div>
//       )}
      
//       {/* Scroll to top button - centered at bottom, always above mascot (z-60) */}
//       <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-60">
//         <button 
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none opacity-0 pointer-events-none"
//           id="scrollTopBtn"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
      
//       {/* Styles */}
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateX(10px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        
//         @keyframes scaleUp {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-scaleUp { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
//         @keyframes subtle-bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-3px); }
//         }
//         .animate-subtle-bounce { animation: subtle-bounce 3s ease-in-out infinite; }
        
//         .custom-scrollbar::-webkit-scrollbar { width: 5px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: rgba(59, 130, 246, 0.3);
//           border-radius: 10px;
//           transition: all 0.3s ease;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background-color: rgba(59, 130, 246, 0.5);
//         }
        
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.8; transform: scale(0.95); }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 2s ease-in-out infinite;
//         }
        
//         @keyframes pulse-slow-large {
//           0%, 100% { opacity: 0.1; transform: scale(1); }
//           50% { opacity: 0.4; transform: scale(1.1); }
//         }
//         .animate-pulse-slow-large {
//           animation: pulse-slow-large 3s ease-in-out infinite;
//         }
        
//         @keyframes pulse-medium {
//           0%, 100% { opacity: 0.2; transform: scale(0.95); }
//           50% { opacity: 0.5; transform: scale(1.05); }
//         }
//         .animate-pulse-medium {
//           animation: pulse-medium 2.5s ease-in-out infinite;
//         }
        
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0; }
//         }
//         .animate-blink {
//           animation: blink 0.7s infinite;
//         }
        
//         .typing-cursor {
//           display: inline-block;
//           margin-left: 2px;
//         }
        
//         .blue-chat-window {
//           box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.3);
//           transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
//         }
        
//         /* Animated suggestion buttons */
//         .suggestion-btn {
//           transform: translateY(0);
//           box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//         }
        
//         .suggestion-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//         }
        
//         @keyframes spin-slow {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         .animate-spin-slow {
//           animation: spin-slow 2.5s linear infinite;
//         }
//       `}</style>
//     </>
//   );
// };
 


//firstattempt(vasavi)

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

// Process text to convert both emails and URLs to markdown format
const processTextToMarkdown = (text: string): string => {
  let processedText = text;
  processedText = convertEmailsToLinks(processedText);
  processedText = convertUrlsToMarkdown(processedText);
  return processedText;
};

// TypeWriter component for animated text display
const TypeWriter: React.FC<{ text: string; delay?: number; onComplete?: () => void }> = ({
  text,
  delay = 30,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a 
            {...props} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline hover:text-blue-600"
          />
        )
      }}
    >
      {displayText}
    </ReactMarkdown>
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

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [chatHeight, setChatHeight] = useState<number>(450);

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
        const minHeight = 450;
        const maxHeight = window.innerHeight * 0.8;
        const newHeight = Math.min(Math.max(contentHeight + 100, minHeight), maxHeight);
        setChatHeight(newHeight);
      };
      
      updateHeight();
      
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [isOpen, messages]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const botResponse = await chatService.sendMessage(newMessage);
      
      // Process the response text to convert URLs and emails to markdown format
      const processedText = processTextToMarkdown(botResponse.text);
      
      const typingResponse: Message = {
        ...botResponse,
        originalText: botResponse.text,
        text: processedText,
        isTyping: true
      };

      setMessages(prev => [...prev, typingResponse]);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botResponse.id ? { ...msg, isTyping: false } : msg
          )
        );
      }, botResponse.text.length * 30 + 500);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Sorry! Something went wrong. Please try again.",
          sender: "bot"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle suggestion click
  const handleSuggestion = async (text: string): Promise<void> => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: "user"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      const botResponse = await chatService.sendMessage(text);
      
      // Process the response text to convert URLs and emails to markdown format
      const processedText = processTextToMarkdown(botResponse.text);
      
      const typingResponse: Message = {
        ...botResponse,
        originalText: botResponse.text,
        text: processedText,
        isTyping: true
      };

      setMessages(prev => [...prev, typingResponse]);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botResponse.id ? { ...msg, isTyping: false } : msg
          )
        );
      }, botResponse.text.length * 30 + 500);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Sorry! Something went wrong. Please try again.",
          sender: "bot"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" />
          <div className="absolute bottom-6 right-6 flex flex-row items-end gap-6 z-50">
            {/* Chat Window */}
            <div
              className="w-[90vw] max-w-md bg-white/95 backdrop-blur-md border border-blue-100 shadow-2xl rounded-3xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out blue-chat-window animate-scaleUp"
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
                      <div className="grid gap-3 w-full max-w-xs mx-auto">
                        <button 
                          onClick={() => handleSuggestion("What products do you offer?")}
                          className="suggestion-btn bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
                        >
                          <span className="bg-blue-100 rounded-full p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                            </svg>
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-800">What products do you offer?</h4>
                            <p className="text-xs text-gray-500 mt-1">Explore our product range</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => handleSuggestion("Where are your locations?")}
                          className="suggestion-btn bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
                        >
                          <span className="bg-green-100 rounded-full p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                              <circle cx="12" cy="9" r="2.5" />
                            </svg>
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-800">Where are your locations?</h4>
                            <p className="text-xs text-gray-500 mt-1">Find our offices and branches</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => handleSuggestion("What services are available?")}
                          className="suggestion-btn bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
                        >
                          <span className="bg-purple-100 rounded-full p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21l3-1.5L15 21l-.75-4M4 4h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm0 0V2a2 2 0 012-2h12a2 2 0 012 2v2" />
                            </svg>
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-800">What services are available?</h4>
                            <p className="text-xs text-gray-500 mt-1">See what we can do for you</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => handleSuggestion("What are your main offerings?")}
                          className="suggestion-btn bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-xl p-3 text-left transition-all duration-300 flex items-center shadow-sm"
                        >
                          <span className="bg-orange-100 rounded-full p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V6c0-2.21 3.59-4 8-4s8 1.79 8 4v8c0 2.21-3.59 4-8 4z" />
                            </svg>
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-800">What are your main offerings?</h4>
                            <p className="text-xs text-gray-500 mt-1">Get an overview of our solutions</p>
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
                        className={`max-w-[80%] px-4 py-3 shadow-sm transition-all ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none"
                        }`}
                      >
                        <div className="text-sm md:text-base leading-relaxed">
                          {message.sender === "bot" && message.isTyping ? (
                            <>
                              <TypeWriter text={message.text} />
                              <span className="typing-cursor animate-blink">|</span>
                            </>
                          ) : message.sender === "bot" ? (
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
                          ) : (
                            message.text
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 mt-1 mr-2 flex-shrink-0">
                        <img
                          src="/lovable-uploads/indrabot-mascot.png"
                          alt="Bot"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%] shadow-sm">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex items-center bg-white gap-2 rounded-b-3xl">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm md:text-base transition-all duration-300 bg-gray-50"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-full p-2.5 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                  disabled={newMessage.trim() === ""}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
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
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .suggestion-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }
      `}</style>
    </>
  );
};