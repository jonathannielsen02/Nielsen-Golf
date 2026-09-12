import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, ExternalLink } from 'lucide-react';
import { Tournament } from '../types';
import { useGolfData } from '../context/GolfDataContext';
import { calculatePlayerSeasonStats } from '../utils/statsCalculator';
import { formatCalendarDateRange, formatVenue, getLeaderboardUrl } from '../services/schedule';

const playerMatches = (t: Tournament, player: 'jonathan' | 'tim') =>
  t.player_id.includes(player) || (t.player_name || '').toLowerCase().includes(player);

const displayScoreToPar = (value?: string) => {
  if (value === undefined || value === null || String(value).trim() === '') return '—';
  const raw = String(value).trim();
  if (raw === '0' || raw.toUpperCase() === 'E') return 'E';
  const n = Number(raw);
  if (!Number.isNaN(n) && n > 0) return `+${n}`;
  return raw;
};

interface PlayerColumnProps {
  player: 'jonathan' | 'tim';
  label: string;
  results: Tournament[];
  selectedSeason: number;
}

const PlayerColumn: React.FC<PlayerColumnProps> = ({ player, label, results, selectedSeason }) => {
  const stats = calculatePlayerSeasonStats(results, player, selectedSeason);
  const isJonathan = player === 'jonathan';
  const accent = isJonathan ? '#1E3A8A' : '#244437';
  const soft = isJonathan ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200';

  const summary = [
    ['Starts', stats.starts],
    ['Top 10s', stats.top_10s],
    ['Top 25s', stats.top_25s],
    ['Best', stats.best_finish],
    ['Avg', stats.scoring_average ? stats.scoring_average.toFixed(2) : '—']
  ];

  return (
    <section className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 sm:p-6 border-b border-[#E2DFD7]" style={{ borderTop: `4px solid ${accent}` }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: accent }}>Player Results</span>
            <h2 className="text-2xl font-display font-black uppercase tracking-tight mt-1">{label}</h2>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${soft}`} style={{ color: accent }}>
            {results.length ? `${results.length} Starts` : 'Results Pending'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-5">
          {summary.map(([name, value]) => (
            <div key={String(name)} className="bg-white border border-[#E2DFD7] rounded-lg p-2.5 text-center min-w-0">
              <span className="text-[9px] font-bold uppercase text-[#656A65] block truncate">{name}</span>
              <span className="font-mono text-sm sm:text-base font-black mt-1 block truncate">{results.length ? value : '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {!results.length ? (
        <div className="px-6 py-14 text-center">
          <p className="font-display font-bold text-[#202421]">Results coming soon</p>
          <p className="text-sm text-[#656A65] mt-2">No {selectedSeason} results have been entered yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E2DFD7]">
          {results.map((result) => {
            const rounds = [result.round_1, result.round_2, result.round_3, result.round_4]
              .filter(v => v !== undefined && String(v).trim() !== '');
            const leaderboardUrl = getLeaderboardUrl(result);
            return (
              <article key={result.id} className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {result.tour && <span className="text-[10px] font-bold uppercase tracking-wider text-[#656A65]">{result.tour}</span>}
                    <h3 className="text-base sm:text-lg font-display font-black text-[#202421] mt-1 leading-tight">{result.name}</h3>
                    <p className="text-xs text-[#656A65] mt-1.5 leading-relaxed">
                      {formatCalendarDateRange(result.start_date, result.end_date, { shortMonth: true })}
                      {formatVenue(result.course, result.city, result.state_country) ? ` • ${formatVenue(result.course, result.city, result.state_country)}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-[#656A65]">Finish</span>
                    <span className="font-mono text-xl font-black text-[#202421]">{result.finish || '—'}</span>
                    <span className="block font-mono font-black mt-1" style={{ color: accent }}>{displayScoreToPar(result.score_to_par)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {rounds.map((score, i) => (
                      <div key={i} className="min-w-11 bg-white border border-[#E2DFD7] rounded-lg px-2 py-1.5 text-center">
                        <span className="block text-[8px] font-bold text-[#656A65] uppercase">R{i + 1}</span>
                        <span className="block font-mono font-black text-sm text-[#202421]">{score}</span>
                      </div>
                    ))}
                  </div>
                  {result.leaderboard_url && leaderboardUrl && (
                    <a href={leaderboardUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider hover:underline shrink-0" style={{ color: accent }}>
                      Official <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export const ResultsView: React.FC = () => {
  const { results } = useGolfData();
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [selectedTour, setSelectedTour] = useState<string>('All');

  const tours = useMemo(() => ['All', ...Array.from(new Set(results.map(r => r.tour).filter(Boolean)))], [results]);
  const seasons = useMemo(() => Array.from(new Set<number>(results
    .map(r => Number(r.season || r.start_date?.slice(0, 4)))
    .filter((y): y is number => Number.isFinite(y)))).sort((a, b) => b - a), [results]);

  useEffect(() => {
    if (seasons.length > 0 && !seasons.includes(selectedSeason)) setSelectedSeason(seasons[0]);
  }, [seasons, selectedSeason]);

  const seasonTourResults = useMemo(() => results.filter(result => {
    const season = Number(result.season || result.start_date?.slice(0, 4));
    return season === selectedSeason && (selectedTour === 'All' || result.tour === selectedTour);
  }), [results, selectedSeason, selectedTour]);

  const jonathanResults = seasonTourResults.filter(r => playerMatches(r, 'jonathan'));
  const timResults = seasonTourResults.filter(r => playerMatches(r, 'tim'));

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-16 text-[#202421]">
      <div className="bg-[#ECEAE4] border-b border-[#D9D6CC] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-2.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#B49A6A]" />
              <span>Season Results</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight uppercase">Tournament Results &amp; Stats</h1>
            <p className="text-sm sm:text-base text-[#656A65] mt-2 max-w-xl leading-relaxed">
              Jonathan and Tim's tournament results, shown side by side throughout the season.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[#D9D6CC]">
            <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg p-1 text-xs">
              <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Season:</span>
              {(seasons.length > 0 ? seasons : [2026, 2025, 2024]).map(year => (
                <button key={year} onClick={() => setSelectedSeason(year)} className={`px-3 py-1 rounded font-bold uppercase transition-colors ${selectedSeason === year ? 'bg-[#202421] text-white' : 'text-[#656A65] hover:text-[#202421]'}`}>{year}</button>
              ))}
            </div>

            {tours.length > 1 && (
              <div className="flex flex-wrap items-center gap-1 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg p-1 text-xs">
                <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Tour:</span>
                {tours.map(tour => (
                  <button key={tour} onClick={() => setSelectedTour(tour)} className={`px-2.5 py-1 rounded font-bold uppercase transition-colors ${selectedTour === tour ? 'bg-[#202421] text-white' : 'text-[#656A65] hover:text-[#202421]'}`}>{tour === 'PGA TOUR Americas' ? 'Americas' : tour}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start">
          <PlayerColumn player="jonathan" label="Jonathan Nielsen" results={jonathanResults} selectedSeason={selectedSeason} />
          <PlayerColumn player="tim" label="Tim Nielsen" results={timResults} selectedSeason={selectedSeason} />
        </div>
      </div>
    </div>
  );
};
