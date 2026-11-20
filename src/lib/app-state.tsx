'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ViewId = 'data-hub' | 'transcription' | 'coding' | 'analytics' | 'reports';

interface AppState {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

const viewOrder: ViewId[] = ['data-hub', 'transcription', 'coding', 'analytics', 'reports'];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveViewState] = useState<ViewId>('data-hub');
  const [demoStep, setDemoStepState] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const setActiveView = useCallback((view: ViewId) => {
    setActiveViewState(view);
    setDemoStepState(viewOrder.indexOf(view) + 1);
  }, []);

  const setDemoStep = useCallback((step: number) => {
    setDemoStepState(step);
    setActiveViewState(viewOrder[step - 1]);
  }, []);

  const nextDemoStep = useCallback(() => {
    setDemoStepState((s) => {
      const next = Math.min(s + 1, 5);
      setActiveViewState(viewOrder[next - 1]);
      return next;
    });
  }, []);

  const prevDemoStep = useCallback(() => {
    setDemoStepState((s) => {
      const prev = Math.max(s - 1, 1);
      setActiveViewState(viewOrder[prev - 1]);
      return prev;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((p) => !p);
  }, []);

  return (
    <AppContext.Provider value={{
      activeView, setActiveView,
      demoStep, setDemoStep, nextDemoStep, prevDemoStep,
      sidebarCollapsed, toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  );
}

