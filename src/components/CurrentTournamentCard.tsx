import React from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatDateRange } from '../utils/statsCalculator';
import { ExternalLink, Calendar, MapPin, ArrowRight, Radio, User } from 'lucide-react';
import { Tournament, Player } from '../types';

export const CurrentTournamentCard: React.FC = () => {
  const {
    jonathan,
    tim,
    jonathanCurrentTournament,
    timCurrentTournament,
    jonathanNextTournament,
    timNextTournament,
    setActiveView,
    setSelectedTournamentSlug
  } = useGolfData();

  const isJonathanActive = Boolean(jonathanCurrentTournament);
  const isTimActive = Boolean(timCurrentTournament);
  const isAnyActive = isJonathanActive || isTimActive;

  const handleTournamentClick = (tourn: Tournament) => {
    setSelectedTournamentSlug(tourn.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="this-week-section" className="py-14 md:py-20 bg-[#FAF9F6] text-[#202421] relative border-b border-[#E2DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10">
          <div className="flex items-center gap-3">
            {isAnyActive ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#244437] text-white text-xs font-bold tracking-widest uppercase shadow-sm">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#B49A6A]" />
                THIS WEEK
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ECEAE4] text-[#244437] text-xs font-bold tracking-widest uppercase border border-[#D9D6CC]">
                <Calendar className="w-3.5 h-3.5" />
                UP NEXT
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#202421] uppercase">
              {isAnyActive ? 'Active Tournament Tracker' : 'Next Scheduled Tournaments'}
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveView('schedule');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#656A65] hover:text-[#244437] flex items-center gap-1.5 uppercase tracking-wider transition-colors"
          >
            <span>View Full 2026 Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dual Tournaments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Jonathan Tournament Column */}
          {jonathan && (
            <PlayerTournamentWidget
              player={jonathan}
              tournament={jonathanCurrentTournament || jonathanNextTournament}
              isLive={isJonathanActive}
              onCardClick={handleTournamentClick}
              onViewPlayer={() => {
                setActiveView('jonathan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* Tim Tournament Column */}
          {tim && (
            <PlayerTournamentWidget
              player={tim}
              tournament={timCurrentTournament || timNextTournament}
              isLive={isTimActive}
              onCardClick={handleTournamentClick}
              onViewPlayer={() => {
                setActiveView('tim');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

        </div>

      </div>
    </section>
  );
};

interface PlayerTournamentWidgetProps {
  player: Player;
  tournament: Tournament | null;
  isLive: boolean;
  onCardClick: (t: Tournament) => void;
  onViewPlayer: () => void;
}

const PlayerTournamentWidget: React.FC<PlayerTournamentWidgetProps> = ({
  player,
  tournament,
  isLive,
  onCardClick,
  onViewPlayer
}) => {
  if (!tournament) {
    return (
      <div className="bg-[#F5F3EE] border border-[#E2DFD7] rounded-xl p-8 text-center text-[#656A65]">
        <p className="text-sm font-semibold">No active or upcoming events scheduled for {player.display_name}.</p>
      </div>
    );
  }

  // Calculate round scores for R1, R2, R3, R4
  const roundMap: Record<number, number | string> = { 1: '—', 2: '—', 3: '—', 4: '—' };
  if (tournament.rounds && tournament.rounds.length > 0) {
    tournament.rounds.forEach((r) => {
      if (r.round_status === 'Completed' && r.score) {
        roundMap[r.round_number] = r.score;
      }
    });
  }

  return (
    <div className="bg-[#F5F3EE] border border-[#E2DFD7] rounded-xl overflow-hidden shadow-sm hover:border-[#244437] transition-all flex flex-col justify-between">
      
      <div className="p-6 sm:p-7 space-y-5">
        
        {/* Player Header Tag */}
        <div className="flex items-center justify-between border-b border-[#D9D6CC] pb-4">
          <div className="flex items-center gap-3">
            <img
              src={player.headshot}
              alt={player.display_name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#244437] block">
                {player.first_name} Nielsen
              </span>
              <h3 className="text-lg font-bold text-[#202421] leading-tight">
                {player.display_name}
              </h3>
            </div>
          </div>

          <div>
            {isLive ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#244437] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>IN PLAY</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#656A65] text-[10px] font-bold uppercase tracking-wider border border-[#D9D6CC]">
                <Calendar className="w-3 h-3 text-[#244437]" />
                <span>UPCOMING</span>
              </span>
            )}
          </div>
        </div>

        {/* Tournament Name & Venue */}
        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#244437] block">
              {tournament.tour}
            </span>
            <h4
              onClick={() => onCardClick(tournament)}
              className="text-xl sm:text-2xl font-display font-black text-[#202421] tracking-tight hover:text-[#244437] cursor-pointer transition-colors"
            >
              {tournament.name}
            </h4>
          </div>

          <div className="space-y-1 text-xs text-[#656A65]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#244437] shrink-0" />
              <span>{tournament.course} • {tournament.city}, {tournament.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#656A65] shrink-0" />
              <span>{formatDateRange(tournament.start_date, tournament.end_date)}</span>
            </div>
          </div>
        </div>

        {/* Live Scores or Upcoming Info */}
        {isLive ? (
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 space-y-4 shadow-sm">
            
            {/* Position & To Par */}
            <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#656A65] block">
                  Current Position
                </span>
                <span className="font-display text-2xl sm:text-3xl font-black text-[#202421]">
                  {tournament.final_finish || 'T12'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#656A65] block">
                  Total Score
                </span>
                <span className="font-display text-2xl sm:text-3xl font-black text-[#244437] font-mono">
                  {tournament.final_score_to_par || 'E'}
                </span>
              </div>
            </div>

            {/* R1 - R4 Cards */}
            <div>
              <div className="flex items-center justify-between mb-2 text-[10px] font-bold uppercase tracking-wider text-[#656A65]">
                <span>Round Scores</span>
                <span>Par {tournament.course_par || 72}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[1, 2, 3, 4].map((rNum) => {
                  const val = roundMap[rNum];
                  const hasScore = val !== '—';
                  return (
                    <div
                      key={rNum}
                      className={`p-2 rounded border transition-all ${
                        hasScore
                          ? 'bg-[#FAF9F6] border-[#D9D6CC]'
                          : 'bg-[#ECEAE4]/50 border-transparent text-[#656A65]'
                      }`}
                    >
                      <span className="block text-[10px] font-bold uppercase text-[#656A65]">R{rNum}</span>
                      <span className={`block text-base font-mono font-bold ${hasScore ? 'text-[#202421]' : 'text-slate-400'}`}>
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-5 text-center space-y-1.5 shadow-sm">
            <span className="text-[11px] font-bold text-[#656A65] uppercase tracking-wider block">
              Tournament Confirmed
            </span>
            <p className="text-sm font-bold text-[#202421]">
              Starts {new Date(tournament.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
        {isLive ? (
          <a
            href={tournament.leaderboard_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>Follow {player.first_name} Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            onClick={() => onCardClick(tournament)}
            className="flex-1 px-4 py-3 rounded-md bg-[#ECEAE4] hover:bg-[#dedad0] text-[#202421] font-bold text-xs uppercase tracking-wider border border-[#D9D6CC] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Tournament Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => onCardClick(tournament)}
          className="px-4 py-3 rounded-md bg-white hover:bg-[#ECEAE4] text-[#656A65] hover:text-[#202421] font-semibold text-xs uppercase tracking-wider border border-[#D9D6CC] transition-colors"
        >
          View Breakdown
        </button>
      </div>

    </div>
  );
};
