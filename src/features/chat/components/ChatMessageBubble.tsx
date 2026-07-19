import { Bot, User, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../types';
import { formatMessage } from '../utils/formatMessage';
import { cn } from '@/utils';
import { useState } from 'react';

interface Props {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: Props) {
  const isAi = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group flex w-full py-5 px-4 sm:px-6 md:px-8 border-b border-gray-100 dark:border-gray-900/50',
        isAi ? 'bg-gray-50/50 dark:bg-gray-900/10' : 'bg-transparent'
      )}
    >
      <div className="max-w-4xl mx-auto flex w-full gap-4 sm:gap-6 items-start relative">
        {/* Avatar */}
        <div
          className={cn(
            'w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl flex items-center justify-center ring-2 transition-shadow shadow-sm',
            isAi
              ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white ring-indigo-100 dark:ring-indigo-950'
              : 'bg-gradient-to-tr from-gray-100 to-gray-50 text-gray-700 ring-gray-200 dark:from-gray-800 dark:to-gray-900 dark:text-gray-200 dark:ring-gray-800'
          )}
          aria-hidden="true"
        >
          {isAi ? <Bot size={20} /> : <User size={20} />}
        </div>

        {/* Content Panel */}
        <div className="flex-1 space-y-1 overflow-hidden min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {isAi ? 'IntelliStudy Coach' : 'You'}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
          <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-850 dark:text-gray-200 text-sm sm:text-base leading-relaxed break-words pt-1">
            {formatMessage(message.content)}
          </div>
        </div>

        {/* Floating Actions on Hover (for AI responses) */}
        {isAi && (
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-all hover:scale-105 active:scale-95"
              title="Copy response to clipboard"
              aria-label="Copy response to clipboard"
            >
              {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
