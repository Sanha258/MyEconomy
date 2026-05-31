import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@finance:token';
const USER_KEY = '@finance:user';

export const authStorage = {
  async setToken(token) {
    if (!token) return;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token || null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async setUser(user) {
    if (!user) return;
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser() {
    try {
      const userStr = await AsyncStorage.getItem(USER_KEY);
      if (!userStr || userStr === 'undefined') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error loading stored user:', error);
      return null;
    }
  },

  async removeUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};