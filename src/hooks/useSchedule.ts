/**
 * Hook to access the unified Google Sheets tournament schedule data.
 */

import { useState, useEffect, useCallback } from 'react';
import { Tournament } from '../types';
import {
  fetchScheduleFromGoogleSheets,
  ScheduleFetchResult,
  formatCalendarDateRange,
  formatLocation,
  formatVenue,
  isValidUrl
} from '../services/schedule';
import { useGolfData } from '../context/GolfDataContext';

export interface UseScheduleReturn {
  tournaments: Tournament[];
  currentTournaments: Tournament[];
  upcomingTournaments: Tournament[];
  completedTournaments: Tournament[];
  jonathanTournaments: Tournament[];
  timTournaments: Tournament[];
  jonathanCurrentTournament: Tournament | null;
  timCurrentTournament: Tournament | null;
  jonathanNextTournament: Tournament | null;
  timNextTournament: Tournament | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  lastUpdated: Date | null;
  refreshSchedule: () => Promise<void>;
  formatDate: typeof formatCalendarDateRange;
  formatLocation: typeof formatLocation;
  formatVenue: typeof formatVenue;
  isValidUrl: typeof isValidUrl;
}

export function useSchedule(): UseScheduleReturn {
  // If GolfDataContext is mounted, it shares the context tournaments directly
  const context = useGolfData();

  const refreshSchedule = useCallback(async () => {
    if (context?.refreshData) {
      await context.refreshData();
    }
  }, [context]);

  const tournaments = context?.tournaments || [];
  const currentTournaments = tournaments.filter((t) => t.status === 'Current');
  const upcomingTournaments = tournaments.filter((t) => t.status === 'Upcoming');
  const completedTournaments = tournaments.filter((t) => t.status === 'Completed');

  const jonathanTournaments = tournaments.filter(
    (t) => t.player_id.includes('jonathan') || t.player_id === 'jonathan'
  );
  const timTournaments = tournaments.filter(
    (t) => t.player_id.includes('tim') || t.player_id === 'tim'
  );

  const jonathanCurrentTournament = context?.jonathanCurrentTournament || null;
  const timCurrentTournament = context?.timCurrentTournament || null;
  const jonathanNextTournament = context?.jonathanNextTournament || null;
  const timNextTournament = context?.timNextTournament || null;

  return {
    tournaments,
    currentTournaments,
    upcomingTournaments,
    completedTournaments,
    jonathanTournaments,
    timTournaments,
    jonathanCurrentTournament,
    timCurrentTournament,
    jonathanNextTournament,
    timNextTournament,
    isLoading: context?.isLoading || false,
    isError: false,
    errorMessage: null,
    lastUpdated: null,
    refreshSchedule,
    formatDate: formatCalendarDateRange,
    formatLocation,
    formatVenue,
    isValidUrl
  };
}
