import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '@redux/store';
import { loadFavourites, removeTeamAsync } from '@redux/slices/favouritesSlice';

interface CricketTeam {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  strTeamBanner?: string;
  strCountry?: string;
  strLeague?: string;
  strStadium?: string;
  intFormedYear?: string;
  strDescriptionEN?: string;
}

export default function FavouritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favouriteTeamIds = useAppSelector((state) => state.favourites.teams);
  const [favouriteTeams, setFavouriteTeams] = useState<CricketTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Debug: Log the raw favourite IDs
  useEffect(() => {
    console.log('Raw favouriteTeamIds from Redux:', favouriteTeamIds);
    console.log('Unique IDs:', [...new Set(favouriteTeamIds)]);
  }, [favouriteTeamIds]);

  const fetchFavouriteTeams = async () => {
    try {
      setLoading(true);
      
      console.log('=== FAVOURITES DEBUG ===');
      console.log('Favourite Team IDs from Redux:', favouriteTeamIds);
      
      // Remove duplicate IDs first
      const uniqueFavouriteIds = [...new Set(favouriteTeamIds)];
      console.log('Unique Favourite IDs:', uniqueFavouriteIds);
      
      if (uniqueFavouriteIds.length === 0) {
        console.log('No favourite teams found');
        setFavouriteTeams([]);
        setLoading(false);
        return;
      }

      // Fetch teams from multiple leagues
      const leagueIds = ['4328', '4425', '4530', '4606'];
      let allTeams: CricketTeam[] = [];
      
      for (const leagueId of leagueIds) {
        try {
          const response = await axios.get(
            `https://www.thesportsdb.com/api/v1/json/3/lookup_all_teams.php?id=${leagueId}`
          );
          
          if (response.data.teams) {
            allTeams = [...allTeams, ...response.data.teams];
          }
        } catch (err) {
          console.log(`Failed to fetch teams for league ${leagueId}`);
        }
      }
      
      console.log(`Total teams fetched: ${allTeams.length}`);
      
      // Remove duplicates from allTeams first
      const uniqueTeams = allTeams.filter((team, index, self) =>
        team && index === self.findIndex((t) => t.idTeam === team.idTeam)
      );
      
      console.log(`Unique teams after deduplication: ${uniqueTeams.length}`);
      
      // Filter only favourite teams using unique IDs
      const filteredTeams = uniqueTeams.filter((team) =>
        team && uniqueFavouriteIds.includes(Number(team.idTeam))
      );
      
      console.log(`Filtered favourite teams: ${filteredTeams.length}`);
      console.log('Filtered teams:', filteredTeams.map(t => ({ id: t.idTeam, name: t.strTeam })));
      
      setFavouriteTeams(filteredTeams);
    } catch (error) {
      console.error('Error fetching favourite teams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    dispatch(loadFavourites());
  }, []);

  useEffect(() => {
    fetchFavouriteTeams();
  }, [favouriteTeamIds]);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Favourites screen focused, reloading favourites...');
      dispatch(loadFavourites());
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavouriteTeams();
  };

  const handleRemoveFavourite = (e: any, teamId: string) => {
    e.stopPropagation(); // Prevent card press when clicking heart
    console.log('Removing team from favourites:', teamId);
    dispatch(removeTeamAsync(Number(teamId)));
  };

  const handleTeamPress = (team: CricketTeam) => {
    router.push({
      pathname: '/team-details/[id]',
      params: {
        id: team.idTeam,
        teamData: JSON.stringify(team),
      },
    });
  };

  const renderTeamCard = ({ item }: { item: CricketTeam }) => {
    const badgeImage = item.strTeamBadge;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleTeamPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {badgeImage ? (
            <Image
              source={{ uri: badgeImage }}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Feather name="shield" size={40} color="#ccc" />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.teamName} numberOfLines={2}>
            {item.strTeam}
          </Text>

          <View style={styles.infoRow}>
            {item.strCountry && (
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={12} color="#666" />
                <Text style={styles.infoText}>{item.strCountry}</Text>
              </View>
            )}
            {item.intFormedYear && (
              <View style={styles.infoItem}>
                <Feather name="calendar" size={12} color="#666" />
                <Text style={styles.infoText}>{item.intFormedYear}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Remove from Favourites Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={(e) => handleRemoveFavourite(e, item.idTeam)}
          activeOpacity={0.7}
        >
          <Feather name="heart" size={20} color="#FF3B30" fill="#FF3B30" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="heart" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Favourite Teams</Text>
      <Text style={styles.emptySubtitle}>
        Go to Teams tab and tap the heart icon to add your favourite teams
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)/explore')}
      >
        <Text style={styles.browseButtonText}>Browse Teams</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && favouriteTeams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favourites</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading favourites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
        <Text style={styles.headerSubtitle}>
          {favouriteTeams.length} {favouriteTeams.length === 1 ? 'team' : 'teams'}
        </Text>
      </View>

      <FlatList
        data={favouriteTeams}
        renderItem={renderTeamCard}
        keyExtractor={(item, index) => `${item.idTeam}-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeImage: {
    width: 50,
    height: 50,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
