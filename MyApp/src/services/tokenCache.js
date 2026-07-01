import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenCache = {
  async getToken(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (err) {
      console.log('tokenCache getToken error:', err);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log('tokenCache saveToken error:', err);
    }
  },
};
