import React, { useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fontFamilies, spacing } from '../../theme/tokens';
import { TaxonomyWord } from '../../data/taxonomy';
import { sky, MIN_TAP } from './layout';

const MIN_SCALE = 0.4;
const MAX_SCALE = 3;
const TAP_THRESHOLD = 6; // px of movement before a touch counts as a drag, not a tap
const OVERSCROLL = 80; // px of empty space allowed past the canvas edge while panning

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}

// Keeps the (possibly scaled) canvas from being panned entirely out of view,
// with a little overscroll room at each edge.
function clampAxis(pos: number, contentSize: number, viewportSize: number): number {
  if (viewportSize <= 0) return pos;
  const a = viewportSize - contentSize - OVERSCROLL;
  const b = OVERSCROLL;
  return clamp(pos, Math.min(a, b), Math.max(a, b));
}

function touchDistance(a: { pageX: number; pageY: number }, b: { pageX: number; pageY: number }): number {
  return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
}

interface Transform {
  scale: number;
  x: number;
  y: number;
}

interface Props {
  selectedIds: string[];
  onToggle: (word: TaxonomyWord) => void;
  height: number;
}

// A pannable, pinch-zoomable canvas of every taxonomy word, placed by
// layoutSky(). Tap targets are fixed at MIN_TAP so they stay legible (and
// non-overlapping) at the default 1:1 scale; zooming further out is a
// deliberate user action, same trade-off as any map view.
export function EmotionSky({ selectedIds, onToggle, height }: Props) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  // The viewport sits inside the page's horizontally-padded content column,
  // so its width is the window width minus that padding. onLayout would give
  // an exact figure, but isn't reliable on every RN runtime, so this estimate
  // is what centering and pan clamping are based on; onLayout below only
  // refines it later if a real measurement does arrive.
  const estimatedWidth = Math.max(0, windowWidth - spacing.contentPadding * 2);

  const [viewport, setViewport] = useState({ width: estimatedWidth, height });
  const [transform, setTransformState] = useState<Transform>(() => ({
    scale: 1,
    x: estimatedWidth / 2 - sky.width / 2,
    y: height / 2 - sky.height / 2,
  }));
  const transformRef = useRef(transform);
  const gestureStart = useRef<Transform & { pinchDistance: number }>({ scale: 1, x: 0, y: 0, pinchDistance: 0 });

  function setTransform(next: Transform) {
    transformRef.current = next;
    setTransformState(next);
  }

  function onViewportLayout(e: LayoutChangeEvent) {
    const { width, height: h } = e.nativeEvent.layout;
    if (width > 0 && h > 0) setViewport({ width, height: h });
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      // Claim immediately once a second finger lands, so a pinch that starts
      // mid-tap (or mid-pan) isn't swallowed by a child Pressable.
      onStartShouldSetPanResponderCapture: (evt: GestureResponderEvent) =>
        evt.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponder: (evt: GestureResponderEvent, g: PanResponderGestureState) =>
        evt.nativeEvent.touches.length === 2 ||
        Math.abs(g.dx) > TAP_THRESHOLD ||
        Math.abs(g.dy) > TAP_THRESHOLD,
      onMoveShouldSetPanResponderCapture: (evt: GestureResponderEvent) =>
        evt.nativeEvent.touches.length === 2,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const touches = evt.nativeEvent.touches;
        gestureStart.current = {
          ...transformRef.current,
          pinchDistance: touches.length === 2 ? touchDistance(touches[0], touches[1]) : 0,
        };
      },
      onPanResponderMove: (evt: GestureResponderEvent, g: PanResponderGestureState) => {
        const touches = evt.nativeEvent.touches;
        const start = gestureStart.current;
        if (touches.length === 2 && start.pinchDistance > 0) {
          const dist = touchDistance(touches[0], touches[1]);
          const scale = clamp((start.scale * dist) / start.pinchDistance, MIN_SCALE, MAX_SCALE);
          setTransform({ scale, x: start.x, y: start.y });
        } else {
          setTransform({
            scale: start.scale,
            x: clampAxis(start.x + g.dx, sky.width * start.scale, viewport.width),
            y: clampAxis(start.y + g.dy, sky.height * start.scale, viewport.height),
          });
        }
      },
    })
  ).current;

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const atCap = selectedIds.length >= 3;

  return (
    <View
      style={[styles.viewport, { height, borderColor: colors.line2, backgroundColor: colors.card2 }]}
      onLayout={onViewportLayout}
      {...panResponder.panHandlers}
    >
      <View
        style={{
          width: sky.width,
          height: sky.height,
          transform: [
            { translateX: transform.x },
            { translateY: transform.y },
            { scale: transform.scale },
          ],
        }}
      >
        {sky.points.map(({ word, x, y }) => {
          const selected = selectedSet.has(word.id);
          const disabled = atCap && !selected;
          return (
            <Pressable
              key={word.id}
              disabled={disabled}
              onPress={() => onToggle(word)}
              style={[
                styles.target,
                {
                  left: x - MIN_TAP / 2,
                  top: y - MIN_TAP / 2,
                  borderColor: selected ? colors.ink : colors.line2,
                  backgroundColor: selected ? colors.soft : colors.card,
                  opacity: disabled ? 0.4 : 1,
                },
              ]}
            >
              <Text numberOfLines={1} style={{ fontFamily: fontFamilies.body, fontSize: 9, color: colors.ink }}>
                {word.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  target: {
    position: 'absolute',
    width: MIN_TAP,
    height: MIN_TAP,
    borderRadius: MIN_TAP / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
