export interface RecommendationRelatedRoadmap {
  id: string;
  title: string;
  subject: string;
  progress: number;
  status: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  category: 'next-study-step' | 'suggested-resource' | 'practice-project' | 'skill-gap' | 'revision-reminder';
  priority: 'low' | 'medium' | 'high';
  relatedRoadmap?: RecommendationRelatedRoadmap;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
