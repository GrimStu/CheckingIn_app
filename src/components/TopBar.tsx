import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, other } from '../theme/tokens';
import { useApp } from '../store/AppContext';
import { useNav } from '../store/NavContext';

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function TopBar() {
  const { colors } = useTheme();
  const { profile } = useApp();
  const { openDrawer } = useNav();
  const firstName = profile.name.split(/\s+/)[0] || 'there';

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg, borderBottomColor: colors.line }]}>
      <Pressable onPress={openDrawer} hitSlop={12} style={styles.hamburger}>
        <View style={[styles.bar, { backgroundColor: colors.ink }]} />
        <View style={[styles.bar, { backgroundColor: colors.ink }]} />
        <View style={[styles.bar, { backgroundColor: colors.ink, width: 14 }]} />
      </Pressable>

      <Text
        numberOfLines={1}
        style={{
          fontFamily: fontFamilies.bodyBold,
          fontSize: 11,
          letterSpacing: 1,
          color: colors.faint,
          textTransform: 'uppercase',
          flex: 1,
          textAlign: 'center',
        }}
      >
        Checking in with {firstName}
      </Text>

      <Pressable onPress={openDrawer} hitSlop={8}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: other.avatarGradTo }]}>
            <Text style={styles.avatarText}>{initials(profile.name || '?')}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  hamburger: {
    width: 22,
    gap: 4,
  },
  bar: {
    height: 2,
    width: 20,
    borderRadius: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#3a352f',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
  },
});
