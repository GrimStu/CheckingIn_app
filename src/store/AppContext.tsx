import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { CheckInEntry, Profile, DEFAULT_PROFILE, CheckInDraft, EMPTY_DRAFT } from '../data/types';
import { loadEntries, saveEntries, loadProfile, saveProfile } from './storage';

interface Stats {
  totalCount: number;
  streak: number;
  perCoreCounts: Record<string, { count: number; color: string }>;
  topRegions: { name: string; count: number }[];
  topWords: { name: string; color: string; count: number }[];
  hasUnfinishedJournal: boolean;
}

interface AppContextValue {
  ready: boolean;
  entries: CheckInEntry[];
  addEntry: (entry: CheckInEntry) => Promise<void>;
  updateEntry: (id: string, patch: Partial<CheckInEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  draft: CheckInDraft;
  setDraft: (patch: Partial<CheckInDraft> | ((prev: CheckInDraft) => CheckInDraft)) => void;
  resetDraft: () => void;
  inProgress: boolean;
  stats: Stats;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function computeStreak(entries: CheckInEntry[]): number {
  if (entries.length === 0) return 0;
  const days = new Set(entries.map((e) => dayKey(e.timestamp)));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [draft, setDraftState] = useState<CheckInDraft>(EMPTY_DRAFT);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    (async () => {
      const [e, p] = await Promise.all([loadEntries(), loadProfile()]);
      setEntries(e);
      setProfile(p);
      setReady(true);
    })();
  }, []);

  const addEntry = useCallback(async (entry: CheckInEntry) => {
    setEntries((prev) => {
      const next = [entry, ...prev];
      saveEntries(next);
      return next;
    });
  }, []);

  const updateEntry = useCallback(async (id: string, patch: Partial<CheckInEntry>) => {
    setEntries((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      saveEntries(next);
      return next;
    });
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEntries(next);
      return next;
    });
  }, []);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      return next;
    });
  }, []);

  const setDraft = useCallback(
    (patch: Partial<CheckInDraft> | ((prev: CheckInDraft) => CheckInDraft)) => {
      setInProgress(true);
      setDraftState((prev) =>
        typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      );
    },
    []
  );

  const resetDraft = useCallback(() => {
    setDraftState(EMPTY_DRAFT);
    setInProgress(false);
  }, []);

  const stats = useMemo<Stats>(() => {
    const perCoreCounts: Record<string, { count: number; color: string }> = {};
    const regionCounts: Record<string, number> = {};
    const wordCounts: Record<string, { color: string; count: number }> = {};
    let hasUnfinishedJournal = false;

    for (const e of entries) {
      if (!e.journalDone) hasUnfinishedJournal = true;
      const coreKey = e.core.name;
      if (!perCoreCounts[coreKey]) perCoreCounts[coreKey] = { count: 0, color: e.core.color };
      perCoreCounts[coreKey].count += 1;

      for (const r of e.regions) {
        regionCounts[r] = (regionCounts[r] || 0) + 1;
      }

      for (const w of [e.second, e.third]) {
        if (!w) continue;
        if (!wordCounts[w.name]) wordCounts[w.name] = { color: w.color, count: 0 };
        wordCounts[w.name].count += 1;
      }
    }

    const topRegions = Object.entries(regionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const topWords = Object.entries(wordCounts)
      .map(([name, v]) => ({ name, color: v.color, count: v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      totalCount: entries.length,
      streak: computeStreak(entries),
      perCoreCounts,
      topRegions,
      topWords,
      hasUnfinishedJournal,
    };
  }, [entries]);

  const value: AppContextValue = {
    ready,
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    profile,
    updateProfile,
    draft,
    setDraft,
    resetDraft,
    inProgress,
    stats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
