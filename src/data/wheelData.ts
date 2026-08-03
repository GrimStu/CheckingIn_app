// Ported from design_handoff_checking_in/wheel-data.json
// Printed-wheel order: clockwise from 12 o'clock.

export interface TertiaryWord {
  name: string;
}

export interface SecondaryWord {
  name: string;
  tertiary: [string, string];
}

export interface CoreSection {
  name: string;
  color: string;
  secondaries: SecondaryWord[];
}

export const wheel: CoreSection[] = [
  ['Fearful', '#efc568', [
    ['Scared', ['Helpless', 'Frightened']],
    ['Anxious', ['Overwhelmed', 'Worried']],
    ['Insecure', ['Inadequate', 'Inferior']],
    ['Weak', ['Worthless', 'Insignificant']],
    ['Rejected', ['Excluded', 'Persecuted']],
    ['Threatened', ['Nervous', 'Exposed']],
  ]],
  ['Angry', '#e8756a', [
    ['Let down', ['Betrayed', 'Resentful']],
    ['Humiliated', ['Disrespected', 'Ridiculed']],
    ['Bitter', ['Indignant', 'Violated']],
    ['Mad', ['Furious', 'Jealous']],
    ['Aggressive', ['Provoked', 'Hostile']],
    ['Frustrated', ['Infuriated', 'Annoyed']],
    ['Distant', ['Withdrawn', 'Numb']],
    ['Critical', ['Sceptical', 'Dismissive']],
  ]],
  ['Disgusted', '#8f8b86', [
    ['Disapproving', ['Judgmental', 'Embarrassed']],
    ['Disappointed', ['Appalled', 'Revolted']],
    ['Awful', ['Nauseated', 'Detestable']],
    ['Repelled', ['Horrified', 'Hesitant']],
  ]],
  ['Sad', '#7fa7dc', [
    ['Hurt', ['Embarrassed', 'Disappointed']],
    ['Depressed', ['Inferior', 'Empty']],
    ['Guilty', ['Remorseful', 'Ashamed']],
    ['Despair', ['Powerless', 'Grief']],
    ['Vulnerable', ['Fragile', 'Victimised']],
    ['Lonely', ['Abandoned', 'Isolated']],
  ]],
  ['Happy', '#f2e35b', [
    ['Optimistic', ['Inspired', 'Hopeful']],
    ['Trusting', ['Intimate', 'Sensitive']],
    ['Peaceful', ['Thankful', 'Loving']],
    ['Powerful', ['Creative', 'Courageous']],
    ['Accepted', ['Valued', 'Respected']],
    ['Proud', ['Confident', 'Successful']],
    ['Interested', ['Inquisitive', 'Curious']],
    ['Content', ['Joyful', 'Free']],
    ['Playful', ['Cheeky', 'Aroused']],
  ]],
  ['Surprised', '#b09ecb', [
    ['Excited', ['Energetic', 'Eager']],
    ['Amazed', ['Awe', 'Astonished']],
    ['Confused', ['Perplexed', 'Disillusioned']],
    ['Startled', ['Dismayed', 'Shocked']],
  ]],
  ['Bad', '#5fbf92', [
    ['Tired', ['Unfocussed', 'Sleepy']],
    ['Stressed', ['Out of control', 'Overwhelmed']],
    ['Busy', ['Rushed', 'Pressured']],
    ['Bored', ['Apathetic', 'Indifferent']],
  ]],
].map(([name, color, secondaries]: any) => ({
  name,
  color,
  secondaries: secondaries.map(([sName, tertiary]: any) => ({ name: sName, tertiary })),
}));

export interface BodyRegion {
  name: string;
  x: number;
  y: number;
  hasHotspot: boolean;
}

export const bodyRegions: BodyRegion[] = [
  { name: 'Head', x: 100, y: 34, hasHotspot: true },
  { name: 'Throat', x: 100, y: 70, hasHotspot: true },
  { name: 'Shoulders', x: 141, y: 86, hasHotspot: true },
  { name: 'Chest', x: 100, y: 112, hasHotspot: true },
  { name: 'Stomach', x: 100, y: 155, hasHotspot: true },
  { name: 'Arms', x: 150, y: 135, hasHotspot: true },
  { name: 'Hands', x: 151, y: 192, hasHotspot: true },
  { name: 'Hips', x: 100, y: 192, hasHotspot: true },
  { name: 'Legs', x: 100, y: 248, hasHotspot: true },
  { name: 'Feet', x: 100, y: 305, hasHotspot: true },
  { name: 'Back', x: 52, y: 112, hasHotspot: false },
];

export const sensations: string[] = [
  'Tight', 'Heavy', 'Warm', 'Cool', 'Buzzing', 'Tingling',
  'Numb', 'Aching', 'Fluttery', 'Pressure', 'Hollow', 'Shaky',
];

// Total tertiary word count across the whole wheel (used for angular-span math).
export const TOTAL_TERTIARY_COUNT = wheel.reduce(
  (sum, section) => sum + section.secondaries.length * 2,
  0
);
