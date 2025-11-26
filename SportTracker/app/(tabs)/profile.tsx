import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { logout } from '@redux/slices/authSlice';
import { toggleTheme } from '@redux/slices/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView,
  Switch,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAppSelector(s => s.auth);
  const isDark = useAppSelector(s => s.theme.isDarkMode);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('token');
          dispatch(logout());
        },
      },
    ]);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Dynamic colors based on theme
  const colors = {
    background: isDark ? '#000' : '#F5F5F5',
    cardBackground: isDark ? '#1C1C1E' : '#fff',
    text: isDark ? '#fff' : '#333',
    textSecondary: isDark ? '#999' : '#999',
    border: isDark ? '#2C2C2E' : '#E5E5E5',
    iconBackground: isDark ? '#2C2C2E' : '#F5F5F5',
    editButtonBg: isDark ? '#2C2C2E' : '#F5F5F5',
    avatarBg: isDark ? '#1C3A5E' : '#E8F4FF',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        </View>

        {/* Profile Avatar Section */}
        <View style={[styles.profileSection, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@/assets/images/profile.png')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user?.firstName || user?.username || 'Guest'}
          </Text>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Feather name={isDark ? "moon" : "sun"} size={22} color={isDark ? "#5E5CE6" : "#FFA500"} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{isDark ? "Dark Mode" : "Light Mode"}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Adjust app appearance</Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleToggleTheme}
                trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
                thumbColor="#fff"
                ios_backgroundColor="#E5E5E5"
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          <View style={[styles.accountCard, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity style={styles.accountItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Feather name="user" size={22} color="#007AFF" />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Account Details</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>View and edit profile</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.accountItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Feather name="shield" size={22} color="#34C759" />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Privacy & Security</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Manage your privacy</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.accountItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Feather name="bell" size={22} color="#FF9500" />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Manage notifications</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.accountItem} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Feather name="log-out" size={22} color="#FF3B30" />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: '#FF3B30' }]}>Logout</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Sign out of your account</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accountCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
});
