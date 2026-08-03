import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies } from '../../theme/tokens';
import { EmotionsWheel } from '../../components/wheel/EmotionsWheel';
import { CrumbChip } from '../../components/Pill';
import { StepHeader } from '../../components/StepHeader';
import { FadeIn } from '../../components/FadeIn';
import { useApp } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { greeting, nextReminderText } from '../../utils/dates';
import { WordPick } from '../../data/types';

function Crumbs({ core, second, third }: { core?: WordPick; second?: WordPick; third?: WordPick }) {
  const picks = [core, second, third].filter(Boolean) as WordPick[];
  if (picks.length === 0) return null;
  return (
    <View style={styles.crumbRow}>
      {picks.map((p, i) => (
        <CrumbChip key={i} label={p.name} color={p.color} />
      ))}
    </View>
  );
}

export function WheelLayer1() {
  const { colors } = useTheme();
  const { draft, setDraft, profile, entries, stats } = useApp();
  const { setCheckinStep } = useNav();
  const firstName = profile.name.split(/\s+/)[0] || 'there';
  const reminderText = nextReminderText(profile);

  return (
    <FadeIn deps={['wheel1']}>
      <StepHeader label="Feeling" step={1} />
      <Text style={[styles.greeting, { color: colors.muted }]}>
        {greeting()}, {firstName}.{reminderText ? ` · next check-in ${reminderText}` : ''}
      </Text>
      {stats.hasUnfinishedJournal && (
        <View style={[styles.softPill, { backgroundColor: colors.soft }]}>
          <Text style={{ fontFamily: fontFamilies.body, fontSize: 13, color: colors.ink }}>
            Your inner child's journal page is still waiting — it's added to your next reminder.
          </Text>
        </View>
      )}
      <Text style={[styles.title, { color: colors.ink }]}>How are you feeling?</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Begin at the centre, then tap whichever feeling feels closest.
      </Text>
      <EmotionsWheel
        key="layer1"
        layer={1}
        core={draft.core}
        gapColor={colors.bg}
        onSelectCore={(pick) => {
          setDraft({ core: pick, second: undefined, third: undefined, lastWheelLayer: 1 });
          setCheckinStep('wheel2');
        }}
        onSelectSecondary={() => {}}
        onSelectTertiary={() => {}}
      />
      <Crumbs core={draft.core} />
    </FadeIn>
  );
}

export function WheelLayer2() {
  const { colors } = useTheme();
  const { draft, setDraft } = useApp();
  const { setCheckinStep } = useNav();

  return (
    <FadeIn deps={['wheel2']}>
      <StepHeader label="Feeling" step={1} onBack={() => setCheckinStep('wheel1')} />
      <Text style={[styles.title, { color: colors.ink }]}>Let's get closer.</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Any section — whichever word is closest right now.
      </Text>
      <EmotionsWheel
        key="layer2"
        layer={2}
        core={draft.core}
        second={draft.second}
        gapColor={colors.bg}
        onSelectCore={() => {}}
        onSelectSecondary={(pick) => {
          setDraft({ second: pick, third: undefined, lastWheelLayer: 2 });
          setCheckinStep('wheel3');
        }}
        onSelectTertiary={() => {}}
      />
      <Crumbs core={draft.core} second={draft.second} />
    </FadeIn>
  );
}

export function WheelLayer3() {
  const { colors } = useTheme();
  const { draft, setDraft } = useApp();
  const { setCheckinStep } = useNav();

  return (
    <FadeIn deps={['wheel3']}>
      <StepHeader label="Feeling" step={1} onBack={() => setCheckinStep('wheel2')} />
      <Text style={[styles.title, { color: colors.ink }]}>And more precisely?</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Optional — tap a colour in the centre to bring that section forward, then choose a word.
        Or just continue.
      </Text>
      <EmotionsWheel
        key="layer3"
        layer={3}
        core={draft.core}
        second={draft.second}
        third={draft.third}
        gapColor={colors.bg}
        onSelectCore={() => {}}
        onSelectSecondary={() => {}}
        onSelectTertiary={(pick) => {
          setDraft({ third: pick, lastWheelLayer: 3 });
          setCheckinStep('confirm');
        }}
      />
      <Crumbs core={draft.core} second={draft.second} third={draft.third} />
      <Pressable
        style={[styles.pillButton, { borderColor: colors.line2, backgroundColor: colors.card }]}
        onPress={() => {
          setDraft({ lastWheelLayer: 3 });
          setCheckinStep('confirm');
        }}
      >
        <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.ink }}>
          That's close enough — continue
        </Text>
      </Pressable>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    marginBottom: 10,
  },
  softPill: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    marginBottom: 18,
  },
  crumbRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
    justifyContent: 'center',
  },
  pillButton: {
    marginTop: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
});
