import React, { useState } from "react";
import { X, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

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

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user"
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Thanks for your message! Our team will get back to you shortly. Feel free to explore our services while you wait.",
        sender: "bot"
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Open chat"
      >
        {!isOpen && (
          <div className="relative">
            <img
              src="/lovable-uploads/indrabot-mascot.png" 
              alt="Chat Bot" 
              className="w-20 h-20"
            />
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indrasol-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-indrasol-blue"></span>
            </span>
          </div>
        )}
        {isOpen && <X className="w-6 h-6 text-indrasol-blue stroke-2" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-indrasol-blue p-4 text-white flex items-center">
            <img
              src="/lovable-uploads/indrabot-mascot.png" 
              alt="Chat Bot" 
              className="w-14 h-14 mr-3 bg-white rounded-full p-1"
            />
            <div>
              <h3 className="font-bold">IndraBot</h3>
              <p className="text-xs opacity-80">Online | Typically replies instantly</p>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "flex justify-end" : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-indrasol-blue text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex items-center bg-white">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indrasol-blue"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indrasol-blue text-white rounded-r-md px-4 py-2 hover:bg-indrasol-blue/90"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};