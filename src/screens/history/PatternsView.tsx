import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, hexToRgba } from '../../theme/tokens';
import { Card } from '../../components/Card';
import { useApp } from '../../store/AppContext';

export function PatternsView() {
  const { colors } = useTheme();
  const { entries, stats } = useApp();

  if (entries.length === 0) {
    return (
      <Text style={{ fontFamily: fontFamilies.body, fontSize: 14, color: colors.muted, marginTop: 20 }}>
        Patterns will show up here once you've logged a few check-ins.
      </Text>
    );
  }

  const coreCounts = Object.entries(stats.perCoreCounts).sort((a, b) => b[1].count - a[1].count);
  const maxCoreCount = Math.max(...coreCounts.map(([, v]) => v.count), 1);

  return (
    <View style={{ gap: 14 }}>
      <Card>
        <Text style={[styles.cardTitle, { color: colors.ink }]}>How you've been feeling</Text>
        {coreCounts.map(([name, v]) => (
          <View key={name} style={styles.barRow}>
            <Text style={[styles.barLabel, { color: colors.ink }]}>{name}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${(v.count / maxCoreCount) * 100}%`, backgroundColor: v.color },
                ]}
              />
            </View>
            <Text style={[styles.barCount, { color: colors.muted }]}>{v.count}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.ink }]}>Where feelings live in your body</Text>
        <View style={styles.pillWrap}>
          {stats.topRegions.map((r) => (
            <View key={r.name} style={[styles.countPill, { backgroundColor: colors.soft }]}>
              <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 13, color: colors.ink }}>
                {r.name} · {r.count}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.ink }]}>The specific feelings you name most</Text>
        <View style={styles.pillWrap}>
          {stats.topWords.map((w) => (
            <View key={w.name} style={[styles.countPill, { backgroundColor: hexToRgba(w.color, 0.18) }]}>
              <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 13, color: colors.ink }}>
                {w.name} · {w.count}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 16.5,
    marginBottom: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  barLabel: {
    width: 78,
    fontFamily: fontFamilies.bodyMed,
    fontSize: 12.5,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barCount: {
    width: 22,
    textAlign: 'right',
    fontFamily: fontFamilies.body,
    fontSize: 12,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  countPill: {
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
