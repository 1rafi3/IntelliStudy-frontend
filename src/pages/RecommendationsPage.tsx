import React, { useState } from 'react';
import { PageHeader } from '@components/ui/PageHeader';
import { EmptyState } from '@components/ui/EmptyState';
import {
  Sparkles,
  RefreshCw,
  BookOpen,
  Code,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Trash2,
  CheckCircle,
  HelpCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  useRecommendationsQuery,
  useRefreshRecommendationsMutation,
  useMarkAsReadMutation,
  useDeleteRecommendationMutation,
} from '@features/recommendation/hooks';
import { Recommendation } from '@features/recommendation/types';

const CATEGORIES = [
  { id: 'all', label: 'All Recommendations', icon: Sparkles },
  { id: 'next-study-step', label: 'Study Steps', icon: BookOpen },
  { id: 'suggested-resource', label: 'Resources', icon: ExternalLink },
  { id: 'practice-project', label: 'Projects', icon: Code },
  { id: 'skill-gap', label: 'Skill Gaps', icon: AlertTriangle },
  { id: 'revision-reminder', label: 'Revision Reminders', icon: RefreshCw },
];

const PRIORITY_STYLES: Record<string, { badge: string; text: string }> = {
  high: {
    badge: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    text: 'text-red-500',
  },
  medium: {
    badge: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    text: 'text-amber-500',
  },
  low: {
    badge: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    text: 'text-blue-500',
  },
};

const CATEGORY_STYLES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'next-study-step': {
    label: 'Next Study Step',
    icon: <BookOpen size={14} />,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900',
  },
  'suggested-resource': {
    label: 'Suggested Resource',
    icon: <ExternalLink size={14} />,
    color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900',
  },
  'practice-project': {
    label: 'Practice Project',
    icon: <Code size={14} />,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900',
  },
  'skill-gap': {
    label: 'Skill Gap',
    icon: <AlertTriangle size={14} />,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900',
  },
  'revision-reminder': {
    label: 'Revision Reminder',
    icon: <RefreshCw size={14} />,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900',
  },
};

export const RecommendationsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const { data: recommendations = [], isLoading, isError, refetch } = useRecommendationsQuery();
  const refreshMutation = useRefreshRecommendationsMutation();
  const markAsReadMutation = useMarkAsReadMutation();
  const deleteMutation = useDeleteRecommendationMutation();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const toggleReason = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  // Filters
  const filtered = activeCategory === 'all'
    ? recommendations
    : recommendations.filter((r) => r.category === activeCategory);

  const isMutationPending = refreshMutation.isPending || markAsReadMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Smart AI Recommendations"
        description="Personalized study suggestions, projects, and resources curated by AI based on your active roadmaps and progress."
        action={
          <button
            onClick={handleRefresh}
            disabled={isLoading || isMutationPending}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh study recommendations"
          >
            <RefreshCw size={14} className={refreshMutation.isPending ? 'animate-spin' : ''} />
            Scan & Refresh Recommendations
          </button>
        }
      />

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton State */}
      {(isLoading || refreshMutation.isPending) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4 animate-pulse shadow-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  <div className="h-3 bg-gray-150 dark:bg-gray-900 rounded w-5/6" />
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16" />
              </div>
              <div className="h-20 bg-gray-100 dark:bg-gray-900/50 rounded-xl" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-8" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && !refreshMutation.isPending && (
        <EmptyState
          title="Something went wrong"
          description="Failed to load study recommendations. Please try again."
          icon={AlertTriangle}
          actionText="Retry Loading"
          onAction={refetch}
        />
      )}

      {/* Recommendations Grid */}
      {!isLoading && !refreshMutation.isPending && !isError && (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              title={activeCategory === 'all' ? 'All caught up!' : 'No items in this category'}
              description={
                activeCategory === 'all'
                  ? 'Great job! Generate new curriculum roadmaps or click refresh above to receive fresh recommendations.'
                  : 'No suggestions match this category filter right now.'
              }
              icon={Sparkles}
              actionText="Generate Recommendations"
              onAction={handleRefresh}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((item: Recommendation) => {
                const priority = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium;
                const categoryStyle = CATEGORY_STYLES[item.category] || {
                  label: item.category,
                  icon: <HelpCircle size={14} />,
                  color: 'bg-gray-50 border-gray-100',
                };
                const isReasonExpanded = expandedCardId === item.id;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    {/* Header: Badges & Dismiss */}
                    <div className="px-5 pt-5 pb-3 flex justify-between items-start gap-3">
                      <div className="flex flex-wrap gap-2">
                        {/* Category badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryStyle.color}`}
                        >
                          {categoryStyle.icon}
                          {categoryStyle.label}
                        </span>
                        {/* Priority badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priority.badge}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${priority.text}`} />
                          {item.priority}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={isMutationPending}
                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        aria-label="Dismiss recommendation"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="px-5 pb-4 flex-1 space-y-2">
                      <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Related Roadmap indicator */}
                      {item.relatedRoadmap && (
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 px-2.5 py-1 rounded-lg">
                          <TrendingUp size={12} />
                          Active Roadmap: {item.relatedRoadmap.title} ({item.relatedRoadmap.progress}% complete)
                        </div>
                      )}
                    </div>

                    {/* Expandable Advice Block */}
                    <div className="px-5 pb-3">
                      <button
                        onClick={() => toggleReason(item.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        aria-expanded={isReasonExpanded}
                      >
                        <Lightbulb size={12} />
                        {isReasonExpanded ? 'Hide suggestion advice' : 'Why this is recommended'}
                      </button>

                      {isReasonExpanded && (
                        <div className="mt-2 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl p-3 leading-relaxed animate-[fadeInUp_0.2s_ease-out]">
                          {item.reason}
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-900 flex justify-between items-center gap-4 mt-auto">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        <Clock size={12} />
                        {new Date(item.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>

                      <button
                        onClick={() => markAsReadMutation.mutate(item.id)}
                        disabled={isMutationPending}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={14} />
                        Complete Task
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default RecommendationsPage;
