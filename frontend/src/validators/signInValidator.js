import * as yup from 'yup';

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required('Informe seu email')
    .email('Email inválido'),
  password: yup
    .string()
    .required('Informe sua senha'),
});