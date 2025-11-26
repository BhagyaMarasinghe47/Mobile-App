// Home Screen with Cricket Leagues, Events, Teams and Favourites
import React, { useEffect, useMemo, useRef } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
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

  const teamsWithStatus = useMemo(() => {
    return teams.map((team) => ({
      ...team,
      status: getRandomStatus(),
    }));
  }, [teams]);

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

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>
          Welcome back{user ? `, ${user.firstName || user.username}` : ''}! 👋
        </Text>
        <Text style={styles.subtitle}>Explore Cricket Teams & Events</Text>
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push('/(tabs)/profile')}
      >
        <Feather name="user" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  const renderUpcomingEvents = () => {
    if (eventsLoading && events.length === 0) {
      return (
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
        </View>
      );
    }

    if (events.length === 0) {
      return null;
    }

    return (
      <Animated.View style={[styles.eventsSection, { opacity: eventsFadeAnim }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={refetchEvents}>
            <Feather name="refresh-cw" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {events.slice(0, 5).map((event) => (
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favourite Leagues</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/favourites')}>
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
    if (leaguesLoading && leagues.length === 0) {
      return (
        <View style={styles.leaguesSection}>
          <Text style={styles.sectionTitle}>Cricket Leagues</Text>
          <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
        </View>
      );
    }

    if (leagues.length === 0) {
      return null;
    }

    return (
      <Animated.View style={[styles.leaguesSection, { opacity: leaguesFadeAnim }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cricket Leagues</Text>
          <TouchableOpacity onPress={refetchLeagues}>
            <Feather name="refresh-cw" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.leaguesGrid}>
          {leagues.slice(0, 6).map((league) => (
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
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading cricket teams...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && teams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={teamsWithStatus}
        renderItem={renderItem}
        keyExtractor={(item) => item.idTeam}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderUpcomingEvents()}
            {renderFavouriteLeagues()}
            {renderCricketLeagues()}
            {renderTeamsSection()}
          </>
        }
        ListEmptyComponent={renderEmptyState}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
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
});
