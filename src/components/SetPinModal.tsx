import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../theme/tokens';
import { PinPad } from './PinPad';
import { setPin } from '../utils/appLock';

const PIN_LENGTH = 4;

export function SetPinModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirmed: () => void;
}) {
  const { colors } = useTheme();
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPinValue] = useState('');
  const [error, setError] = useState(false);

  function reset() {
    setStage('create');
    setFirstPin('');
    setPinValue('');
    setError(false);
  }

  function handleCancel() {
    reset();
    onCancel();
  }

  async function handleChange(next: string) {
    setError(false);
    setPinValue(next);
    if (next.length < PIN_LENGTH) return;

    if (stage === 'create') {
      setFirstPin(next);
      setPinValue('');
      setStage('confirm');
      return;
    }

    if (next === firstPin) {
      await setPin(next);
      reset();
      onConfirmed();
    } else {
      setError(true);
      setPinValue('');
      setFirstPin('');
      setStage('create');
    }
  }

  if (!visible) return null;

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.wrap, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.ink }]}>
          {stage === 'create' ? 'Set a PIN' : 'Confirm your PIN'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {stage === 'create'
            ? "You'll use this to unlock the app if Face ID or fingerprint isn't available."
            : 'Enter the same PIN again.'}
        </Text>
        {error && (
          <Text style={[styles.error, { color: colors.faint }]}>
            Those didn't match. Let's try again.
          </Text>
        )}
        <PinPad value={pin} length={PIN_LENGTH} onChange={handleChange} />
        <Pressable onPress={handleCancel} style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.muted }}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 900,
    elevation: 900,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13.5,
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
});
