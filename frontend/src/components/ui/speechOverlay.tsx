import React from "react";
import { X, Send, Mic, MicOff } from "lucide-react";

// Speech Recognition interface for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

// Speech Overlay Props
interface SpeechOverlayProps {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  onClose: () => void;
  onSend: (text: string) => void;
}

export const SpeechOverlay: React.FC<SpeechOverlayProps> = ({
  isListening,
  transcript,
  isSupported,
  error,
  onClose,
  onSend
}) => {
  const handleSend = () => {
    if (transcript.trim()) {
      onSend(transcript.trim());
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/30 to-black/60 backdrop-blur-md flex items-center justify-center z-50 rounded-3xl animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-xl rounded-3xl p-8 mx-4 max-w-lg w-full shadow-2xl border border-blue-200/50 animate-modalSlideUp relative overflow-hidden">
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/30 to-purple-50/20 animate-gradient-shift"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {isListening ? (
                  <div className="relative">
                    {/* Outer glow rings */}
                    <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400/30 to-indigo-500/30 rounded-full animate-ping-slow"></div>
                    <div className="absolute inset-1 w-14 h-14 bg-gradient-to-r from-blue-500/40 to-indigo-600/40 rounded-full animate-pulse-ring"></div>
                    
                    {/* Main microphone */}
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-xl animate-mic-pulse">
                      <Mic className="w-8 h-8 text-white animate-bounce-subtle" />
                      
                      {/* Inner glow */}
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                    </div>
                    
                    {/* Sound waves */}
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 bg-blue-400 rounded-full animate-sound-wave"
                          style={{
                            height: `${12 + i * 4}px`,
                            right: `${i * 6}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Mic className="w-8 h-8 text-white" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  Voice Input
                </h3>
                <p className="text-sm text-blue-600/80 font-medium">
                  {isListening ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                      Listening...
                    </span>
                  ) : (
                    "Ready to listen"
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-blue-100/50 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 group"
            >
              <X className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl animate-slideIn shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </div>
                <span className="text-red-700 text-sm font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {/* Not Supported Message */}
          {!isSupported && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl animate-slideIn shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
                <span className="text-yellow-700 text-sm font-medium">
                  Voice recognition is not supported in your browser
                </span>
              </div>
            </div>
          )}

          {/* Enhanced Voice Visualization */}
          {isListening && (
            <div className="mb-8 flex justify-center relative">
              <div className="flex space-x-2 items-end p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-200/30">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-blue-500 via-blue-400 to-indigo-500 rounded-full animate-voice-wave"
                    style={{
                      width: '4px',
                      height: `${Math.random() * 30 + 15}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${0.8 + Math.random() * 0.4}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Surrounding glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-indigo-200/30 to-blue-200/20 rounded-2xl animate-pulse-glow"></div>
            </div>
          )}

          {/* Enhanced Transcript Display */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-blue-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Transcript
            </label>
            <div className="min-h-[120px] max-h-[200px] overflow-y-auto p-6 bg-gradient-to-br from-gray-50/80 to-blue-50/30 border border-blue-200/40 rounded-2xl relative backdrop-blur-sm shadow-inner">
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl"></div>
              
              <div className="relative z-10">
                {transcript ? (
                  <p className="text-gray-800 leading-relaxed text-base animate-typeIn">{transcript}</p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-blue-500/70 italic text-center">
                      {isListening ? (
                        <span className="flex items-center justify-center space-x-2">
                          <span className="animate-pulse">🎤</span>
                          <span>Speak now...</span>
                        </span>
                      ) : (
                        "Click the microphone to start speaking"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Cancel
            </button>
            {transcript.trim() && (
              <button
                onClick={handleSend}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                <span>Send Message</span>
              </button>
            )}
          </div>

          {/* Enhanced Instructions */}
          <div className="mt-6 text-center">
            <p className="text-xs text-blue-600/70 font-medium">
              {isSupported ? "🎯 Speak clearly for best results" : "Please use the text input instead"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export types for use in other components
export type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent }; 