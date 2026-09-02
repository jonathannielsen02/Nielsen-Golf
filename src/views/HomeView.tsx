import React from 'react';
import { Hero } from '../components/Hero';
import { PlayerCardsSection } from '../components/PlayerCardsSection';
import { CurrentTournamentCard } from '../components/CurrentTournamentCard';
import { LatestRoundCard } from '../components/LatestRoundCard';
import { UpcomingSchedule } from '../components/UpcomingSchedule';
import { RecentResults } from '../components/RecentResults';
import { SeasonStats } from '../components/SeasonStats';
import { FollowerSignup } from '../components/FollowerSignup';

export const HomeView: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Follow The Players (Side-by-side player cards) */}
      <PlayerCardsSection />

      {/* Section 3: This Week (Active tournament tracker for both golfers) */}
      <CurrentTournamentCard />

      {/* Section 4: Latest Round Recap with AI Scoring Analysis */}
      <LatestRoundCard />

      {/* Section 5: Upcoming Tournaments Schedule */}
      <UpcomingSchedule />

      {/* Section 6: Recent Completed Tournament Results */}
      <RecentResults />

      {/* Section 7: Season at a Glance Automated Stats */}
      <SeasonStats />

      {/* Section 8: Supporter / Fan Updates & Partner Highlights */}
      <FollowerSignup />
    </div>
  );
};
