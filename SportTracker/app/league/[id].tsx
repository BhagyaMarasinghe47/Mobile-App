import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { fetchTeamsByLeague } from '@redux/slices/teamsSlice';
import { Feather } from '@expo/vector-icons';

export default function LeagueScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { teams, loading, error } = useAppSelector(s => s.teams);

  useEffect(() => {
    if (id) dispatch(fetchTeamsByLeague(String(id)));
  }, [id]);

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#F3F6F9', dark: '#111' }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Teams</ThemedText>
        <ThemedText>League: {id}</ThemedText>
      </ThemedView>

      {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}
      {error && <ThemedText style={{ color: '#ff3b30' }}>Failed to load teams.</ThemedText>}

      <FlatList
        data={teams}
        keyExtractor={item => item.idTeam}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/team/${item.idTeam}`)}>
            {item.strTeamBadge ? (
              <Image source={{ uri: item.strTeamBadge }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}><Feather name="users" size={28} color="#666" /></View>
            )}
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{item.strTeam}</ThemedText>
              {item.strStadium && <ThemedText style={styles.meta}>{item.strStadium}</ThemedText>}
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
  logo: { width: 56, height: 56, borderRadius: 6, marginRight: 12 },
  logoPlaceholder: { width: 56, height: 56, borderRadius: 6, marginRight: 12, backgroundColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  meta: { fontSize: 12, opacity: 0.6, marginTop: 4 },
});
