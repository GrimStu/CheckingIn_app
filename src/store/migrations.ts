import { CheckInEntry, WordPick } from '../data/types';
import { wordTaxonomy } from '../data/wheelData';
import { taxonomy, markers, TaxonomyWord } from '../data/taxonomy';

// Each migration step upgrades an entry from exactly `from` to `from + 1`.
// Add new steps to the end of `migrationSteps` as the taxonomy evolves —
// keep each step small and self-contained rather than growing one big
// function. `loadEntries` runs an entry through every step in order,
// starting from whatever version it was saved at.
export interface MigrationStep {
  from: number;
  upgrade: (entry: any) => any;
}

function lookupWordPick(raw: any): WordPick | undefined {
  if (!raw) return raw;
  const taxon = wordTaxonomy[raw.name];
  if (taxon) {
    return {
      id: taxon.id,
      name: raw.name,
      valence: taxon.valence,
      arousal: taxon.arousal,
      color: raw.color ?? taxon.color,
    };
  }
  // No match in the current taxonomy — keep the entry rather than drop it.
  return {
    id: `unknown:${raw.name}`,
    name: raw.name,
    valence: 0,
    arousal: 0,
    color: raw.color ?? '#93897b',
  };
}

// v0 (no `version` field; name+color only WordPicks) -> v1 (id/valence/arousal
// stamped on every pick, explicit `version`).
const v0ToV1: MigrationStep = {
  from: 0,
  upgrade: (entry) => ({
    ...entry,
    version: 1,
    core: lookupWordPick(entry.core),
    second: lookupWordPick(entry.second),
    third: lookupWordPick(entry.third),
  }),
};

// v1 -> v2: the wheel taxonomy (wheelData.ts) is replaced by the original
// word list in taxonomy.ts. Old wheel ids don't exist in the new taxonomy,
// so re-resolve each pick by label (name) match instead.
const labelToWord = new Map<string, TaxonomyWord>();
for (const word of [...taxonomy, ...markers]) {
  labelToWord.set(word.label.toLowerCase(), word);
}

function retaxonomize(raw: WordPick | undefined): WordPick | undefined {
  if (!raw) return raw;
  const match = labelToWord.get(raw.name.toLowerCase());
  if (match) {
    return {
      id: match.id,
      name: raw.name,
      valence: match.valence,
      arousal: match.arousal,
      color: raw.color,
    };
  }
  // No label match in the new taxonomy — keep the entry rather than drop it.
  return {
    id: `unknown:${raw.name}`,
    name: raw.name,
    valence: 0,
    arousal: 0,
    color: raw.color,
  };
}

const v1ToV2: MigrationStep = {
  from: 1,
  upgrade: (entry) => ({
    ...entry,
    version: 2,
    core: retaxonomize(entry.core),
    second: retaxonomize(entry.second),
    third: retaxonomize(entry.third),
  }),
};

export const migrationSteps: MigrationStep[] = [v0ToV1, v1ToV2];

export const CURRENT_ENTRY_VERSION = migrationSteps.length; // 1, once, etc. as steps are appended

export function migrateEntry(raw: any): CheckInEntry {
  let entry = raw;
  let version = typeof entry.version === 'number' ? entry.version : 0;
  while (version < CURRENT_ENTRY_VERSION) {
    const step = migrationSteps.find((s) => s.from === version);
    if (!step) break; // no migration defined from here; stop rather than lose the entry
    entry = step.upgrade(entry);
    version = entry.version;
  }
  return entry as CheckInEntry;
}
