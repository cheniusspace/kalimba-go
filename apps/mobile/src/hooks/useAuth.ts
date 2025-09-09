import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, signInWithProvider, signOut, getCurrentUser } from '../lib/supabase';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

// Query key factory
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hook to get current user
export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const result = await getCurrentUser();
      if (result.success) {
        return result.user;
      }
      throw result.error;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          queryClient.setQueryData(authKeys.user(), session?.user || null);
        } else if (event === 'SIGNED_OUT') {
          queryClient.setQueryData(authKeys.user(), null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Handle deep linking for OAuth callbacks
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (url.includes('auth/callback')) {
        // Handle the OAuth callback
        supabase.auth.getSessionFromUrl(url).then(({ data, error }) => {
          if (error) {
            console.error('Deep link auth error:', error);
          } else if (data.session) {
            queryClient.setQueryData(authKeys.user(), data.session.user);
          }
        });
      }
    };

    // Handle initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for subsequent deep links
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, [queryClient]);

  return {
    user,
    isLoading,
    error,
    refetch,
    isAuthenticated: !!user,
  };
}

// Hook for OAuth sign in
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInWithProvider,
    onSuccess: (result) => {
      if (result.success && result.session) {
        queryClient.setQueryData(authKeys.user(), result.session.user);
      }
    },
    onError: (error) => {
      console.error('Sign in mutation error:', error);
    },
  });
}

// Hook for sign out
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.clear(); // Clear all cached data
    },
    onError: (error) => {
      console.error('Sign out mutation error:', error);
    },
  });
}
