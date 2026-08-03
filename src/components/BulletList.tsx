import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontFamilies } from '../theme/tokens';

export function BulletList({
  items,
  textColor,
  dotColor,
}: {
  items: string[];
  textColor: string;
  dotColor: string;
}) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={[styles.row, i > 0 && { marginTop: 12 }]}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={[styles.text, { color: textColor }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 9,
  },
  text: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14.5,
    lineHeight: 24,
  },
});
