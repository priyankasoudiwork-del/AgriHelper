import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';

interface BilingualTextProps extends TextProps {
  kannada: string;
  english: string;
  kannadaStyle?: TextStyle;
  englishStyle?: TextStyle;
  separator?: string;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  kannada,
  english,
  style,
  kannadaStyle,
  englishStyle,
  separator = ' | ',
  ...props
}) => {
  return (
    <Text style={style} {...props}>
      <Text style={kannadaStyle}>{kannada}</Text>
      <Text>{separator}</Text>
      <Text style={englishStyle}>{english}</Text>
    </Text>
  );
};
