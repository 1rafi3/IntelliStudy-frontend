import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@components/ui/PageHeader';
import { EmptyState } from '@components/ui/EmptyState';
import { useBookmarksQuery, useDeleteBookmarkMutation } from '@features/bookmark/hooks';
import { Bookmark } from '@features/bookmark/types';
import toast from 'react-hot-toast';
import { recommendationService } from '@features/recommendation/services';
import {
  Bookmark as BookmarkIcon,
  Search,
  Trash2,
  ExternalLink,
  BookOpen,
  Bot,
  MessageCircle,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Saved', icon: BookmarkIcon },
  { id: 'ai-roadmap', label: 'AI Roadmaps', icon: Bot },
  { id: 'manual-roadmap', label: 'Manual Roadmaps', icon: BookOpen },
  { id: 'chat-response', label: 'AI Coach Replies', icon: MessageCircle },
  { id: 'recommendation', label: 'Recommendations', icon: Sparkles },
];

const CATEGORY_STYLES: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  'ai-roadmap': {
    label: 'AI Roadmap',
    icon: <Bot size={14} className="text-purple-600" />,
    color: 'border-purple-200 text-purple-700 bg-purple-50',
    bg: 'bg-purple-100/50',
  },
  'manual-roadmap': {
    label: 'Manual Roadmap',
    icon: <BookOpen size={14} className="text-emerald-600" />,
    color: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    bg: 'bg-emerald-100/50',
  },
  'chat-response': {
    label: 'AI Coach',
    icon: <MessageCircle size={14} className="text-blue-600" />,
    color: 'border-blue-200 text-blue-700 bg-blue-50',
    bg: 'bg-blue-100/50',
  },
  'recommendation': {
    label: 'Recommendation',
    icon: <Sparkles size={14} className="text-indigo-600" />,
    color: 'border-indigo-200 text-indigo-700 bg-indigo-50',
    bg: 'bg-indigo-100/50',
  },
};

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const queryParams = {
    page,
    limit: 8,
    search: search.trim() || undefined,
    type: activeCategory === 'all' ? undefined : (activeCategory as any),
  };

  const { data, isLoading, isError, refetch } = useBookmarksQuery(queryParams);
  const deleteMutation = useDeleteBookmarkMutation();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
      },
    });
  };

  const handleNavigate = async (item: Bookmark) => {
    if (item.type === 'ai-roadmap' || item.type === 'manual-roadmap') {
      navigate(`/dashboard/roadmaps/${item.referencedId}`);
    } else if (item.type === 'recommendation') {
      try {
        const recommendation = await recommendationService.getById(item.referencedId);
        if (recommendation.read) {
          toast.error('This recommendation has already been completed and is no longer available.');
          return;
        }
        navigate('/dashboard/recommendations');
      } catch {
        toast.error('This recommendation has already been completed and is no longer available.');
      }
    } else if (item.type === 'chat-response') {
      navigate('/dashboard/chat');
    }
  };

  const isMutationPending = deleteMutation.isPending;

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <PageHeader
        title="Saved Bookmarks"
        description="Quickly reference saved study roadmaps, AI coach explanations, and smart recommendations."
      />

      {/* Control Bar (Search & Categories Filter) */}
      <div className="bg-white border border-neutral-200/60 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Row 1: Search bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search saved bookmarks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="block w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all"
          />
        </div>

        {/* Row 2: Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookmark list section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200/60 rounded-2xl p-5 space-y-4 animate-pulse shadow-sm h-48"
            >
              <div className="flex justify-between">
                <div className="h-6 bg-neutral-200 rounded w-24" />
                <div className="h-6 bg-neutral-200 rounded w-6" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-150 rounded w-5/6" />
              </div>
              <div className="h-8 bg-neutral-100 rounded w-full pt-4 mt-auto" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Something went wrong"
          description="Failed to load your saved bookmarks. Please try again."
          icon={AlertTriangle}
          actionText="Retry Loading"
          onAction={refetch}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title={search ? 'No search results found' : 'No bookmarks saved yet'}
          description={
            search
              ? 'Try modifying your search keywords or category filters.'
              : 'Add study roadmaps, AI coach explanations, or recommendations to your bookmarks to view them here.'
          }
          icon={BookmarkIcon}
          actionText={search ? 'Clear Search' : 'Go to Coach Dashboard'}
          onAction={search ? () => setSearch('') : () => navigate('/dashboard')}
        />
      ) : (
        <div className="space-y-6">
          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.items.map((item: Bookmark) => {
              const style = CATEGORY_STYLES[item.type] || {
                label: 'General',
                icon: <HelpCircle size={14} />,
                color: 'border-neutral-200 text-neutral-700 bg-neutral-50',
                bg: 'bg-neutral-100/50',
              };

              const isConfirming = confirmDeleteId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-neutral-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-5 min-h-[220px] relative overflow-hidden"
                >
                  {/* Card Header: Type badge & Delete */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize ${style.color}`}
                    >
                      {style.icon}
                      {style.label}
                    </span>

                    {isConfirming ? (
                      <div className="flex items-center gap-1 z-10 animate-fade-in">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isMutationPending}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shadow-sm transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded text-[10px] font-bold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Bookmark"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 space-y-1 mb-4">
                    <h3 className="font-bold text-neutral-800 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    {item.preview && (
                      <p className="text-[11px] text-neutral-400 font-medium italic line-clamp-1">
                        {item.preview}
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Date & Link */}
                  <div className="border-t border-neutral-100 pt-3 flex justify-between items-center text-[10px] text-neutral-400 font-semibold mt-auto">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNavigate(item)}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-bold hover:underline"
                    >
                      <span>Open Link</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <span className="text-xs text-neutral-500 font-medium">
                Page {data.page} of {data.totalPages} ({data.total} bookmarks total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(data.page - 1)}
                  disabled={!data.hasPrevPage}
                  className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(data.page + 1)}
                  disabled={!data.hasNextPage}
                  className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default BookmarksPage;
