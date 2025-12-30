import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  color = '#8b5cf6',
  style,
  labelStyle,
}) => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 28,
  };

  const iconSizeMap = {
    small: 14,
    medium: 16,
    large: 18,
  };

  const boxSize = sizeMap[size];
  const iconSize = iconSizeMap[size];

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.box,
          {
            width: boxSize,
            height: boxSize,
            borderColor: checked ? color : '#d1d5db',
            backgroundColor: checked ? color : '#ffffff',
          },
          disabled && styles.disabled,
        ]}
      >
        {checked && (
          <Text style={[styles.checkmark, { fontSize: iconSize }]}>✓</Text>
        )}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            disabled && styles.labelDisabled,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

interface RadioProps {
  selected: boolean;
  onChange: (selected: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Radio: React.FC<RadioProps> = ({
  selected,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  color = '#8b5cf6',
  style,
  labelStyle,
}) => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 28,
  };

  const innerSizeMap = {
    small: 10,
    medium: 12,
    large: 14,
  };

  const outerSize = sizeMap[size];
  const innerSize = innerSizeMap[size];

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => !disabled && onChange(!selected)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radioOuter,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderColor: selected ? color : '#d1d5db',
          },
          disabled && styles.disabled,
        ]}
      >
        {selected && (
          <View
            style={[
              styles.radioInner,
              {
                width: innerSize,
                height: innerSize,
                borderRadius: innerSize / 2,
                backgroundColor: color,
              },
            ]}
          />
        )}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            disabled && styles.labelDisabled,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

interface RadioGroupProps {
  options: Array<{ label: string; value: string | number }>;
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  size = 'medium',
  color = '#8b5cf6',
  style,
}) => {
  return (
    <View style={[styles.radioGroup, style]}>
      {options.map((option) => (
        <Radio
          key={option.value.toString()}
          selected={option.value === value}
          onChange={() => onChange(option.value)}
          label={option.label}
          disabled={disabled}
          size={size}
          color={color}
          style={styles.radioGroupItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  labelDisabled: {
    color: '#9ca3af',
  },
  radioOuter: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  radioInner: {},
  radioGroup: {
    gap: 12,
  },
  radioGroupItem: {
    marginBottom: 8,
  },
});
