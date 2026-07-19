import React, { useState } from 'react';
import { 
  BookOpen, Plus, Search, ArrowUpDown, Archive, 
  ChevronLeft, ChevronRight, Grid, List 
} from 'lucide-react';
import { PageHeader } from '@components/ui/PageHeader';
import { EmptyState } from '@components/ui/EmptyState';
import { CTAButton } from '@components/ui/CTAButton';
import { RoadmapCard } from '@features/roadmaps/components/RoadmapCard';
import { RoadmapModal } from '@features/roadmaps/components/RoadmapModal';
import { useRoadmapsQuery } from '@features/roadmaps/hooks';
import { RoadmapResponse } from '@features/roadmaps/types';

export const RoadmapsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapResponse | null>(null);
  
  // Grid/List View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Query / Filter states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [archived, setArchived] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title' | 'progress'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load roadmaps dynamically
  const { data, isLoading, isError } = useRoadmapsQuery({
    page,
    limit: 12,
    search: search.trim() || undefined,
    status: (status || undefined) as any,
    difficulty: (difficulty || undefined) as any,
    archived,
    sortBy,
    sortOrder,
  });

  const handleEdit = (roadmap: RoadmapResponse) => {
    setSelectedRoadmap(roadmap);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedRoadmap(null);
    setModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-lg pb-xl">
      
      {/* Page Header */}
      <PageHeader 
        title="Study Roadmaps" 
        description="Design and manage customized study plans with AI-suggested checkpoints."
        action={
          <CTAButton variant="primary" onClick={handleCreateNew} className="gap-xs">
            <Plus size={16} /> Create Roadmap
          </CTAButton>
        }
      />

      {/* Control Bar (Search, Filters, Sort) */}
      <div className="bg-white border border-neutral-200/60 rounded-2xl p-md shadow-sm space-y-md">
        
        {/* Row 1: Search & View Mode */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-neutral-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search roadmaps by title or subject..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="block w-full pl-lg pr-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4 transition-micro"
            />
          </div>

          <div className="flex items-center gap-xs justify-end shrink-0">
            {/* Archive Filter Toggle */}
            <button
              onClick={() => { setArchived(!archived); setPage(1); }}
              className={`flex items-center gap-2xs px-sm py-[9px] border rounded-xl text-xs font-semibold transition-micro focus:outline-none ${
                archived 
                  ? 'bg-amber-50 border-amber-300 text-amber-700' 
                  : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
              }`}
            >
              <Archive size={14} />
              <span>{archived ? 'Show Active' : 'Show Archived'}</span>
            </button>

            {/* Layout Mode Toggles */}
            <div className="border border-neutral-200 rounded-xl p-[3px] flex gap-3xs bg-neutral-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-xs rounded-lg transition-micro ${viewMode === 'grid' ? 'bg-white shadow-2xs text-primary-600' : 'text-neutral-400'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-xs rounded-lg transition-micro ${viewMode === 'list' ? 'bg-white shadow-2xs text-primary-600' : 'text-neutral-400'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filtering & Sorting Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-sm pt-xs border-t border-neutral-100 items-center">
          
          {/* Status Filter */}
          <div className="flex items-center gap-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase shrink-0">Status</span>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="block w-full px-sm py-xs bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase shrink-0">Difficulty</span>
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              className="block w-full px-sm py-xs bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div className="flex items-center gap-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase shrink-0">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="block w-full px-sm py-xs bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="title">Title Name</option>
              <option value="progress">Progress %</option>
            </select>
          </div>

          {/* Sort Direction toggle */}
          <div className="flex items-center gap-xs justify-end">
            <span className="text-[10px] font-bold text-neutral-400 uppercase shrink-0">Order</span>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2xs px-sm py-xs border border-neutral-200 rounded-lg bg-neutral-50 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-micro"
            >
              <ArrowUpDown size={12} />
              <span className="capitalize">{sortOrder}ending</span>
            </button>
          </div>

        </div>

      </div>

      {/* Loading Skeleton View */}
      {isLoading && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md' : 'flex flex-col gap-sm'}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200/50 rounded-2xl p-md space-y-md animate-pulse">
              <div className="space-y-xs">
                <div className="h-4 w-1/4 bg-neutral-100 rounded-md" />
                <div className="h-6 w-3/4 bg-neutral-100 rounded-md" />
                <div className="h-4 w-1/2 bg-neutral-100 rounded-md" />
              </div>
              <div className="h-10 bg-neutral-50 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center p-xl bg-white border border-red-100 rounded-2xl text-center max-w-md mx-auto my-lg">
          <p className="text-red-600 font-bold mb-xs">Failed to load roadmaps</p>
          <p className="text-neutral-500 text-xs leading-relaxed mb-sm">
            There was an error communicating with the database. Please verify your connection status.
          </p>
          <CTAButton variant="secondary" onClick={() => window.location.reload()}>
            Retry Connection
          </CTAButton>
        </div>
      )}

      {/* Loaded Lists Grid/List rendering */}
      {!isLoading && !isError && data && (
        <>
          {data.roadmaps.length === 0 ? (
            <EmptyState 
              title={archived ? "No archived roadmaps" : "No active roadmaps found"} 
              description={
                archived 
                  ? "You have not moved any active roadmaps to the archives yet." 
                  : "Input any study topic or role parameter and let the AI generate checkpoint steps."
              }
              icon={BookOpen}
              actionText={archived ? undefined : "Generate Your First Roadmap"}
              onAction={archived ? undefined : handleCreateNew}
            />
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md' : 'flex flex-col gap-sm'}>
              {data.roadmaps.map((rm) => (
                <RoadmapCard key={rm.id} roadmap={rm} onEdit={handleEdit} />
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-200/60 pt-md mt-lg text-xs font-semibold text-neutral-500">
              <span>
                Showing Page {data.page} of {data.totalPages} ({data.total} total roadmaps)
              </span>
              <div className="flex items-center gap-xs">
                <button
                  disabled={data.page <= 1}
                  onClick={() => handlePageChange(data.page - 1)}
                  className="p-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition-micro"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={data.page >= data.totalPages}
                  onClick={() => handlePageChange(data.page + 1)}
                  className="p-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition-micro"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Creation / Edit Modal overlay */}
      <RoadmapModal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setSelectedRoadmap(null); }} 
        roadmapToEdit={selectedRoadmap} 
      />

    </div>
  );
};
export default RoadmapsPage;
