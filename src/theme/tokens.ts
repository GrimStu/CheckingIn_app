// Design tokens ported from design_handoff_checking_in/README.md

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  card: string;
  card2: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  line2: string;
  soft: string;
  btn: string;
  btnText: string;
  grad1: string;
  grad2: string;
  accent: string;
}

export const lightColors: ThemeColors = {
  bg: '#fbf9f4',
  card: '#ffffff',
  card2: '#fffdf8',
  ink: '#3a352f',
  muted: '#93897b',
  faint: '#b3a893',
  line: '#efe8da',
  line2: '#e5dccb',
  soft: '#f5f0e6',
  btn: '#3a352f',
  btnText: '#ffffff',
  grad1: '#f6ecff',
  grad2: '#fff3e2',
  accent: '#7d6ac2',
};

export const darkColors: ThemeColors = {
  bg: '#1c1915',
  card: '#282319',
  card2: '#221e16',
  ink: '#ece6da',
  muted: '#a89d8b',
  faint: '#7c7263',
  line: '#3a3327',
  line2: '#48402f',
  soft: '#332d22',
  btn: '#ece6da',
  btnText: '#26211a',
  grad1: '#2c2436',
  grad2: '#332b1e',
  accent: '#b3a2e8',
};

// Body figure fill/stroke (not part of the light/dark palette proper)
export const bodyFigure = {
  light: { fill: '#efe8db', stroke: '#dcd2be' },
  dark: { fill: '#332d24', stroke: '#4a4335' },
};

export const other = {
  success: '#8fbf9f', // toggle-on / checked checkbox
  celebrationGreen: '#3ddc84', // bright, vivid green for the done-screen tick
  avatarGradFrom: '#f0d24f',
  avatarGradTo: '#e2766c',
  navPillFrom: '#f0d24f',
  navPillTo: '#e2766c',
  warningTagBg: 'rgba(240,210,79,.28)',
  warningTagText: '#a07c1c',
  deleteLink: '#c0685e',
  scrim: 'rgba(20,16,10,.45)',
};

// Flat placeholder for every sky (taxonomy-based) WordPick, until the
// cloudscape gets its own color treatment.
export const skyWordColor = '#93897b';

export const wheelColors: Record<string, string> = {
  Fearful: '#efc568',
  Angry: '#e8756a',
  Disgusted: '#8f8b86',
  Sad: '#7fa7dc',
  Happy: '#f2e35b',
  Surprised: '#b09ecb',
  Bad: '#5fbf92',
};

export const radii = {
  r10: 10,
  r12: 12,
  r14: 14,
  r16: 16,
  r18: 18,
  r20: 20,
  r22: 22,
  pill: 100,
};

export const spacing = {
  s8: 8,
  s10: 10,
  s12: 12,
  s14: 14,
  s16: 16,
  s20: 20,
  s26: 26,
  contentPadding: 20,
};

export const type = {
  pageTitle: 24,
  stepTitle: 23,
  cardTitle: 16.5,
  body: 14.5,
  secondary: 13.25,
  meta: 12.25,
  eyebrow: 11,
};

export const fontFamilies = {
  heading: 'Quicksand_700Bold',
  headingSemi: 'Quicksand_600SemiBold',
  headingMed: 'Quicksand_500Medium',
  body: 'Karla_400Regular',
  bodyMed: 'Karla_500Medium',
  bodySemi: 'Karla_600SemiBold',
  bodyBold: 'Karla_700Bold',
};

// mix(hex, t) = channel + (255 - channel) * t  -- white tint mix used across the wheel
export function mixWhite(hex: string, t: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
