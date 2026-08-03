import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../theme/tokens';

export function StepHeader({
  label,
  step,
  totalSteps = 3,
  onBack,
}: {
  label: string;
  step: number; // 1-indexed
  totalSteps?: number;
  onBack?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={10}>
            <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.muted }}>
              ‹ Back
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text
        style={{
          fontFamily: fontFamilies.bodyBold,
          fontSize: 12,
          letterSpacing: 1.2,
          color: colors.faint,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View style={[styles.side, styles.dotsWrap]}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i < step ? colors.ink : colors.line2 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  side: {
    minWidth: 60,
  },
  dotsWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
