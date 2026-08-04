import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, skyWordColor } from '../../theme/tokens';
import { EmotionSky } from '../../components/sky/EmotionSky';
import { WordChip } from '../../components/Pill';
import { StepHeader } from '../../components/StepHeader';
import { AppButton } from '../../components/Button';
import { FadeIn } from '../../components/FadeIn';
import { useApp } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { markers, TaxonomyWord } from '../../data/taxonomy';
import { CURRENT_ENTRY_VERSION } from '../../store/migrations';
import { WordPick, CheckInEntry } from '../../data/types';
import { greeting, nextReminderText } from '../../utils/dates';

const SKY_HEIGHT = 420;

function toWordPick(word: TaxonomyWord): WordPick {
  return {
    id: word.id,
    name: word.label,
    valence: word.valence,
    arousal: word.arousal,
    color: skyWordColor,
  };
}

export function SkyStep() {
  const { colors } = useTheme();
  const { draft, setDraft, addEntry, profile, stats } = useApp();
  const { setCheckinStep } = useNav();
  const [pendingMarker, setPendingMarker] = useState<TaxonomyWord | null>(null);

  const firstName = profile.name.split(/\s+/)[0] || 'there';
  const reminderText = nextReminderText(profile);

  const picks = [draft.core, draft.second, draft.third].filter(Boolean) as WordPick[];
  const selectedIds = picks.map((p) => p.id);

  function removePick(id: string) {
    const remaining = picks.filter((p) => p.id !== id);
    setDraft({ core: remaining[0], second: remaining[1], third: remaining[2] });
  }

  function toggle(word: TaxonomyWord) {
    if (selectedIds.includes(word.id)) {
      removePick(word.id);
      return;
    }
    if (picks.length >= 3) return;
    const next = [...picks, toWordPick(word)];
    setDraft({ core: next[0], second: next[1], third: next[2] });
  }

  function pickMarker(marker: TaxonomyWord) {
    setDraft({ core: toWordPick(marker), second: undefined, third: undefined });
    setPendingMarker(marker);
  }

  function saveMarkerAndExit() {
    if (!pendingMarker) return;
    const entry: CheckInEntry = {
      version: CURRENT_ENTRY_VERSION,
      id: `${Date.now()}`,
      timestamp: Date.now(),
      core: toWordPick(pendingMarker),
      regions: [],
      sensations: [],
      journalDone: false,
    };
    addEntry(entry);
    setPendingMarker(null);
    setCheckinStep('done');
  }

  function keepGoing() {
    // The marker stays as the first pick; the sky opens to add up to two more.
    setPendingMarker(null);
  }

  return (
    <FadeIn deps={['sky']}>
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
        Tap up to three words, wherever they sit. Drag or pinch to move around the sky.
      </Text>

      <View style={styles.markerRow}>
        <Text style={{ fontFamily: fontFamilies.body, fontSize: 12.5, color: colors.muted, marginRight: 8 }}>
          Or, quickly:
        </Text>
        {markers.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => pickMarker(m)}
            style={[styles.markerChip, { borderColor: colors.line2, backgroundColor: colors.card }]}
          >
            <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.ink }}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      {pendingMarker ? (
        <View style={[styles.markerPanel, { borderColor: colors.line2, backgroundColor: colors.soft }]}>
          <Text style={{ fontFamily: fontFamilies.body, fontSize: 14, color: colors.ink, marginBottom: 12 }}>
            That's {pendingMarker.label} Want to get closer?
          </Text>
          <View style={styles.markerPanelButtons}>
            <AppButton label="No, that's it" variant="outline" onPress={saveMarkerAndExit} style={{ flex: 1 }} />
            <AppButton label="Yes, get closer" onPress={keepGoing} style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <>
          <EmotionSky selectedIds={selectedIds} onToggle={toggle} height={SKY_HEIGHT} />

          <View style={styles.crumbRow}>
            {picks.map((p, i) => (
              <WordChip key={p.id} label={p.name} color={p.color} selected size={i as 0 | 1 | 2} onPress={() => removePick(p.id)} />
            ))}
          </View>
          <Text style={{ fontFamily: fontFamilies.body, fontSize: 12, color: colors.faint, textAlign: 'center', marginTop: 4 }}>
            {picks.length} / 3 selected
          </Text>

          <AppButton
            label="Continue"
            disabled={picks.length === 0}
            onPress={() => setCheckinStep('confirm')}
            style={{ marginTop: 18 }}
          />
        </>
      )}
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  greeting: { fontFamily: fontFamilies.body, fontSize: 14, marginBottom: 10 },
  softPill: { borderRadius: 12, padding: 12, marginBottom: 14 },
  title: { fontFamily: fontFamilies.heading, fontSize: 24, marginBottom: 6 },
  subtitle: { fontFamily: fontFamilies.body, fontSize: 14, marginBottom: 14 },
  markerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 14, gap: 8 },
  markerChip: { borderWidth: 1, borderRadius: 100, paddingVertical: 8, paddingHorizontal: 16 },
  markerPanel: { borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 4 },
  markerPanelButtons: { flexDirection: 'row', gap: 12, marginTop: 4 },
  crumbRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' },
});
