import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';

export const Toast = ({
  visible,
  message,
  type = 'success',
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -120,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          onHide?.();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor:
            type === 'success'
              ? '#16A34A'
              : '#DC2626',
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.message}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: StatusBar.currentHeight || 40,
    left: 16,
    right: 16,
    zIndex: 9999,
    padding: 16,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  message: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});