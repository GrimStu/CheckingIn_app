import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, other } from '../theme/tokens';
import { useNav, TabName } from '../store/NavContext';
import { useApp } from '../store/AppContext';

const items: { key: TabName; label: string }[] = [
  { key: 'checkin', label: 'Check-in' },
  { key: 'history', label: 'History' },
  { key: 'practices', label: 'Practices' },
];

export function BottomNav() {
  const { colors } = useTheme();
  const { activeTab, setActiveTab, closeExerciseScreen, setCheckinStep } = useNav();
  const { resetDraft, inProgress } = useApp();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg, borderTopColor: colors.line }]}>
      {items.map((item) => {
        const active = activeTab === item.key;
        return (
          <Pressable
            key={item.key}
            style={styles.item}
            onPress={() => {
              closeExerciseScreen();
              if (item.key === 'checkin' && !inProgress) {
                resetDraft();
                setCheckinStep('sky');
              }
              setActiveTab(item.key);
            }}
          >
            {active ? (
              <LinearGradient
                colors={[other.navPillFrom, other.navPillTo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.pill}
              />
            ) : (
              <View style={styles.pillPlaceholder} />
            )}
            <Text
              style={{
                fontFamily: active ? fontFamilies.bodyBold : fontFamilies.bodyMed,
                fontSize: 12,
                color: active ? colors.ink : colors.faint,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    height: 62,
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pill: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  pillPlaceholder: {
    width: 20,
    height: 4,
  },
});
