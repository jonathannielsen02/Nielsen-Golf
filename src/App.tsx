/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GolfDataProvider, useGolfData } from './context/GolfDataContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { ScheduleView } from './views/ScheduleView';
import { ResultsView } from './views/ResultsView';
import { TournamentDetailView } from './views/TournamentDetailView';
import { PartnerWithUsView } from './views/PartnerWithUsView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

const AppContent: React.FC = () => {
  const { activeView, isLoading } = useGolfData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex flex-col items-center justify-center text-[#202421] space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#244437] flex items-center justify-center font-display font-black text-2xl text-white tracking-tight animate-pulse shadow-md">
          NG
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#244437]">
          Loading Nielsen Golf...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EE] text-[#202421] selection:bg-[#244437] selection:text-white">
      {/* Universal Top Navigation */}
      <Navigation />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'profile' && <ProfileView playerSlug="jonathan" />}
        {activeView === 'jonathan' && <ProfileView playerSlug="jonathan" />}
        {activeView === 'tim' && <ProfileView playerSlug="tim" />}
        {activeView === 'schedule' && <ScheduleView />}
        {activeView === 'results' && <ResultsView />}
        {activeView === 'tournament-detail' && <TournamentDetailView />}
        {activeView === 'partner-with-us' && <PartnerWithUsView />}
        {activeView === 'partners' && <PartnerWithUsView defaultSection="partners" />}
        {activeView === 'sponsorship' && <PartnerWithUsView defaultSection="sponsor" />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'admin' && <AdminView />}
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <GolfDataProvider>
      <AppContent />
    </GolfDataProvider>
  );
}
