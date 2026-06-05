import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { theme } from '../theme';
import { Input } from '../components/input';
import { SelectInput } from '../components/selectInput';
import { Button } from '../components/button';
import { Toast } from '../components/Toast';
import { limitSchema } from '../validators/limitValidator';
import { limitService } from '../services/limitService';
import {
  formatAmountToInput,
  formatCurrency,
  formatMonthLabel,
  generateMonthOptions,
  getCurrentMonthValue,
  isPreviousMonth,
  parseAmountToApi,
} from '../utils/monthlyFinance';

export default function SettingsScreen() {
  const currentMonth = useMemo(() => getCurrentMonthValue(), []);
  const createMonthOptions = useMemo(
    () => generateMonthOptions({ pastMonths: 0, futureMonths: 24 }),
    []
  );
  const searchMonthOptions = useMemo(
    () => generateMonthOptions({ pastMonths: 120, futureMonths: 24 }),
    []
  );

  const [selectedSearchMonth, setSelectedSearchMonth] = useState(currentMonth);
  const [selectedLimit, setSelectedLimit] = useState(null);
  const [editingLimitId, setEditingLimitId] = useState(null);
  const [loadingLimit, setLoadingLimit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    resolver: yupResolver(limitSchema),
    defaultValues: {
      amount: '',
      referenceMonth: currentMonth,
    },
  });

  const selectedMonthLocked = isPreviousMonth(selectedSearchMonth);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const clearForm = () => {
    reset({
      amount: '',
      referenceMonth: currentMonth,
    });
    setEditingLimitId(null);
  };

  const loadLimit = async (referenceMonth) => {
    try {
      setLoadingLimit(true);
      const response = await limitService.getByMonth(referenceMonth);
      setSelectedLimit(response || null);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Não foi possível carregar o limite',
        'error'
      );
    } finally {
      setLoadingLimit(false);
    }
  };

  useEffect(() => {
    loadLimit(selectedSearchMonth);
  }, [selectedSearchMonth]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const payload = {
        amount: parseAmountToApi(data.amount),
        referenceMonth: data.referenceMonth,
      };

      if (editingLimitId) {
        await limitService.update(editingLimitId, payload);
        showToast('Limite atualizado com sucesso!');
      } else {
        await limitService.create(payload);
        showToast('Limite cadastrado com sucesso!');
      }

      const shouldReloadImmediately = selectedSearchMonth === payload.referenceMonth;
      setSelectedSearchMonth(payload.referenceMonth);

      if (shouldReloadImmediately) {
        await loadLimit(payload.referenceMonth);
      }

      clearForm();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Não foi possível salvar o limite',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (!selectedLimit) return;

    if (isPreviousMonth(selectedLimit.referenceMonth)) {
      showToast(
        'Não é permitido editar limites de meses anteriores ao mês atual',
        'error'
      );
      return;
    }

    setEditingLimitId(selectedLimit.id);
    setValue('amount', formatAmountToInput(selectedLimit.amount));
    setValue('referenceMonth', selectedLimit.referenceMonth);
  };

  const handleDelete = async () => {
    if (!selectedLimit) return;

    if (isPreviousMonth(selectedLimit.referenceMonth)) {
      showToast(
        'Não é permitido excluir limites de meses anteriores ao mês atual',
        'error'
      );
      return;
    }

    try {
      setDeleting(true);
      await limitService.remove(selectedLimit.id);
      showToast('Limite excluído com sucesso!');
      setSelectedLimit(null);

      if (editingLimitId === selectedLimit.id) {
        clearForm();
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Não foi possível excluir o limite',
        'error'
      );
    } finally {
      setDeleting(false);
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
        <View style={styles.content}>
          <Text style={styles.title}>Limite</Text>

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
            title={editingLimitId ? 'ATUALIZAR' : 'SALVAR'}
            onPress={handleSubmit(onSubmit)}
            loading={saving}
            style={styles.saveButton}
          />

          {editingLimitId && (
            <Button
              title="CANCELAR EDIÇÃO"
              variant="outline"
              onPress={clearForm}
              style={styles.cancelButton}
            />
          )}

          <Text style={styles.subtitle}>Consulta</Text>

          <SelectInput
            value={selectedSearchMonth}
            onChange={setSelectedSearchMonth}
            options={searchMonthOptions}
            placeholder="Selecione um mês"
          />

          {loadingLimit ? (
            <Text style={styles.emptyText}>Carregando limite...</Text>
          ) : !selectedLimit ? (
            <Text style={styles.emptyText}>Nenhum limite foi encontrado</Text>
          ) : (
            <>
              <View style={styles.limitCard}>
                <Text style={styles.limitMonth}>
                  {formatMonthLabel(selectedLimit.referenceMonth)}
                </Text>
                <Text style={styles.limitAmount}>
                  {formatCurrency(selectedLimit.amount)}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Button
                  title="EDITAR"
                  onPress={handleEdit}
                  disabled={selectedMonthLocked}
                  style={styles.actionButton}
                />
                <Button
                  title="EXCLUIR"
                  variant="secondary"
                  onPress={handleDelete}
                  loading={deleting}
                  disabled={selectedMonthLocked}
                  style={styles.actionButton}
                />
              </View>
            </>
          )}

          {selectedMonthLocked && selectedLimit && (
            <Text style={styles.warningText}>
              Limites de meses anteriores podem ser consultados, mas não podem ser editados ou excluídos.
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
  content: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    fontSize: 20,
  },
  saveButton: {
    marginTop: theme.spacing.sm,
  },
  cancelButton: {
    marginTop: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  limitCard: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  limitMonth: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '700',
    flex: 1,
  },
  limitAmount: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
