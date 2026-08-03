import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useFonts, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { Karla_400Regular, Karla_500Medium, Karla_600SemiBold, Karla_700Bold } from '@expo-google-fonts/karla';

import { AppProvider, useApp } from './src/store/AppContext';
import { NavProvider, useNav } from './src/store/NavContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { TopBar } from './src/components/TopBar';
import { BottomNav } from './src/components/BottomNav';
import { Drawer } from './src/components/Drawer';
import { LockScreen } from './src/components/LockScreen';
import { RootContent } from './src/screens/RootContent';
import {
  setupNotificationCategory,
  requestNotificationPermissions,
  rescheduleReminders,
} from './src/store/notifications';

function NotificationBridge() {
  const { profile, stats, resetDraft, inProgress } = useApp();
  const { setActiveTab, setCheckinStep, closeExerciseScreen } = useNav();
  const didInit = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        await setupNotificationCategory();
        const granted = await requestNotificationPermissions();
        if (granted) {
          await rescheduleReminders(profile, stats.hasUnfinishedJournal);
        }
      } catch (err) {
        console.warn('Notification setup failed', err);
      }
    })();

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (response.actionIdentifier === 'LATER') return;
      closeExerciseScreen();
      if (!inProgress) {
        resetDraft();
        setCheckinStep('wheel1');
      }
      setActiveTab('checkin');
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    rescheduleReminders(profile, stats.hasUnfinishedJournal).catch((err) =>
      console.warn('Failed to reschedule reminders', err)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.hasUnfinishedJournal]);

  return null;
}

function Shell() {
  const { colors } = useTheme();
  const { profile } = useApp();
  const [locked, setLocked] = useState(profile.lock);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (profile.lock && next !== 'active') {
        setLocked(true);
      }
    });
    return () => sub.remove();
  }, [profile.lock]);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <NotificationBridge />
      <TopBar />
      <RootContent />
      <BottomNav />
      <Drawer />
      {profile.lock && locked && <LockScreen onUnlock={() => setLocked(false)} />}
    </SafeAreaView>
  );
}

function ThemedShell() {
  const { profile, ready } = useApp();
  if (!ready) return <View style={styles.flex} />;
  return (
    <ThemeProvider dark={profile.dark}>
      <NavProvider>
        <StatusBar style={profile.dark ? 'light' : 'dark'} />
        <Shell />
      </NavProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    Karla_400Regular,
    Karla_500Medium,
    Karla_600SemiBold,
    Karla_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemedShell />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
