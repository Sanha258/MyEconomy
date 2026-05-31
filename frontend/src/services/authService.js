import { api } from './api';

export const authService = {
  async signIn(data) {
    const response = await api.post('/api/auth/signin', data);
    return response.data; 
  },

  async signUp(data) {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },
};