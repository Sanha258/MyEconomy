import * as yup from 'yup';

const isValidDate = (value) => {
  if (!value) return false;

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(value)) return false;

  const [, day, month, year] = value.match(regex);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() == year &&
    date.getMonth() == month - 1 &&
    date.getDate() == day
  );
};

const isPastDate = (value) => {
  if (!value) return false;

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(value)) return false;

  const [, day, month, year] = value.match(regex);
  const birthDate = new Date(year, month - 1, day);

  birthDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return birthDate < today;
};

export const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  email: yup
    .string()
    .required('Email obrigatório')
    .email('Email inválido'),

  birthDate: yup
    .string()
    .required('Data de nascimento obrigatória')
    .test(
      'is-valid-date',
      'Data inválida (use DD/MM/AAAA)',
      isValidDate
    )
    .test(
      'past-date',
      'Data de nascimento deve ser anterior à data atual',
      isPastDate
    ),

  password: yup
    .string()
    .required('Senha obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),

  confirmPassword: yup
    .string()
    .required('Confirme sua senha')
    .oneOf([yup.ref('password')], 'As senhas não conferem'),
});

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email obrigatório')
    .email('Email inválido'),

  password: yup
    .string()
    .required('Senha obrigatória'),
});