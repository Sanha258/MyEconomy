import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../components/input';
import { Button } from '../components/button';
import { theme } from '../theme';
import { cardShadow } from '../styles/shadow';
import { signInSchema } from '../validators/signInValidator';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export default function SignInScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // ✅ Apenas email pode vir do cadastro, senha SEMPRE vazia
  const preFilledEmail = route.params?.email || '';

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: preFilledEmail,
      password: '',  
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.signIn(data);
      await signIn(response.accessToken,response.user);
    } catch (error) {
      console.error('SignIn error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Erro', 'Email ou senha inválidos');
      } else if (error.response?.status === 400) {
        Alert.alert('Erro', error.response?.data?.message || 'Dados inválidos');
      } else {
        Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSignUp = () => {
    const email = getValues('email');
    navigation.navigate('SignUp', { email: email || '' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>ENTRAR</Text>
        </View>

        <View style={[styles.form, cardShadow]}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
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
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Senha"
                placeholder="********"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

          <View style={styles.footerContainer}>
            <Text style={styles.staticText}>Não possui conta? </Text>
            <TouchableOpacity onPress={handleNavigateToSignUp}>
              <Text style={styles.linkText}>Crie aqui</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  form: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.lg,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
  },
  staticText: {
    ...theme.typography.body,
    color: theme.colors.textLight,
  },
  linkText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});