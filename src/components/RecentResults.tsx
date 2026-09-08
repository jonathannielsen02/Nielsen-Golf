import React from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { ArrowRight, Trophy } from 'lucide-react';

export const RecentResults: React.FC = () => {
  const { setActiveView } = useGolfData();

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
          <button
            onClick={() => {
              setActiveView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#244437] hover:text-[#1b342a]"
          >
            View Results <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl px-6 py-10 sm:py-12 text-center shadow-sm">
          <p className="text-lg font-display font-bold text-[#202421]">2026 results coming soon</p>
          <p className="text-sm text-[#656A65] mt-2 max-w-xl mx-auto">
            Verified tournament scores and finishes will be added as the season record is finalized.
          </p>
        </div>
      </div>
    </section>
  );
};
