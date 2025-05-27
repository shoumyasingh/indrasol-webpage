import { Message } from '../types/chat';
import { API_ENDPOINTS } from '../config';

export interface SendMessageResponse {
  response: string;
}

export const chatService = {
  /**
   * Send a message to the backend API
   * @param message The message text to send
   * @returns Promise with the bot's response message
   */
  sendMessage: async (message: string): Promise<Message> => {
    try {
      const response = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: SendMessageResponse = await response.json();
      return {
        id: Date.now(),
        text: data.response,
        sender: "bot"
      };
    } catch (error) {
      console.error('Error sending message:', error);
      // Return a fallback error message
      return {
        id: Date.now(),
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: "bot"
      };
    }
  },

  /**
   * Get conversation history
   * @returns Promise with array of messages
   */
  getConversationHistory: async (): Promise<Message[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_CONVERSATION);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      // Return default welcome message on error
      return [
        { 
          id: 1, 
          text: "Hello! I'm IndraBot, your friendly assistant. How can I help you today?", 
          sender: "bot" 
        }
      ];
    }
  }
};