import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies } from '../../theme/tokens';
import { FadeIn } from '../../components/FadeIn';
import { useNav, HistoryTab } from '../../store/NavContext';
import { Timeline } from './Timeline';
import { CalendarView } from './CalendarView';
import { PatternsView } from './PatternsView';

const TABS: { key: HistoryTab; label: string }[] = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'patterns', label: 'Patterns' },
];

export function HistoryScreen() {
  const { colors } = useTheme();
  const { historyTab, setHistoryTab } = useNav();

  return (
    <FadeIn deps={['history']}>
      <Text style={[styles.title, { color: colors.ink }]}>Your check-ins</Text>
      <View style={styles.tabRow}>
        {TABS.map((t) => {
          const active = historyTab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setHistoryTab(t.key)}
              style={[
                styles.tab,
                { backgroundColor: active ? colors.btn : colors.soft },
              ]}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.bodySemi,
                  fontSize: 13,
                  color: active ? colors.btnText : colors.muted,
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {historyTab === 'timeline' && <Timeline />}
      {historyTab === 'calendar' && <CalendarView />}
      {historyTab === 'patterns' && <PatternsView />}
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  tab: {
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
