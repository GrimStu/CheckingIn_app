import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, radii } from '../../theme/tokens';
import { FadeIn } from '../../components/FadeIn';
import { useNav, ExerciseName } from '../../store/NavContext';

const CARDS: { key: ExerciseName; title: string; blurb: string; duration: string }[] = [
  {
    key: 'bodyscan',
    title: 'Body scan',
    blurb: 'Travel slowly through your body, just noticing sensations. Nothing to fix.',
    duration: '5–10 minutes',
  },
  {
    key: 'meditation',
    title: 'Mindfulness meditation',
    blurb: 'Sit with your breath and watch thoughts pass, like an outside observer.',
    duration: '10 minutes, with timer',
  },
  {
    key: 'eating',
    title: 'Mindful eating',
    blurb: 'One raisin, all of your attention. Look, touch, smell, taste — slowly.',
    duration: '5 minutes',
  },
  {
    key: 'senses',
    title: 'Five senses',
    blurb: 'A quick grounding: 5 see, 4 feel, 3 hear, 2 smell, 1 taste.',
    duration: '1–2 minutes',
  },
];

export function PracticesIndex() {
  const { colors } = useTheme();
  const { openExerciseScreen } = useNav();

  return (
    <FadeIn deps={['practices']}>
      <Text style={[styles.title, { color: colors.ink }]}>Practices</Text>
      <View style={{ gap: 14 }}>
        {CARDS.map((card, i) => (
          <Pressable key={card.key} onPress={() => openExerciseScreen(card.key, 'practices')}>
            <LinearGradient
              colors={i % 2 === 0 ? [colors.grad1, colors.grad2] : [colors.grad2, colors.grad1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <Text style={[styles.cardTitle, { color: colors.ink }]}>{card.title}</Text>
              <Text style={[styles.cardBlurb, { color: colors.muted }]}>{card.blurb}</Text>
              <Text style={[styles.cardDuration, { color: colors.accent }]}>{card.duration} ›</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    marginBottom: 16,
  },
  card: {
    borderRadius: radii.r20,
    padding: 18,
  },
  cardTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 17,
    marginBottom: 6,
  },
  cardBlurb: {
    fontFamily: fontFamilies.body,
    fontSize: 13.5,
    marginBottom: 10,
    lineHeight: 19,
  },
  cardDuration: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
  },
});
