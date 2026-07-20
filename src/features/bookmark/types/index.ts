export interface Bookmark {
  id: string;
  user: string;
  type: 'ai-roadmap' | 'manual-roadmap' | 'chat-response' | 'recommendation';
  referencedId: string;
  title: string;
  description?: string;
  preview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookmarks {
  items: Bookmark[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AddBookmarkDto {
  type: 'ai-roadmap' | 'manual-roadmap' | 'chat-response' | 'recommendation';
  referencedId: string;
  title: string;
  description?: string;
  preview?: string;
}

export interface ListBookmarksQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'ai-roadmap' | 'manual-roadmap' | 'chat-response' | 'recommendation';
}
