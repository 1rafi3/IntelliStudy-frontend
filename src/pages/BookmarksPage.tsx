import React from 'react';
import { PageHeader } from '@components/ui/PageHeader';
import { EmptyState } from '@components/ui/EmptyState';
import { Bookmark } from 'lucide-react';

export const BookmarksPage: React.FC = () => {
  const handleBrowse = () => {
    alert('Global Bookmarks — custom resource saving integration coming in next phase!');
  };

  return (
    <div className="space-y-lg">
      <PageHeader 
        title="Bookmarks" 
        description="Access all your saved articles, video links, and custom study notes."
      />
      <EmptyState 
        title="No saved bookmarks" 
        description="Bookmark reference links inside your study roadmaps or save helpful chat coach explanations to see them here."
        icon={Bookmark}
        actionText="Browse Roadmaps to Save"
        onAction={handleBrowse}
      />
    </div>
  );
};
export default BookmarksPage;
