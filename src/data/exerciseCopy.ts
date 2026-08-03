// Condensed, bullet-point versions of the source guidance in
// design_handoff_checking_in/exercise-copy.txt, reformatted for an easier read.

export const bodyScanCopy: string[] = [
  "Notice sensations without needing to change or fix them. There's no rush.",
  'Start at your feet. Notice warmth, coolness, pressure, or a breeze on your skin.',
  'Slowly move upward: calves, thighs, pelvis, stomach, chest, back, shoulders, arms, hands, neck, head.',
  'Then travel back down the same way, until you reach your feet again.',
];

export const meditationCopy: string[] = [
  'Find a quiet place to sit undisturbed. Set the timer above; the length matters less with practice.',
  "Bring your attention to your breathing. When your mind wanders, that's ok.",
  'Notice your thoughts and feelings like an outside observer, then gently return to your breath.',
  'Frustration or boredom may show up too. Just notice it, and keep returning to your breathing.',
];

export const mindfulEatingCopy: string[] = [
  'Choose something easy to hold, like a raisin. Move slowly through each step.',
  'Look at it first. Notice its colour, size, and how the light catches it.',
  'Pick it up. Notice its weight, texture, and smell.',
  'Place it on your tongue without chewing yet. Notice the texture and taste.',
  'Finally, chew slowly, noticing how the texture and flavour change.',
];

export interface FiveSensesStep {
  number: number;
  label: string;
  text: string;
}

export const fiveSensesSubtitle =
  'A grounding technique for moments of stress or overwhelm. Naming what your senses notice, one at a time, gently pulls your attention out of your head and into the present.';

export const fiveSensesSteps: FiveSensesStep[] = [
  {
    number: 5,
    label: 'things you can see',
    text: 'Look around and name five things. Notice their colour, shape, or how the light falls on them.',
  },
  {
    number: 4,
    label: 'things you can feel',
    text: 'Notice four things you can touch: your clothes, the floor beneath you, the air. Are they soft, hard, warm, or cool?',
  },
  {
    number: 3,
    label: 'things you can hear',
    text: "Listen for three sounds you'd normally tune out, like traffic, a clock ticking, or a fan humming.",
  },
  {
    number: 2,
    label: 'things you can smell',
    text: "Notice two smells nearby. If nothing stands out, your own shirt or a sip of air works too.",
  },
  {
    number: 1,
    label: 'thing you can taste',
    text: 'Focus on one taste in your mouth, or take a slow sip of water.',
  },
];

export const fiveSensesFooter =
  "The numbers are just a guide. Notice more or fewer of each, and try it mid-task too, like washing dishes or on a walk.";
