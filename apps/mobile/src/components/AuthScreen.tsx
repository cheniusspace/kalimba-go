import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth, useSignIn, useSignOut } from '../hooks/useAuth';

export function AuthScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const signInMutation = useSignIn();
  const signOutMutation = useSignOut();

  const handleSignIn = async (provider: 'google' | 'github' | 'apple') => {
    try {
      const result = await signInMutation.mutateAsync(provider);
      if (!result.success) {
        Alert.alert('Sign In Failed', result.error?.message || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Sign In Failed', 'An unexpected error occurred');
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOutMutation.mutateAsync();
      if (!result.success) {
        Alert.alert('Sign Out Failed', result.error?.message || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Sign Out Failed', 'An unexpected error occurred');
    }
  };

  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.userInfo}>Email: {user.email}</Text>
        <Text style={styles.userInfo}>ID: {user.id}</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
          disabled={signOutMutation.isPending}
        >
          {signOutMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Choose your preferred sign-in method</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={() => handleSignIn('google')}
        disabled={signInMutation.isPending}
      >
        {signInMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.githubButton]}
        onPress={() => handleSignIn('github')}
        disabled={signInMutation.isPending}
      >
        {signInMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign in with GitHub</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.appleButton]}
        onPress={() => handleSignIn('apple')}
        disabled={signInMutation.isPending}
      >
        {signInMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Apple</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  githubButton: {
    backgroundColor: '#333',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
  },
});
