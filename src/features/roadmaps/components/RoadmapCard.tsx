import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Calendar, MoreVertical, 
  Edit2, Archive, Trash2 
} from 'lucide-react';
import { RoadmapResponse } from '../types';
import { useDeleteRoadmapMutation, useToggleArchiveMutation } from '../hooks';

interface RoadmapCardProps {
  roadmap: RoadmapResponse;
  onEdit: (roadmap: RoadmapResponse) => void;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, onEdit }) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteRoadmapMutation();
  const archiveMutation = useToggleArchiveMutation();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${roadmap.title}"? This cannot be undone.`);
    if (confirmed) {
      deleteMutation.mutate(roadmap.id);
    }
  };

  const handleArchive = () => {
    archiveMutation.mutate(roadmap.id);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'intermediate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'advanced':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-neutral-700 bg-neutral-50 border-neutral-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'paused':
        return 'Paused';
      default:
        return status;
    }
  };

  return (
    <div className={`bg-white border ${roadmap.archived ? 'border-dashed border-neutral-200 opacity-75' : 'border-neutral-200/60'} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-md relative`}>
      
      {/* Header Info */}
      <div className="flex justify-between items-start gap-xs mb-sm">
        <div className="min-w-0">
          <span className={`inline-flex items-center px-xs py-3xs rounded-md text-[10px] font-bold border capitalize ${getDifficultyColor(roadmap.difficulty)}`}>
            {roadmap.difficulty}
          </span>
          <h3 className="font-bold text-neutral-800 font-display mt-xs truncate leading-snug" title={roadmap.title}>
            {roadmap.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-2xs truncate">{roadmap.subject}</p>
        </div>

        {/* Action Dropdown Menu */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-xs text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-micro"
          >
            <MoreVertical size={16} />
          </button>
          
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-xs w-36 bg-white border border-neutral-200/60 rounded-xl shadow-md py-xs z-20 text-xs">
                <button
                  onClick={() => { setDropdownOpen(false); navigate(`/dashboard/roadmaps/${roadmap.id}`); }}
                  className="w-full text-left px-sm py-xs text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 flex items-center gap-xs font-medium"
                >
                  <BookOpen size={14} /> View Details
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); onEdit(roadmap); }}
                  className="w-full text-left px-sm py-xs text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 flex items-center gap-xs font-medium"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); handleArchive(); }}
                  className="w-full text-left px-sm py-xs text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 flex items-center gap-xs font-medium"
                >
                  <Archive size={14} /> {roadmap.archived ? 'Unarchive' : 'Archive'}
                </button>
                <div className="border-t border-neutral-100 my-xs" />
                <button
                  onClick={() => { setDropdownOpen(false); handleDelete(); }}
                  className="w-full text-left px-sm py-xs text-red-600 hover:bg-red-50 flex items-center gap-xs font-semibold"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description / Goal */}
      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-md flex-1">
        {roadmap.description || 'No description provided.'}
      </p>

      {/* Progress Section */}
      <div className="space-y-2xs mb-md">
        <div className="flex justify-between items-center text-[10px] font-semibold text-neutral-500">
          <span>Progress</span>
          <span>{roadmap.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${roadmap.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center border-t border-neutral-100 pt-sm text-[10px] text-neutral-400 font-semibold">
        <div className="flex items-center gap-2xs">
          <Clock size={12} />
          <span>{roadmap.estimatedDuration ? `${roadmap.estimatedDuration}w` : 'Flexible'}</span>
        </div>
        <div className="flex items-center gap-2xs">
          <Calendar size={12} />
          <span>{new Date(roadmap.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <span className="text-neutral-500">{getStatusLabel(roadmap.status)}</span>
      </div>

    </div>
  );
};
export default RoadmapCard;
