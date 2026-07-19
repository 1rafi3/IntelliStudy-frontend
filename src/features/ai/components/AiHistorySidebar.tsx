import React from 'react';
import { Clock, Trash2, History, ChevronRight, BarChart3 } from 'lucide-react';
import { useAIHistoryQuery, useDeleteHistoryMutation } from '../hooks';
import { AIHistoryResponse, GenerateRoadmapDto, GeneratedRoadmapData } from '../types';

interface AiHistorySidebarProps {
  onSelectHistory: (prompt: GenerateRoadmapDto, roadmap: GeneratedRoadmapData) => void;
}

const DIFFICULTY_DOT: Record<string, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-amber-500',
  advanced: 'bg-red-500',
};

export const AiHistorySidebar: React.FC<AiHistorySidebarProps> = ({ onSelectHistory }) => {
  const { data: history, isLoading } = useAIHistoryQuery();
  const deleteMutation = useDeleteHistoryMutation();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = window.confirm('Remove this roadmap from history?');
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-2.5" aria-label="Loading AI history">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-gray-900 rounded-xl animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    );
  }

  // Empty State
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 px-4 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-400 shadow-sm">
          <History size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No History Yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
            Generated roadmaps will appear here for quick access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5" role="list" aria-label="AI roadmap history">
      {history.map((record: AIHistoryResponse) => {
        const roadmap = record.generatedRoadmap as GeneratedRoadmapData;
        const title = roadmap.title || record.prompt.learningGoal;
        const difficulty = roadmap.difficulty || 'beginner';
        const dotClass = DIFFICULTY_DOT[difficulty] || DIFFICULTY_DOT.beginner;

        return (
          <div
            key={record.id}
            role="listitem"
            onClick={() => onSelectHistory(record.prompt, roadmap)}
            className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-400"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectHistory(record.prompt, roadmap);
              }
            }}
            aria-label={`Load roadmap: ${title}`}
          >
            {/* Title Row */}
            <div className="flex items-start justify-between gap-2 pr-7">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
              </h4>
            </div>

            {/* Goal snippet */}
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
              {record.prompt.learningGoal}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(record.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                  <BarChart3 size={10} />
                  {difficulty}
                </span>
              </div>
              <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-200">
                Load
                <ChevronRight size={12} />
              </span>
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => handleDelete(e, record.id)}
              className="absolute top-3 right-3 p-1.5 text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label={`Delete roadmap history: ${title}`}
              title="Delete this history record"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
