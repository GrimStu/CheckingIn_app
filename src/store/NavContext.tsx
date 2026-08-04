import React, { createContext, useContext, useState, useCallback } from 'react';

export type TabName = 'checkin' | 'history' | 'practices';
export type HistoryTab = 'timeline' | 'calendar' | 'patterns';
export type ExerciseName = 'bodyscan' | 'meditation' | 'eating' | 'senses';
export type CheckInStep =
  | 'sky'
  | 'confirm'
  | 'bodyIntro'
  | 'body'
  | 'journal'
  | 'done';

interface NavContextValue {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  checkinStep: CheckInStep;
  setCheckinStep: (s: CheckInStep) => void;

  historyTab: HistoryTab;
  setHistoryTab: (t: HistoryTab) => void;
  expandedEntryId: string | null;
  setExpandedEntryId: (id: string | null) => void;

  openExercise: ExerciseName | null;
  exerciseReturnTo: TabName | null;
  openExerciseScreen: (name: ExerciseName, returnTo: TabName) => void;
  closeExerciseScreen: () => void;
}

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabName>('checkin');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkinStep, setCheckinStep] = useState<CheckInStep>('sky');
  const [historyTab, setHistoryTab] = useState<HistoryTab>('timeline');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [openExercise, setOpenExercise] = useState<ExerciseName | null>(null);
  const [exerciseReturnTo, setExerciseReturnTo] = useState<TabName | null>(null);

  const setActiveTab = useCallback((tab: TabName) => setActiveTabState(tab), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const openExerciseScreen = useCallback((name: ExerciseName, returnTo: TabName) => {
    setOpenExercise(name);
    setExerciseReturnTo(returnTo);
  }, []);
  const closeExerciseScreen = useCallback(() => {
    setOpenExercise(null);
    setExerciseReturnTo(null);
  }, []);

  const value: NavContextValue = {
    activeTab,
    setActiveTab,
    drawerOpen,
    openDrawer,
    closeDrawer,
    checkinStep,
    setCheckinStep,
    historyTab,
    setHistoryTab,
    expandedEntryId,
    setExpandedEntryId,
    openExercise,
    exerciseReturnTo,
    openExerciseScreen,
    closeExerciseScreen,
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
