import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ionicons } from '@expo/vector-icons';

import { Input } from '../components/input';
import { Button } from '../components/button';
import { SelectInput } from '../components/selectInput';
import { Toast } from '../components/Toast';
import { expenseSchema } from '../validators/expenseValidator';
import { expenseService } from '../services/expenseService';
import { theme } from '../theme';

const getCurrentMonthValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getMonthStartDate = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const formatMonthLabel = (value) => {
  if (!value) return '';

  const [year, month] = value.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, (character) => character.toUpperCase());
};

const generateMonthOptions = ({ pastMonths, futureMonths }) => {
  const options = [];
  const now = new Date();

  for (let offset = -pastMonths; offset <= futureMonths; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    options.push({
      value,
      label: formatMonthLabel(value),
    });
  }

  return options;
};

const normalizeAmount = (value) => {
  if (value.includes(',')) {
    return value.replace(/\./g, '').replace(',', '.');
  }

  return value;
};

const parseAmountToApi = (value) => {
  const normalizedValue = normalizeAmount(value);
  return Number(normalizedValue);
};

const formatAmountToInput = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace('.', ',');
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const MOCK_LOCKED_EXPENSES = {
  '2026-05': [
    {
      id: 'mock-expense-2026-05',
      description: 'Internet',
      amount: 129.9,
      referenceMonth: '2026-05',
      isMock: true,
    },
  ],
};

const isPreviousMonth = (referenceMonth) => {
  const [year, month] = referenceMonth.split('-');
  const selectedDate = new Date(Number(year), Number(month) - 1, 1);
  const currentDate = getMonthStartDate(new Date());
  return selectedDate < currentDate;
};

export default function ExpenseScreen() {
  const currentMonth = useMemo(() => getCurrentMonthValue(), []);
  const createMonthOptions = useMemo(
    () => generateMonthOptions({ pastMonths: 0, futureMonths: 24 }),
    []
  );
  const historyMonthOptions = useMemo(
    () => generateMonthOptions({ pastMonths: 120, futureMonths: 24 }),
    []
  );

  const [expenses, setExpenses] = useState([]);
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState(currentMonth);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: '',
      referenceMonth: currentMonth,
    },
  });

  const isHistoryLocked = isPreviousMonth(selectedHistoryMonth);
  const displayedExpenses =
    expenses.length > 0
      ? expenses
      : (MOCK_LOCKED_EXPENSES[selectedHistoryMonth] || []);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const loadExpenses = async (referenceMonth) => {
    try {
      setLoadingHistory(true);
      const response = await expenseService.listByMonth(referenceMonth);
      setExpenses(response);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Não foi possível carregar as despesas',
        'error'
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadExpenses(selectedHistoryMonth);
  }, [selectedHistoryMonth]);

  const clearForm = () => {
    reset({
      description: '',
      amount: '',
      referenceMonth: currentMonth,
    });
    setEditingExpenseId(null);
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const payload = {
        description: data.description.trim(),
        amount: parseAmountToApi(data.amount),
        referenceMonth: data.referenceMonth,
      };

      if (editingExpenseId) {
        await expenseService.update(editingExpenseId, payload);
        showToast('Despesa atualizada com sucesso!');
      } else {
        await expenseService.create(payload);
        showToast('Despesa cadastrada com sucesso!');
      }

      setSelectedHistoryMonth(payload.referenceMonth);
      await loadExpenses(payload.referenceMonth);
      clearForm();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Não foi possível salvar a despesa',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    if (isPreviousMonth(expense.referenceMonth)) {
      showToast(
        'Não é permitido editar despesas de meses anteriores ao mês atual',
        'error'
      );
      return;
    }

    setEditingExpenseId(expense.id);
    setValue('description', expense.description);
    setValue('amount', formatAmountToInput(expense.amount));
    setValue('referenceMonth', expense.referenceMonth);
  };

  const handleDelete = async (expense) => {
    if (isPreviousMonth(expense.referenceMonth)) {
      showToast(
        'Não é permitido excluir despesas de meses anteriores ao mês atual',
        'error'
      );
      return;
    }

    try {
      await expenseService.remove(expense.id);
      showToast('Despesa excluída com sucesso!');
      await loadExpenses(selectedHistoryMonth);

      if (editingExpenseId === expense.id) {
        clearForm();
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Não foi possível excluir a despesa',
        'error'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.headerTitle}>Despesa</Text>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Descrição"
                required
                placeholder="Digite a descrição"
                value={value}
                onChangeText={onChange}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Valor"
                required
                placeholder="0,00"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.amount?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="referenceMonth"
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="Mês"
                required
                value={value}
                onChange={onChange}
                options={createMonthOptions}
                error={errors.referenceMonth?.message}
              />
            )}
          />

          <Button
            title={editingExpenseId ? 'Atualizar' : 'Salvar'}
            onPress={handleSubmit(onSubmit)}
            loading={saving}
          />

          {editingExpenseId && (
            <TouchableOpacity style={styles.cancelEdit} onPress={clearForm}>
              <Text style={styles.cancelEditText}>Cancelar edição</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.historyTitle}>Histórico</Text>

          <SelectInput
            value={selectedHistoryMonth}
            onChange={setSelectedHistoryMonth}
            options={historyMonthOptions}
            placeholder="Selecione um mês"
          />

          {loadingHistory ? (
            <Text style={styles.emptyText}>Carregando despesas...</Text>
          ) : displayedExpenses.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma despesa foi encontrada</Text>
          ) : (
            displayedExpenses.map((expense) => {
              const lockedExpense = isPreviousMonth(expense.referenceMonth);

              return (
                <View key={expense.id} style={styles.expenseRow}>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.iconButton,
                      lockedExpense && styles.iconButtonDisabled,
                    ]}
                    onPress={() => handleEdit(expense)}
                    disabled={lockedExpense}
                  >
                    <Ionicons name="pencil" size={18} color={theme.colors.white} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.iconButton,
                      styles.deleteButton,
                      lockedExpense && styles.iconButtonDisabled,
                    ]}
                    onPress={() => handleDelete(expense)}
                    disabled={lockedExpense}
                  >
                    <Ionicons name="trash" size={18} color={theme.colors.white} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}

          {isHistoryLocked && displayedExpenses.length > 0 && (
            <Text style={styles.warningText}>
              Despesas de meses anteriores podem ser consultadas, mas não podem ser editadas ou excluídas.
            </Text>
          )}
        </View>
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
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  cancelEdit: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  cancelEditText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  historyTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    fontSize: 20,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  expenseInfo: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseDescription: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '600',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  expenseAmount: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '700',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: theme.colors.primaryDark,
  },
  iconButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
