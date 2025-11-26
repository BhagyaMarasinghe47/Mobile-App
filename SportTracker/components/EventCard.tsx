import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface EventCardProps {
  eventName: string;
  homeTeam?: string;
  awayTeam?: string;
  date?: string;
  time?: string;
  venue?: string;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  eventName,
  homeTeam,
  awayTeam,
  date,
  time,
  venue,
  onPress,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Feather name="calendar" size={16} color="#fff" />
          <Text style={styles.badgeText}>Upcoming</Text>
        </View>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.eventName} numberOfLines={2}>
          {eventName}
        </Text>

        {(homeTeam || awayTeam) && (
          <View style={styles.teamsContainer}>
            <View style={styles.teamRow}>
              <Text style={styles.teamLabel}>Home:</Text>
              <Text style={styles.teamName} numberOfLines={1}>
                {homeTeam || 'TBA'}
              </Text>
            </View>
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <View style={styles.teamRow}>
              <Text style={styles.teamLabel}>Away:</Text>
              <Text style={styles.teamName} numberOfLines={1}>
                {awayTeam || 'TBA'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          {time && (
            <View style={styles.infoItem}>
              <Feather name="clock" size={14} color="#666" />
              <Text style={styles.infoText}>{time}</Text>
            </View>
          )}
          {venue && (
            <View style={styles.infoItem}>
              <Feather name="map-pin" size={14} color="#666" />
              <Text style={styles.infoText} numberOfLines={1}>
                {venue}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.chevronContainer}>
        <Feather name="chevron-right" size={20} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  teamsContainer: {
    marginBottom: 8,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamLabel: {
    fontSize: 12,
    color: '#999',
    width: 50,
    fontWeight: '500',
  },
  teamName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  vsText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 100,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  chevronContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});
