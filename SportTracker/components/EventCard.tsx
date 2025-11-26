import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
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
  thumbImage?: string;
  squareImage?: string;
  posterImage?: string;
  homeTeamBadge?: string;
  awayTeamBadge?: string;
  homeScore?: string;
  awayScore?: string;
  status?: string;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  eventName,
  homeTeam,
  awayTeam,
  date,
  time,
  venue,
  thumbImage,
  squareImage,
  posterImage,
  homeTeamBadge,
  awayTeamBadge,
  homeScore,
  awayScore,
  status,
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

  const displayImage = thumbImage || squareImage || posterImage;
  const isFinished = status?.toLowerCase().includes('finished');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Image at the very top */}
      {displayImage && (
        <Image
          source={{ uri: displayImage }}
          style={styles.topImage}
          resizeMode="cover"
        />
      )}

      {/* Content below image */}
      <View style={styles.content}>
        {(homeTeam || awayTeam) && (
          <View style={styles.teamsRow}>
            {/* Home Team - Left Side */}
            <View style={styles.teamColumn}>
              {homeTeamBadge && (
                <Image source={{ uri: homeTeamBadge }} style={styles.teamBadge} resizeMode="contain" />
              )}
              <Text style={styles.teamName} numberOfLines={2}>
                {homeTeam || 'TBA'}
              </Text>
              {homeScore !== undefined && homeScore !== null && (
                <Text style={styles.scoreText}>{homeScore}</Text>
              )}
            </View>
            
            {/* VS in Center */}
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            
            {/* Away Team - Right Side */}
            <View style={styles.teamColumn}>
              {awayTeamBadge && (
                <Image source={{ uri: awayTeamBadge }} style={styles.teamBadge} resizeMode="contain" />
              )}
              <Text style={styles.teamName} numberOfLines={2}>
                {awayTeam || 'TBA'}
              </Text>
              {awayScore !== undefined && awayScore !== null && (
                <Text style={styles.scoreText}>{awayScore}</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          {date && (
            <View style={styles.infoItem}>
              <Feather name="calendar" size={14} color="#666" />
              <Text style={styles.infoText}>{formatDate(date)}</Text>
            </View>
          )}
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
  topImage: {
    width: '100%',
    height: 160,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  teamBadge: {
    width: 50,
    height: 50,
  },
  teamName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '700',
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  vsText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
