import React from 'react';
import { useGolfData } from '../context/GolfDataContext';
import {
  formatCalendarDateRange,
  formatVenue,
  formatLocation,
  isValidUrl
} from '../services/schedule';
import { ExternalLink, Calendar, MapPin, ArrowRight, Radio, Clock, User } from 'lucide-react';
import { Tournament, Player } from '../types';

export const CurrentTournamentCard: React.FC = () => {
  const {
    jonathan,
    tim,
    jonathanCurrentTournament,
    timCurrentTournament,
    jonathanPreparingTournament,
    timPreparingTournament,
    jonathanNextTournament,
    timNextTournament,
    setActiveView,
    setSelectedTournamentSlug
  } = useGolfData();

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
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
              Tour Status
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#202421] uppercase mt-0.5">
              Current &amp; Upcoming Tournaments
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
              currentTournament={jonathanCurrentTournament}
              preparingTournament={jonathanPreparingTournament}
              nextTournament={jonathanNextTournament}
              onCardClick={handleTournamentClick}
              onViewProfile={() => {
                setActiveView('jonathan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewSchedule={() => {
                setActiveView('schedule');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* Tim Tournament Column */}
          {tim && (
            <PlayerTournamentWidget
              player={tim}
              currentTournament={timCurrentTournament}
              preparingTournament={timPreparingTournament}
              nextTournament={timNextTournament}
              onCardClick={handleTournamentClick}
              onViewProfile={() => {
                setActiveView('tim');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewSchedule={() => {
                setActiveView('schedule');
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
  currentTournament: Tournament | null;
  preparingTournament: Tournament | null;
  nextTournament: Tournament | null;
  onCardClick: (t: Tournament) => void;
  onViewProfile: () => void;
  onViewSchedule: () => void;
}

const PlayerTournamentWidget: React.FC<PlayerTournamentWidgetProps> = ({
  player,
  currentTournament,
  preparingTournament,
  nextTournament,
  onCardClick,
  onViewProfile,
  onViewSchedule
}) => {
  // Priority: 1. CURRENT tournament, 2. PREPARING tournament, 3. nearest UPCOMING tournament
  const isLive = Boolean(currentTournament);
  const isPreparing = !currentTournament && Boolean(preparingTournament);
  const tournament = currentTournament || preparingTournament || nextTournament;

  if (!tournament) {
    return (
      <div className="bg-[#F5F3EE] border border-[#E2DFD7] rounded-2xl p-8 flex flex-col justify-between text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img
              src={player.headshot}
              alt={player.display_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#244437] block">
                Athlete
              </span>
              <h3 className="text-lg font-bold text-[#202421]">{player.display_name}</h3>
            </div>
          </div>
          <p className="text-sm text-[#656A65]">
            No tournaments currently listed for {player.display_name}.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-[#D9D6CC]">
          <button
            onClick={onViewProfile}
            className="px-4 py-2 rounded-lg bg-white hover:bg-[#ECEAE4] border border-[#D9D6CC] text-xs font-bold uppercase tracking-wider text-[#202421] transition-colors"
          >
            VIEW PROFILE
          </button>
          <button
            onClick={onViewSchedule}
            className="px-4 py-2 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-xs font-bold uppercase tracking-wider text-white transition-colors"
          >
            VIEW SCHEDULE
          </button>
        </div>
      </div>
    );
  }

  const venueText = formatVenue(tournament.course, tournament.city, tournament.state_country);
  const locationText = formatLocation(tournament.city, tournament.state_country);
  const hasLeaderboard = isValidUrl(tournament.leaderboard_url);

  // Parse round scores from Google Sheets fields or rounds array
  const rawRoundScores = [
    tournament.round_1,
    tournament.round_2,
    tournament.round_3,
    tournament.round_4
  ];
  const roundMap: Record<number, string | number> = {
    1: rawRoundScores[0] ?? '—',
    2: rawRoundScores[1] ?? '—',
    3: rawRoundScores[2] ?? '—',
    4: rawRoundScores[3] ?? '—'
  };

  // If tournament has rounds array and raw scores were blank, populate from rounds
  if (tournament.rounds && tournament.rounds.length > 0) {
    tournament.rounds.forEach((r) => {
      if (r.round_status === 'Completed' && r.score) {
        roundMap[r.round_number] = r.score;
      }
    });
  }

  const currentFinish = tournament.finish || tournament.final_finish;
  const currentScoreToPar = tournament.score_to_par || tournament.final_score_to_par;

  return (
    <div className="bg-[#F5F3EE] border border-[#E2DFD7] rounded-2xl overflow-hidden shadow-sm hover:border-[#244437] transition-all flex flex-col justify-between">
      
      <div className="p-6 sm:p-7 space-y-5">
        
        {/* Player Header Tag & Status */}
        <div className="flex items-center justify-between border-b border-[#D9D6CC] pb-4">
          <div className="flex items-center gap-3">
            <img
              src={player.headshot}
              alt={player.display_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#244437] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>PLAYING THIS WEEK</span>
              </span>
            ) : isPreparing ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEAE4] text-[#244437] text-[11px] font-bold uppercase tracking-wider border border-[#B49A6A]/50 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#244437]" />
                <span>TOURNAMENT WEEK</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#244437] text-[11px] font-bold uppercase tracking-wider border border-[#D9D6CC] shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>UP NEXT</span>
              </span>
            )}
          </div>
        </div>

        {/* Tournament Name & Venue */}
        <div className="space-y-2">
          <div>
            {tournament.tour && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#244437] block">
                {tournament.tour}
              </span>
            )}
            <h4
              onClick={() => onCardClick(tournament)}
              className="text-xl sm:text-2xl font-display font-black text-[#202421] tracking-tight hover:text-[#244437] cursor-pointer transition-colors"
            >
              {tournament.name}
            </h4>
          </div>

          <div className="space-y-1.5 text-xs text-[#656A65]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#B49A6A] shrink-0" />
              <span className="font-semibold text-[#202421]">
                {formatCalendarDateRange(tournament.start_date, tournament.end_date)}
              </span>
            </div>

            {venueText && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#244437] shrink-0" />
                <span>{venueText}</span>
              </div>
            )}

            {tournament.tee_time && (
              <div className="flex items-center gap-2 text-[#202421] font-medium">
                <Clock className="w-3.5 h-3.5 text-[#656A65] shrink-0" />
                <span>Tee Time: {tournament.tee_time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Scores, Preparing State, or Upcoming Info */}
        {isLive ? (
          <div className="bg-white border border-[#E2DFD7] rounded-xl p-4 space-y-4 shadow-sm">
            
            {/* Position & To Par when available */}
            {(currentFinish || currentScoreToPar) && (
              <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-3">
                {currentFinish && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#656A65] block">
                      Current Position
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-black text-[#202421]">
                      {currentFinish}
                    </span>
                  </div>
                )}
                {currentScoreToPar && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#656A65] block">
                      Total Score
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-black text-[#244437] font-mono">
                      {currentScoreToPar}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* R1 - R4 Cards when available */}
            <div>
              <div className="flex items-center justify-between mb-2 text-[10px] font-bold uppercase tracking-wider text-[#656A65]">
                <span>Round Scores</span>
                {tournament.course_par && <span>Par {tournament.course_par}</span>}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[1, 2, 3, 4].map((rNum) => {
                  const val = roundMap[rNum];
                  const hasScore = val !== '—' && val !== '' && val !== undefined;
                  return (
                    <div
                      key={rNum}
                      className={`p-2 rounded-lg border transition-all ${
                        hasScore
                          ? 'bg-[#FAF9F6] border-[#D9D6CC]'
                          : 'bg-[#ECEAE4]/50 border-transparent text-[#8A8F8A]'
                      }`}
                    >
                      <span className="block text-[10px] font-bold uppercase text-[#656A65]">
                        R{rNum}
                      </span>
                      <span
                        className={`block text-base font-mono font-bold ${
                          hasScore ? 'text-[#202421]' : 'text-slate-400'
                        }`}
                      >
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {tournament.notes && (
              <p className="text-xs text-[#656A65] italic bg-[#FAF9F6] border border-[#E2DFD7] rounded-lg p-2.5">
                {tournament.notes}
              </p>
            )}

          </div>
        ) : isPreparing ? (
          <div className="bg-white border border-[#E2DFD7] rounded-xl p-4.5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#D9D6CC] text-xs text-[#244437] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A6A]" />
                <span>Travel &amp; Preparation</span>
              </div>
              <span className="text-[11px] font-semibold text-[#656A65]">Tournament Week Routine</span>
            </div>

            <p className="text-xs text-[#656A65] leading-relaxed">
              Athlete is actively preparing for tournament play: travel, practice rounds, and final preparation. Competition play begins {formatCalendarDateRange(tournament.start_date, tournament.start_date)}.
            </p>

            {tournament.notes && (
              <p className="text-xs text-[#656A65] italic bg-[#FAF9F6] border border-[#E2DFD7] rounded-lg p-2.5">
                {tournament.notes}
              </p>
            )}

            {hasLeaderboard && (
              <div className="pt-1 border-t border-[#ECEAE4]">
                <a
                  href={tournament.leaderboard_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#244437] hover:underline"
                >
                  <span>Official Event Page</span>
                  <ExternalLink className="w-3 h-3 text-[#656A65]" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-[#E2DFD7] rounded-xl p-5 text-center space-y-1.5 shadow-sm">
            <span className="text-[11px] font-bold text-[#656A65] uppercase tracking-wider block">
              Scheduled Event
            </span>
            <p className="text-sm font-bold text-[#202421]">
              Starts {formatCalendarDateRange(tournament.start_date, tournament.start_date)}
            </p>
            {locationText && (
              <p className="text-xs text-[#656A65]">
                {locationText}
              </p>
            )}
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
        {isLive ? (
          <>
            {hasLeaderboard && (
              <a
                href={tournament.leaderboard_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-amber-300" />
                <span>FOLLOW LIVE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => onCardClick(tournament)}
              className="flex-1 px-4 py-3 rounded-lg bg-white hover:bg-[#ECEAE4] text-[#202421] font-bold text-xs uppercase tracking-wider border border-[#D9D6CC] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Tournament Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : isPreparing ? (
          <>
            <button
              onClick={() => onCardClick(tournament)}
              className="flex-1 px-4 py-3 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>TOURNAMENT DETAILS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onViewProfile}
              className="flex-1 px-4 py-3 rounded-lg bg-white hover:bg-[#ECEAE4] text-[#202421] font-bold text-xs uppercase tracking-wider border border-[#D9D6CC] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>VIEW PROFILE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onViewProfile}
              className="flex-1 px-4 py-3 rounded-lg bg-white hover:bg-[#ECEAE4] text-[#202421] font-bold text-xs uppercase tracking-wider border border-[#D9D6CC] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>VIEW PROFILE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onViewSchedule}
              className="flex-1 px-4 py-3 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>VIEW SCHEDULE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

    </div>
  );
};
