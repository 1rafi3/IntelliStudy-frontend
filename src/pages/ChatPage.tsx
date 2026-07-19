import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bot, MessageCircle } from 'lucide-react';
import { ChatSidebar } from '@features/chat/components/ChatSidebar';
import { ChatMessageBubble } from '@features/chat/components/ChatMessageBubble';
import { ChatInput } from '@features/chat/components/ChatInput';
import { useChatSessions, useChatHistory, useSendMessage } from '@features/chat/hooks/useChat';
import toast from 'react-hot-toast';
import { ChatMessage } from '@features/chat/types';

export const ChatPage: React.FC = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<ChatMessage | null>(null);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: sessions = [] } = useChatSessions();
  const { data: history = [], isLoading: isHistoryLoading } = useChatHistory(activeSessionId);

  // Mutations
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  // Clear pending optimistic message once it appears in confirmed history
  useEffect(() => {
    if (!isSending && pendingMessage) {
      setPendingMessage(null);
    }
  }, [isSending]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive the full display list
  const displayMessages: ChatMessage[] = pendingMessage
    ? [...history, pendingMessage]
    : history;

  // Auto-scroll logic: only scroll if the user is already near the bottom
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Trigger scroll on message length updates or send state changes
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const threshold = 150; // pixels from bottom
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;

      if (isNearBottom || displayMessages.length <= 1) {
        scrollToBottom('smooth');
      }
    } else {
      scrollToBottom('auto');
    }
  }, [displayMessages.length, isSending]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const optimistic: ChatMessage = {
      role: 'user',
      content: inputValue,
      createdAt: new Date().toISOString(),
    };
    setPendingMessage(optimistic);
    const messageToSend = inputValue;
    setInputValue('');

    // Ensure immediate smooth scroll to bottom after user posts
    setTimeout(() => scrollToBottom('smooth'), 50);

    sendMessage(
      { message: messageToSend, sessionId: activeSessionId || undefined },
      {
        onSuccess: (data) => {
          if (!activeSessionId) {
            setActiveSessionId(data.session.id);
          }
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to send message. Please try again.');
          setPendingMessage(null);
          setInputValue(messageToSend);
        },
      }
    );
  };

  const isEmptyState = !activeSessionId && displayMessages.length === 0;

  return (
    <div className="flex h-[calc(100vh-100px)] lg:h-[calc(100vh-6rem)] w-full overflow-hidden bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-950 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md z-10 flex-shrink-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold ml-2 text-gray-900 dark:text-white">IntelliStudy Coach</span>
        </div>

        {/* Chat Messages (Independent Scroll Area) */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 focus:outline-none"
          tabIndex={0}
          aria-label="Chat messages transcript"
        >
          {isEmptyState ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500 px-4 py-8">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm transition-transform hover:scale-105 duration-300">
                <Bot size={32} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                How can I help you study today?
              </h2>
              <p className="max-w-md text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                Ask me to explain a concept, generate a quiz, help with debugging code, or outline a study plan.
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {isHistoryLoading && activeSessionId ? (
                <div className="flex items-center justify-center h-48" aria-live="polite">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <MessageCircle size={28} className="animate-pulse" />
                    <span className="text-sm font-medium">Retrieving chat history...</span>
                  </div>
                </div>
              ) : (
                displayMessages.map((msg, idx) => (
                  <ChatMessageBubble key={idx} message={msg} />
                ))
              )}

              {/* AI Typing Indicator */}
              {isSending && (
                <div className="group flex w-full py-5 px-4 sm:px-6 md:px-8 bg-gray-50/50 dark:bg-gray-900/10 border-b border-gray-100 dark:border-gray-900/50">
                  <div className="max-w-4xl mx-auto flex w-full gap-4 sm:gap-6 items-start">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl flex items-center justify-center ring-2 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white ring-indigo-100 dark:ring-indigo-950 shadow-sm">
                      <Bot size={20} />
                    </div>
                    <div className="flex-1 space-y-2 mt-3.5">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input/Composer Area (Fixed at the bottom in the block flow) */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-950 dark:via-gray-950 border-t border-gray-100 dark:border-gray-900/50 flex-shrink-0">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            isLoading={isSending}
          />
          <div className="text-center mt-2.5 text-xs text-gray-400 dark:text-gray-500">
            IntelliStudy Coach can make mistakes. Please verify important details.
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
