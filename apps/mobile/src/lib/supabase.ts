import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Configure WebBrowser for auth
WebBrowser.maybeCompleteAuthSession();

// Environment variables - you'll need to set these in your app config
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We'll handle this manually with deep linking
  },
});

// Handle deep linking for OAuth
export const handleAuthCallback = async (url: string) => {
  try {
    const { data, error } = await supabase.auth.getSessionFromUrl(url);
    
    if (error) {
      console.error('Auth callback error:', error);
      return { success: false, error };
    }
    
    if (data.session) {
      console.log('Auth session restored:', data.session.user.email);
      return { success: true, session: data.session };
    }
    
    return { success: false, error: 'No session found' };
  } catch (error) {
    console.error('Auth callback error:', error);
    return { success: false, error };
  }
};

// Sign in with OAuth provider
export const signInWithProvider = async (provider: 'google' | 'github' | 'apple') => {
  try {
    const redirectUrl = Linking.createURL('auth/callback');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });
    
    if (error) {
      console.error('OAuth sign in error:', error);
      return { success: false, error };
    }
    
    if (data.url) {
      // Open the OAuth URL in the browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );
      
      if (result.type === 'success' && result.url) {
        return await handleAuthCallback(result.url);
      }
    }
    
    return { success: false, error: 'OAuth flow was cancelled' };
  } catch (error) {
    console.error('OAuth sign in error:', error);
    return { success: false, error };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return { success: false, error };
    }
    return { success: true, user };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error };
  }
};
