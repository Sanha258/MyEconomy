import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const SelectInput = ({
  label,
  required = false,
  value,
  onChange,
  error,
  placeholder = 'Selecione uma opção',
  options = [],
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <View style={styles.webSelectWrapper}>
          <select
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              paddingRight: '56px',
              fontSize: '16px',
              fontFamily: 'system-ui',
              border: `1px solid ${
                error ? theme.colors.error : theme.colors.border
              }`,
              borderRadius: '8px',
              backgroundColor: theme.colors.white,
              color: value ? theme.colors.text : theme.colors.textLight,
              outline: 'none',
              boxSizing: 'border-box',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <View pointerEvents="none" style={styles.webIconContainer}>
            <Ionicons
              name="chevron-down-outline"
              size={22}
              color={theme.colors.text}
            />
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
        style={[styles.inputContainer, error && styles.inputError]}
      >
        <Text style={[styles.inputText, !selectedOption && styles.placeholder]}>
          {selectedOption?.label || placeholder}
        </Text>

        <View style={styles.iconContainer}>
          <Ionicons
            name="chevron-down-outline"
            size={22}
            color={theme.colors.text}
          />
        </View>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        transparent
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.optionsList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  {item.value === value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  webSelectWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  webIconContainer: {
    position: 'absolute',
    right: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
    fontSize: 14,
  },
  required: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    minHeight: 50,
  },
  inputText: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
  },
  placeholder: {
    color: theme.colors.textLight,
  },
  iconContainer: {
    width: 48,
    alignItems: 'flex-end',
    paddingRight: theme.spacing.lg,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  optionsList: {
    paddingVertical: theme.spacing.sm,
  },
  option: {
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
