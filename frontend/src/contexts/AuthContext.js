import React, { createContext, useState, useEffect } from 'react';
import { authStorage } from '../storage/authStorage';
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
      const storedToken = await authStorage.getToken();
      const storedUser = await authStorage.getUser();

      if (storedToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, userData) => {
    await authStorage.setToken(token);
    await authStorage.setUser(userData);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
  };

  const signOut = async () => {
    await authStorage.clearAll();
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    authStorage.setUser(userData);
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