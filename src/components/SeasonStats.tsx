import React from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { calculatePlayerSeasonStats } from '../utils/statsCalculator';

export const SeasonStats: React.FC = () => {
  const { setActiveView, results } = useGolfData();
  const stats = calculatePlayerSeasonStats(results, undefined, 2026);
  const hasResults = results.some(r => Number(r.season || r.start_date?.slice(0, 4)) === 2026);
  const items: [string, string | number][] = [
    ['Starts', stats.starts],
    ['Cuts Made', stats.cuts_made],
    ['Top 10s', stats.top_10s],
    ['Top 25s', stats.top_25s],
    ['Best Finish', stats.best_finish],
    ['Scoring Avg', stats.scoring_average ? stats.scoring_average.toFixed(2) : '—']
  ];

  return (
    <section className="bg-[#FAF9F6] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 text-[#244437] text-xs font-bold uppercase tracking-widest mb-2">
              <BarChart3 className="w-4 h-4 text-[#B49A6A]" />
              <span>Season Snapshot</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#202421] uppercase tracking-tight">2026 At A Glance</h2>
            <p className="text-sm text-[#656A65] mt-2">Season statistics are calculated automatically from verified results.</p>
          </div>
          <button onClick={() => { setActiveView('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#244437] hover:text-[#1b342a]">
            Full Results <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map(([label, value]) => (
            <div key={label} className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center min-h-[92px] flex flex-col justify-center shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#656A65] block">{label}</span>
              <span className={`${hasResults ? 'font-mono text-xl font-black text-[#202421]' : 'text-xs font-semibold text-[#A0A5A0]'} mt-2 block`}>
                {hasResults ? value : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
