import React, { useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { other } from '../theme/tokens';

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [value]);

  const bg = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.line2, other.success] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.track, { backgroundColor: bg }]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 100,
    padding: 3,
    justifyContent: 'center',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
