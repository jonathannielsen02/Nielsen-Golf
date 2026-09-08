import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { PlayerFilter } from '../types';

export const ResultsView: React.FC = () => {
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('all');
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [selectedTour, setSelectedTour] = useState<string>('All');

  const summaryLabels = ['Starts', 'Cuts Made', 'Top 10s', 'Top 25s', 'Best Finish', 'Scoring Avg'];

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
                Official tournament results for Jonathan and Tim Nielsen will be published here as the season progresses.
              </p>
            </div>

            <div className="flex items-center bg-[#FAF9F6] p-1 rounded-lg border border-[#D9D6CC] self-start md:self-auto shadow-xs">
              {(['all', 'jonathan', 'tim'] as PlayerFilter[]).map((key) => {
                const label = key === 'all' ? 'All Golfers' : key === 'jonathan' ? 'Jonathan' : 'Tim';
                const isActive = playerFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => setPlayerFilter(key)}
                    className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive ? 'bg-[#244437] text-white shadow-sm' : 'text-[#656A65] hover:text-[#202421]'
                    }`}
                  >
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
                <button
                  key={year}
                  onClick={() => setSelectedSeason(year)}
                  className={`px-3 py-1 rounded font-bold uppercase transition-colors ${
                    selectedSeason === year ? 'bg-[#244437] text-white' : 'text-[#656A65] hover:text-[#202421]'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg p-1 text-xs">
              <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Tour:</span>
              {['All', 'PGA TOUR Americas', 'APGA Tour', 'Asian Development Tour'].map((tour) => (
                <button
                  key={tour}
                  onClick={() => setSelectedTour(tour)}
                  className={`px-2.5 py-1 rounded font-bold uppercase transition-colors ${
                    selectedTour === tour ? 'bg-[#244437] text-white' : 'text-[#656A65] hover:text-[#202421]'
                  }`}
                >
                  {tour === 'All' ? 'All' : tour === 'PGA TOUR Americas' ? 'Americas' : tour === 'APGA Tour' ? 'APGA' : 'ADT'}
                </button>
              ))}
            </div>
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
              <span className="text-xs text-[#656A65]">Season statistics will populate from verified tournament results.</span>
            </div>
            <span className="text-xs font-bold text-[#244437] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 uppercase">
              Results Pending
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {summaryLabels.map((label) => (
              <div key={label} className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center min-h-[86px] flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase text-[#656A65] block">{label}</span>
                <span className="text-xs font-semibold text-[#A0A5A0] mt-2 block">Pending</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-[#E2DFD7]">
            <h3 className="text-lg font-display font-black text-[#202421] uppercase tracking-tight">Tournament Log</h3>
          </div>
          <div className="px-6 py-14 sm:py-16 text-center">
            <p className="text-lg font-display font-bold text-[#202421]">Results coming soon</p>
            <p className="mt-2 text-sm text-[#656A65] max-w-lg mx-auto leading-relaxed">
              Verified scores, finishes, and season statistics will appear here once this season&apos;s official results are added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
