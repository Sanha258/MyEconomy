import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../components/button';
import { Loading } from '../components/loading';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      updateUser({
        id: data.id,
        name: data.name,
        email: data.email,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOut },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <Loading />;
  }

  const displayData = profile || {
    name: user?.name || 'João',
    email: user?.email || 'joao@gmail.com',
    birthDate: '09/12/1987',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header com ícone */}
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Card de Dados */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meus Dados</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{displayData.name}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{displayData.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Data de nascimento</Text>
            <Text style={styles.value}>{displayData.birthDate}</Text>
          </View>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    fontSize: 20,
  },
  infoContainer: {
    paddingVertical: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
    fontSize: 14,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
    fontSize: 18,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
    marginTop: theme.spacing.md,
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
});