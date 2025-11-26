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
  const isDark = useAppSelector((state) => state.theme.isDarkMode);
  const [teams, setTeams] = useState<CricketTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic colors based on theme
  const colors = {
    background: isDark ? '#000' : '#f8f9fa',
    cardBackground: isDark ? '#1C1C1E' : '#fff',
    text: isDark ? '#fff' : '#333',
    textSecondary: isDark ? '#999' : '#666',
    border: isDark ? '#2C2C2E' : '#e5e5e5',
  };

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
    
    // Try different image sources - prioritize badge for cleaner look
    const badgeImage = item.strTeamBadge || item.strBadge;
    const bannerImage = item.strTeamBanner || item.strBanner;
    
    console.log(`Team: ${item.strTeam}, Badge: ${badgeImage}, Banner: ${bannerImage}`);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBackground }]}
        onPress={() => handleTeamPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardRow}>
          {/* Badge on Left */}
          <View style={[styles.badgeSection, { backgroundColor: colors.background }]}>
            {badgeImage ? (
              <Image
                source={{ uri: badgeImage }}
                style={styles.badgeImage}
                resizeMode="contain"
                defaultSource={require('@/assets/images/icon.png')}
              />
            ) : (
              <View style={styles.badgePlaceholder}>
                <Feather name="shield" size={40} color="#ccc" />
              </View>
            )}
          </View>

          {/* Details on Right */}
          <View style={styles.detailsSection}>
            <View style={styles.headerRow}>
              <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={2}>
                {item.strTeam}
              </Text>
              <TouchableOpacity
                style={styles.favouriteButton}
                onPress={() => toggleFavourite(item.idTeam)}
                activeOpacity={0.7}
              >
                <Feather
                  name={isFavourite ? 'heart' : 'heart'}
                  size={20}
                  color={isFavourite ? '#FF3B30' : '#666'}
                  fill={isFavourite ? '#FF3B30' : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              {item.strCountry && (
                <View style={styles.infoItem}>
                  <Feather name="map-pin" size={12} color={colors.textSecondary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>{item.strCountry}</Text>
                </View>
              )}
              {item.intFormedYear && (
                <View style={styles.infoItem}>
                  <Feather name="calendar" size={12} color={colors.textSecondary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>{item.intFormedYear}</Text>
                </View>
              )}
            </View>

            {item.strStadium && (
              <View style={styles.infoItem}>
                <Feather name="home" size={12} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.strStadium}
                </Text>
              </View>
            )}

            {item.strDescriptionEN && (
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.strDescriptionEN}
              </Text>
            )}

            <View style={styles.viewDetailsContainer}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Feather name="chevron-right" size={14} color="#007AFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && teams.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Soccer Teams</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading teams...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Soccer Teams</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{filteredTeams.length} teams</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search teams by name, country, stadium..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color={colors.textSecondary} />
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
  cardRow: {
    flexDirection: 'row',
    padding: 12,
  },
  badgeSection: {
    width: 100,
    height: 100,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  badgeImage: {
    width: 100,
    height: 100,
  },
  badgePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  detailsSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  favouriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: 0,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 0,
    lineHeight: 20,
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  infoText: {
    fontSize: 11,
    color: '#666',
  },
  description: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
    marginTop: 6,
    marginBottom: 6,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 4,
  },
});
