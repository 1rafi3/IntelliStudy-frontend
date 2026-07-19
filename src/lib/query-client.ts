import { QueryClient } from '@tanstack/react-query';

// ─── Query Client Configuration ──────────────────────────────────────────────
// Centralized configuration for all TanStack query and mutation behaviors.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Do not retry on 401, 403, or 404 client errors
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes stale time
    },
    mutations: {
      retry: false,
    },
  },
});
