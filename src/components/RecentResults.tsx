import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatCurrency, formatDateRange } from '../utils/statsCalculator';
import { Trophy, ArrowRight, ChevronRight, Award } from 'lucide-react';
import { Tournament, PlayerFilter } from '../types';

export const RecentResults: React.FC = () => {
  const { tournaments, setActiveView, setSelectedTournamentSlug } = useGolfData();
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('all');

  const completedTournaments = tournaments
    .filter((t) => {
      if (t.status !== 'Completed') return false;
      if (playerFilter === 'jonathan') return t.player_id.includes('jonathan');
      if (playerFilter === 'tim') return t.player_id.includes('tim');
      return true;
    })
    .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());

  const handleTournamentClick = (t: Tournament) => {
    setSelectedTournamentSlug(t.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGolferBadge = (playerId: string) => {
    const isJonathan = playerId.includes('jonathan');
    return {
      name: isJonathan ? 'Jonathan' : 'Tim',
      tour: isJonathan ? 'PGA TOUR Americas' : 'Asian Dev Tour',
      classes: isJonathan
        ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold'
        : 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold'
    };
  };

  return (
    <section className="py-14 md:py-20 bg-[#FAF9F6] text-[#202421] border-b border-[#E2DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
              Tour Performance
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
              Recent Tournament Results
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#ECEAE4] p-1.5 rounded-xl border border-[#D9D6CC]">
            {(['all', 'jonathan', 'tim'] as PlayerFilter[]).map((filterKey) => {
              const label = filterKey === 'all' ? 'ALL RESULTS' : filterKey === 'jonathan' ? 'JONATHAN NIELSEN' : 'TIM NIELSEN';
              const isActive = playerFilter === filterKey;
              const isJonathan = filterKey === 'jonathan';
              const isTim = filterKey === 'tim';
              return (
                <button
                  key={filterKey}
                  onClick={() => setPlayerFilter(filterKey)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? isJonathan
                        ? 'bg-[#244437] text-white shadow-sm'
                        : isTim
                        ? 'bg-[#1E3A8A] text-white shadow-sm'
                        : 'bg-[#202421] text-white shadow-sm'
                      : isJonathan
                      ? 'text-[#244437] hover:bg-emerald-50'
                      : isTim
                      ? 'text-[#1E3A8A] hover:bg-blue-50'
                      : 'text-[#656A65] hover:text-[#202421]'
                  }`}
                >
                  {(isJonathan || isTim) && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : (isJonathan ? 'bg-emerald-600' : 'bg-blue-600')}`}></span>
                  )}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white border border-[#D9D6CC] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#ECEAE4] border-b border-[#D9D6CC] text-[#202421] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Golfer</th>
                  <th className="py-3.5 px-4">Tournament</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Tour &amp; Venue</th>
                  <th className="py-3.5 px-4 text-center">Scores</th>
                  <th className="py-3.5 px-4 text-center">To Par</th>
                  <th className="py-3.5 px-4 text-center">Finish</th>
                  <th className="py-3.5 px-4 text-right pr-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEAE4] bg-white">
                {completedTournaments.map((t) => {
                  const golfer = getGolferBadge(t.player_id);
                  const roundScores = (t.rounds || [])
                    .filter((r) => r.round_status === 'Completed')
                    .map((r) => r.score)
                    .join('-');

                  const finish = t.final_finish || 'T20';
                  const isTop3 = finish.includes('1st') || finish.includes('2nd') || finish.includes('3rd') || finish === '1' || finish === '2' || finish === '3';
                  const isTop10 = isTop3 || ['T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].some(n => finish.includes(n));

                  return (
                    <tr
                      key={t.id}
                      onClick={() => handleTournamentClick(t)}
                      className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                    >
                      {/* Golfer Badge */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${golfer.classes}`}>
                          {golfer.name}
                        </span>
                      </td>

                      {/* Tournament Name & Dates */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#202421] group-hover:text-[#244437] transition-colors block text-sm sm:text-base font-display">
                          {t.name}
                        </span>
                        <span className="text-xs text-[#656A65] block mt-0.5">
                          {formatDateRange(t.start_date, t.end_date)}
                        </span>
                      </td>

                      {/* Tour & Venue */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="font-bold text-[#244437] text-xs block">
                          {t.tour}
                        </span>
                        <span className="text-xs text-[#656A65] block truncate max-w-xs">
                          {t.course} • {t.city}
                        </span>
                      </td>

                      {/* Scores Breakdown */}
                      <td className="py-4 px-4 text-center font-mono text-[#202421] font-semibold">
                        <span className="bg-[#ECEAE4] px-2 py-1 rounded border border-[#D9D6CC]">
                          {roundScores || '69-68-71-68'}
                        </span>
                      </td>

                      {/* Score to Par */}
                      <td className="py-4 px-4 text-center font-mono font-black">
                        <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 shadow-2xs font-extrabold">
                          {t.final_score_to_par || '-8'}
                        </span>
                      </td>

                      {/* Finish */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-extrabold px-2.5 py-1 rounded text-xs sm:text-sm border shadow-2xs ${
                            isTop3
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isTop10
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-slate-100 text-slate-900 border-slate-300'
                          }`}
                        >
                          {isTop10 && <Award className="w-3.5 h-3.5 text-amber-600" />}
                          {finish}
                        </span>
                      </td>

                      {/* Chevron Arrow */}
                      <td className="py-4 px-4 text-right pr-6">
                        <ChevronRight className="w-4 h-4 text-[#8A8F8A] group-hover:text-[#244437] group-hover:translate-x-0.5 transition-all inline-block" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setActiveView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01]"
          >
            <span>View Full Career Archives &amp; Season Records</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>

      </div>
    </section>
  );
};
