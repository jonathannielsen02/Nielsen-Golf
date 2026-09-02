import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatCurrency, calculatePlayerSeasonStats, formatDateRange } from '../utils/statsCalculator';
import {
  MapPin,
  GraduationCap,
  Trophy,
  Award,
  Calendar,
  Flag,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  User,
  Activity,
  ExternalLink
} from 'lucide-react';
import { Player, Tournament } from '../types';

interface ProfileViewProps {
  playerSlug?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ playerSlug }) => {
  const {
    activeView,
    setActiveView,
    players,
    jonathan,
    tim,
    tournaments,
    careerHighlights,
    careerTimeline,
    setSelectedTournamentSlug
  } = useGolfData();

  // Determine current active player
  const currentSlug = playerSlug || (activeView === 'tim' ? 'tim' : 'jonathan');
  const player = players.find(p => p.slug === currentSlug || p.id === currentSlug) || (currentSlug === 'tim' ? tim : jonathan) || players[0];

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [profileTab, setProfileTab] = useState<'overview' | 'schedule' | 'results' | 'timeline'>('overview');

  if (!player) return null;

  const playerTournaments = tournaments.filter(t => t.player_id === player.id || t.player_id.includes(player.slug));
  const playerHighlights = careerHighlights.filter(h => h.player_id === player.id);
  const playerTimelineEvents = careerTimeline.filter(t => t.player_id === player.id);
  const stats = calculatePlayerSeasonStats(tournaments, player.slug, selectedYear);

  const upcomingTournaments = playerTournaments.filter(t => t.status === 'Upcoming');
  const completedTournaments = playerTournaments.filter(t => t.status === 'Completed');
  const currentTournament = playerTournaments.find(t => t.status === 'Current');

  const handleTournamentClick = (t: Tournament) => {
    setSelectedTournamentSlug(t.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-16 text-[#202421]">
      
      {/* Top Header Banner */}
      <div className="bg-[#ECEAE4] text-[#202421] border-b border-[#D9D6CC] py-12 lg:py-16 relative overflow-hidden">
        
        {/* Brother Switcher Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#656A65] uppercase tracking-widest">Athlete Profile:</span>
            <div className="flex bg-[#FAF9F6] p-1 rounded-lg border border-[#D9D6CC]">
              <button
                onClick={() => {
                  setActiveView('jonathan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  player.slug === 'jonathan'
                    ? 'bg-[#244437] text-white shadow-sm'
                    : 'text-[#656A65] hover:text-[#202421]'
                }`}
              >
                Jonathan Nielsen
              </button>
              <button
                onClick={() => {
                  setActiveView('tim');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  player.slug === 'tim'
                    ? 'bg-[#244437] text-white shadow-sm'
                    : 'text-[#656A65] hover:text-[#202421]'
                }`}
              >
                Tim Nielsen
              </button>
            </div>
          </div>

          {currentTournament && (
            <a
              href={currentTournament.leaderboard_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE: {currentTournament.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Player Portrait / Action Photo */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#D9D6CC] bg-[#FAF9F6] shadow-sm p-2 max-w-sm mx-auto lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#ECEAE4]">
                  <img
                    src={player.headshot}
                    alt={player.display_name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#202421]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-[#244437] px-2.5 py-1 rounded shadow-xs inline-block">
                      {player.current_tours[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Player Name & Quick Data Matrix */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-3">
                  <span>Nielsen Golf • Professional Athlete</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#202421] tracking-tight">
                  {player.display_name}
                </h1>
                <p className="text-xl font-medium text-[#244437] mt-1 font-serif">
                  Touring Professional Golfer
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FAF9F6] border border-[#D9D6CC] rounded-xl p-5 text-xs">
                <div>
                  <span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Nationality</span>
                  <span className="font-bold text-[#202421] text-sm mt-0.5 block">{player.nationality}</span>
                </div>
                <div>
                  <span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Residence</span>
                  <span className="font-bold text-[#202421] text-sm mt-0.5 block">{player.residence}</span>
                </div>
                <div>
                  <span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Turned Pro</span>
                  <span className="font-bold text-[#202421] text-sm mt-0.5 block">{player.turned_pro}</span>
                </div>
                <div>
                  <span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Height</span>
                  <span className="font-bold text-[#202421] text-sm mt-0.5 block">{player.height}</span>
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-[#E2DFD7]">
                  <span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Collegiate Background</span>
                  <span className="font-semibold text-[#202421] mt-0.5 block">{player.college}</span>
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-[#E2DFD7]">
                  <span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Current Tours</span>
                  <span className="font-semibold text-[#244437] mt-0.5 block">
                    {player.current_tours.join(' • ')}
                  </span>
                </div>
              </div>

              {/* Home Clubs & Social */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-xs text-[#656A65]">
                  <span className="font-semibold text-[#202421]">Home Base / Clubs: </span>
                  <span>{player.home_clubs.join(', ')}</span>
                </div>

                <div className="flex items-center gap-2 text-[#656A65]">
                  <a
                    href={player.instagram_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#FAF9F6] hover:bg-white text-[#202421] border border-[#D9D6CC] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={player.x_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#FAF9F6] hover:bg-white text-[#202421] border border-[#D9D6CC] transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={player.linkedin_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#FAF9F6] hover:bg-white text-[#202421] border border-[#D9D6CC] transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area with Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Navigation Tabs for Profile */}
        <div className="flex items-center gap-2 border-b border-[#D9D6CC] pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'OVERVIEW & STATS' },
            { id: 'schedule', label: `${player.first_name.toUpperCase()}'S SCHEDULE (${upcomingTournaments.length})` },
            { id: 'results', label: `RESULTS (${completedTournaments.length})` },
            { id: 'timeline', label: 'CAREER TIMELINE' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProfileTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition-all ${
                profileTab === tab.id
                  ? player.slug === 'jonathan'
                    ? 'bg-[#244437] text-white shadow-sm'
                    : 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-[#656A65] hover:text-[#202421] hover:bg-[#ECEAE4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {profileTab === 'overview' && (
          <div className="space-y-10">
            {/* Bio & Playing Style */}
            <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="max-w-4xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block mb-1">
                  About {player.display_name}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#202421] mb-6 uppercase tracking-tight">
                  Career Profile &amp; Playing Style
                </h2>
                <div className="prose prose-slate max-w-none text-base text-[#404540] leading-relaxed space-y-4">
                  <p>{player.bio}</p>
                  <p>
                    <strong className="text-[#202421]">Strengths:</strong> {player.strengths || 'Driving accuracy, distance control with mid-irons, and disciplined tournament course management.'}
                  </p>
                  <p>
                    As part of the Nielsen Golf team, {player.first_name} works continuously on physical conditioning, technical shot-shaping, and international competition readiness.
                  </p>
                </div>
              </div>
            </div>

            {/* Season Stats Breakdown */}
            <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
                    Performance Breakdown
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                    Season Statistics
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-[#ECEAE4] p-1.5 rounded-xl border border-[#D9D6CC]">
                  {[2026, 2025, 2024].map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                        selectedYear === year
                          ? player.slug === 'jonathan'
                            ? 'bg-[#244437] text-white shadow-sm'
                            : 'bg-[#1E3A8A] text-white shadow-sm'
                          : 'text-[#656A65] hover:text-[#202421]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-300 rounded-xl p-4 text-center shadow-2xs">
                  <span className="text-[11px] font-bold uppercase text-[#656A65] block">Starts</span>
                  <span className="font-mono text-2xl font-black text-slate-900 mt-1 block">{stats.starts}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center shadow-2xs">
                  <span className="text-[11px] font-extrabold uppercase text-emerald-900 block">Cuts Made</span>
                  <span className="font-mono text-2xl font-black text-emerald-800 mt-1 block">{stats.cuts_made}</span>
                </div>
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-center shadow-2xs">
                  <span className="text-[11px] font-extrabold uppercase text-amber-900 block">Top 10s</span>
                  <span className="font-mono text-2xl font-black text-amber-800 mt-1 block">{stats.top_10s}</span>
                </div>
                <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 text-center shadow-2xs">
                  <span className="text-[11px] font-extrabold uppercase text-blue-900 block">Top 25s</span>
                  <span className="font-mono text-2xl font-black text-blue-800 mt-1 block">{stats.top_25s}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center shadow-2xs">
                  <span className="text-[11px] font-extrabold uppercase text-emerald-900 block">Best Finish</span>
                  <span className="font-mono text-2xl font-black text-emerald-800 mt-1 block">{stats.best_finish}</span>
                </div>
                <div className="bg-teal-50 border border-teal-300 rounded-xl p-4 text-center shadow-2xs">
                  <span className="text-[11px] font-extrabold uppercase text-teal-900 block">Scoring Avg</span>
                  <span className="font-mono text-2xl font-black text-teal-800 mt-1 block">{stats.scoring_average}</span>
                </div>
              </div>
            </div>

            {/* Career Highlights */}
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
                  Milestones
                </span>
                <h3 className="text-2xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                  Career Highlights
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerHighlights.map((hl) => (
                  <div
                    key={hl.id}
                    className="bg-[#FAF9F6] border border-[#D9D6CC] hover:border-[#244437] rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          {hl.year}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
                          {hl.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-display font-bold text-[#202421] leading-snug">
                        {hl.title}
                      </h4>
                      <p className="text-xs text-[#656A65] mt-2 leading-relaxed font-medium">
                        {hl.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Player Schedule */}
        {profileTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-display font-black text-[#202421] uppercase tracking-tight mb-4">
                {player.display_name}'s Upcoming Tour Schedule
              </h3>
              {upcomingTournaments.length === 0 ? (
                <p className="text-sm text-[#656A65]">No upcoming events currently scheduled for {player.first_name}.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingTournaments.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleTournamentClick(t)}
                      className="p-5 rounded-xl border border-[#D9D6CC] hover:border-[#244437] hover:shadow-md transition-all cursor-pointer bg-[#FAF9F6] flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#244437] block">{t.tour}</span>
                        <h4 className="text-base font-bold text-[#202421] mt-0.5">{t.name}</h4>
                        <p className="text-xs text-[#656A65] mt-1">{t.course} • {t.city}, {t.state}</p>
                        <p className="text-xs font-bold text-[#202421] mt-2">Dates: {formatDateRange(t.start_date, t.end_date)}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-[#E2DFD7] flex justify-between items-center text-xs">
                        <span className="text-[#656A65] font-medium">{t.tournament_type}</span>
                        <span className="font-bold text-[#244437] flex items-center gap-1">Details <ArrowRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Player Results */}
        {profileTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-display font-black text-[#202421] uppercase tracking-tight mb-4">
                {player.display_name}'s Recent Tournament Results
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#ECEAE4] border-b border-[#D9D6CC] text-[#202421] font-bold uppercase text-[11px]">
                      <th className="p-3 pl-4">Tournament</th>
                      <th className="p-3">Tour</th>
                      <th className="p-3 text-center">Score</th>
                      <th className="p-3 text-center">Finish</th>
                      <th className="p-3 text-right pr-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEAE4]">
                    {completedTournaments.map(t => (
                      <tr
                        key={t.id}
                        onClick={() => handleTournamentClick(t)}
                        className="hover:bg-[#FAF9F6] cursor-pointer transition-colors"
                      >
                        <td className="p-3 pl-4 font-bold text-[#202421]">{t.name}</td>
                        <td className="p-3 text-[#244437] font-semibold text-xs">{t.tour}</td>
                        <td className="p-3 text-center font-mono font-black text-emerald-800 bg-emerald-50 rounded">{t.final_score_to_par}</td>
                        <td className="p-3 text-center font-bold text-amber-900 bg-amber-50 rounded">{t.final_finish}</td>
                        <td className="p-3 text-right pr-4 text-[#244437]"><ArrowRight className="w-4 h-4 inline" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Career Timeline */}
        {profileTab === 'timeline' && (
          <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
                Path to the Tour
              </span>
              <h3 className="text-2xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                {player.display_name}'s Career Timeline
              </h3>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D9D6CC] space-y-8">
              {playerTimelineEvents.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#244437] group-hover:border-emerald-500 transition-colors" />
                  <div>
                    <span className="text-xs font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 uppercase tracking-wider">
                      {item.period}
                    </span>
                    <h4 className="text-lg sm:text-xl font-display font-bold text-[#202421] mt-1.5">
                      {item.title}
                    </h4>
                    <span className="text-xs font-semibold text-[#656A65] block mb-2">
                      {item.organization}
                    </span>
                    <p className="text-sm text-[#404540] max-w-3xl leading-relaxed">
                      {item.description}
                    </p>

                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {item.highlights.map((h, hIdx) => (
                          <li
                            key={hIdx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ECEAE4] border border-[#D9D6CC] rounded text-xs font-medium text-[#202421]"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#244437]" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partnership CTA Banner */}
        <div className="bg-[#244437] text-white rounded-2xl p-8 sm:p-10 border border-[#1b342a] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] font-mono block mb-1">
              Corporate Partnerships
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              Partner with {player.display_name} &amp; Nielsen Golf
            </h3>
            <p className="text-sm text-slate-200 max-w-xl mt-1">
              Explore athlete apparel branding, executive pro-am hosting, social media visibility, and custom golf outings.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveView('sponsorship');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-lg bg-[#B49A6A] hover:bg-[#a38a5a] text-[#202421] text-xs font-black uppercase tracking-wider shrink-0 shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <span>Sponsorship Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
