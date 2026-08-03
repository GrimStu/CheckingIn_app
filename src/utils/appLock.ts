import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';

// SecureStore and LocalAuthentication only support Android/iOS. Every export here
// fails safe (no-op / false) on other platforms rather than throwing, since the
// web preview is a dev convenience, not a target platform for this feature.
const SUPPORTED = Platform.OS === 'android' || Platform.OS === 'ios';

const PIN_HASH_KEY = 'checkingIn.pinHash';
const PIN_SALT_KEY = 'checkingIn.pinSalt';

function randomSalt(): string {
  const bytes = Crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

export async function hasPinSet(): Promise<boolean> {
  if (!SUPPORTED) return false;
  try {
    const hash = await SecureStore.getItemAsync(PIN_HASH_KEY);
    return !!hash;
  } catch (err) {
    console.warn('hasPinSet failed', err);
    return false;
  }
}

export async function setPin(pin: string): Promise<void> {
  if (!SUPPORTED) return;
  const salt = randomSalt();
  const hash = await hashPin(pin, salt);
  await SecureStore.setItemAsync(PIN_SALT_KEY, salt);
  await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
}

export async function verifyPin(pin: string): Promise<boolean> {
  if (!SUPPORTED) return false;
  try {
    const salt = await SecureStore.getItemAsync(PIN_SALT_KEY);
    const storedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);
    if (!salt || !storedHash) return false;
    const hash = await hashPin(pin, salt);
    return hash === storedHash;
  } catch (err) {
    console.warn('verifyPin failed', err);
    return false;
  }
}

export async function clearPin(): Promise<void> {
  if (!SUPPORTED) return;
  try {
    await SecureStore.deleteItemAsync(PIN_HASH_KEY);
    await SecureStore.deleteItemAsync(PIN_SALT_KEY);
  } catch (err) {
    console.warn('clearPin failed', err);
  }
}

export async function isBiometricAvailable(): Promise<boolean> {
  if (!SUPPORTED) return false;
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;
    return await LocalAuthentication.isEnrolledAsync();
  } catch (err) {
    console.warn('isBiometricAvailable failed', err);
    return false;
  }
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  if (!SUPPORTED) return false;
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Checking In',
      disableDeviceFallback: true,
    });
    return result.success;
  } catch (err) {
    console.warn('authenticateWithBiometrics failed', err);
    return false;
  }
}
