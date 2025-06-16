export interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
    isTyping?: boolean;
    suggested?: string[];
  }
  
  export interface ChatState {
    isOpen: boolean;
    messages: Message[];
    loading: boolean;
    error: string | null;
  }