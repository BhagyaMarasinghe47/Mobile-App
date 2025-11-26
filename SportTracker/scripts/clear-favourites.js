// Script to clear favourites from AsyncStorage
// Run this in your app to reset favourites

import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearFavourites = async () => {
  try {
    await AsyncStorage.removeItem('favourites');
    console.log('Favourites cleared successfully!');
  } catch (e) {
    console.error('Error clearing favourites:', e);
  }
};

export const viewFavourites = async () => {
  try {
    const raw = await AsyncStorage.getItem('favourites');
    console.log('Current favourites:', raw);
  } catch (e) {
    console.error('Error reading favourites:', e);
  }
};
