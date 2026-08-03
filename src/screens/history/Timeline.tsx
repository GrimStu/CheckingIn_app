import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, other } from '../../theme/tokens';
import { Card } from '../../components/Card';
import { ImageViewerModal } from '../../components/ImageViewerModal';
import { useApp } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { dayHeading, timeOfDay } from '../../utils/dates';
import { CheckInEntry } from '../../data/types';
import { captureJournalPhoto, pickJournalPhoto } from '../../utils/media';

export function Timeline() {
  const { colors } = useTheme();
  const { entries, deleteEntry } = useApp();
  const { expandedEntryId, setExpandedEntryId } = useNav();

  const groups = useMemo(() => {
    const map = new Map<string, CheckInEntry[]>();
    for (const e of entries) {
      const key = dayHeading(e.timestamp);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [entries]);

  if (entries.length === 0) {
    return (
      <Text style={{ fontFamily: fontFamilies.body, fontSize: 14, color: colors.muted, marginTop: 20 }}>
        No check-ins yet. Your first one will show up here.
      </Text>
    );
  }

  return (
    <View>
      {groups.map(([heading, dayEntries]) => (
        <View key={heading} style={{ marginBottom: 18 }}>
          <Text style={[styles.dayHeading, { color: colors.faint }]}>{heading}</Text>
          {dayEntries.map((e) => (
            <TimelineEntryCard
              key={e.id}
              entry={e}
              expanded={expandedEntryId === e.id}
              onToggleExpand={() => setExpandedEntryId(expandedEntryId === e.id ? null : e.id)}
              onDelete={() => deleteEntry(e.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function TimelineEntryCard({
  entry: e,
  expanded,
  onToggleExpand,
  onDelete,
}: {
  entry: CheckInEntry;
  expanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
}) {
  const { colors } = useTheme();
  const { updateEntry } = useApp();
  const [busy, setBusy] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const path = [e.core, e.second, e.third].filter(Boolean).map((p) => p!.name).join(' › ');
  const bodyLine = e.regions.length
    ? `In the ${e.regions.slice(0, 2).join(', ').toLowerCase()}${
        e.sensations.length ? ` — ${e.sensations.slice(0, 2).join(', ').toLowerCase()}` : ''
      }`
    : null;

  async function addPhoto(fromCamera: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      const uri = fromCamera ? await captureJournalPhoto() : await pickJournalPhoto();
      if (uri) await updateEntry(e.id, { photo: uri, journalDone: true });
    } finally {
      setBusy(false);
    }
  }

  function markDone() {
    if (busy) return;
    updateEntry(e.id, { journalDone: true });
  }

  return (
    <>
      <Pressable onPress={onToggleExpand}>
        <Card style={{ marginBottom: 10 }} padding={0}>
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: e.core.color }]} />
            <Text style={[styles.path, { color: colors.ink }]} numberOfLines={1}>
              {path}
            </Text>
            <Text style={[styles.time, { color: colors.muted }]}>{timeOfDay(e.timestamp)}</Text>
          </View>
          {bodyLine && <Text style={[styles.bodyLine, { color: colors.muted }]}>{bodyLine}</Text>}
          {!e.journalDone && (
            <View style={[styles.tag, { backgroundColor: other.warningTagBg }]}>
              <Text style={{ color: other.warningTagText, fontSize: 11.5, fontFamily: fontFamilies.bodySemi }}>
                journal page waiting
              </Text>
            </View>
          )}
          {expanded && (
            <View style={styles.expanded}>
              {e.photo && (
                <Pressable
                  onPress={(ev) => {
                    ev.stopPropagation();
                    setViewerOpen(true);
                  }}
                >
                  <Image source={{ uri: e.photo }} style={styles.photo} resizeMode="cover" />
                  <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 12, color: colors.accent, marginTop: 6 }}>
                    Tap to view full page
                  </Text>
                </Pressable>
              )}
              {e.otherSensation ? (
                <View style={[styles.quote, { backgroundColor: colors.soft }]}>
                  <Text style={{ fontFamily: fontFamilies.body, fontSize: 13.5, color: colors.ink }}>
                    {e.otherSensation}
                  </Text>
                </View>
              ) : null}

              {!e.journalDone && (
                <View style={styles.completeJournal}>
                  <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 13, color: colors.ink }}>
                    Finished the journal page since?
                  </Text>
                  <View style={styles.completeButtons}>
                    <Pressable
                      onPress={(ev) => {
                        ev.stopPropagation();
                        addPhoto(true);
                      }}
                      style={[styles.outlineButton, { borderColor: colors.line2 }]}
                    >
                      <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 12.5, color: colors.ink }}>
                        Take a photo
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={(ev) => {
                        ev.stopPropagation();
                        addPhoto(false);
                      }}
                      style={[styles.outlineButton, { borderColor: colors.line2 }]}
                    >
                      <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 12.5, color: colors.ink }}>
                        Choose from gallery
                      </Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={(ev) => {
                      ev.stopPropagation();
                      markDone();
                    }}
                  >
                    <Text style={{ fontFamily: fontFamilies.bodySemi, fontSize: 12.5, color: colors.accent, marginTop: 8 }}>
                      Just mark it done
                    </Text>
                  </Pressable>
                </View>
              )}

              <Pressable
                onPress={(ev) => {
                  ev.stopPropagation();
                  onDelete();
                }}
              >
                <Text style={[styles.delete, { color: other.deleteLink }]}>Delete this entry</Text>
              </Pressable>
            </View>
          )}
        </Card>
      </Pressable>
      <ImageViewerModal uri={e.photo ?? null} visible={viewerOpen} onClose={() => setViewerOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  dayHeading: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  path: {
    flex: 1,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14.5,
  },
  time: {
    fontFamily: fontFamilies.body,
    fontSize: 12.5,
  },
  bodyLine: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    paddingHorizontal: 14,
    paddingBottom: 10,
    marginTop: -6,
  },
  tag: {
    alignSelf: 'flex-start',
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  expanded: {
    padding: 14,
    paddingTop: 0,
    gap: 10,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  quote: {
    borderRadius: 10,
    padding: 12,
  },
  completeJournal: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  completeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  delete: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 13,
  },
});
