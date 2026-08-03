import { wheel, TOTAL_TERTIARY_COUNT, CoreSection } from '../../data/wheelData';

export interface SectionSpan {
  section: CoreSection;
  index: number;
  startAngle: number;
  endAngle: number;
}

// Angular span of a core section is proportional to its tertiary-word count.
// span = secondaries * 2 * 360 / TOTAL_TERTIARY_COUNT
export function sectionSpans(): SectionSpan[] {
  let angle = 0;
  return wheel.map((section, index) => {
    const tertiaryCount = section.secondaries.length * 2;
    const span = (tertiaryCount * 360) / TOTAL_TERTIARY_COUNT;
    const startAngle = angle;
    const endAngle = angle + span;
    angle = endAngle;
    return { section, index, startAngle, endAngle };
  });
}

// 0deg = 12 o'clock, increasing clockwise.
export function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

export function wedgePath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
): string {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const outerStart = polar(cx, cy, rOuter, startAngle);
  const outerEnd = polar(cx, cy, rOuter, endAngle);

  if (rInner <= 0.01) {
    return [
      `M ${cx} ${cy}`,
      `L ${outerStart.x} ${outerStart.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      'Z',
    ].join(' ');
  }

  const innerEnd = polar(cx, cy, rInner, endAngle);
  const innerStart = polar(cx, cy, rInner, startAngle);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

// Radial label rotation: rotated (angle - 90), flipped 180deg further if mid-angle > 180
// so labels on the left side of the wheel stay upright.
export function labelRotation(midAngle: number): number {
  const base = midAngle - 90;
  return midAngle > 180 ? base + 180 : base;
}

export function labelPosition(cx: number, cy: number, r: number, midAngle: number) {
  return polar(cx, cy, r, midAngle);
}
