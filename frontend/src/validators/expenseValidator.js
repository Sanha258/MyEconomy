import * as yup from 'yup';

const normalizeAmount = (value) => {
  if (value.includes(',')) {
    return value.replace(/\./g, '').replace(',', '.');
  }

  return value;
};

const isValidAmount = (value) => {
  if (!value) return false;

  const normalizedValue = normalizeAmount(value);
  const parsedValue = Number(normalizedValue);

  return !Number.isNaN(parsedValue) && parsedValue > 0;
};

export const expenseSchema = yup.object().shape({
  description: yup.string().required('Descrição obrigatória').trim(),
  amount: yup
    .string()
    .required('Valor obrigatório')
    .test('is-valid-amount', 'Valor deve ser maior que zero', isValidAmount),
  referenceMonth: yup.string().required('Mês obrigatório'),
});
