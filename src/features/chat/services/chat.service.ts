import { api } from '@/lib/axios';
import {
  ChatSessionSummary,
  SendMessagePayload,
  SendMessageResponse,
  RenameSessionPayload,
  ChatMessage
} from '../types';

export const chatService = {
  /**
   * Send a message to Gemini and get a response.
   * If sessionId is provided, appends to existing conversation.
   * Otherwise, creates a new conversation.
   */
  sendMessage: async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
    const response = await api.post('/chat/message', payload);
    return response.data.data;
  },

  /**
   * Fetch a list of all chat sessions for the user
   */
  getSessions: async (): Promise<ChatSessionSummary[]> => {
    const response = await api.get('/chat/sessions');
    return response.data.data;
  },

  /**
   * Fetch the full message history for a specific chat session
   */
  getHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data.data;
  },

  /**
   * Rename a chat session
   */
  renameSession: async (sessionId: string, payload: RenameSessionPayload): Promise<ChatSessionSummary> => {
    const response = await api.patch(`/chat/sessions/${sessionId}`, payload);
    return response.data.data;
  },

  /**
   * Delete a chat session
   */
  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/chat/sessions/${sessionId}`);
  },
};
