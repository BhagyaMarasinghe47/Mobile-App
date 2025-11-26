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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

export default function EventDetailsScreen() {
  const { id, eventData } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
        </View>

        <View style={styles.content}>
          {/* Event Title */}
          <Text style={styles.eventTitle}>{event.strEvent}</Text>
          
          {/* Teams */}
          <View style={styles.teamsContainer}>
            <View style={styles.teamBox}>
              <Feather name="shield" size={40} color="#007AFF" />
              <Text style={styles.teamName}>{event.strHomeTeam}</Text>
            </View>
            
            <Text style={styles.vsText}>VS</Text>
            
            <View style={styles.teamBox}>
              <Feather name="shield" size={40} color="#FF3B30" />
              <Text style={styles.teamName}>{event.strAwayTeam}</Text>
            </View>
          </View>

          {/* Scores if available */}
          {event.intHomeScore !== null && event.intAwayScore !== null && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {event.intHomeScore} - {event.intAwayScore}
              </Text>
              <Text style={styles.scoreLabel}>Final Score</Text>
            </View>
          )}

          {/* Event Info */}
          <View style={styles.infoGrid}>
            {event.dateEvent && (
              <View style={styles.infoCard}>
                <Feather name="calendar" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formatDate(event.dateEvent)}</Text>
              </View>
            )}

            {event.strTime && (
              <View style={styles.infoCard}>
                <Feather name="clock" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{event.strTime}</Text>
              </View>
            )}

            {event.strVenue && (
              <View style={styles.infoCard}>
                <Feather name="map-pin" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{event.strVenue}</Text>
              </View>
            )}

            {event.strLeague && (
              <View style={styles.infoCard}>
                <Feather name="award" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>League</Text>
                <Text style={styles.infoValue}>{event.strLeague}</Text>
              </View>
            )}

            {event.strSeason && (
              <View style={styles.infoCard}>
                <Feather name="calendar" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Season</Text>
                <Text style={styles.infoValue}>{event.strSeason}</Text>
              </View>
            )}

            {event.strStatus && (
              <View style={styles.infoCard}>
                <Feather name="info" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{event.strStatus}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {event.strDescriptionEN && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <Text style={styles.description}>{event.strDescriptionEN}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  teamBox: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  vsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#999',
    marginHorizontal: 10,
  },
  scoreContainer: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    opacity: 0.9,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
});
