import React from 'react';
import { PageHeader } from '@components/ui/PageHeader';
import { EmptyState } from '@components/ui/EmptyState';
import { Sparkles } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const handleFetch = () => {
    alert('Smart Recommendations — personalized content integration coming in next phase!');
  };

  return (
    <div className="space-y-lg">
      <PageHeader 
        title="Recommendations" 
        description="Smart, curated resources tailored exactly to your active study targets."
      />
      <EmptyState 
        title="No recommendations yet" 
        description="Once you generate roadmaps, IntelliStudy AI scans public networks to recommend top articles, videos, and books."
        icon={Sparkles}
        actionText="Generate Learning Suggestions"
        onAction={handleFetch}
      />
    </div>
  );
};
export default RecommendationsPage;
