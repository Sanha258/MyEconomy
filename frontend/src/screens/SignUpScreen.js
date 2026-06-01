import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from '../components/input';
import { InputDate } from '../components/inputDate';
import { Button } from '../components/button';
import { Toast } from '../components/Toast';

import { theme } from '../theme';
import { signUpSchema } from '../validators/signUpValidator';
import { authService } from '../services/authService';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [loading, setLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const preFilledEmail = route.params?.email || '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: preFilledEmail,
      birthDate: '',
      password: '',
      confirmPassword: '',
    },
  });

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('/');

    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formattedData = {
        name: data.name,
        email: data.email,
        birthDate: formatDateToISO(data.birthDate),
        password: data.password,
      };

      console.log('Enviando dados:', formattedData);

      await authService.signUp(formattedData);

      showToast('Conta criada com sucesso!', 'success');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SignIn',
              params: {
                email: data.email,
              },
            },
          ],
        });
      }, 1500);
    } catch (error) {
      console.error('SignUp error:', error);

      if (error.response?.status === 409) {
        showToast('Email já cadastrado', 'error');
      } else if (error.response?.status === 400) {
        showToast(
          error.response?.data?.message || 'Dados inválidos',
          'error'
        );
      } else {
        showToast(
          'Não foi possível criar a conta. Tente novamente.',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.headerTitle}>Criar Conta</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Nome"
                required
                placeholder="Seu nome completo"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                required
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <InputDate
                label="Data de nascimento"
                required
                placeholder="DD/MM/AAAA"
                value={value}
                onChangeText={onChange}
                error={errors.birthDate?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Senha"
                required
                placeholder="********"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirmar senha"
                required
                placeholder="********"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Criar Conta"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.goBack()}
          >
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },

  form: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.lg,

    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(0,0,0,0.10)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      },
    }),
  },

  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },

  linkContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },

  linkText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});