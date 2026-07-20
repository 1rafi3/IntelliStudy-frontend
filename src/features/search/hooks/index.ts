import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services';

export const useSearchQuery = (q: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['global-search', q],
    queryFn: () => searchService.search(q),
    enabled: enabled && q.trim().length > 0,
    staleTime: 30_000,
    retry: false,
  });
};
