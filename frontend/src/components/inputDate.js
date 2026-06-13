import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const InputDate = ({
  label,
  required = false,
  value,
  onChangeText,
  error,
  placeholder = 'DD/MM/AAAA',
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';

    if (dateString.includes('/')) {
      return dateString;
    }

    const parts = dateString.split('-');

    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return dateString;
  };

  const parseDate = (dateString) => {
    if (!dateString) return new Date();

    let date = new Date();

    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      date = new Date(year, month - 1, day);
    } else if (dateString.includes('-')) {
      date = new Date(dateString);
    }

    return isNaN(date.getTime()) ? new Date() : date;
  };

  const confirmDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`;

    onChangeText(displayDate);
    setShowPicker(false);
  };

  const openDatePicker = () => {
    const initialDate = parseDate(value);
    setTempDate(initialDate);
    setShowPicker(true);
  };

  if (Platform.OS === 'web') {
    const handleWebChange = (e) => {
      const selectedDate = new Date(e.target.value);

      if (!isNaN(selectedDate.getTime())) {
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();

        onChangeText(`${day}/${month}/${year}`);
      }
    };

    const getISODate = () => {
      if (!value) return '';

      const parsed = parseDate(value);

      return parsed.toISOString().split('T')[0];
    };

    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <input
          type="date"
          value={getISODate()}
          onChange={handleWebChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontFamily: 'system-ui',
            border: `1px solid ${
              error ? theme.colors.error : theme.colors.border
            }`,
            borderRadius: '8px',
            backgroundColor: theme.colors.white,
            color: theme.colors.text,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}
      </View>
    );
  }

  const handleAndroidChange = (event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate) {
      confirmDate(selectedDate);
    }
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

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
        onPress={openDatePicker}
        style={[
          styles.inputContainer,
          error && styles.inputError,
        ]}
      >
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholder,
          ]}
        >
          {formatDisplayDate(value) || placeholder}
        </Text>

        <Ionicons
          name="calendar-outline"
          size={24}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          maximumDate={yesterday}
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {showPicker && Platform.OS === 'ios' && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.cancelButton}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => confirmDate(tempDate)}
                >
                  <Text style={styles.confirmButton}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                maximumDate={yesterday}
                display="spinner"
                onChange={(event, date) =>
                  date && setTempDate(date)
                }
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
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

  inputError: {
    borderColor: theme.colors.error,
  },

  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },

  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  cancelButton: {
    ...theme.typography.body,
    color: theme.colors.error,
    fontSize: 16,
  },

  confirmButton: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  iosPicker: {
    height: 200,
  },
});