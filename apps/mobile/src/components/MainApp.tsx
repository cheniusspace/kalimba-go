import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth, useSignIn } from '../hooks/useAuth';
import { UserProfile } from './UserProfile';

// Mock data for demonstration
const sampleContent = [
  { id: 1, title: 'Amazing Article 1', content: 'This is some great content about technology...' },
  { id: 2, title: 'Interesting Story 2', content: 'Here is another fascinating piece of content...' },
  { id: 3, title: 'Cool Tutorial 3', content: 'Learn something new with this amazing tutorial...' },
  { id: 4, title: 'News Update 4', content: 'Stay updated with the latest news and trends...' },
];

export function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const signInMutation = useSignIn();
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);

  const handleBookmark = async (itemId: number) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'You need to sign in to bookmark items. Would you like to sign in now?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => handleSignIn() },
        ]
      );
      return;
    }

    // Toggle bookmark
    if (bookmarkedItems.includes(itemId)) {
      setBookmarkedItems(prev => prev.filter(id => id !== itemId));
    } else {
      setBookmarkedItems(prev => [...prev, itemId]);
    }
  };

  const handleFavorite = async (itemId: number) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'You need to sign in to favorite items. Would you like to sign in now?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => handleSignIn() },
        ]
      );
      return;
    }

    // Toggle favorite
    if (favoriteItems.includes(itemId)) {
      setFavoriteItems(prev => prev.filter(id => id !== itemId));
    } else {
      setFavoriteItems(prev => [...prev, itemId]);
    }
  };

  const handleSignIn = async () => {
    try {
      // For demo purposes, we'll use Google. In a real app, you might show a picker
      const result = await signInMutation.mutateAsync('google');
      if (!result.success) {
        Alert.alert('Sign In Failed', result.error?.message || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Sign In Failed', 'An unexpected error occurred');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kalimba App</Text>
        <Text style={styles.subtitle}>
          {isAuthenticated 
            ? `Welcome back, ${user?.email}!` 
            : 'Browse content freely - sign in to bookmark and favorite!'
          }
        </Text>
      </View>

      <View style={styles.content}>
        {sampleContent.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemContent}>{item.content}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  bookmarkedItems.includes(item.id) && styles.activeButton
                ]}
                onPress={() => handleBookmark(item.id)}
              >
                <Text style={[
                  styles.actionButtonText,
                  bookmarkedItems.includes(item.id) && styles.activeButtonText
                ]}>
                  {bookmarkedItems.includes(item.id) ? '📌 Bookmarked' : '📌 Bookmark'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  favoriteItems.includes(item.id) && styles.activeButton
                ]}
                onPress={() => handleFavorite(item.id)}
              >
                <Text style={[
                  styles.actionButtonText,
                  favoriteItems.includes(item.id) && styles.activeButtonText
                ]}>
                  {favoriteItems.includes(item.id) ? '❤️ Favorited' : '🤍 Favorite'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {isAuthenticated ? (
        <UserProfile />
      ) : (
        <View style={styles.signInPrompt}>
          <Text style={styles.signInText}>
            Want to save your bookmarks and favorites? Sign in to sync across devices!
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            disabled={signInMutation.isPending}
          >
            <Text style={styles.signInButtonText}>
              {signInMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  content: {
    padding: 15,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  itemContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeButtonText: {
    color: '#fff',
  },
  signInPrompt: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
