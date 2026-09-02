import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatDateRange, formatCurrency } from '../utils/statsCalculator';
import { Tournament, PlayerFilter } from '../types';
import { Calendar, MapPin, ExternalLink, Trophy, Filter, ArrowRight, Radio, User } from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { tournaments, setActiveView, setSelectedTournamentSlug } = useGolfData();
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('all');
  const [filterTour, setFilterTour] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredTournaments = tournaments.filter((t) => {
    if (playerFilter === 'jonathan' && !t.player_id.includes('jonathan')) return false;
    if (playerFilter === 'tim' && !t.player_id.includes('tim')) return false;
    if (filterTour !== 'All' && t.tour !== filterTour) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    return true;
  });

  const currentList = filteredTournaments.filter((t) => t.status === 'Current');
  const upcomingList = filteredTournaments
    .filter((t) => t.status === 'Upcoming')
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  const completedList = filteredTournaments
    .filter((t) => t.status === 'Completed')
    .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());

  const handleTournamentClick = (t: Tournament) => {
    setSelectedTournamentSlug(t.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-extrabold';
      case 'Planned':
        return 'bg-blue-100 text-blue-950 border border-blue-300 font-extrabold';
      case 'Qualifier':
        return 'bg-amber-100 text-amber-950 border border-amber-300 font-extrabold';
      default:
        return 'bg-[#ECEAE4] text-[#202421] border border-[#D9D6CC] font-bold';
    }
  };

  const getGolferBadge = (playerId: string) => {
    const isJonathan = playerId.includes('jonathan');
    return {
      name: isJonathan ? 'Jonathan Nielsen' : 'Tim Nielsen',
      tour: isJonathan ? 'PGA TOUR Americas' : 'Asian Dev Tour (ADT)',
      classes: isJonathan
        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-extrabold'
        : 'bg-blue-100 text-blue-950 border border-blue-300 font-extrabold'
    };
  };

  const uniqueTours = ['All', ...Array.from(new Set(tournaments.map(t => t.tour)))];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-16 text-[#202421]">
      
      {/* Header Banner */}
      <div className="bg-[#ECEAE4] text-[#202421] border-b border-[#D9D6CC] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-2.5">
                <Calendar className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>2026 Tour Calendars</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#202421] tracking-tight uppercase">
                Tournament Schedule
              </h1>
              <p className="text-sm sm:text-base text-[#656A65] mt-2 max-w-xl leading-relaxed">
                Confirmed events, qualifiers, and championship dates for Jonathan Nielsen (PGA TOUR Americas &amp; APGA Tour) and Tim Nielsen (Asian Development Tour - ADT).
              </p>
            </div>

            {/* Player Filter Tabs */}
            <div className="flex items-center bg-[#FAF9F6] p-1.5 rounded-xl border border-[#D9D6CC] self-start md:self-auto shadow-xs gap-1">
              {(['all', 'jonathan', 'tim'] as PlayerFilter[]).map((key) => {
                const label = key === 'all' ? 'All Golfers' : key === 'jonathan' ? 'Jonathan' : 'Tim';
                const isActive = playerFilter === key;
                const isJonathan = key === 'jonathan';
                const isTim = key === 'tim';
                return (
                  <button
                    key={key}
                    onClick={() => setPlayerFilter(key)}
                    className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
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
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : (isJonathan ? 'bg-emerald-500' : 'bg-blue-500')}`}></span>
                    )}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[#D9D6CC]">
            {/* Tour Filter */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF9F6] border border-[#D9D6CC] rounded-xl p-1 text-xs">
              <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Tour:</span>
              {uniqueTours.map((tour) => (
                <button
                  key={tour}
                  onClick={() => setFilterTour(tour)}
                  className={`px-3 py-1 rounded-lg font-extrabold uppercase tracking-wider text-xs transition-colors ${
                    filterTour === tour
                      ? 'bg-[#244437] text-white shadow-2xs'
                      : 'text-[#656A65] hover:text-[#202421] hover:bg-[#ECEAE4]'
                  }`}
                >
                  {tour}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-[#D9D6CC] rounded-xl p-1 text-xs">
              <span className="text-[#656A65] px-2 font-bold uppercase text-[10px]">Status:</span>
              {['All', 'Current', 'Upcoming', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg font-extrabold uppercase tracking-wider text-xs transition-colors ${
                    filterStatus === status
                      ? 'bg-[#244437] text-white shadow-2xs'
                      : 'text-[#656A65] hover:text-[#202421] hover:bg-[#ECEAE4]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        
        {/* Active / Current Section */}
        {currentList.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3.5 py-1.5 rounded-full bg-[#244437] text-white text-xs font-extrabold tracking-widest uppercase flex items-center gap-2 shadow-sm">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                ACTIVE THIS WEEK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentList.map((t) => {
                const golfer = getGolferBadge(t.player_id);
                return (
                  <div
                    key={t.id}
                    className="bg-[#FAF9F6] text-[#202421] border-2 border-[#244437]/50 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded ${golfer.classes}`}>
                          {golfer.name}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          {t.tour}
                        </span>
                      </div>
                      
                      <h3
                        onClick={() => handleTournamentClick(t)}
                        className="text-2xl font-display font-black text-[#202421] hover:text-[#244437] cursor-pointer transition-colors"
                      >
                        {t.name}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#656A65] pt-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#244437]" />
                          {t.course} • {t.city}, {t.state}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-[#202421]">
                          <Calendar className="w-3.5 h-3.5 text-[#B49A6A]" />
                          {formatDateRange(t.start_date, t.end_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-[#D9D6CC]">
                      {t.leaderboard_url && (
                        <a
                          href={t.leaderboard_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
                        >
                          <Radio className="w-3.5 h-3.5 text-amber-300" />
                          <span>LIVE LEADERBOARD</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleTournamentClick(t)}
                        className="px-4 py-2.5 rounded-lg bg-white hover:bg-emerald-50 text-[#244437] text-xs font-bold uppercase tracking-wider border border-[#244437]/30 transition-colors"
                      >
                        Tournament Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Tournaments Section */}
        {upcomingList.length > 0 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
                Scheduled Events
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                Upcoming Tournaments ({upcomingList.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingList.map((t) => {
                const golfer = getGolferBadge(t.player_id);
                return (
                  <div
                    key={t.id}
                    onClick={() => handleTournamentClick(t)}
                    className="bg-[#FAF9F6] border border-[#D9D6CC] hover:border-[#244437] rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${golfer.classes}`}>
                          {golfer.name}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(
                            t.tournament_type
                          )}`}
                        >
                          {t.tournament_type}
                        </span>
                      </div>

                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#244437] block mb-1">
                        {t.tour}
                      </span>

                      <h3 className="text-lg font-display font-bold text-[#202421] group-hover:text-[#244437] transition-colors leading-snug">
                        {t.name}
                      </h3>

                      <div className="space-y-2 text-xs text-[#656A65] mt-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="font-extrabold text-[#202421]">
                            {formatDateRange(t.start_date, t.end_date)}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#244437] shrink-0 mt-0.5" />
                          <span>
                            {t.course} • {t.city}, {t.state}
                          </span>
                        </div>

                        {t.purse && (
                          <div className="flex items-start gap-2 text-[#202421] font-bold">
                            <Trophy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>Purse: <span className="text-emerald-800 font-mono font-extrabold">{formatCurrency(t.purse)}</span></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-[#E2DFD7] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#656A65]">{t.country}</span>
                      <span className="font-bold text-[#244437] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Event Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Tournaments Section */}
        {completedList.length > 0 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
                Archived History
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                Completed Tournaments ({completedList.length})
              </h2>
            </div>

            <div className="bg-white border border-[#D9D6CC] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#ECEAE4] border-b border-[#D9D6CC] text-[#202421] font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 sm:px-6">Golfer</th>
                      <th className="py-3.5 px-4">Tournament</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Tour &amp; Venue</th>
                      <th className="py-3.5 px-4 text-center">Rounds</th>
                      <th className="py-3.5 px-4 text-center">To Par</th>
                      <th className="py-3.5 px-4 text-center">Finish</th>
                      <th className="py-3.5 px-4 text-right pr-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEAE4] bg-white">
                    {completedList.map((t) => {
                      const golfer = getGolferBadge(t.player_id);
                      const roundScores = (t.rounds || [])
                        .filter((r) => r.round_status === 'Completed')
                        .map((r) => r.score)
                        .join('-');

                      const finish = t.final_finish || '—';
                      const isTop3 = finish.includes('1st') || finish.includes('2nd') || finish.includes('3rd') || finish === '1' || finish === '2' || finish === '3';
                      const isTop10 = isTop3 || ['T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].some(n => finish.includes(n));

                      return (
                        <tr
                          key={t.id}
                          onClick={() => handleTournamentClick(t)}
                          className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                        >
                          <td className="py-4 px-4 sm:px-6">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${golfer.classes}`}>
                              {golfer.name}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#202421] group-hover:text-[#244437] transition-colors block text-sm sm:text-base font-display">
                              {t.name}
                            </span>
                            <span className="text-xs text-[#656A65] block mt-0.5">
                              {formatDateRange(t.start_date, t.end_date)}
                            </span>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            <span className="font-bold text-[#244437] text-xs block">
                              {t.tour}
                            </span>
                            <span className="text-xs text-[#656A65] block truncate max-w-xs">
                              {t.course} • {t.city}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-[#202421] font-semibold">
                            <span className="bg-[#ECEAE4] px-2 py-1 rounded border border-[#D9D6CC]">
                              {roundScores || '—'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-mono font-black">
                            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 shadow-2xs font-extrabold">
                              {t.final_score_to_par || 'E'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`font-mono font-extrabold px-2.5 py-1 rounded text-xs border shadow-2xs ${
                              isTop3
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : isTop10
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-slate-100 text-slate-900 border-slate-300'
                            }`}>
                              {finish}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right pr-6">
                            <ArrowRight className="w-4 h-4 text-[#8A8F8A] group-hover:text-[#244437] group-hover:translate-x-0.5 transition-all inline-block" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
