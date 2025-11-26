import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { addTeamAsync, removeTeamAsync } from '@redux/slices/favouritesSlice';

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

export default function TeamsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.teams);
  const [teams, setTeams] = useState<CricketTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTeams = async () => {
    try {
      setLoading(true);
      console.log('Fetching soccer teams...');
      
      // Fetch teams from multiple popular cricket leagues
      const leagueIds = [
        '4328', // International Cricket
        '4425', // Big Bash League
        '4530', // Indian Premier League
        '4606', // Pakistan Super League
      ];
      
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
      
      // Remove duplicates based on team ID
      const uniqueTeams = allTeams.filter((team, index, self) =>
        team !== null && index === self.findIndex((t) => t.idTeam === team.idTeam)
      );
      
      console.log('Total unique teams found:', uniqueTeams.length);
      console.log('Sample team data:', uniqueTeams[0]);
      setTeams(uniqueTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeams();
  };

  // Filter teams based on search query
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const query = searchQuery.toLowerCase();
    return teams.filter((team) =>
      team.strTeam?.toLowerCase().includes(query) ||
      team.strCountry?.toLowerCase().includes(query) ||
      team.strStadium?.toLowerCase().includes(query)
    );
  }, [teams, searchQuery]);

  const toggleFavourite = (teamId: string) => {
    const numId = Number(teamId);
    console.log('Toggle favourite for team:', numId);
    console.log('Current favourites:', favourites);
    if (favourites.includes(numId)) {
      console.log('Removing from favourites');
      dispatch(removeTeamAsync(numId));
    } else {
      console.log('Adding to favourites');
      dispatch(addTeamAsync(numId));
    }
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
    const isFavourite = favourites.includes(Number(item.idTeam));
    
    // Try different image sources
    const bannerImage = item.strTeamBanner;
    const badgeImage = item.strTeamBadge;
    
    console.log(`Team: ${item.strTeam}, Banner: ${bannerImage}, Badge: ${badgeImage}`);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleTeamPress(item)}
        activeOpacity={0.9}
      >
        {/* Main Image Area */}
        <View style={styles.imageContainer}>
          {badgeImage ? (
            <View style={styles.badgeCenteredContainer}>
              <Image
                source={{ uri: badgeImage }}
                style={styles.centeredBadgeImage}
                resizeMode="contain"
              />
            </View>
          ) : bannerImage ? (
            <Image
              source={{ uri: bannerImage }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderBanner}>
              <Feather name="shield" size={40} color="#ccc" />
            </View>
          )}
          
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={() => toggleFavourite(item.idTeam)}
            activeOpacity={0.7}
          >
            <Feather
              name={isFavourite ? 'heart' : 'heart'}
              size={18}
              color={isFavourite ? '#FF3B30' : '#fff'}
              fill={isFavourite ? '#FF3B30' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.teamName} numberOfLines={2}>
            {item.strTeam}
          </Text>

          <View style={styles.infoRow}>
            {item.strCountry && (
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={14} color="#666" />
                <Text style={styles.infoText}>{item.strCountry}</Text>
              </View>
            )}
            {item.intFormedYear && (
              <View style={styles.infoItem}>
                <Feather name="calendar" size={14} color="#666" />
                <Text style={styles.infoText}>{item.intFormedYear}</Text>
              </View>
            )}
          </View>

          {item.strStadium && (
            <View style={styles.infoItem}>
              <Feather name="home" size={14} color="#666" />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.strStadium}
              </Text>
            </View>
          )}

          {item.strDescriptionEN && (
            <Text style={styles.description} numberOfLines={2}>
              {item.strDescriptionEN}
            </Text>
          )}

          <View style={styles.viewDetailsContainer}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Feather name="chevron-right" size={14} color="#007AFF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && teams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Soccer Teams</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading teams...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Soccer Teams</Text>
        <Text style={styles.headerSubtitle}>{filteredTeams.length} teams</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teams by name, country, stadium..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTeams}
        renderItem={renderTeamCard}
        keyExtractor={(item) => item.idTeam}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="search" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No teams found matching your search' : 'No teams available'}
            </Text>
          </View>
        }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBanner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCenteredContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  centeredBadgeImage: {
    width: 100,
    height: 100,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  favouriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -24,
    left: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeImage: {
    width: 45,
    height: 45,
  },
  contentContainer: {
    padding: 12,
    paddingTop: 32,
  },
  teamName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
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
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
    marginTop: 8,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  viewDetailsText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 4,
  },
});
