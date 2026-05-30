import axios from 'axios';

// Para desenvolvimento local
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080'  // Web
  : 'http://10.0.2.2:8080';   // Android emulator

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging
api.interceptors.request.use(request => {
  console.log('API Request:', request.method, request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status);
    return response;
  },
  error => {
    console.error('API Error:', error.message);
    if (error.code === 'ERR_NETWORK') {
      console.error('Backend não está rodando em:', API_URL);
    }
    return Promise.reject(error);
  }
);