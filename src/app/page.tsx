'use client';

import React from 'react';
import { AppProvider, useAppState, ViewId } from '@/lib/app-state';
import { ToastProvider } from '@/components/ui';
import { Sidebar, Header } from '@/components/layout';
import DataHubView from '@/components/views/DataHubView';
import TranscriptionView from '@/components/views/TranscriptionView';
import CodingView from '@/components/views/CodingView';
import AnalyticsView from '@/components/views/AnalyticsView';
import ReportsView from '@/components/views/ReportsView';

function DashboardContent() {
  const { activeView, sidebarCollapsed } = useAppState();

  const renderView = () => {
    switch (activeView) {
      case 'data-hub':
        return <DataHubView />;
      case 'transcription':
        return <TranscriptionView />;
      case 'coding':
        return <CodingView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DataHubView />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <Sidebar />
      <Header />

      <main
        className={`flex-1 pt-16 px-6 lg:px-10 pb-12 transition-all duration-150 ease-out ${
          sidebarCollapsed ? 'ml-14' : 'ml-60'
        }`}
      >
        <div className="max-w-[1440px] mx-auto fade-in">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <ToastProvider>
        <DashboardContent />
      </ToastProvider>
    </AppProvider>
  );
}
