import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@finance:token');
      const storedUser = await AsyncStorage.getItem('@finance:user');

      if (storedToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, userData) => {
    try {
      await AsyncStorage.setItem('@finance:token', token);
      await AsyncStorage.setItem('@finance:user', JSON.stringify(userData));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@finance:token');
      await AsyncStorage.removeItem('@finance:user');
      delete api.defaults.headers.Authorization;
      setUser(null);
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    AsyncStorage.setItem('@finance:user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: !!user,
        user,
        isLoading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};