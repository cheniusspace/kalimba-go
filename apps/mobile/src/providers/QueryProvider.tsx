import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 2,
    },
  },
});

// Optional: Persist query cache to AsyncStorage
const persistQueryClient = async () => {
  try {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const cacheData = queries.map(query => ({
      queryKey: query.queryKey,
      queryHash: query.queryHash,
      state: query.state,
    }));
    
    await AsyncStorage.setItem('react-query-cache', JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to persist query cache:', error);
  }
};

// Load persisted cache on app start
const loadPersistedCache = async () => {
  try {
    const cacheData = await AsyncStorage.getItem('react-query-cache');
    if (cacheData) {
      const queries = JSON.parse(cacheData);
      queries.forEach(({ queryKey, state }: any) => {
        queryClient.setQueryData(queryKey, state.data);
      });
    }
  } catch (error) {
    console.error('Failed to load persisted cache:', error);
  }
};

// Initialize cache loading
loadPersistedCache();

// Persist cache periodically
setInterval(persistQueryClient, 1000 * 60 * 2); // Every 2 minutes

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClient };
