import React from 'react';
import { TouchableOpacity, View, Text, Animated, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  activeColor = '#8b5cf6',
  inactiveColor = '#d1d5db',
  size = 'medium',
  style,
  labelStyle,
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const sizeMap = {
    small: { width: 40, height: 24, thumbSize: 18 },
    medium: { width: 51, height: 31, thumbSize: 27 },
    large: { width: 60, height: 36, thumbSize: 32 },
  };

  const dimensions = sizeMap[size];

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, dimensions.width - dimensions.thumbSize - 2],
  });

  return (
    <View style={[styles.container, style]}>
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
      <TouchableOpacity
        onPress={() => !disabled && onValueChange(!value)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.track,
            {
              width: dimensions.width,
              height: dimensions.height,
              backgroundColor,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: dimensions.thumbSize,
                height: dimensions.thumbSize,
                transform: [{ translateX }],
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  labelDisabled: {
    color: '#9ca3af',
  },
  track: {
    borderRadius: 100,
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
