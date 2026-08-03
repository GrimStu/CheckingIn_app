import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, wheelColors } from '../../theme/tokens';
import { Card } from '../../components/Card';
import { FadeIn } from '../../components/FadeIn';
import { BulletList } from '../../components/BulletList';
import { useNav } from '../../store/NavContext';
import { MeditationTimer } from './MeditationTimer';
import {
  bodyScanCopy,
  meditationCopy,
  mindfulEatingCopy,
  fiveSensesSteps,
  fiveSensesSubtitle,
  fiveSensesFooter,
} from '../../data/exerciseCopy';

const TITLES: Record<string, string> = {
  bodyscan: 'Body scan',
  meditation: 'Mindfulness meditation',
  eating: 'Mindful eating',
  senses: 'Five senses',
};

const badgeColors = Object.values(wheelColors);

export function PracticeDetail() {
  const { colors } = useTheme();
  const { openExercise, exerciseReturnTo, closeExerciseScreen, setCheckinStep } = useNav();
  if (!openExercise) return null;

  const backLabel = exerciseReturnTo === 'checkin' ? '‹ Back to check-in' : '‹ Practices';

  function goBack() {
    closeExerciseScreen();
  }

  return (
    <FadeIn deps={[openExercise]}>
      <Pressable onPress={goBack} hitSlop={10} style={{ marginBottom: 14 }}>
        <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.muted }}>
          {backLabel}
        </Text>
      </Pressable>
      <Text style={[styles.title, { color: colors.ink }]}>{TITLES[openExercise]}</Text>

      {openExercise === 'meditation' && <MeditationTimer />}

      {openExercise === 'bodyscan' && (
        <Card>
          <BulletList items={bodyScanCopy} textColor={colors.ink} dotColor={colors.accent} />
        </Card>
      )}

      {openExercise === 'meditation' && (
        <Card style={{ marginTop: 4 }}>
          <BulletList items={meditationCopy} textColor={colors.ink} dotColor={colors.accent} />
        </Card>
      )}

      {openExercise === 'eating' && (
        <Card>
          <BulletList items={mindfulEatingCopy} textColor={colors.ink} dotColor={colors.accent} />
        </Card>
      )}

      {openExercise === 'senses' && (
        <View>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {fiveSensesSubtitle} {fiveSensesFooter}
          </Text>
          <View style={{ gap: 12 }}>
            {fiveSensesSteps.map((step, i) => (
              <Card key={step.number} style={styles.senseCard}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: badgeColors[i % badgeColors.length] },
                  ]}
                >
                  <Text style={styles.badgeText}>{step.number}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.senseLabel, { color: colors.ink }]}>{step.label}</Text>
                  <Text style={[styles.paragraph, { color: colors.ink, marginTop: 4 }]}>
                    {step.text}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 23,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13.5,
    marginBottom: 14,
  },
  paragraph: {
    fontFamily: fontFamilies.body,
    fontSize: 14.5,
    lineHeight: 24,
  },
  senseCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    color: '#3a352f',
  },
  senseLabel: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
  },
});
