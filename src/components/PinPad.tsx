import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../theme/tokens';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export function PinPad({
  value,
  length,
  onChange,
}: {
  value: string;
  length: number;
  onChange: (next: string) => void;
}) {
  const { colors } = useTheme();

  function press(key: string) {
    if (key === '') return;
    if (key === '⌫') {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length >= length) return;
    onChange(value + key);
  }

  return (
    <View>
      <View style={styles.dotsRow}>
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                borderColor: colors.line2,
                backgroundColor: i < value.length ? colors.ink : 'transparent',
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.grid}>
        {KEYS.map((key, i) => (
          <Pressable
            key={i}
            onPress={() => press(key)}
            disabled={key === ''}
            style={[styles.key, key === '' && styles.keyHidden]}
          >
            <Text style={{ fontFamily: fontFamilies.heading, fontSize: 22, color: colors.ink }}>
              {key}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: '33.33%',
    aspectRatio: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyHidden: {
    opacity: 0,
  },
});
