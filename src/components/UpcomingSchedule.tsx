import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import {
  formatCalendarDateRange,
  formatVenue,
  formatLocation,
  isValidUrl
} from '../services/schedule';
import { Calendar, MapPin, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { Tournament, PlayerFilter } from '../types';

export const UpcomingSchedule: React.FC = () => {
  const { tournaments, setActiveView, setSelectedTournamentSlug } = useGolfData();
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('all');

  const upcomingTournaments = tournaments
    .filter((t) => {
      if (t.status !== 'Upcoming') return false;
      if (playerFilter === 'jonathan') return t.player_id.includes('jonathan');
      if (playerFilter === 'tim') return t.player_id.includes('tim');
      return true;
    })
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  const handleTournamentClick = (t: Tournament) => {
    setSelectedTournamentSlug(t.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold';
      case 'Planned':
        return 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold';
      case 'Qualifier':
        return 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold';
      default:
        return 'bg-[#ECEAE4] text-[#202421] border-[#D9D6CC] font-bold';
    }
  };

  const getGolferBadge = (playerId: string) => {
    const isJonathan = playerId.includes('jonathan');
    return {
      name: isJonathan ? 'Jonathan Nielsen' : 'Tim Nielsen',
      classes: isJonathan
        ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold'
        : 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold'
    };
  };

  return (
    <section className="py-12 md:py-16 bg-[#F5F3EE] border-b border-[#D9D6CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-2.5">
              <Calendar className="w-3.5 h-3.5 text-[#B49A6A]" />
              <span>Tour Calendars</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
              Upcoming Tournaments
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF9F6] p-1.5 rounded-xl border border-[#D9D6CC] shadow-2xs">
            {(['all', 'jonathan', 'tim'] as PlayerFilter[]).map((filterKey) => {
              const label = filterKey === 'all' ? 'All Events' : filterKey === 'jonathan' ? 'Jonathan' : 'Tim';
              const isActive = playerFilter === filterKey;
              return (
                <button
                  key={filterKey}
                  onClick={() => setPlayerFilter(filterKey)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? (filterKey === 'jonathan' ? 'bg-[#244437] text-white shadow-xs' : filterKey === 'tim' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'bg-[#202421] text-white shadow-xs')
                      : (filterKey === 'jonathan' ? 'text-[#244437] hover:bg-emerald-50' : filterKey === 'tim' ? 'text-[#1E3A8A] hover:bg-blue-50' : 'text-[#656A65] hover:text-[#202421] hover:bg-[#ECEAE4]')
                  }`}
                >
                  {filterKey === 'jonathan' && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`} />}
                  {filterKey === 'tim' && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-blue-500'}`} />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {upcomingTournaments.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-[#656A65] border border-[#D9D6CC]">
            No upcoming tournaments found matching current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTournaments.map((t) => {
              const golferInfo = getGolferBadge(t.player_id);
              const venueText = formatVenue(t.course, t.city, t.state_country);
              const locationText = formatLocation(t.city, t.state_country);
              const hasLeaderboard = isValidUrl(t.leaderboard_url);

              return (
                <div
                  key={t.id}
                  onClick={() => handleTournamentClick(t)}
                  className="bg-[#FAF9F6] border border-[#D9D6CC] hover:border-[#244437] rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Golfer & Tour Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${golferInfo.classes}`}>
                        {golferInfo.name}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(
                          t.tournament_type
                        )}`}
                      >
                        {t.tournament_type}
                      </span>
                    </div>

                    {t.tour && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#244437] block mb-1">
                        {t.tour}
                      </span>
                    )}

                    <h3 className="text-lg font-display font-black text-[#202421] group-hover:text-[#244437] transition-colors leading-snug">
                      {t.name}
                    </h3>

                    <div className="space-y-2 text-xs text-[#656A65] mt-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[#B49A6A] shrink-0 mt-0.5" />
                        <span className="font-semibold text-[#202421]">
                          {formatCalendarDateRange(t.start_date, t.end_date)}
                        </span>
                      </div>

                      {venueText && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#244437] shrink-0 mt-0.5" />
                          <span>{venueText}</span>
                        </div>
                      )}

                      {t.tee_time && (
                        <div className="flex items-start gap-2 text-[#202421] font-medium">
                          <Clock className="w-4 h-4 text-[#656A65] shrink-0 mt-0.5" />
                          <span>Tee Time: {t.tee_time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#E2DFD7] flex items-center justify-between text-xs">
                    {hasLeaderboard ? (
                      <a
                        href={t.leaderboard_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-[#244437] hover:underline flex items-center gap-1"
                      >
                        Leaderboard <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="font-medium text-[#8A8F8A]">
                        {locationText}
                      </span>
                    )}
                    <span className="font-bold text-[#244437] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Event Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setActiveView('schedule');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
          >
            <span>View Complete Tour Schedule</span>
            <ArrowRight className="w-4 h-4 text-[#B49A6A]" />
          </button>
        </div>

      </div>
    </section>
  );
};
