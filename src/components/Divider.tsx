import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color = '#e5e7eb',
  spacing = 0,
  style,
}) => {
  const dividerStyle =
    orientation === 'horizontal'
      ? {
          height: thickness,
          width: '100%',
          backgroundColor: color,
          marginVertical: spacing,
        }
      : {
          width: thickness,
          height: '100%',
          backgroundColor: color,
          marginHorizontal: spacing,
        };

  return <View style={[dividerStyle, style]} />;
};

interface DividerWithTextProps {
  text: string;
  color?: string;
  thickness?: number;
  spacing?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const DividerWithText: React.FC<DividerWithTextProps> = ({
  text,
  color = '#e5e7eb',
  thickness = 1,
  spacing = 16,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, { marginVertical: spacing }, style]}>
      <View style={[styles.line, { height: thickness, backgroundColor: color }]} />
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <View style={[styles.line, { height: thickness, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 16,
    fontWeight: '500',
  },
});
