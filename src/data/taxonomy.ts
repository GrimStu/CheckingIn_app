/**
 * Checking In: emotion taxonomy v2
 *
 * Original word list. Not derived from any published feelings wheel.
 *
 * valence: -1 (unpleasant) to +1 (pleasant)
 * arousal: -1 (low energy) to +1 (high energy)
 *
 * ids are stable and must never change once assigned.
 * Labels and coordinates may be retuned; ids may not.
 *
 * Words that appear twice (untethered, floating, in-a-bubble) are the same
 * label in two regions of the sky. Different id, different meaning, chosen by
 * where the user taps rather than by a follow-up question.
 */

export interface TaxonomyWord {
  id: string;
  label: string;
  valence: number;
  arousal: number;
  group: string;
}

export const TAXONOMY_VERSION = 2;

export const taxonomy: TaxonomyWord[] = [
  { id: 'tired', label: 'tired', valence: -0.15, arousal: -0.40, group: 'depletion' },
  { id: 'drained', label: 'drained', valence: -0.35, arousal: -0.50, group: 'depletion' },
  { id: 'weak', label: 'weak', valence: -0.45, arousal: -0.35, group: 'depletion' },
  { id: 'heavy', label: 'heavy', valence: -0.60, arousal: -0.45, group: 'depletion' },
  { id: 'wiped', label: 'wiped', valence: -0.45, arousal: -0.72, group: 'depletion' },
  { id: 'worn-out', label: 'worn-out', valence: -0.50, arousal: -0.80, group: 'depletion' },
  { id: 'worn-thin', label: 'worn-thin', valence: -0.75, arousal: -0.25, group: 'depletion' },
  { id: 'depleted', label: 'depleted', valence: -0.75, arousal: -0.70, group: 'depletion' },
  { id: 'exhausted', label: 'exhausted', valence: -0.65, arousal: -0.88, group: 'depletion' },

  { id: 'annoyed', label: 'annoyed', valence: -0.40, arousal: 0.30, group: 'anger' },
  { id: 'frustrated', label: 'frustrated', valence: -0.50, arousal: 0.45, group: 'anger' },
  { id: 'aggravated', label: 'aggravated', valence: -0.55, arousal: 0.55, group: 'anger' },
  { id: 'angry', label: 'angry', valence: -0.65, arousal: 0.62, group: 'anger' },
  { id: 'pissed-off', label: 'pissed-off', valence: -0.70, arousal: 0.68, group: 'anger' },
  { id: 'seething', label: 'seething', valence: -0.85, arousal: 0.65, group: 'anger' },
  { id: 'fuming', label: 'fuming', valence: -0.75, arousal: 0.85, group: 'anger' },
  { id: 'volatile', label: 'volatile', valence: -0.55, arousal: 0.90, group: 'anger' },

  { id: 'uncomfortable', label: 'uncomfortable', valence: -0.28, arousal: 0.10, group: 'tension' },
  { id: 'nervous', label: 'nervous', valence: -0.25, arousal: 0.27, group: 'tension' },
  { id: 'worried', label: 'worried', valence: -0.53, arousal: 0.30, group: 'tension' },
  { id: 'tense', label: 'tense', valence: -0.35, arousal: 0.45, group: 'tension' },
  { id: 'anxious', label: 'anxious', valence: -0.53, arousal: 0.55, group: 'tension' },
  { id: 'stressed', label: 'stressed', valence: -0.55, arousal: 0.72, group: 'tension' },
  { id: 'scared', label: 'scared', valence: -0.68, arousal: 0.72, group: 'tension' },
  { id: 'overwhelmed', label: 'overwhelmed', valence: -0.62, arousal: 0.84, group: 'tension' },

  { id: 'stifled', label: 'stifled', valence: -0.65, arousal: 0.15, group: 'confinement' },
  { id: 'trapped', label: 'trapped', valence: -0.73, arousal: 0.45, group: 'confinement' },
  { id: 'claustrophobic', label: 'claustrophobic', valence: -0.83, arousal: 0.75, group: 'confinement' },

  { id: 'apprehensive', label: 'apprehensive', valence: -0.50, arousal: 0.25, group: 'on-guard' },
  { id: 'defensive', label: 'defensive', valence: -0.30, arousal: 0.41, group: 'on-guard' },
  { id: 'watched', label: 'watched', valence: -0.62, arousal: 0.46, group: 'on-guard' },
  { id: 'on-guard', label: 'on guard', valence: -0.37, arousal: 0.59, group: 'on-guard' },
  { id: 'surrounded', label: 'surrounded', valence: -0.60, arousal: 0.62, group: 'on-guard' },
  { id: 'harassed', label: 'harassed', valence: -0.72, arousal: 0.66, group: 'on-guard' },

  { id: 'raw', label: 'raw', valence: -0.62, arousal: 0.05, group: 'exposure' },
  { id: 'stripped', label: 'stripped', valence: -0.70, arousal: 0.22, group: 'exposure' },
  { id: 'vulnerable', label: 'vulnerable', valence: -0.55, arousal: 0.25, group: 'exposure' },
  { id: 'exposed', label: 'exposed', valence: -0.62, arousal: 0.32, group: 'exposure' },
  { id: 'violated', label: 'violated', valence: -0.88, arousal: 0.50, group: 'exposure' },

  { id: 'let-down', label: 'let down', valence: -0.62, arousal: -0.40, group: 'wronged' },
  { id: 'taken-from-me', label: 'something taken from me', valence: -0.80, arousal: -0.25, group: 'wronged' },
  { id: 'rejected', label: 'rejected', valence: -0.75, arousal: -0.05, group: 'wronged' },
  { id: 'used', label: 'used', valence: -0.70, arousal: 0.10, group: 'wronged' },
  { id: 'abused', label: 'abused', valence: -0.90, arousal: 0.25, group: 'wronged' },
  { id: 'betrayed', label: 'betrayed', valence: -0.85, arousal: 0.40, group: 'wronged' },

  { id: 'embarrassed', label: 'embarrassed', valence: -0.45, arousal: 0.20, group: 'grief' },
  { id: 'guilty', label: 'guilty', valence: -0.52, arousal: -0.02, group: 'grief' },
  { id: 'hurt', label: 'hurt', valence: -0.65, arousal: -0.10, group: 'grief' },
  { id: 'sad', label: 'sad', valence: -0.48, arousal: -0.52, group: 'grief' },
  { id: 'ashamed', label: 'ashamed', valence: -0.70, arousal: -0.20, group: 'grief' },
  { id: 'grief', label: 'grief', valence: -0.80, arousal: -0.30, group: 'grief' },
  { id: 'isolated', label: 'isolated', valence: -0.55, arousal: -0.38, group: 'grief' },
  { id: 'abandoned', label: 'abandoned', valence: -0.80, arousal: -0.48, group: 'grief' },
  { id: 'lonely', label: 'lonely', valence: -0.65, arousal: -0.58, group: 'grief' },

  { id: 'untethered-dark', label: 'untethered', valence: -0.50, arousal: -0.18, group: 'disconnection' },
  { id: 'misunderstood', label: 'misunderstood', valence: -0.62, arousal: -0.24, group: 'disconnection' },
  { id: 'floating-dark', label: 'floating', valence: -0.30, arousal: -0.42, group: 'disconnection' },
  { id: 'detached', label: 'detached', valence: -0.55, arousal: -0.45, group: 'disconnection' },
  { id: 'muffled', label: 'muffled', valence: -0.38, arousal: -0.55, group: 'disconnection' },
  { id: 'hollow', label: 'hollow', valence: -0.70, arousal: -0.60, group: 'disconnection' },
  { id: 'in-a-bubble-dark', label: 'in a bubble', valence: -0.40, arousal: -0.68, group: 'disconnection' },
  { id: 'numb', label: 'numb', valence: -0.55, arousal: -0.78, group: 'disconnection' },

  { id: 'driven', label: 'driven', valence: -0.05, arousal: 0.70, group: 'middle' },
  { id: 'pensive', label: 'pensive', valence: 0.05, arousal: -0.30, group: 'middle' },

  { id: 'present', label: 'present', valence: 0.62, arousal: -0.05, group: 'presence' },
  { id: 'untethered-bright', label: 'untethered', valence: 0.45, arousal: -0.15, group: 'presence' },
  { id: 'tethered', label: 'tethered', valence: 0.58, arousal: -0.26, group: 'presence' },
  { id: 'floating-bright', label: 'floating', valence: 0.52, arousal: -0.33, group: 'presence' },
  { id: 'in-a-bubble-bright', label: 'in a bubble', valence: 0.35, arousal: -0.50, group: 'presence' },
  { id: 'quiet', label: 'quiet', valence: 0.55, arousal: -0.55, group: 'presence' },

  { id: 'hopeful', label: 'hopeful', valence: 0.50, arousal: 0.16, group: 'settled' },
  { id: 'lighter', label: 'lighter', valence: 0.60, arousal: 0.05, group: 'settled' },
  { id: 'relieved', label: 'relieved', valence: 0.50, arousal: -0.13, group: 'settled' },
  { id: 'content', label: 'content', valence: 0.55, arousal: -0.30, group: 'settled' },
  { id: 'settled', label: 'settled', valence: 0.45, arousal: -0.40, group: 'settled' },
  { id: 'at-peace', label: 'at peace', valence: 0.70, arousal: -0.45, group: 'settled' },

  { id: 'loved', label: 'loved', valence: 0.80, arousal: 0.10, group: 'connection' },
  { id: 'accepted', label: 'accepted', valence: 0.65, arousal: -0.05, group: 'connection' },
  { id: 'seen', label: 'seen', valence: 0.80, arousal: 0.22, group: 'connection' },
  { id: 'worthy', label: 'worthy', valence: 0.55, arousal: 0.27, group: 'connection' },

  { id: 'chuffed', label: 'chuffed', valence: 0.55, arousal: 0.10, group: 'capacity' },
  { id: 'capable', label: 'capable', valence: 0.55, arousal: 0.25, group: 'capacity' },
  { id: 'accomplished', label: 'accomplished', valence: 0.62, arousal: 0.28, group: 'capacity' },
  { id: 'proud', label: 'proud', valence: 0.72, arousal: 0.35, group: 'capacity' },
  { id: 'strong', label: 'strong', valence: 0.65, arousal: 0.42, group: 'capacity' },
  { id: 'powerful', label: 'powerful', valence: 0.75, arousal: 0.55, group: 'capacity' },
  { id: 'focused', label: 'focused', valence: 0.55, arousal: 0.58, group: 'capacity' },
  { id: 'determined', label: 'determined', valence: 0.45, arousal: 0.62, group: 'capacity' },
  { id: 'invulnerable', label: 'invulnerable', valence: 0.85, arousal: 0.55, group: 'capacity' },

  { id: 'moved', label: 'moved', valence: 0.45, arousal: 0.20, group: 'alive' },
  { id: 'curious', label: 'curious', valence: 0.40, arousal: 0.35, group: 'alive' },
  { id: 'happy', label: 'happy', valence: 0.75, arousal: 0.40, group: 'alive' },
  { id: 'free', label: 'free', valence: 0.70, arousal: 0.50, group: 'alive' },
  { id: 'alive', label: 'alive', valence: 0.75, arousal: 0.65, group: 'alive' },
  { id: 'excited', label: 'excited', valence: 0.55, arousal: 0.75, group: 'alive' },
  { id: 'elated', label: 'elated', valence: 0.80, arousal: 0.80, group: 'alive' },
];

/**
 * Intensity markers. Not placed in the sky.
 * These save a complete entry on their own, then offer one optional
 * "want to get closer?" step. Declining is a valid endpoint.
 */
export const markers: TaxonomyWord[] = [
  { id: 'meh', label: 'meh!', valence: -0.20, arousal: -0.30, group: 'marker' },
  { id: 'shit', label: 'shit!', valence: -0.70, arousal: 0.30, group: 'marker' },
];

export const byId = (id: string): TaxonomyWord | undefined =>
  taxonomy.find((w) => w.id === id) ?? markers.find((w) => w.id === id);
