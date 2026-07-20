import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Clock, Star, Edit2, Archive, Trash2, 
  CheckCircle2, Compass, Award, Tag, Sparkles, Bookmark 
} from 'lucide-react';
import { useRoadmapQuery, useDeleteRoadmapMutation, useToggleArchiveMutation } from '@features/roadmaps/hooks';
import { PageHeader } from '@components/ui/PageHeader';
import { DashboardCard } from '@components/ui/DashboardCard';
import { CTAButton } from '@components/ui/CTAButton';
import { LoadingScreen } from '@components/ui/LoadingScreen';
import { RoadmapModal } from '@features/roadmaps/components/RoadmapModal';
import { useBookmarksQuery, useAddBookmarkMutation, useDeleteBookmarkByReferenceMutation } from '@features/bookmark/hooks';

export const RoadmapDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteMutation = useDeleteRoadmapMutation();
  const archiveMutation = useToggleArchiveMutation();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: roadmap, isLoading, isError } = useRoadmapQuery(id || '');

  // Bookmarks integration
  const { data: bookmarksData } = useBookmarksQuery({ limit: 100 });
  const addBookmarkMutation = useAddBookmarkMutation();
  const deleteBookmarkByReferenceMutation = useDeleteBookmarkByReferenceMutation();

  const isBookmarked = !!bookmarksData?.items.some(
    (b) => (b.type === 'ai-roadmap' || b.type === 'manual-roadmap') && b.referencedId === id
  );

  const handleToggleBookmark = () => {
    if (!roadmap) return;
    const type = roadmap.tags.includes('AI-Generated') ? 'ai-roadmap' : 'manual-roadmap';
    if (isBookmarked) {
      deleteBookmarkByReferenceMutation.mutate({ type, referencedId: roadmap.id });
    } else {
      addBookmarkMutation.mutate({
        type,
        referencedId: roadmap.id,
        title: roadmap.title,
        description: roadmap.description || '',
        preview: `Subject: ${roadmap.subject} | Difficulty: ${roadmap.difficulty} | Progress: ${roadmap.progress}%`,
      });
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (isError || !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-2xl space-y-md text-center max-w-sm mx-auto">
        <h3 className="font-bold text-neutral-800 text-lg">Roadmap Not Found</h3>
        <p className="text-neutral-500 text-sm">The roadmap you are trying to view does not exist or has been deleted.</p>
        <CTAButton variant="secondary" onClick={() => navigate('/dashboard/roadmaps')}>
          Back to Roadmaps
        </CTAButton>
      </div>
    );
  }

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${roadmap.title}"? This cannot be undone.`);
    if (confirmed) {
      deleteMutation.mutate(roadmap.id, {
        onSuccess: () => navigate('/dashboard/roadmaps'),
      });
    }
  };

  const handleArchive = () => {
    archiveMutation.mutate(roadmap.id);
  };

  // Generate mock timeline items based on the subject / title
  const mockTimeline = [
    { id: 1, title: 'Module 1: Foundational Core & Syntax', duration: '2 weeks', desc: 'Introduction to fundamentals, configuration, and structural syntax.' },
    { id: 2, title: 'Module 2: Advanced Design & Utilities', duration: '3 weeks', desc: 'Understanding layout hierarchies, spacing architectures, and global utility integrations.' },
    { id: 3, title: 'Module 3: Integration & State Management', duration: '3 weeks', desc: 'Connecting schemas, validating payloads, caching state triggers, and managing store APIs.' },
    { id: 4, title: 'Module 4: Performance & Secure Operations', duration: '4 weeks', desc: 'Integrating rate limits, deploying edge architectures, managing server caches, and scaling loads.' },
  ];

  return (
    <div className="space-y-lg pb-xl">
      
      {/* Navigation & Header */}
      <button 
        onClick={() => navigate('/dashboard/roadmaps')}
        className="inline-flex items-center gap-2xs text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-micro"
      >
        <ArrowLeft size={16} /> Back to Roadmaps
      </button>

      <PageHeader 
        title={roadmap.title}
        description={roadmap.subject}
        action={
          <div className="flex items-center gap-xs">
            <CTAButton 
              variant={isBookmarked ? 'primary' : 'secondary'} 
              size="sm" 
              onClick={handleToggleBookmark} 
              className="gap-2xs"
              disabled={addBookmarkMutation.isPending || deleteBookmarkByReferenceMutation.isPending}
            >
              <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </CTAButton>
            <CTAButton variant="secondary" size="sm" onClick={() => setModalOpen(true)} className="gap-2xs">
              <Edit2 size={14} /> Edit
            </CTAButton>
            <CTAButton variant="secondary" size="sm" onClick={handleArchive} className="gap-2xs">
              <Archive size={14} /> {roadmap.archived ? 'Unarchive' : 'Archive'}
            </CTAButton>
            <CTAButton variant="secondary" size="sm" onClick={handleDelete} className="gap-2xs text-red-600 border-red-100 hover:bg-red-50">
              <Trash2 size={14} /> Delete
            </CTAButton>
          </div>
        }
      />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left column: Syllabus and descriptions */}
        <div className="lg:col-span-8 space-y-lg">
          
          {/* Description & Goals */}
          <DashboardCard title="Learning Objectives" subtitle="Overview of your learning checkpoints">
            <div className="space-y-md mt-xs">
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2xs">Description</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {roadmap.description || 'No description provided for this roadmap.'}
                </p>
              </div>

              {roadmap.goal && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2xs">Ultimate Goal</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    🎯 {roadmap.goal}
                  </p>
                </div>
              )}

              {/* Tags list */}
              {roadmap.tags && roadmap.tags.length > 0 && (
                <div className="pt-sm border-t border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-sm">Tags</h4>
                  <div className="flex flex-wrap gap-xs">
                    {roadmap.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2xs px-xs py-[3px] rounded-lg bg-neutral-100 border border-neutral-200/50 text-xs font-medium text-neutral-600">
                        <Tag size={12} className="text-neutral-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Timeline / Modules list */}
          <div className="space-y-sm">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2xs">
              <Compass size={18} className="text-primary-500" /> Curriculum Blueprint
            </h3>
            
            <div className="relative border-l border-neutral-200 pl-md ml-xs space-y-lg">
              {mockTimeline.map((item, idx) => {
                const isPassed = roadmap.progress > idx * 25;
                return (
                  <div key={item.id} className="relative">
                    {/* Circle Node */}
                    <div className={`w-5 h-5 rounded-full border-4 ${
                      isPassed 
                        ? 'bg-primary-500 border-primary-100 text-white' 
                        : 'bg-white border-neutral-200'
                    } absolute -left-[26px] top-[2px] flex items-center justify-center shrink-0`}>
                      {isPassed && <CheckCircle2 size={12} strokeWidth={3} />}
                    </div>

                    <div className="bg-white border border-neutral-200/60 rounded-xl p-md shadow-2xs">
                      <div className="flex justify-between items-center gap-xs">
                        <h4 className="font-bold text-neutral-800 text-sm">{item.title}</h4>
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-xs py-3xs rounded-md">{item.duration}</span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed mt-2xs">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: Progress and stats card */}
        <div className="lg:col-span-4 space-y-lg">
          
          {/* Metadata Card */}
          <DashboardCard title="Roadmap Overview">
            <div className="space-y-sm text-sm mt-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="flex items-center gap-xs"><Clock size={16} /> Est. Duration</span>
                <span className="font-semibold text-neutral-700">{roadmap.estimatedDuration ? `${roadmap.estimatedDuration} Weeks` : 'Flexible'}</span>
              </div>
              
              <div className="flex items-center justify-between text-neutral-500 pt-2xs border-t border-neutral-50">
                <span className="flex items-center gap-xs"><Star size={16} /> Difficulty</span>
                <span className="font-semibold text-neutral-700 capitalize">{roadmap.difficulty}</span>
              </div>

              <div className="flex items-center justify-between text-neutral-500 pt-2xs border-t border-neutral-50">
                <span className="flex items-center gap-xs"><Calendar size={16} /> Created Date</span>
                <span className="font-semibold text-neutral-700">
                  {new Date(roadmap.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Progress Card */}
          <DashboardCard title="Your Study Progress" subtitle="Updated real-time as modules close">
            <div className="space-y-md mt-sm">
              <div className="flex items-end justify-between">
                <div className="space-y-2xs">
                  <span className="text-3xl font-black text-neutral-800 font-display">{roadmap.progress}%</span>
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Completion</p>
                </div>
                <Award size={48} className="text-primary-500 shrink-0 bg-primary-50 p-2xs rounded-2xl" />
              </div>

              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${roadmap.progress}%` }}
                />
              </div>
            </div>
          </DashboardCard>

          {/* Archive Status Info Banner */}
          {roadmap.archived && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-md flex gap-sm text-amber-800 text-xs">
              <Sparkles size={20} className="shrink-0 text-amber-600 mt-2xs" />
              <div className="leading-relaxed">
                <p className="font-bold">Archived Roadmap</p>
                <p className="text-amber-700 mt-2xs">This curriculum is in your archives. You can study it, or click unarchive in the header controls to return it to your dashboard.</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Edit Modal */}
      <RoadmapModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        roadmapToEdit={roadmap} 
      />
      
    </div>
  );
};
export default RoadmapDetailPage;
