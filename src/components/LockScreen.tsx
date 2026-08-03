import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../theme/tokens';
import { PinPad } from './PinPad';
import { useApp } from '../store/AppContext';
import { isBiometricAvailable, authenticateWithBiometrics, verifyPin, clearPin } from '../utils/appLock';

const PIN_LENGTH = 4;

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { colors } = useTheme();
  const { updateProfile } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const available = await isBiometricAvailable();
      setBiometricAvailable(available);
      if (available) {
        const ok = await authenticateWithBiometrics();
        if (ok) onUnlock();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pin.length < PIN_LENGTH) return;
    (async () => {
      const ok = await verifyPin(pin);
      if (ok) {
        onUnlock();
      } else {
        setError(true);
        setPin('');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  async function retryBiometric() {
    const ok = await authenticateWithBiometrics();
    if (ok) onUnlock();
  }

  function forgotPin() {
    Alert.alert(
      'Reset app lock?',
      "This turns App lock off so you can get back in. You won't lose any check-ins. You can set a new PIN afterward from the drawer.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Turn off app lock',
          style: 'destructive',
          onPress: async () => {
            await clearPin();
            await updateProfile({ lock: false });
            onUnlock();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.wrap, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.ink }]}>Enter your PIN</Text>
        {error && (
          <Text style={[styles.error, { color: colors.faint }]}>That PIN didn't match. Try again.</Text>
        )}
        <PinPad value={pin} length={PIN_LENGTH} onChange={(v) => { setError(false); setPin(v); }} />
        {biometricAvailable && (
          <Pressable onPress={retryBiometric} style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.accent }}>
              Use Face ID / fingerprint instead
            </Text>
          </Pressable>
        )}
        <Pressable onPress={forgotPin} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ fontFamily: fontFamilies.body, fontSize: 13, color: colors.muted }}>
            Forgot your PIN?
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 1000,
    elevation: 1000,
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
    marginBottom: 12,
  },
  error: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
});
