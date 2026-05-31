import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SEU_IP = '192.168.2.108'; // ← SUBSTITUA PELO IP DO SEU COMPUTADOR

const getApiUrl = () => {
  // Web (navegador no computador)
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }
  
  // Android Emulator
  if (Platform.OS === 'android' && !__DEV__ === false) {
    return 'http://10.0.2.2:8080';
  }
  
  // 📱 DISPOSITIVO FÍSICO (Expo Go)
  return `http://${SEU_IP}:8080`;
};

const API_URL = getApiUrl();

console.log('📱 Plataforma:', Platform.OS);
console.log('🌐 API_URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, 
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
        console.log('Token adicionado:', config.url);
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    console.error('URL tentada:', error.config?.baseURL + error.config?.url);
    
    if (error.code === 'ERR_NETWORK') {
      console.error(' NÃO FOI POSSÍVEL CONECTAR AO BACKEND!');
      console.error(' VERIFIQUE:');
      console.error(`   1. Backend está rodando? (Ver terminal do backend)`);
      console.error(`   2. IP correto? Tentando: ${API_URL}`);
      console.error(`   3. Celular e computador na mesma rede Wi-Fi?`);
      console.error(`   4. Teste no navegador do celular: ${API_URL}/api/auth/signup`);
    }
    
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('@finance:token');
      AsyncStorage.removeItem('@finance:user');
    }
    return Promise.reject(error);
  }
);