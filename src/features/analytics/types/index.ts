export interface AnalyticsOverview {
  totalRoadmaps: number;
  activeRoadmaps: number;
  completedRoadmaps: number;
  pausedRoadmaps: number;
  aiGeneratedRoadmaps: number;
  totalChatSessions: number;
  totalChatMessages: number;
  totalRecommendations: number;
  totalBookmarks: number;
  totalAiGenerations: number;
  averageRoadmapProgress: number;
  profileCompletion: number;
}

export interface DistributionItem {
  range?: string;
  status?: string;
  difficulty?: string;
  type?: string;
  category?: string;
  date?: string;
  count: number;
}

export interface ChatActivityItem {
  date: string;
  count: number;
}

export interface Insight {
  type: 'positive' | 'info' | 'warning';
  title: string;
  description: string;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  roadmapProgressDistribution: DistributionItem[];
  roadmapStatusDistribution: DistributionItem[];
  roadmapDifficultyDistribution: DistributionItem[];
  bookmarkDistribution: DistributionItem[];
  recommendationCategoryDistribution: DistributionItem[];
  chatActivity: ChatActivityItem[];
  insights: Insight[];
}
