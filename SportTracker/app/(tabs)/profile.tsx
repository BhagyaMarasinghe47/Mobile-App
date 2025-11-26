import React from 'react';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { logout } from '@redux/slices/authSlice';
import { toggleTheme } from '@redux/slices/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user } = useAppSelector(s => s.auth);
  const isDark = useAppSelector(s => s.theme.isDarkMode);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('token');
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#E3F2FD', dark: '#123' }} headerImage={<></>}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
        {user && <ThemedText style={styles.subtitle}>{user.firstName || user.username}</ThemedText>}
      </ThemedView>
      {user ? (
        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">Email</ThemedText>
          <ThemedText>{user.email}</ThemedText>
          <ThemedText style={styles.divider} />
          <ThemedText type="defaultSemiBold">Username</ThemedText>
          <ThemedText>{user.username}</ThemedText>
        </ThemedView>
      ) : (
        <ThemedText style={{ opacity: 0.6 }}>Not logged in.</ThemedText>
      )}
      <TouchableOpacity style={styles.actionButton} onPress={() => dispatch(toggleTheme())}>
        <Feather name={isDark ? 'sun' : 'moon'} size={18} color="#fff" />
        <ThemedText style={styles.actionText}>{isDark ? 'Light Mode' : 'Dark Mode'}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ff3b30' }]} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#fff" />
        <ThemedText style={styles.actionText}>Logout</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    marginBottom: 16,
  },
  subtitle: {
    opacity: 0.6,
  },
  card: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 10,
    marginBottom: 20,
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});
