import { api } from '@lib/axios';
import { SearchResponse } from '../types';

export const searchService = {
  search: async (q: string): Promise<SearchResponse> => {
    const res = await api.get('/search', { params: { q } });
    return res.data.data;
  },
};
export default searchService;
