import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/loading';
import { AuthRoutes } from './AuthRoutes';
import { AppRoutes } from './AppRoutes';

export const RouteGuard = () => {
  const { authenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || !isReady) {
    return <Loading />;
  }

  return authenticated ? <AppRoutes /> : <AuthRoutes />;
};