import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { ChatSessionSummary } from '../types';
import { cn } from '@/utils';
import { useDeleteSession, useRenameSession } from '../hooks/useChat';
import toast from 'react-hot-toast';

interface Props {
  sessions: ChatSessionSummary[];
  activeSessionId: string | null;
  onSelectSession: (id: string | null) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function ChatSidebar({ sessions, activeSessionId, onSelectSession, isMobileOpen, onCloseMobile }: Props) {
  const { mutate: deleteSession } = useDeleteSession();
  const { mutate: renameSession } = useRenameSession();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleNewChat = () => {
    onSelectSession(null);
    if (window.innerWidth < 1024) onCloseMobile();
  };

  const handleSelectSession = (id: string) => {
    onSelectSession(id);
    if (window.innerWidth < 1024) onCloseMobile();
  };

  const startRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setMenuOpenId(null);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      renameSession(
        { sessionId: id, payload: { title: editTitle } },
        {
          onSuccess: () => {
            setEditingId(null);
            toast.success('Conversation renamed');
          },
          onError: () => toast.error('Failed to rename conversation'),
        }
      );
    } else {
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteSession(id, {
      onSuccess: () => {
        if (activeSessionId === id) onSelectSession(null);
        toast.success('Conversation deleted');
      },
      onError: () => toast.error('Failed to delete conversation'),
    });
    setMenuOpenId(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3 mt-2">
            Recent Conversations
          </div>
          
          {sessions.length === 0 ? (
            <div className="text-sm text-gray-500 px-3 py-2 italic">
              No recent conversations.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors',
                  activeSessionId === session.id
                    ? 'bg-indigo-100 dark:bg-gray-800 text-indigo-900 dark:text-indigo-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                )}
                onClick={() => {
                  if (editingId !== session.id) handleSelectSession(session.id);
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <MessageSquare size={18} className="flex-shrink-0 opacity-70" />
                  
                  {editingId === session.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => saveRename(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(session.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="flex-1 bg-white dark:bg-gray-950 text-sm border border-indigo-500 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate text-sm font-medium">{session.title}</span>
                  )}
                </div>

                {/* Actions Menu */}
                {editingId !== session.id && (
                  <div className="relative flex-shrink-0 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === session.id ? null : session.id);
                      }}
                      className={cn(
                        "p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                        menuOpenId === session.id && "opacity-100 bg-gray-300 dark:bg-gray-700"
                      )}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {menuOpenId === session.id && (
                      <div className="absolute right-0 top-6 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(session.id, session.title);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Edit2 size={14} /> Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(session.id);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
