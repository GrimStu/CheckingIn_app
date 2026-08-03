export interface WordPick {
  id: string; // stable identifier; must never change once assigned
  name: string;
  valence: number; // -1 (unpleasant) to 1 (pleasant), stamped at time of selection
  arousal: number; // -1 (low energy) to 1 (high energy), stamped at time of selection
  color: string; // section color this word belongs to (own section, not necessarily the core's)
}

export interface CheckInEntry {
  version: number;
  id: string;
  timestamp: number;
  core: WordPick;
  second?: WordPick;
  third?: WordPick;
  regions: string[];
  sensations: string[];
  otherSensation?: string;
  photo?: string; // local file uri
  journalDone: boolean;
}

export interface ReminderSetting {
  hour: number;
  minute: number;
  enabled: boolean;
}

export interface Profile {
  name: string;
  avatar?: string; // local file uri
  dark: boolean;
  lock: boolean;
  reminders: [ReminderSetting, ReminderSetting, ReminderSetting]; // morning, midday, evening
}

export const DEFAULT_PROFILE: Profile = {
  name: 'Stu',
  avatar: undefined,
  dark: false,
  lock: false,
  reminders: [
    { hour: 8, minute: 30, enabled: true },
    { hour: 13, minute: 0, enabled: true },
    { hour: 20, minute: 30, enabled: true },
  ],
};

// In-progress check-in draft
export interface CheckInDraft {
  core?: WordPick;
  second?: WordPick;
  third?: WordPick;
  lastWheelLayer: 1 | 2 | 3;
  regions: string[];
  sensations: string[];
  otherSensation?: string;
  photo?: string;
}

export const EMPTY_DRAFT: CheckInDraft = {
  lastWheelLayer: 1,
  regions: [],
  sensations: [],
};
