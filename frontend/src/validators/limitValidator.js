import * as yup from 'yup';
import { isValidAmount } from '../utils/monthlyFinance';

export const limitSchema = yup.object().shape({
  amount: yup
    .string()
    .required('Valor obrigatório')
    .test('is-valid-amount', 'Valor deve ser maior que zero', isValidAmount),
  referenceMonth: yup.string().required('Mês obrigatório'),
});
