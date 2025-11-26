// Home Screen with Soccer Teams, Players, Events and Leagues Search
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useCricketTeams } from '@/hooks/useCricketTeams';
import { useUpcomingEvents } from '@/hooks/useUpcomingEvents';
import { useCricketLeagues } from '@/hooks/useCricketLeagues';
import { CricketCard } from '@/components/CricketCard';
import { EventCard } from '@/components/EventCard';
import { LeagueCard } from '@/components/LeagueCard';
import type { CricketTeam, TeamStatus } from '@/src/types/cricket';
import { useAppSelector } from '@redux/store';

const STATUS_OPTIONS: TeamStatus[] = ['Active', 'Popular', 'Upcoming'];

const getRandomStatus = (): TeamStatus => {
  return STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
};

export default function HomeScreen() {
  const router = useRouter();
  const { teams, loading, error, refetch } = useCricketTeams();
  const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useUpcomingEvents();
  const { leagues, loading: leaguesLoading, error: leaguesError, refetch: refetchLeagues } = useCricketLeagues();
  const { user } = useAppSelector((state) => state.auth);
  const favourites = useAppSelector((state) => state.favourites);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const eventsFadeAnim = useRef(new Animated.Value(0)).current;
  const leaguesFadeAnim = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>({
    teams: [],
    players: [],
    events: [],
    leagues: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [popularTeams, setPopularTeams] = useState<any[]>([]);
  const [popularTeamsLoading, setPopularTeamsLoading] = useState(false);
  const popularTeamsFadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch popular teams from English Premier League
  const fetchPopularTeams = async () => {
    setPopularTeamsLoading(true);
    try {
      // Fetch teams from English Premier League (ID: 4328)
      const response = await axios.get('https://www.thesportsdb.com/api/v1/json/3/lookup_all_teams.php?id=4328');
      if (response.data.teams) {
        // Get first 10 teams
        setPopularTeams(response.data.teams.slice(0, 10));
        
        // Fade in animation
        Animated.timing(popularTeamsFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error('Error fetching popular teams:', error);
    } finally {
      setPopularTeamsLoading(false);
    }
  };

  // Search function using TheSportsDB API
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ teams: [], players: [], events: [], leagues: [] });
      return;
    }

    setIsSearching(true);
    console.log('=== STARTING SEARCH ===');
    console.log('Search Query:', query);
    
    try {
      const searchTerm = query.trim();
      
      // Search teams, players, events, and leagues in parallel
      const [teamsRes, playersRes, eventsRes, leaguesRes] = await Promise.all([
        axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${searchTerm}`).catch(() => ({ data: { teams: null } })),
        axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchTerm}`).catch(() => ({ data: { player: null } })),
        axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${searchTerm}`).catch(() => ({ data: { event: null } })),
        axios.get(`https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?s=Soccer`).catch(() => ({ data: { countries: null } }))
      ]);

      console.log('Raw API Responses:');
      console.log('Teams:', teamsRes.data.teams ? teamsRes.data.teams.length : 0);
      console.log('Players:', playersRes.data.player ? playersRes.data.player.length : 0);
      console.log('Events:', eventsRes.data.event ? eventsRes.data.event.length : 0);
      console.log('Leagues:', leaguesRes.data.countries ? leaguesRes.data.countries.length : 0);

      // Filter only soccer/football teams
      const soccerTeams = (teamsRes.data.teams || []).filter((team: any) => 
        team && (team.strSport === 'Soccer' || team.strSport === 'Football')
      );

      // Filter only soccer/football players
      const soccerPlayers = (playersRes.data.player || []).filter((player: any) => 
        player && (player.strSport === 'Soccer' || player.strSport === 'Football')
      );

      // Filter only soccer/football events
      const soccerEvents = (eventsRes.data.event || []).filter((event: any) => 
        event && (event.strSport === 'Soccer' || event.strSport === 'Football')
      );

      // Filter leagues by search query
      const matchedLeagues = (leaguesRes.data.countries || []).filter((league: any) => 
        league && league.strLeague?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log('Filtered Soccer Results:');
      console.log('Soccer Teams:', soccerTeams.length);
      console.log('Soccer Players:', soccerPlayers.length);
      console.log('Soccer Events:', soccerEvents.length);
      console.log('Matched Leagues:', matchedLeagues.length);

      setSearchResults({
        teams: soccerTeams,
        players: soccerPlayers,
        events: soccerEvents,
        leagues: matchedLeagues,
      });

      console.log('Search Results Set Successfully');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
      console.log('=== SEARCH COMPLETE ===');
    }
  };

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 500);
    } else {
      setSearchResults({ teams: [], players: [], events: [], leagues: [] });
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Debug logging
  useEffect(() => {
    console.log('Events count:', events.length, 'Loading:', eventsLoading);
    console.log('Leagues count:', leagues.length, 'Loading:', leaguesLoading);
    console.log('Teams count:', teams.length, 'Loading:', loading);
  }, [events, leagues, teams, eventsLoading, leaguesLoading, loading]);

  useEffect(() => {
    if (!loading && teams.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, teams]);

  useEffect(() => {
    if (!eventsLoading && events.length > 0) {
      Animated.timing(eventsFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [eventsLoading, events]);

  useEffect(() => {
    if (!leaguesLoading && leagues.length > 0) {
      Animated.timing(leaguesFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [leaguesLoading, leagues]);

  useEffect(() => {
    fetchPopularTeams();
  }, []);

  const teamsWithStatus = useMemo(() => {
    return teams.map((team) => ({
      ...team,
      status: getRandomStatus(),
    }));
  }, [teams]);

  // Filter teams, leagues, and events based on search query
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teamsWithStatus;
    const query = searchQuery.toLowerCase();
    return teamsWithStatus.filter((team) =>
      team.strTeam?.toLowerCase().includes(query) ||
      team.strCountry?.toLowerCase().includes(query)
    );
  }, [teamsWithStatus, searchQuery]);

  const filteredLeagues = useMemo(() => {
    if (!searchQuery.trim()) return leagues;
    const query = searchQuery.toLowerCase();
    return leagues.filter((league) =>
      league.strLeague?.toLowerCase().includes(query) ||
      league.strCountry?.toLowerCase().includes(query)
    );
  }, [leagues, searchQuery]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const query = searchQuery.toLowerCase();
    return events.filter((event) =>
      event.strEvent?.toLowerCase().includes(query) ||
      event.strHomeTeam?.toLowerCase().includes(query) ||
      event.strAwayTeam?.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  const handleCardPress = (team: CricketTeam) => {
    router.push({
      pathname: '/details/[id]',
      params: {
        id: team.idTeam,
        teamData: JSON.stringify(team),
      },
    });
  };

  const handleEventPress = (eventId: string) => {
    console.log('Event pressed:', eventId);
  };

  const handleLeaguePress = (leagueId: string) => {
    router.push({
      pathname: '/(tabs)/explore',
      params: { leagueId },
    });
  };

  const handleRefresh = () => {
    refetch();
    refetchEvents();
    refetchLeagues();
  };

  const renderHeroSection = () => (
    <ImageBackground
      source={require('@/assets/images/Football game Photos .jpg')}
      style={styles.heroBackground}
      imageStyle={styles.heroImage}
    >
      <View style={styles.heroOverlay}>
        <View style={styles.heroContent}>
          <View style={styles.headerRow}>
            <View style={styles.textContainer}>
              <Text style={styles.greeting}>
                Welcome back{user ? `, ${user.firstName || user.username}` : ''}! 👋
              </Text>
              <Text style={styles.subtitle}>Explore Soccer Teams & Events</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Feather name="user" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Teams, Players, Leagues, Events"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {isSearching && <ActivityIndicator size="small" color="#007AFF" />}
            {searchQuery.length > 0 && !isSearching && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );

  const renderSearchResults = () => {
    if (!searchQuery.trim()) return null;

    // Show loading state while searching
    if (isSearching) {
      return (
        <View style={styles.searchLoadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.searchLoadingText}>Searching...</Text>
        </View>
      );
    }

    const hasResults = searchResults.teams.length > 0 || 
                      searchResults.players.length > 0 || 
                      searchResults.events.length > 0 || 
                      searchResults.leagues.length > 0;

    if (!hasResults) {
      return (
        <View style={styles.searchEmptyState}>
          <Feather name="search" size={60} color="#ccc" />
          <Text style={styles.searchEmptyText}>No results found for "{searchQuery}"</Text>
          <Text style={styles.searchEmptySubtext}>Try searching for teams like "Arsenal", players like "Messi", or leagues like "Premier League"</Text>
        </View>
      );
    }

    return (
      <View style={styles.searchResultsContainer}>
        {/* Search Results: Teams */}
        {searchResults.teams.length > 0 && (
          <View style={styles.searchSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Teams ({searchResults.teams.length})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.searchScroll}>
              {searchResults.teams.map((team: any) => {
                const badgeImage = team.strTeamBadge || team.strBadge || team.strTeamLogo || null;
                return (
                  <TouchableOpacity
                    key={team.idTeam}
                    style={styles.searchCard}
                    onPress={() => router.push({
                      pathname: '/team-details/[id]',
                      params: { id: team.idTeam, teamData: JSON.stringify(team) }
                    })}
                  >
                    {badgeImage ? (
                      <Image
                        source={{ uri: badgeImage }}
                        style={styles.searchCardImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Feather name="shield" size={40} color="#007AFF" />
                    )}
                    <Text style={styles.searchCardTitle} numberOfLines={2}>{team.strTeam}</Text>
                    <Text style={styles.searchCardSubtitle}>{team.strCountry}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Search Results: Players */}
        {searchResults.players.length > 0 && (
          <View style={styles.searchSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Players ({searchResults.players.length})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.searchScroll}>
              {searchResults.players.map((player: any) => (
                <TouchableOpacity
                  key={player.idPlayer}
                  style={styles.searchCard}
                  onPress={() => router.push({
                    pathname: '/player-details/[id]',
                    params: { id: player.idPlayer, playerData: JSON.stringify(player) }
                  })}
                >
                  <Feather name="user" size={40} color="#28a745" />
                  <Text style={styles.searchCardTitle} numberOfLines={2}>{player.strPlayer}</Text>
                  <Text style={styles.searchCardSubtitle}>{player.strTeam || player.strNationality}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search Results: Events */}
        {searchResults.events.length > 0 && (
          <View style={styles.searchSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Events ({searchResults.events.length})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.searchScroll}>
              {searchResults.events.map((event: any) => (
                <TouchableOpacity
                  key={event.idEvent}
                  style={styles.searchCard}
                  onPress={() => router.push({
                    pathname: '/event-details/[id]',
                    params: { id: event.idEvent, eventData: JSON.stringify(event) }
                  })}
                >
                  <Feather name="calendar" size={40} color="#ff6347" />
                  <Text style={styles.searchCardTitle} numberOfLines={2}>{event.strEvent}</Text>
                  <Text style={styles.searchCardSubtitle}>{event.dateEvent}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search Results: Leagues */}
        {searchResults.leagues.length > 0 && (
          <View style={styles.searchSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Leagues ({searchResults.leagues.length})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.searchScroll}>
              {searchResults.leagues.map((league: any) => (
                <TouchableOpacity
                  key={league.idLeague}
                  style={styles.searchCard}
                  onPress={() => handleLeaguePress(league.idLeague)}
                >
                  <Feather name="award" size={40} color="#ffc107" />
                  <Text style={styles.searchCardTitle} numberOfLines={2}>{league.strLeague}</Text>
                  <Text style={styles.searchCardSubtitle}>{league.strCountry}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderPopularTeams = () => {
    if (popularTeamsLoading && popularTeams.length === 0) {
      return (
        <View style={styles.popularTeamsSection}>
          <Text style={styles.sectionTitle}>Popular Teams (Loading...)</Text>
          <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
        </View>
      );
    }

    if (popularTeams.length === 0) {
      return null;
    }

    return (
      <Animated.View style={[styles.popularTeamsSection, { opacity: popularTeamsFadeAnim }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Teams</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularTeamsScroll}
        >
          {popularTeams.map((team) => (
            <TouchableOpacity
              key={team.idTeam}
              style={styles.popularTeamCard}
              onPress={() => router.push({
                pathname: '/team-details/[id]',
                params: { id: team.idTeam, teamData: JSON.stringify(team) }
              })}
            >
              {team.strBadge ? (
                <View style={styles.popularTeamImageContainer}>
                  <Image
                    source={{ uri: team.strBadge }}
                    style={styles.popularTeamImage}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={[styles.popularTeamImageContainer, styles.popularTeamImagePlaceholder]}>
                  <Feather name="shield" size={40} color="#ccc" />
                </View>
              )}
              <Text style={styles.popularTeamName} numberOfLines={2}>{team.strTeam}</Text>
              <Text style={styles.popularTeamLeague} numberOfLines={1}>{team.strLeague}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderUpcomingEvents = () => {
    if (eventsLoading && filteredEvents.length === 0) {
      return (
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Upcoming Events (Loading...)</Text>
          <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
        </View>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={{ color: '#999', marginLeft: 16, marginTop: 10 }}>
            {searchQuery ? 'No matching events found' : 'No upcoming events'}
          </Text>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.eventsSection, { opacity: eventsFadeAnim }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events ({filteredEvents.length})</Text>
          <TouchableOpacity onPress={refetchEvents}>
            <Feather name="refresh-cw" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {filteredEvents.slice(0, 5).map((event) => (
            <View key={event.idEvent} style={styles.eventCardWrapper}>
              <EventCard
                eventName={event.strEvent}
                homeTeam={event.strHomeTeam}
                awayTeam={event.strAwayTeam}
                date={event.dateEvent}
                time={event.strTime}
                venue={event.strVenue}
                onPress={() => handleEventPress(event.idEvent)}
              />
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderFavouriteLeagues = () => {
    const favouriteLeagues = leagues.filter(league => 
      favourites.leagues.includes(Number(league.idLeague))
    ).slice(0, 5);

    if (favouriteLeagues.length === 0) {
      return null;
    }

    return (
      <Animated.View style={[styles.favouritesSection, { opacity: leaguesFadeAnim }]}>
        <View style={styles.sectionHeaderCentered}>
          <Text style={styles.sectionTitle}>Favourite Leagues</Text>
          <TouchableOpacity style={styles.sectionHeaderSeeAll} onPress={() => router.push('/(tabs)/favourites')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.leaguesScroll}
        >
          {favouriteLeagues.map((league) => (
            <View key={league.idLeague} style={styles.leagueCardWrapper}>
              <LeagueCard
                image={league.strBadge || league.strLogo}
                title={league.strLeague}
                country={league.strCountry}
                year={league.intFormedYear}
                onPress={() => handleLeaguePress(league.idLeague)}
              />
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderCricketLeagues = () => {
    if (leaguesLoading && filteredLeagues.length === 0) {
      return (
        <View style={styles.leaguesSection}>
          <Text style={styles.sectionTitle}>Cricket Leagues (Loading...)</Text>
          <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
        </View>
      );
    }

    if (filteredLeagues.length === 0) {
      return (
        <View style={styles.leaguesSection}>
          <Text style={styles.sectionTitle}>Cricket Leagues</Text>
          <Text style={{ color: '#999', marginTop: 10 }}>
            {searchQuery ? 'No matching leagues found' : 'No leagues available'}
          </Text>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.leaguesSection, { opacity: leaguesFadeAnim }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cricket Leagues ({filteredLeagues.length})</Text>
          <TouchableOpacity onPress={refetchLeagues}>
            <Feather name="refresh-cw" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.leaguesGrid}>
          {filteredLeagues.slice(0, 6).map((league) => (
            <LeagueCard
              key={league.idLeague}
              image={league.strBadge || league.strLogo}
              title={league.strLeague}
              country={league.strCountry}
              year={league.intFormedYear}
              onPress={() => handleLeaguePress(league.idLeague)}
            />
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderTeamsSection = () => (
    <View style={styles.teamsSection}>
      <Text style={styles.sectionTitle}>Cricket Teams</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="inbox" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No cricket teams found</Text>
      <Text style={styles.emptySubtext}>Pull down to refresh</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Feather name="alert-circle" size={64} color="#ff3b30" />
      <Text style={styles.errorText}>Failed to load teams</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: CricketTeam & { status: TeamStatus } }) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          animatedStyle,
          { opacity: loading ? 0 : fadeAnim },
        ]}
      >
        <CricketCard
          image={item.strTeamBadge}
          title={item.strTeam}
          description={item.strDescriptionEN}
          status={item.status}
          onPress={() => handleCardPress(item)}
        />
      </Animated.View>
    );
  };

  if (loading && teams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeroSection()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading soccer teams...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && teams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeroSection()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={searchQuery.trim() ? [] : filteredTeams}
        renderItem={renderItem}
        keyExtractor={(item) => item.idTeam}
        numColumns={2}
        columnWrapperStyle={searchQuery.trim() ? undefined : styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {renderHeroSection()}
            {searchQuery.trim() ? (
              renderSearchResults()
            ) : (
              <>
                {renderUpcomingEvents()}
                {renderPopularTeams()}
              </>
            )}
          </>
        }
        ListEmptyComponent={null}
        refreshControl={
          <RefreshControl
            refreshing={loading || eventsLoading || leaguesLoading}
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
  heroBackground: {
    width: '100%',
    minHeight: 280,
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroImage: {
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    width: '100%',
    minHeight: 280,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    marginBottom: 0,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsSection: {
    backgroundColor: '#fff',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  popularTeamsSection: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  popularTeamsScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  popularTeamCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  popularTeamImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  popularTeamImagePlaceholder: {
    backgroundColor: '#f0f0f0',
  },
  popularTeamImage: {
    width: 60,
    height: 60,
  },
  popularTeamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  popularTeamLeague: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeaderCentered: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sectionHeaderSeeAll: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  eventsScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  eventCardWrapper: {
    marginRight: 8,
  },
  teamsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  favouritesSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  leaguesSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  leaguesScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  leagueCardWrapper: {
    marginRight: 8,
  },
  leaguesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  searchResultsContainer: {
    paddingBottom: 20,
  },
  searchSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  searchCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  searchCardImage: {
    width: 60,
    height: 60,
  },
  searchCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  searchCardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  searchEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  searchEmptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  searchEmptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  searchLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  searchLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
