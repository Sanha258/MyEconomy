import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
