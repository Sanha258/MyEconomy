import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome obrigatório'),
  email: yup
    .string()
    .required('Email obrigatório')
    .email('Email inválido'),
  birthDate: yup
    .string()
    .required('Data de nascimento obrigatória'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirme sua senha')
    .oneOf([yup.ref('password')], 'As senhas não conferem'),
});