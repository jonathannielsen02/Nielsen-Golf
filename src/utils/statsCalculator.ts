import { Tournament, SeasonStats, Round } from '../types';
import { formatCalendarDateRange } from '../services/schedule';

export function calculatePlayerSeasonStats(tournaments: Tournament[], playerId?: string, year: number | string = 2026): SeasonStats {
  const yearStr = year.toString();
  const playerTournaments = tournaments.filter(t => {
    if (playerId && t.player_id !== playerId && !t.player_id.includes(playerId)) {
      return false;
    }
    if (!t.start_date) return false;
    return t.start_date.startsWith(yearStr) && (t.status === 'Completed' || (t.status === 'Current' && (t.rounds?.length || 0) > 0));
  });

  const starts = playerTournaments.length;
  let cutsMade = 0;
  let top10s = 0;
  let top25s = 0;
  let wins = 0;
  let totalEarnings = 0;
  let bestFinishRank = 999;
  let bestFinishText = '—';

  let totalRoundsScore = 0;
  let totalRoundsCount = 0;

  playerTournaments.forEach(t => {
    if (t.earnings) {
      totalEarnings += t.earnings;
    }

    if (t.rounds && t.rounds.length > 0) {
      t.rounds.forEach((r: Round) => {
        if (r.score && r.score > 50 && r.round_status === 'Completed') {
          totalRoundsScore += r.score;
          totalRoundsCount += 1;
        }
      });
    }

    if (t.final_finish) {
      const finish = t.final_finish.trim().toUpperCase();
      const isQualifier = (t.event_type || '').toLowerCase().includes('qualif');
      if (t.made_cut === true) {
        cutsMade += 1;
      } else if (t.made_cut === undefined && !isQualifier && !['MC', 'CUT', 'WD', 'DQ', 'DNQ'].includes(finish)) {
        cutsMade += 1;
      }

      const numericPart = parseInt(finish.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numericPart)) {
        if (numericPart < bestFinishRank) {
          bestFinishRank = numericPart;
          bestFinishText = t.final_finish;
        }
        if (numericPart === 1) {
          wins += 1;
        }
        if (numericPart <= 10) {
          top10s += 1;
        }
        if (numericPart <= 25) {
          top25s += 1;
        }
      } else if (finish.includes('1ST') || finish.includes('WIN')) {
        wins += 1;
        top10s += 1;
        top25s += 1;
        bestFinishRank = 1;
        bestFinishText = '1st';
      } else if (finish.includes('2ND')) {
        top10s += 1;
        top25s += 1;
        if (bestFinishRank > 2) {
          bestFinishRank = 2;
          bestFinishText = '2nd';
        }
      } else if (finish.includes('3RD')) {
        top10s += 1;
        top25s += 1;
        if (bestFinishRank > 3) {
          bestFinishRank = 3;
          bestFinishText = '3rd';
        }
      }
    }
  });

  const scoringAverage = totalRoundsCount > 0 ? parseFloat((totalRoundsScore / totalRoundsCount).toFixed(2)) : 0;

  return {
    player_id: playerId,
    year,
    starts,
    cuts_made: cutsMade,
    top_10s: top10s,
    top_25s: top25s,
    wins,
    best_finish: bestFinishText,
    scoring_average: scoringAverage,
    earnings: totalEarnings
  };
}

export const calculateSeasonStats = calculatePlayerSeasonStats;

export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateRange(startDate: string, endDate?: string): string {
  if (!startDate) return '';
  return formatCalendarDateRange(startDate, endDate, { shortMonth: true });
}
