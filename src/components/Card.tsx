import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

interface InfoBoxProps {
  icon?: string;
  message: string;
  variant?: 'info' | 'warning' | 'success' | 'error';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  icon,
  message,
  variant = 'info',
  style,
  textStyle,
}) => {
  const defaultIcons = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    error: '❌',
  };

  return (
    <View style={[styles.infoBox, styles[`infoBox_${variant}`], style]}>
      {icon !== undefined && (
        <Text style={styles.icon}>{icon || defaultIcons[variant]}</Text>
      )}
      <Text style={[styles.message, styles[`message_${variant}`], textStyle]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoBox_info: {
    backgroundColor: '#eff6ff',
  },
  infoBox_warning: {
    backgroundColor: '#fffbeb',
  },
  infoBox_success: {
    backgroundColor: '#f0fdf4',
  },
  infoBox_error: {
    backgroundColor: '#fef2f2',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  message_info: {
    color: '#1e40af',
  },
  message_warning: {
    color: '#92400e',
  },
  message_success: {
    color: '#166534',
  },
  message_error: {
    color: '#991b1b',
  },
});
