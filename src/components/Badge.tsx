import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.badge, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`], textStyle]}>
        {label}
      </Text>
    </View>
  );
};

interface NotificationBadgeProps {
  count: number;
  max?: number;
  style?: ViewStyle;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  style,
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();

  if (count === 0) return null;

  return (
    <View style={[styles.notificationBadge, style]}>
      <Text style={styles.notificationText}>{displayCount}</Text>
    </View>
  );
};

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: number;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 12,
  style,
}) => {
  return (
    <View
      style={[
        styles.statusBadge,
        styles[`status_${status}`],
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: '#ede9fe',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
  },
  success: {
    backgroundColor: '#dcfce7',
  },
  warning: {
    backgroundColor: '#fef3c7',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  info: {
    backgroundColor: '#dbeafe',
  },
  size_small: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  size_medium: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  size_large: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: '#7c3aed',
  },
  text_secondary: {
    color: '#4b5563',
  },
  text_success: {
    color: '#16a34a',
  },
  text_warning: {
    color: '#ca8a04',
  },
  text_danger: {
    color: '#dc2626',
  },
  text_info: {
    color: '#2563eb',
  },
  text_small: {
    fontSize: 11,
  },
  text_medium: {
    fontSize: 13,
  },
  text_large: {
    fontSize: 15,
  },
  notificationBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  status_online: {
    backgroundColor: '#22c55e',
  },
  status_offline: {
    backgroundColor: '#9ca3af',
  },
  status_away: {
    backgroundColor: '#f59e0b',
  },
  status_busy: {
    backgroundColor: '#ef4444',
  },
});
