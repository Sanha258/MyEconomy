import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform, 
} from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo atual</Text>
            <Text style={styles.balanceValue}>R$ 5.240,00</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="arrow-up-circle" size={32} color={theme.colors.success} />
              <Text style={styles.statLabel}>Receitas</Text>
              <Text style={styles.statValue}>R$ 8.500,00</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="arrow-down-circle" size={32} color={theme.colors.error} />
              <Text style={styles.statLabel}>Despesas</Text>
              <Text style={styles.statValue}>R$ 3.260,00</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    fontSize: 28,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.lg,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  balanceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  balanceValue: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginTop: 8,
    fontSize: 36,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginTop: 8,
  },
  statValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginTop: 4,
  },
});