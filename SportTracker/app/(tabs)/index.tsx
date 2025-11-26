import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, Alert, FlatList, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { fetchLeagues } from '@redux/slices/leaguesSlice';
import { addLeagueAsync, removeLeagueAsync, loadFavourites } from '@redux/slices/favouritesSlice';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { logout } from '@redux/slices/authSlice';
import { addLeague, removeLeague } from '@redux/slices/favouritesSlice';
import type { League } from '@api/cricketApi';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const leaguesState = useAppSelector(s => s.leagues);
  const favourites = useAppSelector(s => s.favourites);
  const leagues = leaguesState.leagues as League[];
  const leaguesLoading = leaguesState.loading;
  const leaguesError = !!leaguesState.error;

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Clear AsyncStorage
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            
            // Clear Redux state
            dispatch(logout());
            
            // Navigate to login
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  useEffect(() => {
    dispatch(loadFavourites());
    dispatch(fetchLeagues());
  }, []);

  const toggleFavourite = (id: number, isFav: boolean) => {
    if (isFav) dispatch(removeLeagueAsync(id));
    else dispatch(addLeagueAsync(id));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome{user ? `, ${user.firstName || user.username}` : ''}!</ThemedText>
        <HelloWave />
      </ThemedView>

      {user && (
        <ThemedView style={styles.userInfoContainer}>
          <ThemedText type="subtitle">User Information</ThemedText>
          <ThemedText>Email: {user.email}</ThemedText>
          <ThemedText>Username: {user.username}</ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#fff" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="subtitle">Cricket Leagues</ThemedText>
      </ThemedView>
      {leaguesLoading && (
        <ActivityIndicator style={{ marginVertical: 12 }} />
      )}
      {leaguesError && (
        <ThemedText style={{ color: '#ff3b30' }}>Failed to load leagues.</ThemedText>
      )}
      <FlatList
        data={leagues}
        keyExtractor={(item) => item.idLeague}
        renderItem={({ item }) => {
          const fav = favourites.leagues.includes(Number(item.idLeague));
          return (
            <TouchableOpacity
              style={styles.leagueRow}
              onPress={() => router.push({ pathname: '/(tabs)/explore', params: { leagueId: item.idLeague } })}
            >
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">{item.strLeague}</ThemedText>
                <ThemedText style={styles.leagueSport}>Cricket</ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavourite(Number(item.idLeague), fav)}
                style={styles.favButton}
              >
                <Feather name={fav ? 'star' : 'star'} size={20} color={fav ? '#FFD700' : '#999'} />
              </TouchableOpacity>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={{ marginBottom: 24 }}
      />

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userInfoContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
  },
  leagueSport: {
    fontSize: 12,
    opacity: 0.6,
  },
  favButton: {
    marginHorizontal: 12,
  },
  separator: {
    height: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
