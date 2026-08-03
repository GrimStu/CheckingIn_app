import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, radii, other } from '../../theme/tokens';
import { AppButton } from '../../components/Button';
import { BulletList } from '../../components/BulletList';
import { StepHeader } from '../../components/StepHeader';
import { FadeIn } from '../../components/FadeIn';
import { useApp } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { CheckInEntry } from '../../data/types';
import { rescheduleReminders } from '../../store/notifications';
import { captureJournalPhoto, pickJournalPhoto } from '../../utils/media';

export function JournalStep() {
  const { colors } = useTheme();
  const { draft, addEntry, profile } = useApp();
  const { setCheckinStep } = useNav();
  const [checked, setChecked] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(draft.photo);
  const [saving, setSaving] = useState(false);

  const firstName = profile.name.split(/\s+/)[0] || 'them';
  const feelingPath = [draft.core, draft.second, draft.third]
    .filter(Boolean)
    .map((p) => p!.name)
    .join(' › ');
  const bodySummary = draft.regions.length
    ? `mostly in your ${draft.regions.slice(0, 2).join(', ').toLowerCase()}`
    : '';

  async function takePhoto() {
    const uri = await captureJournalPhoto();
    if (uri) setPhoto(uri);
  }

  async function pickFromGallery() {
    const uri = await pickJournalPhoto();
    if (uri) setPhoto(uri);
  }

  async function save() {
    if (!draft.core || saving) return;
    setSaving(true);
    const journalDone = !!photo || checked;
    const entry: CheckInEntry = {
      version: 1,
      id: `${Date.now()}`,
      timestamp: Date.now(),
      core: draft.core,
      second: draft.second,
      third: draft.third,
      regions: draft.regions,
      sensations: draft.sensations,
      otherSensation: draft.otherSensation,
      photo,
      journalDone,
    };
    await addEntry(entry);
    try {
      await rescheduleReminders(profile, !journalDone);
    } catch (err) {
      console.warn('Failed to reschedule reminders after saving check-in', err);
    }
    setCheckinStep('done');
  }

  return (
    <FadeIn deps={['journal']}>
      <StepHeader label="Journal" step={3} onBack={() => setCheckinStep('body')} />
      <Text style={[styles.title, { color: colors.ink }]}>Give little {firstName} a voice.</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        You felt {feelingPath}{bodySummary ? `, ${bodySummary}` : ''}.
      </Text>

      <LinearGradient
        colors={[colors.grad2, colors.grad1]}
        style={styles.innerChildCard}
      >
        <Text style={{ fontFamily: fontFamilies.heading, fontSize: 17, color: colors.ink, marginBottom: 12 }}>
          Your inner child gets the pen first
        </Text>
        <BulletList
          items={[
            "This part happens on paper, not on a screen. Open your journal and write as your inner child, using your non-dominant hand. The wobbly, child-like writing is the point. Let them say plainly what's been bothering them.",
            'Then swap hands, and respond as the caregiver: warm, steady, on their side. "I hear you, little one. I\'m not going anywhere."',
          ]}
          textColor={colors.ink}
          dotColor={colors.ink}
        />
      </LinearGradient>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="cover" />
      ) : (
        <View style={styles.photoButtons}>
          <Pressable
            style={[styles.outlineButton, { borderColor: colors.line2 }]}
            onPress={takePhoto}
          >
            <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.ink }}>
              Take a photo
            </Text>
          </Pressable>
          <Pressable
            style={[styles.outlineButton, { borderColor: colors.line2 }]}
            onPress={pickFromGallery}
          >
            <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 14, color: colors.ink }}>
              Choose from gallery
            </Text>
          </Pressable>
        </View>
      )}

      <Pressable style={styles.checkboxRow} onPress={() => setChecked((c) => !c)}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: checked ? other.success : colors.line2,
              backgroundColor: checked ? other.success : 'transparent',
            },
          ]}
        >
          {checked && <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>}
        </View>
        <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 14, color: colors.ink }}>
          I've written my journal pages
        </Text>
      </Pressable>

      <Text style={{ fontFamily: fontFamilies.body, fontSize: 12.5, color: colors.muted, marginBottom: 18 }}>
        Not done yet? That's ok — save anyway, and your next reminder will gently nudge you to
        finish the page.
      </Text>

      <AppButton label="Save this check-in" onPress={save} disabled={saving} />
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
  innerChildCard: {
    borderRadius: radii.r18,
    padding: 18,
    marginBottom: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.r16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 230,
    borderRadius: 14,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
