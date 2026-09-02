import React from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { ExternalLink, ArrowRight, Calendar, Radio } from 'lucide-react';
import { Player, Tournament } from '../types';

export const PlayerCardsSection: React.FC = () => {
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

  return (
    <section id="players-section" className="py-14 md:py-20 bg-[#F5F3EE] border-b border-[#E2DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">
            Current Status &amp; Performance
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-[#202421] mt-1 uppercase tracking-tight">
            Follow The Players
          </h2>
          <p className="text-sm sm:text-base text-[#656A65] mt-2">
            Real-time tournament status, recent scoring, and upcoming starts for Jonathan and Tim Nielsen.
          </p>
        </div>

        {/* Side-by-Side Player Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Jonathan Nielsen Card */}
          {jonathan && (
            <PlayerCardItem
              player={jonathan}
              currentTournament={jonathanCurrentTournament}
              nextTournament={jonathanNextTournament}
              onViewProfile={() => {
                setSelectedTournamentSlug(null);
                setActiveView('jonathan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              viewButtonLabel="View Jonathan's Profile"
              accentColor="green"
            />
          )}

          {/* Tim Nielsen Card */}
          {tim && (
            <PlayerCardItem
              player={tim}
              currentTournament={timCurrentTournament}
              nextTournament={timNextTournament}
              onViewProfile={() => {
                setSelectedTournamentSlug(null);
                setActiveView('tim');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              viewButtonLabel="View Tim's Profile"
              accentColor="navy"
            />
          )}

        </div>
      </div>
    </section>
  );
};

interface PlayerCardItemProps {
  player: Player;
  currentTournament: Tournament | null;
  nextTournament: Tournament | null;
  onViewProfile: () => void;
  viewButtonLabel: string;
  accentColor: 'green' | 'navy';
}

const PlayerCardItem: React.FC<PlayerCardItemProps> = ({
  player,
  currentTournament,
  nextTournament,
  onViewProfile,
  viewButtonLabel,
  accentColor
}) => {
  const isLive = Boolean(currentTournament);

  return (
    <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl overflow-hidden shadow-sm hover:border-[#244437] transition-all flex flex-col justify-between">
      <div>
        
        {/* Card Header & Photo */}
        <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-[#ECEAE4]">
          <img
            src={player.hero_image || player.headshot}
            alt={player.display_name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Live Status Badge */}
          <div className="absolute top-4 left-4">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#244437] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Playing This Week</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#202421] text-[11px] font-bold uppercase tracking-wider shadow-md">
                <Calendar className="w-3 h-3 text-[#244437]" />
                <span>Next Start Scheduled</span>
              </span>
            )}
          </div>

          {/* Player Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              {player.display_name}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {player.current_tours.map(t => (
                <span key={t} className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-amber-300 border border-amber-300/30 uppercase tracking-wider">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Current & Upcoming Status Details */}
        <div className="p-6 space-y-4">
          
          {/* What is the player doing right now? */}
          {isLive && currentTournament ? (
            <div className="bg-[#ECEAE4] border border-[#D9D6CC] rounded-xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#244437] bg-white px-2 py-0.5 rounded border border-[#D9D6CC]">
                    Current Tournament
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-[#202421] leading-tight mt-1.5">
                    {currentTournament.name}
                  </h4>
                  <p className="text-xs text-[#656A65] font-medium">{currentTournament.course}</p>
                </div>
                <div className="text-right pl-3">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 font-mono leading-none shadow-2xs">
                    {currentTournament.final_score_to_par || 'E'}
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 block mt-1.5">
                    Pos: {currentTournament.final_finish || 'In Play'}
                  </span>
                </div>
              </div>

              {/* Round Score Pills */}
              {currentTournament.rounds && currentTournament.rounds.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#D9D6CC] text-center">
                  {[1, 2, 3, 4].map((rNum) => {
                    const r = currentTournament.rounds?.find(x => x.round_number === rNum);
                    const isSub70 = r && r.score < 70;
                    return (
                      <div key={rNum} className={`rounded py-1 px-1.5 border shadow-2xs ${
                        r
                          ? isSub70
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-white border-slate-300 text-slate-900'
                          : 'bg-white/50 border-[#E2DFD7] text-slate-400'
                      }`}>
                        <span className="text-[9px] uppercase font-bold text-[#656A65] block">R{rNum}</span>
                        <span className="text-xs font-black font-mono">
                          {r ? r.score : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#ECEAE4]/60 border border-[#E2DFD7] rounded-lg p-4 text-xs text-[#656A65]">
              <span className="font-bold text-[#202421] uppercase tracking-wider block mb-1">Current Status:</span>
              <span>Tournament preparation and practice week. No active tournament today.</span>
            </div>
          )}

          {/* Where are they playing next? */}
          {nextTournament && (
            <div className="bg-white border border-[#E2DFD7] rounded-xl p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B49A6A] block">
                Next Tournament
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#202421]">{nextTournament.name}</h4>
                  <p className="text-xs text-[#656A65]">{nextTournament.city}, {nextTournament.state}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#244437] bg-emerald-50 px-2 py-1 rounded border border-emerald-200 block">
                    {new Date(nextTournament.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onViewProfile}
          className={`flex-1 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01] ${
            accentColor === 'green'
              ? 'bg-[#244437] hover:bg-[#1b342a] text-white border-transparent'
              : 'bg-[#1E3A8A] hover:bg-[#172554] text-white border-transparent'
          }`}
        >
          <span>{viewButtonLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {isLive && currentTournament && (
          <a
            href={currentTournament.leaderboard_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-lg bg-white hover:bg-emerald-50 text-[#244437] font-bold text-xs uppercase tracking-wider border border-[#244437]/30 shadow-2xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Radio className="w-3.5 h-3.5 text-[#B49A6A]" />
            <span>Follow Live</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        )}
      </div>

    </div>
  );
};
