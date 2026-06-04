import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Pressable,
} from 'react-native';
import { Loading } from '../components/loading';
import { theme } from '../theme';
import { cardShadow } from '../styles/shadow';
import { useAuth } from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    setModalVisible(false);
    try {
      await signOut();
      console.log('LOGOUT EXECUTADO');
    } catch (error) {
      console.error('ERRO NO LOGOUT:', error);
    }
  };

  if (!user) {
    return <Loading />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informada';
    if (dateString.includes('/')) return dateString;
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meus Dados</Text>
        </View>

        <View style={[styles.card, cardShadow]}>
          <Text style={styles.cardTitle}>Informações da Conta</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{user.name || ''}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email || ''}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Data de nascimento</Text>
            <Text style={styles.value}>
              {formatDate(user.birthDate)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={theme.colors.error}
          />
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Confirmação Moderno */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalIcon}>
                <Ionicons name="log-out-outline" size={48} color={theme.colors.error} />
              </View>
              
              <Text style={styles.modalTitle}>Sair da conta</Text>
              <Text style={styles.modalMessage}>
                Tem certeza que deseja sair? Você precisará fazer login novamente para acessar sua conta.
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.confirmButtonText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
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
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
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
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
 
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 340,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h2,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  confirmButton: {
    backgroundColor: theme.colors.error,
  },
  cancelButtonText: {
    ...theme.typography.button,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  confirmButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
    fontWeight: '600',
  },
});
