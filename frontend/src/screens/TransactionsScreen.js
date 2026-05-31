import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionsScreen() {
  const transactions = [
    { id: 1, type: 'income', description: 'Salário', amount: 5000, date: '15/05/2026' },
    { id: 2, type: 'expense', description: 'Aluguel', amount: 1200, date: '10/05/2026' },
    { id: 3, type: 'expense', description: 'Supermercado', amount: 800, date: '08/05/2026' },
    { id: 4, type: 'income', description: 'Freelance', amount: 1500, date: '05/05/2026' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Transações</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {transactions.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <Ionicons
                name={item.type === 'income' ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={32}
                color={item.type === 'income' ? theme.colors.success : theme.colors.error}
              />
              <View>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: item.type === 'income' ? theme.colors.success : theme.colors.error },
              ]}
            >
              {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    fontSize: 28,
  },
  addButton: {
    padding: 4,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
    }),
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionDescription: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  transactionDate: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  transactionAmount: {
    ...theme.typography.body,
    fontWeight: 'bold',
  },
});