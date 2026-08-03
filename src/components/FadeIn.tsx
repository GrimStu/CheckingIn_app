import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// Screens fade-and-rise 300ms ease (opacity 0->1, translateY 10px->0).
export function FadeIn({ children, deps = [] }: { children: React.ReactNode; deps?: any[] }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return <Animated.View style={{ flex: 1, opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
}
