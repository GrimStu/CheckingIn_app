import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNav } from '../store/NavContext';
import { CheckInFlow } from './checkin/CheckInFlow';
import { HistoryScreen } from './history/HistoryScreen';
import { PracticesIndex } from './practices/PracticesIndex';
import { PracticeDetail } from './practices/PracticeDetail';

export function RootContent() {
  const { colors } = useTheme();
  const { activeTab, openExercise } = useNav();

  let content;
  if (openExercise) {
    content = <PracticeDetail />;
  } else {
    switch (activeTab) {
      case 'checkin':
        content = <CheckInFlow />;
        break;
      case 'history':
        content = <HistoryScreen />;
        break;
      case 'practices':
        content = <PracticesIndex />;
        break;
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
});
