import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radii } from '../theme/tokens';

export function Card({
  children,
  style,
  padding = 18,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.card, borderColor: colors.line, padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.r18,
    borderWidth: 1,
  },
});
