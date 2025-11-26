import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface TeamData {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  strTeamBanner?: string;
  strCountry?: string;
  strLeague?: string;
  strStadium?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  intFormedYear?: string;
  strDescriptionEN?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strYoutube?: string;
  strManager?: string;
}

export default function TeamDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamData: TeamData = params.teamData ? JSON.parse(params.teamData as string) : null;

  if (!teamData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={60} color="#ff3b30" />
          <Text style={styles.errorText}>Team data not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const openLink = (url?: string) => {
    if (url) {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(formattedUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Banner */}
        <View style={styles.bannerContainer}>
          {teamData.strTeamBanner ? (
            <Image
              source={{ uri: teamData.strTeamBanner }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderBanner}>
              <Feather name="image" size={80} color="#ccc" />
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Team Badge Overlay */}
          {teamData.strTeamBadge && (
            <View style={styles.badgeOverlay}>
              <Image
                source={{ uri: teamData.strTeamBadge }}
                style={styles.badgeImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          {/* Team Name */}
          <Text style={styles.teamName}>{teamData.strTeam}</Text>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            {teamData.strCountry && (
              <View style={styles.infoCard}>
                <Feather name="map-pin" size={20} color="#007AFF" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Country</Text>
                  <Text style={styles.infoCardValue}>{teamData.strCountry}</Text>
                </View>
              </View>
            )}

            {teamData.intFormedYear && (
              <View style={styles.infoCard}>
                <Feather name="calendar" size={20} color="#007AFF" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Founded</Text>
                  <Text style={styles.infoCardValue}>{teamData.intFormedYear}</Text>
                </View>
              </View>
            )}

            {teamData.strStadium && (
              <View style={styles.infoCard}>
                <Feather name="home" size={20} color="#007AFF" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Stadium</Text>
                  <Text style={styles.infoCardValue}>{teamData.strStadium}</Text>
                  {teamData.strStadiumLocation && (
                    <Text style={styles.infoCardSubtext}>{teamData.strStadiumLocation}</Text>
                  )}
                </View>
              </View>
            )}

            {teamData.intStadiumCapacity && (
              <View style={styles.infoCard}>
                <Feather name="users" size={20} color="#007AFF" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Capacity</Text>
                  <Text style={styles.infoCardValue}>
                    {parseInt(teamData.intStadiumCapacity).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}

            {teamData.strLeague && (
              <View style={styles.infoCard}>
                <Feather name="award" size={20} color="#007AFF" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>League</Text>
                  <Text style={styles.infoCardValue}>{teamData.strLeague}</Text>
                </View>
              </View>
            )}

            {teamData.strManager && (
              <View style={styles.infoCard}>
                <Feather name="user" size={20} color="#007AFF" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Manager</Text>
                  <Text style={styles.infoCardValue}>{teamData.strManager}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          {teamData.strDescriptionEN && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.descriptionText}>{teamData.strDescriptionEN}</Text>
            </View>
          )}

          {/* Social Links */}
          {(teamData.strWebsite ||
            teamData.strFacebook ||
            teamData.strTwitter ||
            teamData.strInstagram ||
            teamData.strYoutube) && (
            <View style={styles.socialContainer}>
              <Text style={styles.sectionTitle}>Connect</Text>
              <View style={styles.socialButtons}>
                {teamData.strWebsite && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openLink(teamData.strWebsite)}
                  >
                    <Feather name="globe" size={24} color="#007AFF" />
                    <Text style={styles.socialButtonText}>Website</Text>
                  </TouchableOpacity>
                )}

                {teamData.strFacebook && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openLink(teamData.strFacebook)}
                  >
                    <Feather name="facebook" size={24} color="#1877F2" />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>
                )}

                {teamData.strTwitter && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openLink(teamData.strTwitter)}
                  >
                    <Feather name="twitter" size={24} color="#1DA1F2" />
                    <Text style={styles.socialButtonText}>Twitter</Text>
                  </TouchableOpacity>
                )}

                {teamData.strInstagram && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openLink(teamData.strInstagram)}
                  >
                    <Feather name="instagram" size={24} color="#E4405F" />
                    <Text style={styles.socialButtonText}>Instagram</Text>
                  </TouchableOpacity>
                )}

                {teamData.strYoutube && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openLink(teamData.strYoutube)}
                  >
                    <Feather name="youtube" size={24} color="#FF0000" />
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
    backgroundColor: '#f8f9fa',
  },
  bannerContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBanner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 4,
    borderColor: '#fff',
  },
  badgeImage: {
    width: 80,
    height: 80,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  teamName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
    lineHeight: 40,
  },
  infoCardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoCardSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  socialContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 100,
    gap: 6,
  },
  socialButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
