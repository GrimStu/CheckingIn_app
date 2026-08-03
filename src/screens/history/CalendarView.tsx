import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies } from '../../theme/tokens';
import { useApp } from '../../store/AppContext';
import { timeOfDay } from '../../utils/dates';
import { CheckInEntry } from '../../data/types';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function buildGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  // Monday-first: convert JS getDay() (0=Sun) to Monday-first index
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function CalendarView() {
  const { colors } = useTheme();
  const { entries } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<Date>(now);

  const entriesByDay = useMemo(() => {
    const map = new Map<string, CheckInEntry[]>();
    for (const e of entries) {
      const d = new Date(e.timestamp);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [entries]);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const selectedKey = `${selectedDay.getFullYear()}-${selectedDay.getMonth()}-${selectedDay.getDate()}`;
  const selectedEntries = entriesByDay.get(selectedKey) ?? [];

  return (
    <View>
      <View style={styles.navRow}>
        <Pressable onPress={() => shiftMonth(-1)} hitSlop={10}>
          <Text style={[styles.navArrow, { color: colors.ink }]}>‹</Text>
        </Pressable>
        <Text style={{ fontFamily: fontFamilies.heading, fontSize: 15, color: colors.ink }}>
          {monthLabel}
        </Text>
        <Pressable onPress={() => shiftMonth(1)} hitSlop={10}>
          <Text style={[styles.navArrow, { color: colors.ink }]}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={[styles.weekday, { color: colors.faint }]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day, i) => {
          if (!day) return <View key={i} style={styles.cell} />;
          const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
          const dayEntries = entriesByDay.get(key) ?? [];
          const isSelected =
            day.getFullYear() === selectedDay.getFullYear() &&
            day.getMonth() === selectedDay.getMonth() &&
            day.getDate() === selectedDay.getDate();
          return (
            <Pressable
              key={i}
              style={[
                styles.cell,
                styles.dayCell,
                isSelected && { backgroundColor: colors.btn },
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.bodyMed,
                  fontSize: 13,
                  color: isSelected ? colors.btnText : colors.ink,
                }}
              >
                {day.getDate()}
              </Text>
              <View style={styles.dotsRow}>
                {dayEntries.slice(0, 3).map((e, idx) => (
                  <View key={idx} style={[styles.miniDot, { backgroundColor: e.core.color }]} />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 14 }}>
        {selectedEntries.length === 0 ? (
          <Text style={{ fontFamily: fontFamilies.body, fontSize: 13, color: colors.muted }}>
            No check-ins this day.
          </Text>
        ) : (
          selectedEntries.map((e) => (
            <View key={e.id} style={[styles.compactRow, { borderColor: colors.line }]}>
              <View style={[styles.miniDot, { backgroundColor: e.core.color }]} />
              <Text style={{ fontFamily: fontFamilies.bodyMed, fontSize: 13, color: colors.ink, flex: 1 }}>
                {[e.core, e.second, e.third].filter(Boolean).map((p) => p!.name).join(' › ')}
              </Text>
              <Text style={{ fontFamily: fontFamilies.body, fontSize: 12, color: colors.muted }}>
                {timeOfDay(e.timestamp)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navArrow: {
    fontSize: 22,
    paddingHorizontal: 10,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    minHeight: 40,
  },
  dayCell: {
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
    height: 6,
  },
  miniDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});
