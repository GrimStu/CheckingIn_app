import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
  Animated,
  BackHandler,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, other } from '../theme/tokens';
import { useApp } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { Toggle } from './Toggle';
import { SetPinModal } from './SetPinModal';
import { clearPin } from '../utils/appLock';
import {
  requestNotificationPermissions,
  rescheduleReminders,
  previewReminderNow,
} from '../store/notifications';

const DRAWER_WIDTH = 288;
const REMINDER_LABELS = ['Morning', 'Midday', 'Evening'];

function initials(name: string): string {
  return name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  return `${h12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}

export function Drawer() {
  const { colors } = useTheme();
  const { profile, updateProfile, stats } = useApp();
  const { drawerOpen, closeDrawer } = useNav();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const [setPinModalOpen, setSetPinModalOpen] = useState(false);

  useEffect(() => {
    translateX.setValue(drawerOpen ? 0 : -DRAWER_WIDTH);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeDrawer();
      return true;
    });
    return () => sub.remove();
  }, [drawerOpen, closeDrawer]);

  async function pickAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      updateProfile({ avatar: result.assets[0].uri });
    }
  }

  async function onToggleDark(v: boolean) {
    updateProfile({ dark: v });
  }

  async function onToggleLock(v: boolean) {
    if (v) {
      setSetPinModalOpen(true);
      return;
    }
    await clearPin();
    updateProfile({ lock: false });
  }

  async function onToggleReminder(index: number, enabled: boolean) {
    const reminders = [...profile.reminders] as typeof profile.reminders;
    reminders[index] = { ...reminders[index], enabled };
    updateProfile({ reminders });
    try {
      if (enabled) await requestNotificationPermissions();
      await rescheduleReminders({ ...profile, reminders }, stats.hasUnfinishedJournal);
    } catch (err) {
      console.warn('Failed to reschedule reminders', err);
    }
  }

  async function onChangeReminderTime(index: number, hour: number, minute: number) {
    const reminders = [...profile.reminders] as typeof profile.reminders;
    reminders[index] = { ...reminders[index], hour, minute };
    updateProfile({ reminders });
    try {
      await rescheduleReminders({ ...profile, reminders }, stats.hasUnfinishedJournal);
    } catch (err) {
      console.warn('Failed to reschedule reminders', err);
    }
  }

  return (
    <>
      {drawerOpen && (
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: other.scrim }]} onPress={closeDrawer} />
      )}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: colors.card,
            transform: [{ translateX }],
          },
        ]}
      >
          <View style={styles.avatarRow}>
            <Pressable onPress={pickAvatar}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: other.avatarGradTo }]}>
                  <Text style={{ color: '#3a352f', fontFamily: fontFamilies.bodyBold, fontSize: 20 }}>
                    {initials(profile.name || '?')}
                  </Text>
                </View>
              )}
            </Pressable>
            <Text style={{ fontFamily: fontFamilies.body, fontSize: 11.5, color: colors.muted, marginTop: 8 }}>
              Tap the circle to add a photo.
            </Text>
          </View>

          <TextInput
            value={profile.name}
            onChangeText={(name) => updateProfile({ name })}
            placeholder="Your name"
            placeholderTextColor={colors.faint}
            style={{
              fontFamily: fontFamilies.heading,
              fontSize: 18,
              color: colors.ink,
              paddingVertical: 4,
            }}
          />

          <Row label="Dark mode" hint="Easier on evening eyes" colors={colors}>
            <Toggle value={profile.dark} onChange={onToggleDark} />
          </Row>

          <Row label="App lock" hint="Face ID, fingerprint, or PIN on opening the app" colors={colors}>
            <Toggle value={profile.lock} onChange={onToggleLock} />
          </Row>

          <Text style={{ fontFamily: fontFamilies.bodyBold, fontSize: 13, color: colors.faint, marginTop: 10 }}>
            REMINDERS & ALARMS
          </Text>

          {profile.reminders.map((r, i) => (
            <View key={i} style={styles.reminderRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 14, color: colors.ink }}>
                  {REMINDER_LABELS[i]}
                </Text>
                <Pressable onPress={() => setEditingTimeIndex(editingTimeIndex === i ? null : i)}>
                  <Text style={{ fontFamily: fontFamilies.body, fontSize: 13, color: colors.muted, marginTop: 2 }}>
                    {formatTime(r.hour, r.minute)}
                  </Text>
                </Pressable>
              </View>
              <Toggle value={r.enabled} onChange={(v) => onToggleReminder(i, v)} />
            </View>
          ))}
          {editingTimeIndex !== null && (
            <TimeStepper
              hour={profile.reminders[editingTimeIndex].hour}
              minute={profile.reminders[editingTimeIndex].minute}
              onChange={(h, m) => onChangeReminderTime(editingTimeIndex, h, m)}
            />
          )}

          <Pressable
            onPress={() =>
              previewReminderNow(stats.hasUnfinishedJournal).catch((err) =>
                console.warn('Failed to preview reminder', err)
              )
            }
          >
            <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 13, color: colors.accent, marginTop: 6 }}>
              Preview a reminder
            </Text>
          </Pressable>

          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: fontFamilies.body, fontSize: 12, color: colors.muted }}>
            {stats.totalCount} check-ins · {stats.streak}-day streak
          </Text>
        </Animated.View>
      <SetPinModal
        visible={setPinModalOpen}
        onCancel={() => setSetPinModalOpen(false)}
        onConfirmed={() => {
          setSetPinModalOpen(false);
          updateProfile({ lock: true });
        }}
      />
    </>
  );
}

function Row({
  label,
  hint,
  children,
  colors,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 14, color: colors.ink }}>{label}</Text>
        <Text style={{ fontFamily: fontFamilies.body, fontSize: 12, color: colors.muted, marginTop: 2 }}>
          {hint}
        </Text>
      </View>
      {children}
    </View>
  );
}

function TimeStepper({
  hour,
  minute,
  onChange,
}: {
  hour: number;
  minute: number;
  onChange: (h: number, m: number) => void;
}) {
  const { colors } = useTheme();
  function bump(field: 'h' | 'm', delta: number) {
    if (field === 'h') onChange(((hour + delta) % 24 + 24) % 24, minute);
    else onChange(hour, ((minute + delta) % 60 + 60) % 60);
  }
  return (
    <View style={[styles.stepper, { borderColor: colors.line2 }]}>
      <StepperCol label="Hour" value={hour.toString().padStart(2, '0')} onUp={() => bump('h', 1)} onDown={() => bump('h', -1)} />
      <StepperCol label="Min" value={minute.toString().padStart(2, '0')} onUp={() => bump('m', 5)} onDown={() => bump('m', -5)} />
    </View>
  );
}

function StepperCol({ label, value, onUp, onDown }: { label: string; value: string; onUp: () => void; onDown: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Pressable onPress={onUp} hitSlop={8}>
        <Text style={{ color: colors.accent, fontSize: 16 }}>▲</Text>
      </Pressable>
      <Text style={{ fontFamily: fontFamilies.heading, fontSize: 18, color: colors.ink, marginVertical: 4 }}>
        {value}
      </Text>
      <Pressable onPress={onDown} hitSlop={8}>
        <Text style={{ color: colors.accent, fontSize: 16 }}>▼</Text>
      </Pressable>
      <Text style={{ fontFamily: fontFamilies.body, fontSize: 10, color: colors.muted }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 26,
    paddingVertical: 22,
    gap: 18,
  },
  avatarRow: {
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
});
