import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface LeagueCardProps {
  image?: string;
  title: string;
  country?: string;
  year?: string;
  onPress: () => void;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({
  image,
  title,
  country,
  year,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Feather name="award" size={40} color="#ccc" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {(country || year) && (
          <View style={styles.infoContainer}>
            {country && (
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={12} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>
                  {country}
                </Text>
              </View>
            )}
            {year && (
              <View style={styles.infoItem}>
                <Feather name="calendar" size={12} color="#666" />
                <Text style={styles.infoText}>{year}</Text>
              </View>
            )}
          </View>
        )}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
  },
  infoContainer: {
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
});
