import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useAppSelector } from '@/src/redux/store';

export default function EventDetailsScreen() {
  const { id, eventData } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const isDark = useAppSelector((state) => state.theme.isDarkMode);
  const colors = {
    background: isDark ? '#000' : '#f8f9fa',
    cardBackground: isDark ? '#1C1C1E' : '#fff',
    text: isDark ? '#fff' : '#333',
    textSecondary: isDark ? '#999' : '#666',
    border: isDark ? '#2C2C2E' : '#e5e5e5',
  };

  useEffect(() => {
    if (eventData) {
      try {
        setEvent(JSON.parse(eventData as string));
        setLoading(false);
      } catch (e) {
        fetchEventDetails();
      }
    } else {
      fetchEventDetails();
    }
  }, [id, eventData]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${id}`
      );
      if (response.data.events && response.data.events.length > 0) {
        setEvent(response.data.events[0]);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const openVideo = () => {
    if (event?.strVideo) {
      Linking.openURL(event.strVideo);
    }
  };

  const isFinished = event?.strStatus?.toLowerCase().includes('finished');
  const displayImage = event?.strPoster || event?.strBanner || event?.strSquare || event?.strThumb;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={60} color="#ff3b30" />
          <Text style={[styles.errorText, { color: colors.text }]}>Event not found</Text>
          <TouchableOpacity style={styles.backButtonError} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        {displayImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: displayImage }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.backButtonOverlay}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.contentContainer}>
          {/* Event Title */}
          <View style={[styles.titleSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>{event.strEvent}</Text>
            <View style={[styles.statusBadge, isFinished ? styles.finishedBadge : styles.upcomingBadge]}>
              <Text style={styles.statusText}>{isFinished ? 'Match Finished' : 'Upcoming Match'}</Text>
            </View>
          </View>

          {/* Teams Section */}
          <View style={[styles.teamsSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.teamsRow}>
              {/* Home Team */}
              <View style={styles.teamBox}>
                {event.strHomeTeamBadge ? (
                  <Image
                    source={{ uri: event.strHomeTeamBadge }}
                    style={styles.teamBadgeLarge}
                    resizeMode="contain"
                  />
                ) : (
                  <Feather name="shield" size={60} color="#007AFF" />
                )}
                <Text style={[styles.teamNameLarge, { color: colors.text }]}>
                  {event.strHomeTeam}
                </Text>
                {event.intHomeScore !== undefined && event.intHomeScore !== null && (
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLarge}>{event.intHomeScore}</Text>
                  </View>
                )}
              </View>

              {/* VS */}
              <View style={styles.vsSection}>
                <Text style={styles.vsLarge}>VS</Text>
              </View>

              {/* Away Team */}
              <View style={styles.teamBox}>
                {event.strAwayTeamBadge ? (
                  <Image
                    source={{ uri: event.strAwayTeamBadge }}
                    style={styles.teamBadgeLarge}
                    resizeMode="contain"
                  />
                ) : (
                  <Feather name="shield" size={60} color="#007AFF" />
                )}
                <Text style={[styles.teamNameLarge, { color: colors.text }]}>
                  {event.strAwayTeam}
                </Text>
                {event.intAwayScore !== undefined && event.intAwayScore !== null && (
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLarge}>{event.intAwayScore}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Match Information */}
          <View style={[styles.infoSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Match Information</Text>
            
            {event.strLeague && (
              <View style={styles.infoRow}>
                <Feather name="award" size={20} color="#007AFF" />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>League</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{event.strLeague}</Text>
                </View>
              </View>
            )}

            {event.dateEvent && (
              <View style={styles.infoRow}>
                <Feather name="calendar" size={20} color="#007AFF" />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Date</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{formatDate(event.dateEvent)}</Text>
                </View>
              </View>
            )}

            {event.strTime && (
              <View style={styles.infoRow}>
                <Feather name="clock" size={20} color="#007AFF" />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Time</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{event.strTime}</Text>
                </View>
              </View>
            )}

            {event.strVenue && (
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={20} color="#007AFF" />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Venue</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{event.strVenue}</Text>
                  {event.strCity && (
                    <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
                      {event.strCity}{event.strCountry ? `, ${event.strCountry}` : ''}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {event.strSeason && (
              <View style={styles.infoRow}>
                <Feather name="flag" size={20} color="#007AFF" />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Season</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{event.strSeason}</Text>
                </View>
              </View>
            )}

            {event.intRound && (
              <View style={styles.infoRow}>
                <Feather name="hash" size={20} color="#007AFF" />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Round</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>Round {event.intRound}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          {event.strDescriptionEN && (
            <View style={[styles.descriptionSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                {event.strDescriptionEN}
              </Text>
            </View>
          )}

          {/* Video Highlights */}
          {event.strVideo && isFinished && (
            <TouchableOpacity
              style={styles.videoButton}
              onPress={openVideo}
            >
              <Feather name="youtube" size={24} color="#fff" />
              <Text style={styles.videoButtonText}>Watch Highlights</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonError: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  titleSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  finishedBadge: {
    backgroundColor: '#34C759',
  },
  upcomingBadge: {
    backgroundColor: '#007AFF',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  teamsSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
  },
  teamBadgeLarge: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  teamNameLarge: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreBox: {
    marginTop: 4,
  },
  scoreLarge: {
    fontSize: 36,
    fontWeight: '700',
    color: '#007AFF',
  },
  vsSection: {
    paddingHorizontal: 16,
  },
  vsLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: '#999',
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  descriptionSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
