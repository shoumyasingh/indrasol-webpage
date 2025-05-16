import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";




interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isTyping?: boolean;
}

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

  return <>{displayText}</>;
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm IndraBot, your friendly assistant. How can I help you today?",
      sender: "bot"
    }
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const response = await fetch(
        `http://localhost:8000/extract/query?text=${encodeURIComponent(newMessage)}`
      );
      const data = await response.json();
      console.log("Response from server:", data);
      if (!response.ok) throw new Error(data.detail || "Query failed");

      const botResponse: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
        isTyping: true
      };

      setMessages(prev => [...prev, botResponse]);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botResponse.id ? { ...msg, isTyping: false } : msg
          )
        );
      }, data.response.length * 30 + 500);
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
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200"
        aria-label="Open chat"
      >
        {!isOpen ? (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indrasol-blue/10 animate-pulse-slow"></div>
            <img
              src="/lovable-uploads/indrabot-mascot.png"
              alt="Chat Bot"
              className="w-12 h-12 md:w-16 md:h-16 transition-transform duration-300 hover:rotate-6 drop-shadow-md"
            />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indrasol-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indrasol-blue"></span>
            </span>
          </div>
        ) : (
          <X className="w-6 h-6 text-indrasol-blue stroke-2 transition-transform duration-300 hover:rotate-90" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[90%] sm:w-96 h-[450px] bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/90 p-4 text-white flex items-center rounded-t-2xl shadow-sm">
          <img
            src="/lovable-uploads/indrabot-mascot.png"
            alt="Chat Bot"
            className="w-12 h-12 mr-3 transition-transform duration-300 hover:rotate-6"
          />
          <div>
            <h3 className="font-bold text-lg flex items-center gap-1.5">
              IndraBot <span className="inline-block w-3 h-3 rounded-full bg-green-400 border-2 border-white"></span>
            </h3>
            <p className="text-xs opacity-90 font-medium text-blue-100">
              Online | Typically replies instantly
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
          <div className="space-y-4 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`animate-fadeIn ${
                  message.sender === "user" ? "flex justify-end" : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-indrasol-blue to-indrasol-blue/90 text-white rounded-2xl rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200/70 rounded-2xl rounded-bl-none backdrop-blur-sm bg-opacity-90"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {message.sender === "bot" && message.isTyping ? (
                      <>
                        <TypeWriter text={message.text} />
                        <span className="typing-cursor animate-blink">|</span>
                      </>
                    ) : (
                      message.text
                    )}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200/70 rounded-2xl rounded-bl-none p-3.5 max-w-[85%] shadow-sm backdrop-blur-sm bg-opacity-90">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indrasol-blue/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-indrasol-blue/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-indrasol-blue/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200/70 p-4 flex items-center bg-white/90 backdrop-blur-sm gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border border-gray-300/80 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/60 focus:border-transparent text-sm md:text-base transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/90 text-white rounded-full p-2.5 hover:from-indrasol-blue/90 hover:to-indrasol-blue transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md hover:shadow-lg"
            disabled={newMessage.trim() === ""}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
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
      `}</style>
    </>
  );
};











// import React, { useState, useEffect, useRef } from "react";
// import { X, Send, Zap } from "lucide-react";

// interface Message {
//   id: number;
//   text: string;
//   sender: "user" | "bot";
//   isTyping?: boolean;
// }

// // TypeWriter component for typing effect
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
  
//   return <>{displayText}</>
// };

// export const ChatBot: React.FC = () => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>([
//     { 
//       id: 1, 
//       text: "Hello! I'm IndraBot, your friendly assistant. How can I help you today?", 
//       sender: "bot" 
//     }
//   ]);
//   const [newMessage, setNewMessage] = useState<string>("");
//   const [isTyping, setIsTyping] = useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const toggleChat = (): void => {
//     setIsOpen(!isOpen);
//   };

//   // Auto-scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = (e: React.FormEvent): void => {
//     e.preventDefault();
//     if (newMessage.trim() === "") return;

//     // Add user message
//     const userMessage: Message = {
//       id: messages.length + 1,
//       text: newMessage,
//       sender: "user"
//     };
    
//     setMessages([...messages, userMessage]);
//     setNewMessage("");
    
//     // Show typing indicator
//     setIsTyping(true);
    
//     // Simulate bot response after a short delay
//     setTimeout(() => {
//       setIsTyping(false);
      
//       // Add bot response with typing effect
//       const botResponse: Message = {
//         id: messages.length + 2,
//         text: "Thanks for your message! Our team will get back to you shortly. Feel free to explore our services while you wait.",
//         sender: "bot",
//         isTyping: true
//       };
      
//       setMessages(prev => [...prev, botResponse]);
      
//       // After typing animation completes, update the message
//       setTimeout(() => {
//         setMessages(prev => 
//           prev.map(msg => 
//             msg.id === botResponse.id 
//               ? { ...msg, isTyping: false } 
//               : msg
//           )
//         );
//       }, botResponse.text.length * 30 + 500); // Calculate time based on message length plus buffer
//     }, 1500);
//   };

//   return (
//     <>
//       {/* Chat Button */}
//       <button
//         onClick={toggleChat}
//         className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200"
//         aria-label="Open chat"
//       >
//         {!isOpen && (
//           <div className="relative">
//             <div className="absolute inset-0 rounded-full bg-indrasol-blue/10 animate-pulse-slow"></div>
//             <img
//               src="/lovable-uploads/indrabot-mascot.png" 
//               alt="Chat Bot" 
//               className="w-12 h-12 md:w-16 md:h-16 transition-transform duration-300 hover:rotate-6 drop-shadow-md"
//             />
//             <span className="absolute -top-1 -right-1 flex h-4 w-4">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indrasol-blue opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-4 w-4 bg-indrasol-blue"></span>
//             </span>
//           </div>
//         )}
//         {isOpen && (
//           <X className="w-6 h-6 text-indrasol-blue stroke-2 transition-transform duration-300 hover:rotate-90" />
//         )}
//       </button>

//       {/* Chat Window */}
//       <div 
//         className={`fixed bottom-24 right-6 z-50 w-[90%] sm:w-96 h-[450px] bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 transition-all duration-500 ease-in-out ${
//           isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
//         }`}
//       >
//         {/* Chat Header */}
//         <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/90 p-4 text-white flex items-center rounded-t-2xl shadow-sm">
//           <div className="relative">
            
//             <img
//               src="/lovable-uploads/indrabot-mascot.png" 
//               alt="Chat Bot" 
//               className="w-12 h-12 mr-3  transition-transform duration-300 hover:rotate-6"
//             />
            
//           </div>
//           <div>
//             <h3 className="font-bold text-lg flex items-center gap-1.5">
//               IndraBot <span className="inline-block w-3 h-3 rounded-full bg-green-400 border-2 border-white"></span>
//             </h3>
//             <p className="text-xs opacity-90 font-medium text-blue-100">Online | Typically replies instantly</p>
//           </div>
//         </div>
        
//         {/* Chat Messages */}
//         <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
//           <div className="space-y-4 pb-2">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`animate-fadeIn ${
//                   message.sender === "user" ? "flex justify-end" : "flex justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-[85%] p-3.5 shadow-sm ${
//                     message.sender === "user"
//                       ? "bg-gradient-to-br from-indrasol-blue to-indrasol-blue/90 text-white rounded-2xl rounded-br-none"
//                       : "bg-white text-gray-800 border border-gray-200/70 rounded-2xl rounded-bl-none backdrop-blur-sm bg-opacity-90"
//                   }`}
//                 >
//                   <p className="text-sm md:text-base leading-relaxed">
//                     {message.sender === "bot" && message.isTyping ? (
//                       <>
//                         <TypeWriter text={message.text} />
//                         <span className="typing-cursor animate-blink">|</span>
//                       </>
//                     ) : (
//                       message.text
//                     )}
//                   </p>
//                 </div>
//               </div>
//             ))}
            
//             {/* Typing indicator */}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-white text-gray-800 border border-gray-200/70 rounded-2xl rounded-bl-none p-3.5 max-w-[85%] shadow-sm backdrop-blur-sm bg-opacity-90">
//                   <div className="flex space-x-2">
//                     <div className="w-2 h-2 rounded-full bg-indrasol-blue/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
//                     <div className="w-2 h-2 rounded-full bg-indrasol-blue/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
//                     <div className="w-2 h-2 rounded-full bg-indrasol-blue/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {/* Invisible element for auto-scroll */}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
        
//         {/* Chat Input */}
//         <form onSubmit={handleSendMessage} className="border-t border-gray-200/70 p-4 flex items-center bg-white/90 backdrop-blur-sm gap-2">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             className="flex-1 border border-gray-300/80 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/60 focus:border-transparent text-sm md:text-base transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/90 text-white rounded-full p-2.5 hover:from-indrasol-blue/90 hover:to-indrasol-blue transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md hover:shadow-lg"
//             disabled={newMessage.trim() === ""}
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </form>
//       </div>

//       {/* Add global styles for animations */}
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background-color: transparent;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: rgba(0, 0, 0, 0.1);
//           border-radius: 10px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background-color: rgba(0, 0, 0, 0.2);
//         }
        
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0; }
//           50% { opacity: 1; }
//         }
        
//         .animate-pulse-slow {
//           animation: pulse-slow 3s ease-in-out infinite;
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
//       `}</style>
//     </>
//   );
// };
