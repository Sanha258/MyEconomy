import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getApiUrl = () => {
  // Web - usa localhost diretamente
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }
  
  // Android Emulator
  if (Platform.OS === 'android') {
    // 10.0.2.2 é o IP do host local para o emulador Android
    return 'http://10.0.2.2:8080';
  }
  
  // iOS Emulator
  if (Platform.OS === 'ios') {
    return 'http://localhost:8080';
  }
  
  return 'http://192.168.2.108:8080'; // ← SUBSTITUA PELO IP da SUA MÁQUINA NA REDE LOCAL PARA DISPOSITIVOS FÍSICOS
};

const API_URL = getApiUrl();

console.log('🔧 API_URL configurada para:', API_URL, 'Plataforma:', Platform.OS);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@finance:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(' Token adicionado à requisição:', config.url);
      } else {
        console.log(' Nenhum token encontrado para:', config.url);
      }
    } catch (error) {
      console.error(' Erro ao recuperar token:', error);
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(' API Error:', error.message);
    if (error.response?.status === 401) {
      console.error('Token inválido ou expirado');
      AsyncStorage.removeItem('@finance:token');
      AsyncStorage.removeItem('@finance:user');
    }
    if (error.code === 'ERR_NETWORK') {
      console.error('Backend não está rodando em:', API_URL);
      console.error('Dica: Para dispositivo físico, use o IP da sua máquina na rede local');
    }
    return Promise.reject(error);
  }
);