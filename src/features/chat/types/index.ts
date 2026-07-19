export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

export interface SendMessagePayload {
  message: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  session: ChatSession;
  reply: string;
}

export interface RenameSessionPayload {
  title: string;
}
