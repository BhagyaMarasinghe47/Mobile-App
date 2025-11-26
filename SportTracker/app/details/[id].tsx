import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import type { CricketTeam, TeamStatus } from '@/src/types/cricket';

const { width } = Dimensions.get('window');
const FALLBACK_IMAGE = 'https://via.placeholder.com/300x200.png?text=Cricket';

const STATUS_COLORS: Record<TeamStatus, string> = {
  Active: '#34C759',
  Popular: '#FF9500',
  Upcoming: '#007AFF',
};

const STATUS_OPTIONS: TeamStatus[] = ['Active', 'Popular', 'Upcoming'];

const getRandomStatus = (): TeamStatus => {
  return STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
};

export default function TeamDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const team: CricketTeam | null = useMemo(() => {
    try {
      if (params.teamData && typeof params.teamData === 'string') {
        return JSON.parse(params.teamData) as CricketTeam;
      }
      return null;
    } catch (e) {
      console.error('Failed to parse team data:', e);
      return null;
    }
  }, [params.teamData]);

  const status: TeamStatus = useMemo(() => getRandomStatus(), []);

  if (!team) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={64} color="#ff3b30" />
          <Text style={styles.errorText}>Team not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleOpenLink = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Failed to open URL:', err)
      );
    }
  };

  const imageUri = team.strTeamBadge || team.strTeamLogo || FALLBACK_IMAGE;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Team Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.statusBadgeLarge,
              { backgroundColor: STATUS_COLORS[status] },
            ]}
          >
            <Text style={styles.statusTextLarge}>{status}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{team.strTeam}</Text>
            {team.strTeamShort && (
              <Text style={styles.shortName}>({team.strTeamShort})</Text>
            )}
          </View>

          {/* Info Cards */}
          {team.strCountry && (
            <View style={styles.infoCard}>
              <Feather name="map-pin" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Country</Text>
                <Text style={styles.infoValue}>{team.strCountry}</Text>
              </View>
            </View>
          )}

          {team.intFormedYear && (
            <View style={styles.infoCard}>
              <Feather name="calendar" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Formed</Text>
                <Text style={styles.infoValue}>{team.intFormedYear}</Text>
              </View>
            </View>
          )}

          {team.strStadium && (
            <View style={styles.infoCard}>
              <Feather name="home" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Stadium</Text>
                <Text style={styles.infoValue}>{team.strStadium}</Text>
                {team.strStadiumLocation && (
                  <Text style={styles.infoSubValue}>
                    {team.strStadiumLocation}
                  </Text>
                )}
              </View>
            </View>
          )}

          {team.intStadiumCapacity && (
            <View style={styles.infoCard}>
              <Feather name="users" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Stadium Capacity</Text>
                <Text style={styles.infoValue}>
                  {parseInt(team.intStadiumCapacity).toLocaleString()} seats
                </Text>
              </View>
            </View>
          )}

          {/* Description */}
          {team.strDescriptionEN && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{team.strDescriptionEN}</Text>
            </View>
          )}

          {/* Social Media Links */}
          {(team.strWebsite ||
            team.strFacebook ||
            team.strTwitter ||
            team.strInstagram ||
            team.strYoutube) && (
            <View style={styles.socialSection}>
              <Text style={styles.sectionTitle}>Connect</Text>
              <View style={styles.socialButtons}>
                {team.strWebsite && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleOpenLink(team.strWebsite)}
                  >
                    <Feather name="globe" size={20} color="#007AFF" />
                    <Text style={styles.socialButtonText}>Website</Text>
                  </TouchableOpacity>
                )}
                {team.strFacebook && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleOpenLink(team.strFacebook)}
                  >
                    <Feather name="facebook" size={20} color="#007AFF" />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>
                )}
                {team.strTwitter && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleOpenLink(team.strTwitter)}
                  >
                    <Feather name="twitter" size={20} color="#007AFF" />
                    <Text style={styles.socialButtonText}>Twitter</Text>
                  </TouchableOpacity>
                )}
                {team.strInstagram && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleOpenLink(team.strInstagram)}
                  >
                    <Feather name="instagram" size={20} color="#007AFF" />
                    <Text style={styles.socialButtonText}>Instagram</Text>
                  </TouchableOpacity>
                )}
                {team.strYoutube && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleOpenLink(team.strYoutube)}
                  >
                    <Feather name="youtube" size={20} color="#007AFF" />
                    <Text style={styles.socialButtonText}>YouTube</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  bannerContainer: {
    width: width,
    height: 280,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  statusBadgeLarge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusTextLarge: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  shortName: {
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoSubValue: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  descriptionSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
  },
  socialSection: {
    marginTop: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginTop: 16,
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
