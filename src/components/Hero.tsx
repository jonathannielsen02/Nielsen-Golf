import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { ArrowRight, ExternalLink, Radio, Calendar, MapPin, Trophy, Heart, ChevronRight } from 'lucide-react';
import { Tournament, Player } from '../types';

export const Hero: React.FC = () => {
  const {
    jonathan,
    tim,
    jonathanCurrentTournament,
    timCurrentTournament,
    jonathanNextTournament,
    timNextTournament,
    tournaments,
    setActiveView,
    setSelectedTournamentSlug
  } = useGolfData();

  // Determine active or upcoming event to display in the leaderboard widget
  const activeEvent = jonathanCurrentTournament || timCurrentTournament;
  const upcomingEvent = jonathanNextTournament || timNextTournament || tournaments.find(t => t.status === 'Upcoming') || tournaments[0];
  const primaryEvent: Tournament = activeEvent || upcomingEvent;

  const [selectedEventId, setSelectedEventId] = useState<string>(primaryEvent ? primaryEvent.id : '');

  // Active tournament in widget
  const currentEvent = tournaments.find(t => t.id === selectedEventId) || primaryEvent;
  const isLive = currentEvent?.status === 'Current';

  const handleOpenTournament = (tourn: Tournament) => {
    setSelectedTournamentSlug(tourn.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find round scores for display
  const getRoundScores = (tourn?: Tournament) => {
    if (!tourn || !tourn.rounds) return [null, null, null, null];
    return [1, 2, 3, 4].map(rNum => {
      const r = tourn.rounds?.find(x => x.round_number === rNum && x.round_status === 'Completed');
      return r ? r.score : null;
    });
  };

  return (
    <section className="relative bg-[#FAF9F6] text-[#202421] border-b border-[#E2DFD7] pt-12 pb-16 md:pt-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ================= LEFT SIDE: NIELSEN GOLF & CAPTION ================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Official Circuit Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#ECEAE4] border border-[#D9D6CC] text-[#244437] text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#244437] animate-pulse"></span>
              <span>Official Career Hub • PGA TOUR Americas, APGA &amp; ADT</span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight text-[#202421] leading-none uppercase">
                NIELSEN GOLF
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium text-[#244437]">
                Jonathan Nielsen &amp; Tim Nielsen
              </p>
            </div>

            {/* Caption */}
            <p className="text-base sm:text-lg text-[#656A65] max-w-xl leading-relaxed">
              Two brothers pursuing professional golf at the highest level. Follow live tournament leaderboards, current status, and schedules across PGA TOUR Americas, APGA Tour, and the Asian Development Tour (ADT).
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('jonathan')}
                className="px-5 py-3 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Jonathan Nielsen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveView('tim')}
                className="px-5 py-3 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Tim Nielsen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveView('partner-with-us')}
                className="px-5 py-3 rounded-lg bg-[#ECEAE4] hover:bg-[#dedad0] text-[#202421] font-bold text-xs uppercase tracking-wider border border-[#D9D6CC] transition-colors flex items-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>Partner With Us</span>
              </button>
            </div>

            {/* Quick Status Sub-bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#656A65] border-t border-[#E2DFD7]/80">
              <div className="flex items-center gap-1.5 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-[#244437]"></span>
                <span className="font-bold text-[#244437]">Jonathan:</span>
                <span className="text-emerald-950 font-medium">PGA TOUR Americas &amp; APGA Tour</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200/60">
                <span className="w-2 h-2 rounded-full bg-[#1E3A8A]"></span>
                <span className="font-bold text-[#1E3A8A]">Tim:</span>
                <span className="text-blue-950 font-medium">Asian Development Tour (ADT)</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE: LIVE SCORING LEADERBOARD WIDGET ================= */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF9F6] border-2 border-[#D9D6CC] rounded-2xl overflow-hidden shadow-md hover:border-[#244437] transition-all">
              
              {/* Leaderboard Top Header Banner */}
              <div className="bg-[#ECEAE4] border-b border-[#D9D6CC] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#244437] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>LIVE LEADERBOARD</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#244437] text-[10px] font-bold uppercase tracking-wider border border-[#D9D6CC]">
                        <Calendar className="w-3 h-3 text-[#244437]" />
                        <span>EVENT LEADERBOARD</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B49A6A] px-2 py-0.5 rounded bg-amber-50 border border-amber-200/60">
                      {currentEvent?.tour || 'PGA TOUR Americas'}
                    </span>
                  </div>

                  {/* Tournament quick-switch tabs if multiple exist */}
                  {tournaments.filter(t => t.status === 'Current' || t.status === 'Upcoming').length > 1 && (
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#D9D6CC] shadow-2xs">
                      {tournaments
                        .filter(t => t.status === 'Current' || t.status === 'Upcoming')
                        .slice(0, 2)
                        .map((t) => {
                          const isJonathan = t.player_id.includes('jonathan');
                          const isSelected = currentEvent?.id === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setSelectedEventId(t.id)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 ${
                                isSelected
                                  ? (isJonathan ? 'bg-[#244437] text-white shadow-xs' : 'bg-[#1E3A8A] text-white shadow-xs')
                                  : (isJonathan ? 'text-[#244437] hover:bg-emerald-50' : 'text-[#1E3A8A] hover:bg-blue-50')
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : (isJonathan ? 'bg-[#244437]' : 'bg-[#1E3A8A]')}`}></span>
                              <span>{isJonathan ? 'Jonathan' : 'Tim'}</span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Event Name & Course */}
                <div className="mt-3">
                  <h3
                    onClick={() => currentEvent && handleOpenTournament(currentEvent)}
                    className="text-xl sm:text-2xl font-display font-black text-[#202421] tracking-tight hover:text-[#244437] cursor-pointer transition-colors"
                  >
                    {currentEvent?.name || 'ATB Classic'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#656A65]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#244437] shrink-0" />
                      <span>{currentEvent?.course || 'Northern Bear Golf Club'}</span>
                    </span>
                    <span>•</span>
                    <span>{currentEvent?.city}, {currentEvent?.state}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#202421]">Par {currentEvent?.course_par || 72}</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard Scoring Table */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Athlete Score Rows */}
                <div className="space-y-3">
                  
                  {/* Jonathan Nielsen Row */}
                  {jonathan && (
                    <LeaderboardPlayerRow
                      player={jonathan}
                      tournament={
                        currentEvent?.player_id.includes('jonathan')
                          ? currentEvent
                          : (jonathanCurrentTournament || jonathanNextTournament)
                      }
                      isEventPlayer={Boolean(currentEvent?.player_id.includes('jonathan'))}
                      roundScores={getRoundScores(
                        currentEvent?.player_id.includes('jonathan')
                          ? currentEvent
                          : (jonathanCurrentTournament || jonathanNextTournament) || undefined
                      )}
                      onRowClick={() => {
                        const target = currentEvent?.player_id.includes('jonathan')
                          ? currentEvent
                          : (jonathanCurrentTournament || jonathanNextTournament);
                        if (target) handleOpenTournament(target);
                      }}
                    />
                  )}

                  {/* Tim Nielsen Row */}
                  {tim && (
                    <LeaderboardPlayerRow
                      player={tim}
                      tournament={
                        currentEvent?.player_id.includes('tim')
                          ? currentEvent
                          : (timCurrentTournament || timNextTournament)
                      }
                      isEventPlayer={Boolean(currentEvent?.player_id.includes('tim'))}
                      roundScores={getRoundScores(
                        currentEvent?.player_id.includes('tim')
                          ? currentEvent
                          : (timCurrentTournament || timNextTournament) || undefined
                      )}
                      onRowClick={() => {
                        const target = currentEvent?.player_id.includes('tim')
                          ? currentEvent
                          : (timCurrentTournament || timNextTournament);
                        if (target) handleOpenTournament(target);
                      }}
                    />
                  )}

                </div>

                {/* Leaderboard Action Controls */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  {currentEvent?.leaderboard_url && (
                    <a
                      href={currentEvent.leaderboard_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Radio className="w-3.5 h-3.5 text-[#B49A6A]" />
                      <span>Official Live Leaderboard</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}

                  <button
                    onClick={() => currentEvent && handleOpenTournament(currentEvent)}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-white hover:bg-emerald-50 text-[#244437] font-bold text-xs uppercase tracking-wider border border-[#244437]/30 shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Full Scorecard</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#244437]" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

interface LeaderboardPlayerRowProps {
  player: Player;
  tournament: Tournament | null;
  isEventPlayer: boolean;
  roundScores: (number | null)[];
  onRowClick: () => void;
}

const LeaderboardPlayerRow: React.FC<LeaderboardPlayerRowProps> = ({
  player,
  tournament,
  isEventPlayer,
  roundScores,
  onRowClick
}) => {
  const isLive = tournament?.status === 'Current';
  const scoreToPar = tournament?.final_score_to_par || 'E';
  const position = tournament?.final_finish || (isLive ? (player.id.includes('jonathan') ? 'T8' : 'T14') : 'Scheduled');
  const isJonathan = player.id.includes('jonathan');

  const isUnderPar = scoreToPar.startsWith('-');
  const isOverPar = scoreToPar.startsWith('+');

  return (
    <div
      onClick={onRowClick}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
        isEventPlayer
          ? 'bg-white border-[#D9D6CC] shadow-sm hover:border-[#244437] ring-1 ring-[#244437]/10'
          : 'bg-[#FAF9F6] border-[#E2DFD7] hover:border-[#D9D6CC]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        
        {/* Golfer Avatar & Name */}
        <div className="flex items-center gap-3">
          <img
            src={player.headshot}
            alt={player.display_name}
            className={`w-10 h-10 rounded-full object-cover border-2 shadow-xs ${
              isJonathan ? 'border-emerald-600' : 'border-blue-600'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#202421]">
                {player.display_name}
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                isJonathan ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
              }`}>
                {isJonathan ? 'Americas' : 'ADT'}
              </span>
              {isLive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="In Play"></span>
              )}
            </div>
            <span className="text-[11px] text-[#656A65] block font-medium">
              {isLive ? (tournament?.name || 'Active Tournament') : (tournament ? `Next: ${tournament.name}` : 'Tour Schedule')}
            </span>
          </div>
        </div>

        {/* Position & Score To Par */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
              position.includes('1st') || position.includes('2nd') || position.includes('3rd')
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : position.startsWith('T') && parseInt(position.slice(1)) <= 15
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-[#ECEAE4] text-[#202421] border-[#D9D6CC]'
            }`}>
              Pos: {position}
            </span>
            <span className={`font-mono text-lg sm:text-xl font-extrabold px-2 py-0.5 rounded ${
              isUnderPar
                ? 'text-emerald-800 bg-emerald-100 border border-emerald-300 shadow-2xs'
                : isOverPar
                ? 'text-amber-800 bg-amber-100 border border-amber-300'
                : 'text-slate-800 bg-slate-100 border border-slate-300'
            }`}>
              {scoreToPar}
            </span>
          </div>
        </div>

      </div>

      {/* Round Breakdown Pills */}
      {tournament && (
        <div className="mt-2.5 pt-2.5 border-t border-[#ECEAE4] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-[#656A65] mr-1">Rounds:</span>
            {[1, 2, 3, 4].map((rNum) => {
              const score = roundScores[rNum - 1];
              const isSub70 = score !== null && score < 70;
              return (
                <span
                  key={rNum}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-extrabold border ${
                    score
                      ? isSub70
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                        : 'bg-slate-50 text-slate-800 border-slate-300'
                      : 'text-[#A0A5A0] bg-transparent border-transparent'
                  }`}
                >
                  R{rNum}: {score || '—'}
                </span>
              );
            })}
          </div>

          <span className="text-[10px] font-extrabold text-[#244437] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
            {isLive ? 'Thru Rd 2' : 'Upcoming'}
          </span>
        </div>
      )}
    </div>
  );
};
