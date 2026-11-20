'use client';

import React, { useEffect } from 'react';
import { Database, FileText, Code2, BarChart3, FileOutput, ChevronLeft, ChevronRight, Lock, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAppState, ViewId } from '@/lib/app-state';

const navItems: { id: ViewId; label: string; shortLabel: string; icon: React.ReactNode; shortcut: string }[] = [
  { id: 'data-hub', label: 'Data Hub', shortLabel: 'Data', icon: <Database size={18} strokeWidth={1.5} />, shortcut: '1' },
  { id: 'transcription', label: 'Transcription', shortLabel: 'Trans', icon: <FileText size={18} strokeWidth={1.5} />, shortcut: '2' },
  { id: 'coding', label: 'Coding Studio', shortLabel: 'Code', icon: <Code2 size={18} strokeWidth={1.5} />, shortcut: '3' },
  { id: 'analytics', label: 'Analytics', shortLabel: 'Anal', icon: <BarChart3 size={18} strokeWidth={1.5} />, shortcut: '4' },
  { id: 'reports', label: 'Reports', shortLabel: 'Rpts', icon: <FileOutput size={18} strokeWidth={1.5} />, shortcut: '5' },
];

export function Sidebar() {
  const { activeView, setActiveView, demoStep, nextDemoStep, prevDemoStep, sidebarCollapsed, toggleSidebar } = useAppState();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        e.preventDefault();
        setActiveView(navItems[num - 1].id);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [setActiveView]);

  return (
    <aside className={`fixed left-0 top-0 h-full bg-surface border-r border-border z-30 flex flex-col transition-all duration-150 ease-out ${sidebarCollapsed ? 'w-14' : 'w-60'}`}>
      {/* Brand */}
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} h-12 border-b border-border`}>
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-ink tracking-tight">Baala Labs</span>
            <span className="text-xs text-ink-3 ml-1">• QualAI</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-[var(--radius-sm)] hover:bg-fill-1 transition-default cursor-pointer text-ink-3 hover:text-ink"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeft size={16} strokeWidth={1.5} /> : <PanelLeftClose size={16} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-2 px-2 space-y-0.5" role="navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-default cursor-pointer
              ${activeView === item.id ? 'bg-fill-2 text-ink' : 'text-ink-2 hover:bg-fill-1 hover:text-ink'}`}
            title={sidebarCollapsed ? `${item.label} (${item.shortcut})` : undefined}
            aria-label={item.label}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <kbd className="text-[10px] text-ink-3 font-mono bg-fill-1 px-1 py-0.5 rounded">{item.shortcut}</kbd>
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Keyboard shortcuts hint */}
      {!sidebarCollapsed && (
        <div className="px-4 py-2 border-t border-border">
          <p className="text-[10px] text-ink-3">Press <kbd className="font-mono bg-fill-1 px-1 rounded">1</kbd>–<kbd className="font-mono bg-fill-1 px-1 rounded">5</kbd> to switch views • <kbd className="font-mono bg-fill-1 px-1 rounded">⌘K</kbd> search</p>
        </div>
      )}

      {/* Demo walkthrough */}
      <div className={`${sidebarCollapsed ? 'px-2' : 'px-4'} py-3 border-t border-border`}>
        {!sidebarCollapsed && <p className="text-xs text-ink-3 mb-2">Step {demoStep} of 5</p>}
        {/* Progress segments */}
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-0.5 flex-1 rounded-full transition-default ${s <= demoStep ? 'bg-ink' : 'bg-fill-2'}`}
            />
          ))}
        </div>
        {!sidebarCollapsed && (
          <div className="flex justify-between">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1}
              className="text-xs text-ink-2 hover:text-ink disabled:opacity-30 cursor-pointer transition-default flex items-center gap-1"
            >
              <ChevronLeft size={12} strokeWidth={1.5} /> Previous
            </button>
            <button
              onClick={nextDemoStep}
              disabled={demoStep === 5}
              className="text-xs text-ink-2 hover:text-ink disabled:opacity-30 cursor-pointer transition-default flex items-center gap-1"
            >
              Next <ChevronRight size={12} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export function Header() {
  const { sidebarCollapsed } = useAppState();

  return (
    <header className={`fixed top-0 ${sidebarCollapsed ? 'left-14' : 'left-60'} right-0 h-12 bg-surface border-b border-border z-20 flex items-center justify-between px-6 transition-all duration-150 ease-out`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-ink">Menstrual Health Impact Study</span>
        <span className="text-sm text-ink-3">— Q4</span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border rounded-full">
        <Lock size={12} strokeWidth={1.5} className="text-ink-2" />
        <span className="text-[11px] text-ink-2">PII Redacted • RBAC: Lead Researcher • Zero-Retention API</span>
      </div>
    </header>
  );
}

