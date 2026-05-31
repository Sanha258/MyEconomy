import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { userService } from '../services/userService';

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
      
      if (storedToken) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        await loadUser();
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const profile = await userService.getProfile();
      setUser(profile);
      await AsyncStorage.setItem('@finance:user', JSON.stringify(profile));
    } catch (error) {
      console.error('Error loading user:', error);
      await signOut();
    }
  };

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('@finance:token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      await loadUser(); 
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
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};