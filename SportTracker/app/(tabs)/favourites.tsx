import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@redux/store';
import { getAllLeagues, League } from '@api/cricketApi';
import { useAppDispatch } from '@redux/store';
import { loadFavourites } from '@redux/slices/favouritesSlice';

export default function FavouritesScreen() {
  const favouriteLeagueIds = useAppSelector(s => s.favourites.leagues);
  const [allLeagues, setAllLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getAllLeagues();
        setAllLeagues(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    dispatch(loadFavourites());
    fetch();
  }, []);

  const favouriteLeagues = allLeagues.filter(l => favouriteLeagueIds.includes(Number(l.idLeague)));

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#ECECEC', dark: '#222' }} headerImage={<View />}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Favourites</ThemedText>
        <ThemedText style={styles.subtitle}>Your saved leagues</ThemedText>
      </ThemedView>
      {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}
      {error && <ThemedText style={{ color: '#ff3b30' }}>Failed to load favourites.</ThemedText>}
      <FlatList
        data={favouriteLeagues}
        keyExtractor={l => l.idLeague}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ThemedView style={styles.leagueCard}>
            <ThemedText type="defaultSemiBold">{item.strLeague}</ThemedText>
            <ThemedText style={styles.meta}>Cricket League</ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={!loading && !error ? (
          <ThemedText style={{ opacity: 0.6 }}>No favourite leagues yet.</ThemedText>
        ) : null}
      />
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
  leagueCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
  },
  meta: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
});
