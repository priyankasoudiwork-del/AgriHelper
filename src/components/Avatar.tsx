import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circular' | 'rounded' | 'square';
  backgroundColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  variant = 'circular',
  backgroundColor = '#8b5cf6',
  style,
  textStyle,
}) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 96,
  };

  const borderRadiusMap = {
    circular: sizeMap[size] / 2,
    rounded: 12,
    square: 0,
  };

  const avatarSize = sizeMap[size];
  const borderRadius = borderRadiusMap[variant];

  const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const fontSizeMap = {
    small: 14,
    medium: 18,
    large: 24,
    xlarge: 36,
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius,
          backgroundColor: source ? 'transparent' : backgroundColor,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius,
            },
          ]}
        />
      ) : name ? (
        <Text
          style={[
            styles.initials,
            { fontSize: fontSizeMap[size] },
            textStyle,
          ]}
        >
          {getInitials(name)}
        </Text>
      ) : (
        <Text style={[styles.initials, { fontSize: fontSizeMap[size] }]}>?</Text>
      )}
    </View>
  );
};

interface AvatarGroupProps {
  avatars: Array<{
    source?: ImageSourcePropType;
    name?: string;
  }>;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 3,
  size = 'medium',
  style,
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <View style={[styles.group, style]}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupItem,
            index > 0 && styles.groupItemOverlap,
          ]}
        >
          <Avatar
            source={avatar.source}
            name={avatar.name}
            size={size}
            style={styles.groupAvatar}
          />
        </View>
      ))}
      {remainingCount > 0 && (
        <View style={[styles.groupItem, styles.groupItemOverlap]}>
          <Avatar
            name={`+${remainingCount}`}
            size={size}
            backgroundColor="#6b7280"
            style={styles.groupAvatar}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  group: {
    flexDirection: 'row',
  },
  groupItem: {
    position: 'relative',
  },
  groupItemOverlap: {
    marginLeft: -12,
  },
  groupAvatar: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
