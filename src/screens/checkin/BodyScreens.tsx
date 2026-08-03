import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, hexToRgba } from '../../theme/tokens';
import { Card } from '../../components/Card';
import { AppButton } from '../../components/Button';
import { TapChip } from '../../components/Pill';
import { StepHeader } from '../../components/StepHeader';
import { FadeIn } from '../../components/FadeIn';
import { BodyFigure } from '../../components/BodyFigure';
import { useApp } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { bodyRegions, sensations } from '../../data/wheelData';
import { bodyScanCopy } from '../../data/exerciseCopy';
import { BulletList } from '../../components/BulletList';

export function BodyIntroStep() {
  const { colors } = useTheme();
  const { draft } = useApp();
  const { setCheckinStep } = useNav();
  const feelingName = draft.core?.name ?? 'this';

  return (
    <FadeIn deps={['bodyIntro']}>
      <StepHeader label="Body" step={2} onBack={() => setCheckinStep('confirm')} />
      <Text style={[styles.title, { color: colors.ink }]}>Now, let's find it in your body.</Text>
      <Card style={{ marginTop: 16, marginBottom: 12 }}>
        <Text style={[styles.paragraph, { color: colors.ink }]}>
          Right now, you're feeling <Text style={{ fontFamily: fontFamilies.bodyBold }}>{feelingName}</Text>.
        </Text>
      </Card>
      <Card style={{ marginBottom: 18 }}>
        <BulletList items={bodyScanCopy} textColor={colors.ink} dotColor={colors.accent} />
      </Card>
      <AppButton label="I've scanned. Show me the body map." onPress={() => setCheckinStep('body')} />
    </FadeIn>
  );
}

const HOTSPOT_SIZE = 34;
const FIGURE_SIZE = 220;
const SCALE = FIGURE_SIZE / 200;

export function BodyMapStep() {
  const { colors, bodyFigureColors } = useTheme();
  const { draft, setDraft } = useApp();
  const { setCheckinStep } = useNav();
  const [otherText, setOtherText] = useState(draft.otherSensation ?? '');
  const [otherOpen, setOtherOpen] = useState(!!draft.otherSensation);
  const feelingName = draft.core?.name ?? 'it';

  function toggleRegion(name: string) {
    setDraft((prev) => ({
      ...prev,
      regions: prev.regions.includes(name)
        ? prev.regions.filter((r) => r !== name)
        : [...prev.regions, name],
    }));
  }

  function toggleSensation(name: string) {
    setDraft((prev) => ({
      ...prev,
      sensations: prev.sensations.includes(name)
        ? prev.sensations.filter((s) => s !== name)
        : [...prev.sensations, name],
    }));
  }

  return (
    <FadeIn deps={['body']}>
      <StepHeader label="Body" step={2} onBack={() => setCheckinStep('bodyIntro')} />
      <Text style={[styles.title, { color: colors.ink }]}>Where does {feelingName.toLowerCase()} live right now?</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Tap the body, or the labels below. Choose as many places as you need, or none at all.
      </Text>

      <View style={{ width: FIGURE_SIZE, height: (FIGURE_SIZE * 330) / 200, alignSelf: 'center', marginVertical: 12 }}>
        <BodyFigure size={FIGURE_SIZE} fill={bodyFigureColors.fill} stroke={bodyFigureColors.stroke} />
        {bodyRegions
          .filter((r) => r.hasHotspot)
          .map((r) => {
            const selected = draft.regions.includes(r.name);
            return (
              <Pressable
                key={r.name}
                onPress={() => toggleRegion(r.name)}
                style={[
                  styles.hotspot,
                  {
                    left: r.x * SCALE - HOTSPOT_SIZE / 2,
                    top: r.y * SCALE - HOTSPOT_SIZE / 2,
                    backgroundColor: selected
                      ? hexToRgba(draft.core?.color ?? colors.accent, 0.3)
                      : hexToRgba(colors.ink, 0.08),
                    borderColor: colors.ink,
                    borderStyle: selected ? 'solid' : 'dashed',
                    borderWidth: selected ? 3 : 2,
                  },
                ]}
              />
            );
          })}
      </View>

      <View style={styles.chipsRow}>
        {bodyRegions.map((r) => (
          <TapChip
            key={r.name}
            label={r.name}
            selected={draft.regions.includes(r.name)}
            onPress={() => toggleRegion(r.name)}
          />
        ))}
      </View>

      <Text style={[styles.cardTitle, { color: colors.ink }]}>How does it feel there?</Text>
      <View style={styles.chipsRow}>
        {sensations.map((s) => (
          <TapChip
            key={s}
            label={s}
            selected={draft.sensations.includes(s)}
            onPress={() => toggleSensation(s)}
          />
        ))}
        <TapChip label="Other…" dashed selected={otherOpen} onPress={() => setOtherOpen((o) => !o)} />
      </View>
      {otherOpen && (
        <TextInput
          value={otherText}
          onChangeText={(t) => {
            setOtherText(t);
            setDraft({ otherSensation: t });
          }}
          placeholder="Name the sensation in your own words…"
          placeholderTextColor={colors.faint}
          style={[styles.input, { borderColor: colors.line2, color: colors.ink }]}
        />
      )}

      <AppButton label="Continue" onPress={() => setCheckinStep('journal')} style={{ marginTop: 22 }} />
      <Text style={{ fontFamily: fontFamilies.body, fontSize: 12.5, color: colors.muted, textAlign: 'center', marginTop: 12 }}>
        Nothing showing up right now, or feeling overwhelmed? That's okay. Continue without picking
        anything.
      </Text>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 23,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    marginBottom: 16,
  },
  paragraph: {
    fontFamily: fontFamilies.body,
    fontSize: 14.5,
    lineHeight: 24,
  },
  hotspot: {
    position: 'absolute',
    width: HOTSPOT_SIZE,
    height: HOTSPOT_SIZE,
    borderRadius: HOTSPOT_SIZE / 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    marginBottom: 16,
  },
});
