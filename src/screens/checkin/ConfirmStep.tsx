import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies } from '../../theme/tokens';
import { WordChip } from '../../components/Pill';
import { AppButton } from '../../components/Button';
import { FadeIn } from '../../components/FadeIn';
import { useApp } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';

export function ConfirmStep() {
  const { colors } = useTheme();
  const { draft } = useApp();
  const { setCheckinStep } = useNav();

  const picks = [draft.core, draft.second, draft.third].filter(Boolean) as NonNullable<
    typeof draft.core
  >[];

  function adjust() {
    setCheckinStep('sky');
  }

  return (
    <FadeIn deps={['confirm']}>
      <View style={styles.wrap}>
        <Text style={[styles.eyebrow, { color: colors.muted }]}>So, right now you're feeling…</Text>
        <View style={styles.stack}>
          {picks.map((p, i) => (
            <WordChip key={i} label={p.name} color={p.color} size={i as 0 | 1 | 2} />
          ))}
        </View>
        <Text style={[styles.question, { color: colors.ink }]}>Does that feel right?</Text>
        <View style={styles.buttons}>
          <AppButton label="Adjust" variant="outline" onPress={adjust} style={{ flex: 1 }} />
          <AppButton
            label="Yes — continue"
            variant="filled"
            onPress={() => setCheckinStep('bodyIntro')}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 34,
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: fontFamilies.body,
    fontSize: 14.5,
    marginBottom: 20,
  },
  stack: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  question: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    marginBottom: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
