export interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
  }
  
  export interface ChatState {
    isOpen: boolean;
    messages: Message[];
    loading: boolean;
    error: string | null;
  }