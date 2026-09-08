import React from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { ArrowRight, Trophy } from 'lucide-react';
import { formatCalendarDateRange } from '../services/schedule';

const scoreToPar = (value?: string) => {
  if (!value && value !== '0') return '—';
  const raw = String(value).trim();
  if (raw === '0' || raw.toUpperCase() === 'E') return 'E';
  const n = Number(raw);
  return !Number.isNaN(n) && n > 0 ? `+${n}` : raw;
};

export const RecentResults: React.FC = () => {
  const { setActiveView, results } = useGolfData();
  const recent = [...results].sort((a, b) => b.end_date.localeCompare(a.end_date)).slice(0, 4);

  return (
    <section className="bg-[#F5F3EE] py-12 sm:py-16 border-y border-[#D9D6CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 text-[#244437] text-xs font-bold uppercase tracking-widest mb-2">
              <Trophy className="w-4 h-4 text-[#B49A6A]" />
              <span>Recent Results</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#202421] uppercase tracking-tight">Tournament Results</h2>
          </div>
          <button onClick={() => { setActiveView('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#244437] hover:text-[#1b342a]">
            View Results <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl px-6 py-10 sm:py-12 text-center shadow-sm">
            <p className="text-lg font-display font-bold text-[#202421]">2026 results coming soon</p>
            <p className="text-sm text-[#656A65] mt-2 max-w-xl mx-auto">Verified tournament scores and finishes will appear here automatically once entered in Google Sheets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.map((result) => (
              <div key={result.id} className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-xl p-5 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#244437]">{result.player_name}</span>
                <h3 className="font-display font-black text-[#202421] mt-1 leading-tight">{result.name}</h3>
                <p className="text-[11px] text-[#656A65] mt-1">{formatCalendarDateRange(result.start_date, result.end_date, { shortMonth: true })}</p>
                <div className="flex items-end justify-between mt-5 pt-4 border-t border-[#E2DFD7]">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-[#656A65]">Finish</span>
                    <span className="font-mono text-xl font-black text-[#202421]">{result.finish || '—'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-[#656A65]">Score</span>
                    <span className="font-mono text-lg font-black text-[#244437]">{scoreToPar(result.score_to_par)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
