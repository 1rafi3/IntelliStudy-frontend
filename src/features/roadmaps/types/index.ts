export type RoadmapStatus = 'not-started' | 'in-progress' | 'completed' | 'paused';
export type RoadmapDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CreateRoadmapDto {
  title: string;
  subject: string;
  description?: string;
  goal?: string;
  difficulty: RoadmapDifficulty;
  estimatedDuration?: number;
  tags?: string[];
}

export interface UpdateRoadmapDto {
  title?: string;
  subject?: string;
  description?: string;
  goal?: string;
  difficulty?: RoadmapDifficulty;
  estimatedDuration?: number;
  progress?: number;
  status?: RoadmapStatus;
  tags?: string[];
}

export interface RoadmapResponse {
  id: string;
  title: string;
  subject: string;
  description?: string;
  goal?: string;
  difficulty: RoadmapDifficulty;
  estimatedDuration?: number;
  progress: number;
  status: RoadmapStatus;
  tags: string[];
  archived: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRoadmapsResponse {
  roadmaps: RoadmapResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListRoadmapsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RoadmapStatus;
  difficulty?: RoadmapDifficulty;
  archived?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'progress';
  sortOrder?: 'asc' | 'desc';
}
