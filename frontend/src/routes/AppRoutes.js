import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const AppRoutes = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MeusDados') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }

          return (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperFocused,
              ]}
            >
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="MeusDados"
        component={ProfileScreen}
        options={{
          title: 'Meus Dados',
        }}
      />
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          title: 'Home',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.primary,
    borderTopWidth: 0,
    height: 72,
    paddingBottom: 10,
    paddingTop: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperFocused: {
    backgroundColor: theme.colors.primaryDark,
  },
});
