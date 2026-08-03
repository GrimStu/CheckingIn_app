import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, radii } from '../../theme/tokens';
import { AppButton } from '../../components/Button';

const DURATIONS = [5, 10, 15, 20];

function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MeditationTimer() {
  const { colors } = useTheme();
  const [minutes, setMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [running, setRunning] = useState(false);
  const breathe = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    loopRef.current.start();
    return () => loopRef.current?.stop();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft <= 0]);

  function selectDuration(m: number) {
    setMinutes(m);
    setSecondsLeft(m * 60);
    setRunning(false);
  }

  function reset() {
    setSecondsLeft(minutes * 60);
    setRunning(false);
  }

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const opacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] });

  return (
    <View style={{ alignItems: 'center', marginBottom: 22 }}>
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: colors.grad1,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      <Text style={[styles.countdown, { color: colors.ink }]}>{formatMMSS(secondsLeft)}</Text>
      <View style={styles.pillsRow}>
        {DURATIONS.map((m) => (
          <Pressable
            key={m}
            onPress={() => selectDuration(m)}
            style={[
              styles.pill,
              {
                backgroundColor: minutes === m ? colors.btn : colors.soft,
                borderColor: colors.line2,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: fontFamilies.bodySemi,
                fontSize: 13,
                color: minutes === m ? colors.btnText : colors.muted,
              }}
            >
              {m}m
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.buttonsRow}>
        <AppButton
          label={running ? 'Pause' : 'Begin'}
          onPress={() => setRunning((r) => !r)}
          style={{ flex: 1 }}
        />
        <AppButton label="Reset" variant="outline" onPress={reset} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 18,
  },
  countdown: {
    fontFamily: fontFamilies.heading,
    fontSize: 40,
    marginBottom: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  pill: {
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
