import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Bot,
  MessageCircle,
  Sparkles,
  Bookmark,
  X,
  Loader2,
  FileText,
} from 'lucide-react';
import { useDebounce } from '@hooks/use-debounce';
import { useSearchQuery } from '../hooks';
import { Highlight } from './Highlight';
import { SearchGroup } from '../types';

const TYPE_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'manual-roadmap': { icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-50' },
  'ai-roadmap': { icon: Bot, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  'chat-session': { icon: MessageCircle, color: 'text-accent-500', bg: 'bg-accent-50' },
  recommendation: { icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
  bookmark: { icon: Bookmark, color: 'text-yellow-500', bg: 'bg-yellow-50' },
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const debouncedQuery = useDebounce(input.trim(), 350);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useSearchQuery(debouncedQuery, isOpen);

  useEffect(() => {
    if (isOpen) {
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setInput('');
          onClose();
          setTimeout(() => {
            (window as any).__openSearch?.();
          }, 0);
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  const handleSelect = useCallback(
    (group: SearchGroup, itemIdx: number) => {
      const item = group.items[itemIdx];
      if (!item) return;
      onClose();
      navigate(item.route);
    },
    [navigate, onClose],
  );

  if (!isOpen) return null;

  const showResults = debouncedQuery.length > 0 && !isLoading;
  const showEmpty = debouncedQuery.length > 0 && !isLoading && !isError && data && data.total === 0;
  const showError = debouncedQuery.length > 0 && isError;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[12vh] px-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200/80 overflow-hidden flex flex-col max-h-[70vh]">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
          <Search size={20} className="text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search roadmaps, chats, bookmarks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-base text-neutral-800 placeholder-neutral-400 bg-transparent border-none outline-none focus:ring-0"
          />
          {isLoading && <Loader2 size={18} className="text-neutral-400 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition shrink-0 p-0.5"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {showError && (
            <div className="flex flex-col items-center py-12 text-center px-4">
              <FileText size={36} className="text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500 mb-2">Search failed. Please try again.</p>
              <button
                onClick={() => refetch()}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {showEmpty && (
            <div className="flex flex-col items-center py-12 text-center px-4">
              <Search size={36} className="text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-700">No results found</p>
              <p className="text-xs text-neutral-400 mt-1">
                Try a different search term or check your spelling.
              </p>
            </div>
          )}

          {showResults &&
            data &&
            data.groups.map((group) => {
              const iconMeta = TYPE_ICONS[group.type] || TYPE_ICONS['bookmark'];
              const GroupIcon = iconMeta.icon;
              return (
                <div key={group.type}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                    <GroupIcon size={14} className={iconMeta.color} />
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      {group.label}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {group.items.length}
                    </span>
                  </div>

                  {/* Items */}
                  {group.items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(group, idx)}
                      className="w-full text-left px-5 py-3 flex items-start gap-3 hover:bg-neutral-50 transition border-b border-neutral-50 last:border-b-0 group"
                    >
                      <div
                        className={`w-8 h-8 rounded-xl ${iconMeta.bg} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <GroupIcon size={15} className={iconMeta.color} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-primary-600 transition">
                          <Highlight text={item.title} query={debouncedQuery} />
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                          <Highlight text={item.description} query={debouncedQuery} />
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}

          {/* Initial state (no query yet) */}
          {debouncedQuery.length === 0 && (
            <div className="flex flex-col items-center py-14 text-center px-4">
              <Search size={40} className="text-neutral-200 mb-4" />
              <p className="text-sm text-neutral-500">
                Search across roadmaps, chat sessions, recommendations, and bookmarks.
              </p>
              <p className="text-xs text-neutral-400 mt-3 flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded-md text-[11px] font-mono">
                  ⌘K
                </kbd>
                <span>to open search anytime</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
