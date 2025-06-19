// src/services/chatService.ts
import { Message } from '../types/chat';
import { API_ENDPOINTS } from '../config';

export interface SendMessageResponse {
  response: string;
  intent: string;
  routed_agent: string;
  suggested?: string[];
  action?: string;
}

// ── 1.  Response shape from MCP router ──────────────────────────────
export interface ChatResponse {
  turn_id:      string;
  text:         string; 
  routed_skill: string;
  finished:     boolean;
  suggested?:   string[];
  latency_ms:   number;
  error?:       string | null;
  meta?:        Record<string, any>;
}

// ── 2.  Local-storage keys ──────────────────────────────────────────
const STORAGE_KEYS = {
  USER_ID: 'indra_user_id',
  HISTORY: 'indra_chat_history'          // persisted chat
};

/** Helper : generate stable UUID (crypto if available) */
const genUUID = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `user-${Date.now()}`;

/** ---- INITIALISE session (returns userId + cached history) ---- */
export const bootstrapChat = (): { userId: string; history: Message[] } => {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = genUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }

  const historyJSON = localStorage.getItem(STORAGE_KEYS.HISTORY);
  const history: Message[] = historyJSON ? JSON.parse(historyJSON) : [];

  return { userId, history };
};

/** ---- Persist history after every turn ---- */
const saveHistory = (history: Message[]) =>
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

/** ---- Convert Message[] ➜ string[] expected by backend ---- */
const toPlainHistory = (history: Message[]): string[] =>
  history.map((m) => {
    const prefix = m.sender === 'user' ? 'User:' : 'Bot:';
    return `${prefix} ${m.text}`;
  });

/** ----------------  MAIN SERVICE  ---------------- */
export const chatService = {
  /** Send a message & update local history */
  sendMessage: async (
    messageText: string,
    history: Message[]
  ): Promise<{ botReply: Message; newHistory: Message[] }> => {
    const { userId } = bootstrapChat();

    // 1️⃣  Add the user message optimistically
    const userMsg: Message = { id: Date.now(), text: messageText, sender: 'user' };
    const updatedHistory = [...history, userMsg];

    try {
      const res = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          query: messageText,
          history: toPlainHistory(updatedHistory) // send FULL transcript
        }),
        signal: AbortSignal.timeout?.(15000)      // native timeout (Chrome 117+)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: SendMessageResponse = await res.json();
      const botMsg: Message = { 
        id: Date.now() + 1, 
        text: data.response, 
        sender: 'bot',
        action: data.action 
      };

      const finalHistory = [...updatedHistory, botMsg];
      saveHistory(finalHistory);

      return { botReply: botMsg, newHistory: finalHistory };
    } catch (err) {
      console.error('chatService error', err);
      const fallback: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again shortly.",
        sender: 'bot'
      };
      const userMsg: Message = { id: Date.now(), text: messageText, sender: 'user' };
      const errorHistory = [...history, userMsg, fallback];
      saveHistory(errorHistory);
      return { botReply: fallback, newHistory: errorHistory };
    }
  },

  /** Retrieve cached conversation (widget init) */
  getCachedHistory: (): Message[] => {
    const json = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return json ? (JSON.parse(json) as Message[]) : [];
  },

  /** Reset chat (optional UI ctrl) */
  resetConversation: () => {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }
};
