import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckInEntry, Profile, DEFAULT_PROFILE } from '../data/types';
import { migrateEntry } from './migrations';

const ENTRIES_KEY = 'checkingIn.entries';
const PROFILE_KEY = 'checkingIn.profile';

export async function loadEntries(): Promise<CheckInEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as any[];
    let anyMigrated = false;
    const upgraded = parsed.map((rawEntry) => {
      const startingVersion = rawEntry.version;
      const migrated = migrateEntry(rawEntry);
      if (migrated.version !== startingVersion) anyMigrated = true;
      return migrated;
    });
    if (anyMigrated) await saveEntries(upgraded);
    return upgraded;
  } catch {
    return [];
  }
}

export async function saveEntries(entries: CheckInEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function loadProfile(): Promise<Profile> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return DEFAULT_PROFILE;
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as Profile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
