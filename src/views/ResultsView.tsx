import React, { useMemo, useState } from 'react';
import { BarChart3, ExternalLink } from 'lucide-react';
import { PlayerFilter, Tournament } from '../types';
import { useGolfData } from '../context/GolfDataContext';
import { calculatePlayerSeasonStats } from '../utils/statsCalculator';
import { formatCalendarDateRange, formatVenue, getLeaderboardUrl } from '../services/schedule';

const playerMatches = (t: Tournament, filter: PlayerFilter) => {
  if (filter === 'all') return true;
  return t.player_id.includes(filter) || (t.player_name || '').toLowerCase().includes(filter);
};

const displayScoreToPar = (value?: string) => {
  if (value === undefined || value === null || String(value).trim() === '') return '—';
  const raw = String(value).trim();
  if (raw === '0' || raw.toUpperCase() === 'E') return 'E';
  const n = Number(raw);
  if (!Number.isNaN(n) && n > 0) return `+${n}`;
  return raw;
};

export const ResultsView: React.FC = () => {
  const { results } = useGolfData();
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('all');
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [selectedTour, setSelectedTour] = useState<string>('All');

  const tours = useMemo(() => ['All', ...Array.from(new Set(results.map(r => r.tour).filter(Boolean)))], [results]);

  const filtered = useMemo(() => results.filter((result) => {
    const season = Number(result.season || result.start_date?.slice(0, 4));
    return playerMatches(result, playerFilter)
      && season === selectedSeason
      && (selectedTour === 'All' || result.tour === selectedTour);
  }), [results, playerFilter, selectedSeason, selectedTour]);

  const stats = useMemo(() => {
    if (playerFilter === 'all') return calculatePlayerSeasonStats(filtered, undefined, selectedSeason);
    return calculatePlayerSeasonStats(filtered, playerFilter, selectedSeason);
  }, [filtered, playerFilter, selectedSeason]);

  const hasResults = filtered.length > 0;
  const summary = [
    ['Starts', stats.starts],
    ['Cuts Made', stats.cuts_made],
    ['Top 10s', stats.top_10s],
    ['Top 25s', stats.top_25s],
    ['Best Finish', stats.best_finish],
    ['Scoring Avg', stats.scoring_average ? stats.scoring_average.toFixed(2) : '—']
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-16 text-[#202421]">
      <div className="bg-[#ECEAE4] text-[#202421] border-b border-[#D9D6CC] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-2.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>Season Results</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#202421] tracking-tight uppercase">
                Tournament Results &amp; Stats
              </h1>
              <p className="text-sm sm:text-base text-[#656A65] mt-2 max-w-xl leading-relaxed">
                Verified tournament results for Jonathan and Tim Nielsen, updated from the Nielsen Golf season record.
              </p>
            </div>

            <div className="flex items-center bg-[#FAF9F6] p-1 rounded-lg border border-[#D9D6CC] self-start md:self-auto shadow-xs">
              {(['all', 'jonathan', 'tim'] as PlayerFilter[]).map((key) => {
                const label = key === 'all' ? 'All Golfers' : key === 'jonathan' ? 'Jonathan' : 'Tim';
                return (
                  <button key={key} onClick={() => setPlayerFilter(key)} className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${playerFilter === key ? 'bg-[#244437] text-white shadow-sm' : 'text-[#656A65] hover:text-[#202421]'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[#D9D6CC]">
            <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg p-1 text-xs">
              <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Season:</span>
              {[2026, 2025, 2024].map((year) => (
                <button key={year} onClick={() => setSelectedSeason(year)} className={`px-3 py-1 rounded font-bold uppercase transition-colors ${selectedSeason === year ? 'bg-[#244437] text-white' : 'text-[#656A65] hover:text-[#202421]'}`}>
                  {year}
                </button>
              ))}
            </div>

            {tours.length > 1 && (
              <div className="flex flex-wrap items-center gap-1 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg p-1 text-xs">
                <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Tour:</span>
                {tours.map((tour) => (
                  <button key={tour} onClick={() => setSelectedTour(tour)} className={`px-2.5 py-1 rounded font-bold uppercase transition-colors ${selectedTour === tour ? 'bg-[#244437] text-white' : 'text-[#656A65] hover:text-[#202421]'}`}>
                    {tour === 'PGA TOUR Americas' ? 'Americas' : tour}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-display font-black text-[#202421] uppercase tracking-tight">
                {selectedSeason} {playerFilter === 'all' ? 'Combined' : playerFilter === 'jonathan' ? 'Jonathan Nielsen' : 'Tim Nielsen'} Summary
              </h2>
              <span className="text-xs text-[#656A65]">Calculated automatically from the Results tab in Google Sheets.</span>
            </div>
            <span className="text-xs font-bold text-[#244437] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 uppercase">
              {hasResults ? 'Verified Results' : 'Results Pending'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {summary.map(([label, value]) => (
              <div key={String(label)} className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center min-h-[86px] flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase text-[#656A65] block">{label}</span>
                <span className={`mt-2 block ${hasResults ? 'font-mono text-xl font-black text-[#202421]' : 'text-xs font-semibold text-[#A0A5A0]'}`}>
                  {hasResults ? value : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-[#E2DFD7]">
            <h3 className="text-lg font-display font-black text-[#202421] uppercase tracking-tight">Tournament Log</h3>
          </div>

          {!hasResults ? (
            <div className="px-6 py-14 sm:py-16 text-center">
              <p className="text-lg font-display font-bold text-[#202421]">Results coming soon</p>
              <p className="mt-2 text-sm text-[#656A65] max-w-lg mx-auto leading-relaxed">
                Add verified tournament results to the Google Sheet and they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2DFD7]">
              {filtered.map((result) => {
                const rounds = [result.round_1, result.round_2, result.round_3, result.round_4].filter(v => v !== undefined && String(v).trim() !== '');
                const leaderboardUrl = getLeaderboardUrl(result);
                return (
                  <div key={result.id} className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_auto] gap-5 lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#244437]">{result.player_name}</span>
                        {result.tour && <span className="text-[10px] font-bold uppercase tracking-wider text-[#656A65]">• {result.tour}</span>}
                      </div>
                      <h4 className="text-lg font-display font-black text-[#202421]">{result.name}</h4>
                      <p className="text-xs text-[#656A65] mt-1">
                        {formatCalendarDateRange(result.start_date, result.end_date, { shortMonth: true })}
                        {formatVenue(result.course, result.city, result.state_country) ? ` • ${formatVenue(result.course, result.city, result.state_country)}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {rounds.map((score, i) => (
                        <div key={i} className="min-w-12 bg-white border border-[#E2DFD7] rounded-lg px-2.5 py-2 text-center">
                          <span className="block text-[9px] font-bold text-[#656A65] uppercase">R{i + 1}</span>
                          <span className="block font-mono font-black text-[#202421]">{score}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-1 text-right">
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#656A65]">Finish</span>
                        <span className="font-mono text-xl font-black text-[#202421]">{result.finish || '—'}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#656A65]">Score</span>
                        <span className="font-mono font-black text-[#244437]">{displayScoreToPar(result.score_to_par)}</span>
                      </div>
                      {result.leaderboard_url && leaderboardUrl && (
                        <a href={leaderboardUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#244437] hover:underline">
                          Official <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
