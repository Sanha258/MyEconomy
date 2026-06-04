import React, { useState, useEffect } from 'react';
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
import { Button } from '../components/button';
import { Toast } from '../components/Toast';

import { theme } from '../theme';

import { signInSchema } from '../validators/signInValidator';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export default function SignInScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const preFilledEmail = route.params?.email || '';

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: preFilledEmail,
      password: '',
    },
  });

  /**
   * Atualiza o email quando retornar da tela de cadastro
   */
  useEffect(() => {
    if (route.params?.email) {
      setValue('email', route.params.email);
    }
  }, [route.params?.email]);

  const showToast = (
    message,
    type = 'success'
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response =
        await authService.signIn(data);

      showToast(
        'Login realizado com sucesso!',
        'success'
      );

      await signIn(response.accessToken);

    } catch (error) {
      console.error(
        'SignIn error:',
        error
      );

      if (
        error.response?.status === 401
      ) {
        showToast(
          'Email ou senha incorretos.',
          'error'
        );
      } else if (
        error.code === 'ERR_NETWORK'
      ) {
        showToast(
          'Não foi possível conectar ao servidor.',
          'error'
        );
      } else {
        showToast(
          'Não foi possível realizar o login.',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSignUp = () => {
    const email = getValues('email');

    navigation.navigate(
      'SignUp',
      {
        email: email || '',
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() =>
          setToastVisible(false)
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
      >
        <View style={styles.form}>
          <Text style={styles.headerTitle}>
            Entrar
          </Text>

          <Controller
            control={control}
            name="email"
            render={({
              field: {
                onChange,
                value,
              },
            }) => (
              <Input
                label="Email"
                required
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                error={
                  errors.email?.message
                }
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({
              field: {
                onChange,
                value,
              },
            }) => (
              <Input
                label="Senha"
                required
                placeholder="********"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={
                  errors.password?.message
                }
              />
            )}
          />

          <Button
            title="Entrar"
            onPress={handleSubmit(
              onSubmit
            )}
            loading={loading}
          />

          <View
            style={
              styles.footerContainer
            }
          >
            <Text
              style={
                styles.staticText
              }
            >
              Não possui conta?
            </Text>

            <TouchableOpacity
              onPress={
                handleNavigateToSignUp
              }
            >
              <Text
                style={styles.linkText}
              >
                {' '}
                Crie aqui
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
    },

    scrollContainer: {
      flexGrow: 1,
      justifyContent:
        'center',
      padding:
        theme.spacing.lg,
    },

    form: {
      backgroundColor:
        theme.colors.white,
      borderRadius: 12,
      padding:
        theme.spacing.lg,

      ...Platform.select({
        web: {
          boxShadow:
            '0px 4px 12px rgba(0,0,0,0.10)',
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
      color:
        theme.colors.primary,
      textAlign: 'center',
      marginBottom:
        theme.spacing.lg,
    },

    footerContainer: {
      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems: 'center',
      marginTop:
        theme.spacing.md,
      flexWrap: 'wrap',
    },

    staticText: {
      ...theme.typography.body,
      color:
        theme.colors.textLight,
    },

    linkText: {
      ...theme.typography.body,
      color:
        theme.colors.primary,
      fontWeight: '600',
    },
  });
