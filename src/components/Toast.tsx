import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  position?: 'top' | 'bottom';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  position = 'bottom',
  style,
  textStyle,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getToastIcon = (): string => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  if (!visible && opacity._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        styles[position],
        styles[type],
        {
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <View style={[styles.iconContainer, styles[`icon_${type}`]]}>
        <Text style={styles.icon}>{getToastIcon()}</Text>
      </View>
      <Text style={[styles.message, textStyle]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  top: {
    top: 60,
  },
  bottom: {
    bottom: 40,
  },
  success: {
    backgroundColor: '#10b981',
  },
  error: {
    backgroundColor: '#ef4444',
  },
  warning: {
    backgroundColor: '#f59e0b',
  },
  info: {
    backgroundColor: '#3b82f6',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon_success: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon_error: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon_warning: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon_info: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
});
