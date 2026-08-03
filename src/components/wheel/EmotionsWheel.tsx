import React, { useMemo, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';
import { wheel, wordTaxonomy } from '../../data/wheelData';
import { WordPick } from '../../data/types';
import { mixWhite } from '../../theme/tokens';
import { sectionSpans, wedgePath, labelRotation, labelPosition } from './geometry';

// Stamps id/valence/arousal from the taxonomy onto a selection, keeping the
// visible color as this wedge's own section color (unchanged behavior).
function toWordPick(name: string, color: string): WordPick {
  const taxon = wordTaxonomy[name];
  return {
    id: taxon?.id ?? `unknown:${name}`,
    name,
    valence: taxon?.valence ?? 0,
    arousal: taxon?.arousal ?? 0,
    color,
  };
}

const LABEL_INK = '#3a352f';
const GAP_STROKE_WIDTH = 2;
const SELECTED_STROKE = '#3a352f';

interface Props {
  layer: 1 | 2 | 3;
  size?: number;
  core?: WordPick;
  second?: WordPick;
  third?: WordPick;
  focusedSection?: string;
  onFocusSection?: (name: string) => void;
  onSelectCore: (pick: WordPick) => void;
  onSelectSecondary: (pick: WordPick) => void;
  onSelectTertiary: (pick: WordPick) => void;
  gapColor: string; // theme bg color, used as the separating stroke between wedges
}

function RadialLabel({
  x,
  y,
  angle,
  fontSize,
  children,
}: {
  x: number;
  y: number;
  angle: number;
  fontSize: number;
  children: string;
}) {
  const rot = labelRotation(angle);
  return (
    <G transform={`translate(${x} ${y}) rotate(${rot})`} pointerEvents="none">
      <SvgText
        x={0}
        y={0}
        dy="0.35em"
        fontSize={fontSize}
        fontWeight="700"
        fill={LABEL_INK}
        textAnchor="middle"
      >
        {children}
      </SvgText>
    </G>
  );
}

export function EmotionsWheel({
  layer,
  size = 356,
  core,
  second,
  third,
  focusedSection,
  onFocusSection,
  onSelectCore,
  onSelectSecondary,
  onSelectTertiary,
  gapColor,
}: Props) {
  const spans = useMemo(() => sectionSpans(), []);

  const [internalFocus, setInternalFocus] = useState<string>(() => {
    if (focusedSection) return focusedSection;
    if (second) {
      const found = spans.find((s) => s.section.secondaries.some((sec) => sec.name === second.name));
      if (found) return found.section.name;
    }
    return core?.name ?? spans[0].section.name;
  });
  const activeFocus = focusedSection ?? internalFocus;

  const cx = 0;
  const cy = 0;
  const half = 149;

  function focusSection(name: string) {
    setInternalFocus(name);
    onFocusSection?.(name);
  }

  return (
    <View style={{ width: size, height: size, alignSelf: 'center' }}>
      <Svg width={size} height={size} viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}>
        {layer === 1 &&
          spans.map(({ section, startAngle, endAngle }) => {
            const mid = (startAngle + endAngle) / 2;
            const isSelected = core?.name === section.name;
            const lp = labelPosition(cx, cy, 95, mid);
            return (
              <G key={section.name}>
                <Path
                  d={wedgePath(cx, cy, 0, 146, startAngle, endAngle)}
                  fill={section.color}
                  stroke={isSelected ? SELECTED_STROKE : gapColor}
                  strokeWidth={isSelected ? 2.5 : GAP_STROKE_WIDTH}
                  onPress={() => onSelectCore(toWordPick(section.name, section.color))}
                />
                <RadialLabel x={lp.x} y={lp.y} angle={mid} fontSize={12.5}>
                  {section.name}
                </RadialLabel>
              </G>
            );
          })}

        {layer === 2 && (
          <>
            {spans.map(({ section, startAngle, endAngle }) => {
              const secCount = section.secondaries.length;
              const secSpan = (endAngle - startAngle) / secCount;
              return section.secondaries.map((secondary, i) => {
                const s0 = startAngle + i * secSpan;
                const s1 = s0 + secSpan;
                const mid = (s0 + s1) / 2;
                const isSelected = second?.name === secondary.name;
                const lp = labelPosition(cx, cy, 96, mid);
                return (
                  <G key={`${section.name}-${secondary.name}`}>
                    <Path
                      d={wedgePath(cx, cy, 46, 146, s0, s1)}
                      fill={mixWhite(section.color, 0.15)}
                      stroke={isSelected ? SELECTED_STROKE : gapColor}
                      strokeWidth={isSelected ? 2.5 : GAP_STROKE_WIDTH}
                      onPress={() =>
                        onSelectSecondary(toWordPick(secondary.name, section.color))
                      }
                    />
                    <RadialLabel x={lp.x} y={lp.y} angle={mid} fontSize={10}>
                      {secondary.name}
                    </RadialLabel>
                  </G>
                );
              });
            })}
            {core && (
              <G>
                <Circle cx={0} cy={0} r={40} fill={core.color} stroke={gapColor} strokeWidth={GAP_STROKE_WIDTH} />
                <SvgText x={0} y={0} dy="0.35em" fontSize={12.5} fontWeight="700" fill={LABEL_INK} textAnchor="middle">
                  {core.name}
                </SvgText>
              </G>
            )}
          </>
        )}

        {layer === 3 && (
          <>
            {/* Outer ring: focused section's tertiary words only */}
            {(() => {
              const focused = spans.find((s) => s.section.name === activeFocus) ?? spans[0];
              const { section } = focused;
              const tertiaries: { name: string }[] = [];
              section.secondaries.forEach((sec) => {
                tertiaries.push({ name: sec.tertiary[0] });
                tertiaries.push({ name: sec.tertiary[1] });
              });
              // The focused section's words spread across the full ring (not confined to
              // that section's narrow slice of the whole wheel) so there's room to read them.
              const slice = 360 / tertiaries.length;
              return tertiaries.map((t, i) => {
                const s0 = i * slice;
                const s1 = s0 + slice;
                const mid = (s0 + s1) / 2;
                const tint = i % 2 === 0 ? 0.18 : 0.3;
                const isSelected = third?.name === t.name;
                const lp = labelPosition(cx, cy, 107, mid);
                return (
                  <G key={`${section.name}-t-${t.name}-${i}`}>
                    <Path
                      d={wedgePath(cx, cy, 68, 146, s0, s1)}
                      fill={mixWhite(section.color, tint)}
                      stroke={isSelected ? SELECTED_STROKE : gapColor}
                      strokeWidth={isSelected ? 2.5 : GAP_STROKE_WIDTH}
                      onPress={() => onSelectTertiary(toWordPick(t.name, section.color))}
                    />
                    <RadialLabel x={lp.x} y={lp.y} angle={mid} fontSize={9.5}>
                      {t.name}
                    </RadialLabel>
                  </G>
                );
              });
            })()}

            {/* Inner selector ring: seven core sections */}
            {spans.map(({ section, startAngle, endAngle }) => {
              const mid = (startAngle + endAngle) / 2;
              const isFocused = activeFocus === section.name;
              const lp = labelPosition(cx, cy, 40, mid);
              return (
                <G key={`inner-${section.name}`}>
                  <Path
                    d={wedgePath(cx, cy, 0, 60, startAngle, endAngle)}
                    fill={section.color}
                    stroke={isFocused ? SELECTED_STROKE : gapColor}
                    strokeWidth={isFocused ? 2.5 : GAP_STROKE_WIDTH}
                    onPress={() => focusSection(section.name)}
                  />
                  <RadialLabel x={lp.x} y={lp.y} angle={mid} fontSize={7.5}>
                    {section.name}
                  </RadialLabel>
                </G>
              );
            })}
          </>
        )}
      </Svg>
    </View>
  );
}
