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

export default function PlayerDetailsScreen() {
  const { id, playerData } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerData) {
      try {
        setPlayer(JSON.parse(playerData as string));
        setLoading(false);
      } catch (e) {
        fetchPlayerDetails();
      }
    } else {
      fetchPlayerDetails();
    }
  }, [id, playerData]);

  const fetchPlayerDetails = async () => {
    try {
      const response = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`
      );
      if (response.data.players && response.data.players.length > 0) {
        setPlayer(response.data.players[0]);
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url: string | null) => {
    if (url) {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
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

  if (!player) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Player not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.header}>
          {player.strThumb || player.strCutout ? (
            <Image
              source={{ uri: player.strThumb || player.strCutout }}
              style={styles.playerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Feather name="user" size={100} color="#ccc" />
            </View>
          )}
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Player Info */}
        <View style={styles.content}>
          <Text style={styles.playerName}>{player.strPlayer}</Text>
          
          <View style={styles.infoGrid}>
            {player.strTeam && (
              <View style={styles.infoCard}>
                <Feather name="shield" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Team</Text>
                <Text style={styles.infoValue}>{player.strTeam}</Text>
              </View>
            )}

            {player.strNationality && (
              <View style={styles.infoCard}>
                <Feather name="map-pin" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Nationality</Text>
                <Text style={styles.infoValue}>{player.strNationality}</Text>
              </View>
            )}

            {player.dateBorn && (
              <View style={styles.infoCard}>
                <Feather name="calendar" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Born</Text>
                <Text style={styles.infoValue}>{player.dateBorn}</Text>
              </View>
            )}

            {player.strPosition && (
              <View style={styles.infoCard}>
                <Feather name="target" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Position</Text>
                <Text style={styles.infoValue}>{player.strPosition}</Text>
              </View>
            )}

            {player.strHeight && (
              <View style={styles.infoCard}>
                <Feather name="maximize-2" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>{player.strHeight}</Text>
              </View>
            )}

            {player.strWeight && (
              <View style={styles.infoCard}>
                <Feather name="activity" size={20} color="#007AFF" />
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{player.strWeight}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {player.strDescriptionEN && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{player.strDescriptionEN}</Text>
            </View>
          )}

          {/* Social Media */}
          <View style={styles.socialContainer}>
            {player.strFacebook && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openLink(player.strFacebook)}
              >
                <Feather name="facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
            )}
            {player.strTwitter && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openLink(player.strTwitter)}
              >
                <Feather name="twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            )}
            {player.strInstagram && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openLink(player.strInstagram)}
              >
                <Feather name="instagram" size={24} color="#E4405F" />
              </TouchableOpacity>
            )}
          </View>
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
    height: 300,
    position: 'relative',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  playerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
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
    fontSize: 16,
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
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 30,
    paddingBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
