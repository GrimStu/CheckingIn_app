import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Profile } from '../data/types';

export const CHECKIN_CATEGORY = 'CHECKIN_CATEGORY';

const REMINDER_LABELS = ['morning', 'midday', 'evening'] as const;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotificationCategory() {
  await Notifications.setNotificationCategoryAsync(CHECKIN_CATEGORY, [
    { identifier: 'CHECK_IN', buttonTitle: 'Check in', options: { opensAppToForeground: true } },
    { identifier: 'LATER', buttonTitle: 'Later', options: { opensAppToForeground: false } },
  ]);

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Check-in reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function reminderBody(journalOutstanding: boolean): string {
  return journalOutstanding
    ? 'How are you feeling? Your inner child’s journal page is waiting, too.'
    : 'How are you feeling? Take two gentle minutes.';
}

// Cancels and re-schedules all three daily reminders based on the current profile + journal state.
export async function rescheduleReminders(profile: Profile, journalOutstanding: boolean) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (let i = 0; i < profile.reminders.length; i++) {
    const r = profile.reminders[i];
    if (!r.enabled) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to check in with yourself',
        body: reminderBody(journalOutstanding),
        categoryIdentifier: CHECKIN_CATEGORY,
        data: { kind: 'reminder', slot: REMINDER_LABELS[i] },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: r.hour,
        minute: r.minute,
      },
    });
  }
}

export async function previewReminderNow(journalOutstanding: boolean) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to check in with yourself',
      body: reminderBody(journalOutstanding),
      categoryIdentifier: CHECKIN_CATEGORY,
      data: { kind: 'preview' },
    },
    trigger: null,
  });
}
