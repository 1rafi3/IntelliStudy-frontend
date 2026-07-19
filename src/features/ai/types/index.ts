export interface GenerateRoadmapDto {
  learningGoal: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  weeklyHours: number;
  learningStyle: string;
  language: string;
}

export interface SaveRoadmapDto {
  title: string;
  subject: string;
  description?: string;
  goal?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;
  tags?: string[];
}

export interface AIHistoryResponse {
  id: string;
  prompt: GenerateRoadmapDto;
  generatedRoadmap: Record<string, any>;
  createdAt: string;
}

export interface Phase {
  title: string;
  description: string;
  topics: string[];
  resources: string[];
  estimatedWeeks: number;
}

export interface GeneratedRoadmapData {
  title: string;
  goal: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  weeklyHours: string;
  summary: string;
  phases: Phase[];
}
