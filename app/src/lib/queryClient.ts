import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes for stable data
        refetchOnWindowFocus: false,
        retry: 1,
        gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
      },
      mutations: {
        retry: 1,
      },
    },
  });
}
