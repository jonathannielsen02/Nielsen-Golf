import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { calculatePlayerSeasonStats, calculateSeasonStats, formatCurrency, formatDateRange } from '../utils/statsCalculator';
import { Trophy, Award, TrendingUp, DollarSign, Target, CheckCircle2, ChevronRight, ArrowRight, BarChart3 } from 'lucide-react';
import { Tournament, PlayerFilter } from '../types';

export const ResultsView: React.FC = () => {
  const { tournaments, setActiveView, setSelectedTournamentSlug } = useGolfData();
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('all');
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [selectedTour, setSelectedTour] = useState<string>('All');

  const filteredTournaments = tournaments.filter((t) => {
    if (t.status !== 'Completed') return false;
    if (t.season !== selectedSeason) return false;
    if (playerFilter === 'jonathan' && !t.player_id.includes('jonathan')) return false;
    if (playerFilter === 'tim' && !t.player_id.includes('tim')) return false;
    if (selectedTour !== 'All' && t.tour !== selectedTour) return false;
    return true;
  }).sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());

  const stats = playerFilter === 'all'
    ? calculateSeasonStats(tournaments, selectedSeason)
    : calculatePlayerSeasonStats(tournaments, playerFilter, selectedSeason);

  const handleTournamentClick = (t: Tournament) => {
    setSelectedTournamentSlug(t.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGolferBadge = (playerId: string) => {
    const isJonathan = playerId.includes('jonathan');
    return {
      name: isJonathan ? 'Jonathan' : 'Tim',
      classes: isJonathan
        ? 'bg-[#244437] text-white border-[#244437]'
        : 'bg-[#26364A] text-white border-[#26364A]'
    };
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-16 text-[#202421]">
      
      {/* Header Banner */}
      <div className="bg-[#ECEAE4] text-[#202421] border-b border-[#D9D6CC] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-2.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>Official Scoring Records</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#202421] tracking-tight uppercase">
                Tournament Results &amp; Stats
              </h1>
              <p className="text-sm sm:text-base text-[#656A65] mt-2 max-w-xl leading-relaxed">
                Comprehensive round logs, finishing positions, and scoring averages for Jonathan and Tim Nielsen.
              </p>
            </div>

            {/* Player Filter Tabs */}
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

          {/* Secondary Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[#D9D6CC]">
            {/* Season Selector */}
            <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg p-1 text-xs">
              <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Season:</span>
              {[2026, 2025, 2024].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedSeason(year)}
                  className={`px-3 py-1 rounded font-bold uppercase transition-colors ${
                    selectedSeason === year
                      ? 'bg-[#244437] text-white'
                      : 'text-[#656A65] hover:text-[#202421]'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Tour Filter */}
            <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg p-1 text-xs">
              <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Tour:</span>
              {['All', 'PGA TOUR Americas', 'APGA Tour', 'Asian Development Tour'].map((tour) => (
                <button
                  key={tour}
                  onClick={() => setSelectedTour(tour)}
                  className={`px-2.5 py-1 rounded font-bold uppercase transition-colors ${
                    selectedTour === tour
                      ? 'bg-[#244437] text-white'
                      : 'text-[#656A65] hover:text-[#202421]'
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
        
        {/* Season Summary Statistics Card */}
        <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-display font-black text-[#202421] uppercase tracking-tight">
                {selectedSeason} {playerFilter === 'all' ? 'Combined' : playerFilter === 'jonathan' ? 'Jonathan Nielsen' : 'Tim Nielsen'} Summary
              </h2>
              <span className="text-xs text-[#656A65]">
                Calculated dynamically from tournament scoring records
              </span>
            </div>
            <span className="text-xs font-bold text-[#244437] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 uppercase font-mono">
              Official Tour Records
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#656A65] block">Starts</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#202421] mt-1 block">{stats.starts}</span>
            </div>
            <div className="bg-white border border-[#244437]/40 ring-1 ring-[#244437]/10 rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#244437] block">Cuts Made</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#244437] mt-1 block">{stats.cuts_made}</span>
            </div>
            <div className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#656A65] block">Top 10s</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#202421] mt-1 block">{stats.top_10s}</span>
            </div>
            <div className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#656A65] block">Top 25s</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#202421] mt-1 block">{stats.top_25s}</span>
            </div>
            <div className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#656A65] block">Best Finish</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#244437] mt-1 block">{stats.best_finish}</span>
            </div>
            <div className="bg-white border border-[#E2DFD7] rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#656A65] block">Scoring Avg</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#202421] mt-1 block">{stats.scoring_average}</span>
            </div>
          </div>
        </div>

        {/* Detailed Tournament Results Table */}
        <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-[#E2DFD7] flex items-center justify-between">
            <h3 className="text-lg font-display font-black text-[#202421] uppercase tracking-tight">
              Tournament Log ({filteredTournaments.length} {filteredTournaments.length === 1 ? 'Event' : 'Events'})
            </h3>
            <span className="text-xs text-[#656A65]">
              Click any tournament to view hole-by-hole scorecards &amp; recaps
            </span>
          </div>

          {filteredTournaments.length === 0 ? (
            <div className="p-12 text-center text-[#656A65]">
              No completed tournaments found for the selected season and filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#ECEAE4] border-b border-[#D9D6CC] text-[#656A65] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 sm:px-6">Golfer</th>
                    <th className="py-3.5 px-4">Dates</th>
                    <th className="py-3.5 px-4">Tournament</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Course / Tour</th>
                    <th className="py-3.5 px-2 text-center w-12">R1</th>
                    <th className="py-3.5 px-2 text-center w-12">R2</th>
                    <th className="py-3.5 px-2 text-center w-12">R3</th>
                    <th className="py-3.5 px-2 text-center w-12">R4</th>
                    <th className="py-3.5 px-3 text-center">Total</th>
                    <th className="py-3.5 px-3 text-center">To Par</th>
                    <th className="py-3.5 px-3 text-center">Finish</th>
                    <th className="py-3.5 px-3 text-right pr-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DFD7] bg-white font-mono">
                  {filteredTournaments.map((t) => {
                    const golfer = getGolferBadge(t.player_id);
                    const rMap: Record<number, number | string> = { 1: '—', 2: '—', 3: '—', 4: '—' };
                    (t.rounds || []).forEach((r) => {
                      if (r.round_status === 'Completed' && r.score) {
                        rMap[r.round_number] = r.score;
                      }
                    });

                    return (
                      <tr
                        key={t.id}
                        onClick={() => handleTournamentClick(t)}
                        className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-4 sm:px-6 font-sans">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${golfer.classes}`}>
                            {golfer.name}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-sans text-xs text-[#656A65] whitespace-nowrap">
                          {formatDateRange(t.start_date, t.end_date)}
                        </td>
                        <td className="py-4 px-4 font-sans">
                          <span className="font-bold text-[#202421] group-hover:text-[#244437] transition-colors block text-sm sm:text-base font-display">
                            {t.name}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell font-sans text-xs text-[#656A65]">
                          <span className="font-semibold text-[#202421] block">{t.course}</span>
                          <span className="text-[#656A65] block">{t.tour} • {t.city}</span>
                        </td>
                        <td className="py-4 px-2 text-center text-[#202421]">{rMap[1]}</td>
                        <td className="py-4 px-2 text-center text-[#202421]">{rMap[2]}</td>
                        <td className="py-4 px-2 text-center text-[#202421]">{rMap[3]}</td>
                        <td className="py-4 px-2 text-center text-[#202421]">{rMap[4]}</td>
                        <td className="py-4 px-3 text-center font-bold text-[#202421]">
                          {t.final_total_strokes || '—'}
                        </td>
                        <td className="py-4 px-3 text-center font-extrabold text-[#244437]">
                          {t.final_score_to_par || '—'}
                        </td>
                        <td className="py-4 px-3 text-center font-sans">
                          <span className="font-display font-bold px-2 py-0.5 rounded bg-[#ECEAE4] text-[#202421] text-xs">
                            {t.final_finish || '—'}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right pr-6 font-sans">
                          <ChevronRight className="w-4 h-4 text-[#A0A5A0] group-hover:text-[#244437] group-hover:translate-x-0.5 transition-all inline-block" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
