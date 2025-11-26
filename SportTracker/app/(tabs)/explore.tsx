import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { getTeamsByLeagueId, Team } from '@api/cricketApi';
import { addTeam, removeTeam } from '@redux/slices/favouritesSlice';
import { useAppDispatch, useAppSelector } from '@redux/store';

export default function TeamsScreen() {
  const { leagueId } = useLocalSearchParams<{ leagueId?: string }>();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector(s => s.favourites.teams);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!leagueId) return;
      setLoading(true);
      setError(false);
      try {
        const data = await getTeamsByLeagueId(String(leagueId));
        setTeams(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [leagueId]);

  const toggleFavourite = (id: string) => {
    const numId = Number(id);
    if (favourites.includes(numId)) {
      dispatch(removeTeam(numId));
    } else {
      dispatch(addTeam(numId));
    }
  };

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Teams</ThemedText>
        {leagueId && <ThemedText style={styles.leagueId}>League: {leagueId}</ThemedText>}
      </ThemedView>
      {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}
      {error && <ThemedText style={{ color: '#ff3b30' }}>Failed to load teams.</ThemedText>}
      <FlatList
        data={teams}
        keyExtractor={item => item.idTeam}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => {
          const fav = favourites.includes(Number(item.idTeam));
          return (
            <View style={styles.teamRow}>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">{item.strTeam}</ThemedText>
                {item.strLeague && <ThemedText style={styles.meta}>{item.strLeague}</ThemedText>}
              </View>
              <TouchableOpacity onPress={() => toggleFavourite(item.idTeam)} style={{ padding: 4 }}>
                <Feather name="star" size={20} color={fav ? '#FFD700' : '#999'} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
      {!loading && teams.length === 0 && !error && (
        <ThemedText style={{ opacity: 0.6, marginTop: 12 }}>No teams found.</ThemedText>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    gap: 4,
  },
  leagueId: {
    opacity: 0.6,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
  },
  meta: {
    fontSize: 12,
    opacity: 0.6,
  },
});
