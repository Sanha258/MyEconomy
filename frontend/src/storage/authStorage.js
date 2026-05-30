import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@finance:token';
const USER_KEY = '@finance:user';

export const authStorage = {
  async setToken(token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async setUser(user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser() {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  async removeUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async clearAll() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },
};
