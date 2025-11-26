import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPlayerById } from '@api/cricketApi';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { addPlayerAsync, removePlayerAsync } from '@redux/slices/favouritesSlice';
import { Feather } from '@expo/vector-icons';

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const favourites = useAppSelector(s => s.favourites.players);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const p = await getPlayerById(String(id));
        setPlayer(p);
      } catch (e) {
        Alert.alert('Error', 'Failed to load player');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleFav = () => {
    const pid = Number(id);
    if (favourites.includes(pid)) dispatch(removePlayerAsync(pid));
    else dispatch(addPlayerAsync(pid));
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  if (!player) return <ThemedText style={{ marginTop: 24 }}>No player data.</ThemedText>;

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#FFF', dark: '#111' }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{player.strPlayer}</ThemedText>
        <ThemedText style={styles.meta}>{player.strNationality}</ThemedText>
      </ThemedView>

      {player.strThumb ? (
        <Image source={{ uri: player.strThumb }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}><Feather name="user" size={60} color="#666" /></View>
      )}

      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold">Position</ThemedText>
        <ThemedText>{player.strPosition || 'N/A'}</ThemedText>
        <ThemedText type="defaultSemiBold">Description</ThemedText>
        <ThemedText>{player.strDescriptionEN || 'No description available.'}</ThemedText>
      </ThemedView>

      <TouchableOpacity style={styles.favButton} onPress={toggleFav}>
        <Feather name={favourites.includes(Number(id)) ? 'star' : 'star'} size={18} color="#fff" />
        <ThemedText style={styles.favText}>{favourites.includes(Number(id)) ? 'Remove Favourite' : 'Add to Favourites'}</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6, marginBottom: 12 },
  meta: { opacity: 0.7 },
  photo: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12 },
  photoPlaceholder: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center', justifyContent: 'center' },
  card: { padding: 12, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 8, marginBottom: 12, gap: 8 },
  favButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  favText: { color: '#fff', fontWeight: '600' },
});
