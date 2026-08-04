import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, other } from '../../theme/tokens';
import { AppButton } from '../../components/Button';
import { FadeIn } from '../../components/FadeIn';
import { useApp } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';

export function DoneStep() {
  const { colors } = useTheme();
  const { draft, resetDraft } = useApp();
  const { setCheckinStep, setActiveTab } = useNav();
  const feelingName = draft.core?.name?.toLowerCase() ?? 'this';

  function finish() {
    resetDraft();
    setCheckinStep('sky');
  }

  return (
    <FadeIn deps={['done']}>
      <View style={styles.wrap}>
        <View style={[styles.circle, { backgroundColor: other.celebrationGreen }]}>
          <Text style={{ fontSize: 40 }}>✓</Text>
        </View>
        <Text style={[styles.title, { color: colors.ink }]}>Well done on checking in.</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          You noticed you were feeling {feelingName}, and gave it some room.
        </Text>
        <View style={styles.buttons}>
          <AppButton
            label="View history"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => {
              finish();
              setActiveTab('history');
            }}
          />
          <AppButton label="Done" variant="filled" style={{ flex: 1 }} onPress={finish} />
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 56,
    alignItems: 'center',
  },
  circle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 23,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14.5,
    textAlign: 'center',
    marginBottom: 26,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
