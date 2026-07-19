import React from 'react';
import { Clock, Trash2, History, ChevronRight } from 'lucide-react';
import { useAIHistoryQuery, useDeleteHistoryMutation } from '../hooks';
import { AIHistoryResponse, GenerateRoadmapDto, GeneratedRoadmapData } from '../types';
import { EmptyState } from '@components/ui/EmptyState';

interface AiHistorySidebarProps {
  onSelectHistory: (prompt: GenerateRoadmapDto, roadmap: GeneratedRoadmapData) => void;
}

export const AiHistorySidebar: React.FC<AiHistorySidebarProps> = ({ onSelectHistory }) => {
  const { data: history, isLoading } = useAIHistoryQuery();
  const deleteMutation = useDeleteHistoryMutation();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent selecting the item
    const confirmed = window.confirm('Are you sure you want to delete this history record?');
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-sm">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white border border-neutral-200/60 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <EmptyState 
        title="No History Yet" 
        description="Your previously generated AI roadmaps will appear here for easy access."
        icon={History}
      />
    );
  }

  return (
    <div className="space-y-sm">
      {history.map((record: AIHistoryResponse) => (
        <div 
          key={record.id}
          onClick={() => onSelectHistory(record.prompt, record.generatedRoadmap as GeneratedRoadmapData)}
          className="bg-white border border-neutral-200/60 rounded-xl p-sm shadow-2xs hover:shadow-sm hover:border-primary-200 transition-micro cursor-pointer group flex flex-col"
        >
          <div className="flex justify-between items-start gap-xs">
            <h4 className="text-sm font-bold text-neutral-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {record.generatedRoadmap.title || record.prompt.learningGoal}
            </h4>
            <button 
              onClick={(e) => handleDelete(e, record.id)}
              className="p-xs text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-micro shrink-0 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          <p className="text-xs text-neutral-500 line-clamp-1 mt-2xs mb-sm">
            {record.prompt.learningGoal}
          </p>

          <div className="flex justify-between items-center mt-auto text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 pt-sm">
            <span className="flex items-center gap-2xs">
              <Clock size={12} />
              {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2xs group-hover:text-primary-500 transition-colors">
              Load <ChevronRight size={12} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
