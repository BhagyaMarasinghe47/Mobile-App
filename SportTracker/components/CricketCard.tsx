import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { TeamStatus } from '@/src/types/cricket';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding
const FALLBACK_IMAGE = 'https://via.placeholder.com/300x200.png?text=Cricket';

interface CricketCardProps {
  image?: string;
  title: string;
  description?: string;
  status: TeamStatus;
  onPress: () => void;
}

const STATUS_COLORS: Record<TeamStatus, string> = {
  Active: '#34C759',
  Popular: '#FF9500',
  Upcoming: '#007AFF',
};

export const CricketCard: React.FC<CricketCardProps> = ({
  image,
  title,
  description,
  status,
  onPress,
}) => {
  const imageUri = image || FALLBACK_IMAGE;
  const displayDescription = description || 'Popular Cricket Team';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[status] }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {displayDescription}
        </Text>

        <View style={styles.footer}>
          <Feather name="chevron-right" size={16} color="#999" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default CricketCard;
