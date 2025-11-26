import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { fetchPlayersByTeam } from '@redux/slices/playersSlice';
import { Feather } from '@expo/vector-icons';

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { players, loading, error } = useAppSelector(s => s.players);

  useEffect(() => {
    if (id) dispatch(fetchPlayersByTeam(String(id)));
  }, [id]);

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#FFF', dark: '#111' }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Players</ThemedText>
        <ThemedText>Team: {id}</ThemedText>
      </ThemedView>

      {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}
      {error && <ThemedText style={{ color: '#ff3b30' }}>Failed to load players.</ThemedText>}

      <FlatList
        data={players}
        keyExtractor={item => item.idPlayer}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/player/${item.idPlayer}`)}>
            {item.strThumb ? (
              <Image source={{ uri: item.strThumb }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}><Feather name="user" size={20} color="#666" /></View>
            )}
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{item.strPlayer}</ThemedText>
              {item.strPosition && <ThemedText style={styles.meta}>{item.strPosition}</ThemedText>}
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        )}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: { gap: 4, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 10 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, marginRight: 12, backgroundColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  meta: { fontSize: 12, opacity: 0.6, marginTop: 4 },
});
