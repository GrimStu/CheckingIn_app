import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Rect, Ellipse } from 'react-native-svg';

// Simple front-facing figure built from primitives in a 200x330 space, per README:
// head circle (r22 at 100,38), neck, torso rounded-rect (68,70,64x112 r26),
// two arms (18x102 r9), two hands (r9), two legs (20x120 r10), two feet ellipses.
export function BodyFigure({ size = 240, fill, stroke }: { size?: number; fill: string; stroke: string }) {
  const w = size;
  const h = (size * 330) / 200;
  return (
    <View style={{ width: w, height: h, alignSelf: 'center' }}>
      <Svg width={w} height={h} viewBox="0 0 200 330">
        <Rect x={92} y={56} width={16} height={16} fill={fill} stroke={stroke} strokeWidth={2} />
        <Rect x={104} y={182} width={20} height={120} rx={10} fill={fill} stroke={stroke} strokeWidth={2} />
        <Rect x={76} y={182} width={20} height={120} rx={10} fill={fill} stroke={stroke} strokeWidth={2} />
        <Ellipse cx={114} cy={308} rx={14} ry={8} fill={fill} stroke={stroke} strokeWidth={2} />
        <Ellipse cx={86} cy={308} rx={14} ry={8} fill={fill} stroke={stroke} strokeWidth={2} />
        <Rect x={142} y={78} width={18} height={102} rx={9} fill={fill} stroke={stroke} strokeWidth={2} />
        <Rect x={40} y={78} width={18} height={102} rx={9} fill={fill} stroke={stroke} strokeWidth={2} />
        <Circle cx={151} cy={189} r={9} fill={fill} stroke={stroke} strokeWidth={2} />
        <Circle cx={49} cy={189} r={9} fill={fill} stroke={stroke} strokeWidth={2} />
        <Rect x={68} y={70} width={64} height={112} rx={26} fill={fill} stroke={stroke} strokeWidth={2} />
        <Circle cx={100} cy={38} r={22} fill={fill} stroke={stroke} strokeWidth={2} />
      </Svg>
    </View>
  );
}
