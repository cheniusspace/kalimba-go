import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth, useSignOut } from '../hooks/useAuth';

export function UserProfile() {
  const { user } = useAuth();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your bookmarks and favorites will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await signOutMutation.mutateAsync();
              if (!result.success) {
                Alert.alert('Sign Out Failed', result.error?.message || 'Unknown error');
              }
            } catch (error) {
              Alert.alert('Sign Out Failed', 'An unexpected error occurred');
            }
          }
        },
      ]
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.userId}>ID: {user.id}</Text>
        
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={signOutMutation.isPending}
        >
          <Text style={styles.signOutButtonText}>
            {signOutMutation.isPending ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
