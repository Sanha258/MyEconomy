import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
} from 'react-native';

export const Toast = ({
  visible,
  message,
  type = 'success',
  onHide,
}) => {
  const translateY = useRef(
    new Animated.Value(-150)
  ).current;

  useEffect(() => {
    if (!visible) return;

    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        onHide?.();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const topPosition =
    Platform.OS === 'web'
      ? 20
      : (StatusBar.currentHeight || 40) + 10;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          top: topPosition,
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
    left: 16,
    right: 16,
    zIndex: 9999,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  message: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});