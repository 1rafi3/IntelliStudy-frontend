import { api } from '@/lib/axios';
import { Bookmark, PaginatedBookmarks, AddBookmarkDto, ListBookmarksQuery } from '../types';

export const bookmarkService = {
  /**
   * Fetch paginated and filtered bookmarks.
   */
  getAll: async (query?: ListBookmarksQuery): Promise<PaginatedBookmarks> => {
    const response = await api.get('/bookmarks', { params: query });
    return response.data.data;
  },

  /**
   * Add a new bookmark.
   */
  add: async (dto: AddBookmarkDto): Promise<Bookmark> => {
    const response = await api.post('/bookmarks', dto);
    return response.data.data;
  },

  /**
   * Delete a bookmark by ID.
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/bookmarks/${id}`);
  },

  /**
   * Delete a bookmark by its referenced ID and type.
   */
  deleteByReference: async (type: string, referencedId: string): Promise<void> => {
    await api.delete(`/bookmarks/by-reference/${type}/${referencedId}`);
  },
};

export default bookmarkService;
