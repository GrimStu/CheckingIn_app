import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, radii } from '../theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({ label, onPress, variant = 'filled', disabled, style }: Props) {
  const { colors } = useTheme();

  const bg = disabled ? colors.line2 : variant === 'filled' ? colors.btn : colors.card;
  const textColor = disabled ? colors.faint : variant === 'filled' ? colors.btnText : colors.ink;
  const border = variant === 'outline' ? { borderWidth: 1, borderColor: colors.line2 } : null;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
        border,
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.r16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 15,
  },
});
