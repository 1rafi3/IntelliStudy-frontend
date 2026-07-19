import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap height at 160px (around 6 lines of text)
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const isButtonDisabled = !value.trim() || isLoading;

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div className="relative flex items-end bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all pr-2 pl-3 py-1.5">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask IntelliStudy Coach a question..."
          className="flex-1 max-h-[160px] bg-transparent border-0 outline-none resize-none py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 text-sm sm:text-base leading-relaxed scrollbar-thin"
          rows={1}
          disabled={isLoading}
          aria-label="Ask IntelliStudy Coach a question"
        />
        
        <button
          onClick={onSubmit}
          disabled={isButtonDisabled}
          className={cn(
            'p-2 rounded-xl flex-shrink-0 transition-all duration-200 ml-2 mb-0.5',
            isButtonDisabled
              ? 'bg-gray-100 dark:bg-gray-850 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-105 active:scale-95'
          )}
          aria-label={isLoading ? 'AI Coach is responding' : 'Send message'}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
