import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import {
  SendMessagePayload,
  SendMessageResponse,
  ChatSessionSummary,
  RenameSessionPayload,
  ChatMessage
} from '../types';

// Query Keys
export const chatKeys = {
  all: ['chat'] as const,
  sessions: () => [...chatKeys.all, 'sessions'] as const,
  history: (sessionId: string) => [...chatKeys.all, 'history', sessionId] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useChatSessions() {
  return useQuery<ChatSessionSummary[], Error>({
    queryKey: chatKeys.sessions(),
    queryFn: chatService.getSessions,
  });
}

export function useChatHistory(sessionId: string | null) {
  return useQuery<ChatMessage[], Error>({
    queryKey: chatKeys.history(sessionId!),
    queryFn: () => chatService.getHistory(sessionId!),
    enabled: !!sessionId,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, SendMessagePayload>({
    mutationFn: chatService.sendMessage,
    onSuccess: (data) => {
      // Invalidate sessions list (to update timestamp/title/order)
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
      
      // Update or invalidate the specific session history
      queryClient.setQueryData(chatKeys.history(data.session.id), data.session.messages);
    },
  });
}

export function useRenameSession() {
  const queryClient = useQueryClient();

  return useMutation<ChatSessionSummary, Error, { sessionId: string; payload: RenameSessionPayload }>({
    mutationFn: ({ sessionId, payload }) => chatService.renameSession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: chatService.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });
}
