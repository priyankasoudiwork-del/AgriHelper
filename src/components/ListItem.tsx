import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  rightText?: string;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  rightText,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {leftIcon && (
        <View style={styles.leftIconContainer}>
          <Text style={styles.leftIcon}>{leftIcon}</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>

      {(rightText || rightIcon) && (
        <View style={styles.rightSection}>
          {rightText && <Text style={styles.rightText}>{rightText}</Text>}
          {rightIcon && <Text style={styles.rightIcon}>{rightIcon}</Text>}
        </View>
      )}
    </Component>
  );
};

interface SectionHeaderProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  onActionPress,
  style,
  titleStyle,
}) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  leftIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leftIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  rightText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  rightIcon: {
    fontSize: 20,
    color: '#9ca3af',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
  },
});
