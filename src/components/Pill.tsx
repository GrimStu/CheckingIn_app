import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, radii, hexToRgba } from '../theme/tokens';

// Small pill chip, tinted by a section color, growing/shrinking per size 0|1|2.
export function WordChip({
  label,
  color,
  size = 0,
  onPress,
  selected,
}: {
  label: string;
  color?: string;
  size?: 0 | 1 | 2;
  onPress?: () => void;
  selected?: boolean;
}) {
  const { colors } = useTheme();
  const fontSize = [15, 17, 19][size];
  const padV = [9, 11, 13][size];
  const padH = [20, 25, 30][size];
  const tint = [0.04, 0.16, 0.26][size];
  const bg = color ? hexToRgba(color, tint) : colors.soft;

  const Comp = onPress ? Pressable : View;
  return (
    <Comp
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          paddingVertical: padV,
          paddingHorizontal: padH,
          borderWidth: selected ? 1.5 : 0,
          borderColor: colors.ink,
        },
      ]}
    >
      <Text style={{ fontFamily: fontFamilies.heading, fontSize, color: colors.ink }}>{label}</Text>
    </Comp>
  );
}

// Small crumb chip below the wheel
export function CrumbChip({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.crumb, { backgroundColor: hexToRgba(color, 0.16) }]}>
      <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 13, color }}>{label}</Text>
    </View>
  );
}

// Generic tappable chip (sensations, regions, tabs)
export function TapChip({
  label,
  selected,
  onPress,
  dashed,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  dashed?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tapChip,
        {
          backgroundColor: selected ? hexToRgba(colors.ink, 0.1) : colors.soft,
          borderWidth: selected ? 1.5 : dashed ? 1 : 0,
          borderColor: colors.ink,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 13, color: colors.ink }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  crumb: {
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tapChip: {
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
