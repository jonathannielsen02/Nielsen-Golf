import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatCurrency } from '../utils/statsCalculator';
import { TrendingUp, Award, DollarSign, Target, CheckCircle2, Trophy, ArrowRight, BarChart2 } from 'lucide-react';
import { Player, SeasonStats as SeasonStatsType } from '../types';

export const SeasonStats: React.FC = () => {
  const { jonathan, tim, jonathanSeasonStats, timSeasonStats, setActiveView } = useGolfData();
  const [activeTab, setActiveTab] = useState<'both' | 'jonathan' | 'tim'>('both');

  return (
    <section className="py-16 md:py-24 bg-[#F5F3EE] text-[#202421] border-t border-[#D9D6CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tab Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-2.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#B49A6A]" />
              <span>Official Tour Records</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#202421] tracking-tight uppercase">
              2026 Season at a Glance
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#656A65] max-w-2xl leading-relaxed">
              Automated scoring metrics, cuts made, and leaderboard finishes across PGA TOUR Americas, APGA Tour, and the Asian Development Tour (ADT).
            </p>
          </div>

          <div className="flex items-center bg-[#FAF9F6] p-1.5 rounded-xl border border-[#D9D6CC] self-start md:self-auto shadow-xs gap-1">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'both'
                  ? 'bg-[#202421] text-white shadow-sm'
                  : 'text-[#656A65] hover:text-[#202421] hover:bg-[#ECEAE4]'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('jonathan')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'jonathan'
                  ? 'bg-[#244437] text-white shadow-sm'
                  : 'text-[#244437] hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Jonathan</span>
            </button>
            <button
              onClick={() => setActiveTab('tim')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'tim'
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-[#1E3A8A] hover:bg-blue-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Tim</span>
            </button>
          </div>
        </div>

        {/* Content based on tab */}
        {activeTab === 'both' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Jonathan Column */}
            {jonathan && (
              <PlayerStatsCard
                player={jonathan}
                stats={jonathanSeasonStats}
                accentColor="forest"
                onViewProfile={() => {
                  setActiveView('jonathan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Tim Column */}
            {tim && (
              <PlayerStatsCard
                player={tim}
                stats={timSeasonStats}
                accentColor="navy"
                onViewProfile={() => {
                  setActiveView('tim');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

          </div>
        ) : activeTab === 'jonathan' && jonathan ? (
          <SinglePlayerStatsGrid
            player={jonathan}
            stats={jonathanSeasonStats}
            onViewProfile={() => {
              setActiveView('jonathan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : tim ? (
          <SinglePlayerStatsGrid
            player={tim}
            stats={timSeasonStats}
            onViewProfile={() => {
              setActiveView('tim');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : null}

      </div>
    </section>
  );
};

interface PlayerStatsCardProps {
  player: Player;
  stats: SeasonStatsType;
  accentColor: 'forest' | 'navy';
  onViewProfile: () => void;
}

const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({ player, stats, accentColor, onViewProfile }) => {
  const isForest = accentColor === 'forest';

  return (
    <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-[#244437] transition-all">
      <div>
        {/* Player Header */}
        <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <img
              src={player.headshot}
              alt={player.display_name}
              className={`w-12 h-12 rounded-full object-cover border-2 shadow-xs ${
                isForest ? 'border-emerald-600' : 'border-blue-600'
              }`}
            />
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded inline-block ${
                isForest ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
              }`}>
                {player.current_tours.join(' • ')}
              </span>
              <h3 className="text-xl font-display font-black text-[#202421] leading-tight mt-1">
                {player.display_name}
              </h3>
            </div>
          </div>

          <button
            onClick={onViewProfile}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 uppercase tracking-wider ${
              isForest
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                : 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
            }`}
          >
            <span>Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Grid Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          
          <div className="bg-white p-4 rounded-xl border border-[#E2DFD7] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#656A65] block">Season Starts</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-1 block">{stats.starts}</span>
            <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">Official Events</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-300 shadow-2xs ring-1 ring-emerald-400/20">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 block">Cuts Made</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono mt-1 block">{stats.cuts_made}/{stats.starts}</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">100% Weekend Rate</span>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">Top 10 Finishes</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-800 font-mono mt-1 block">{stats.top_10s}</span>
            <span className="text-[10px] font-semibold text-amber-700 block mt-0.5">Leaderboard Spots</span>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-300 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 block">Top 25 Finishes</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-800 font-mono mt-1 block">{stats.top_25s}</span>
            <span className="text-[10px] font-semibold text-blue-700 block mt-0.5">High Finishes</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-300 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 block">Best Finish</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono mt-1 block">{stats.best_finish}</span>
            <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">Season High</span>
          </div>

          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-300 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-900 block">Scoring Avg</span>
            <span className="text-2xl sm:text-3xl font-black text-teal-800 font-mono mt-1 block">{stats.scoring_average}</span>
            <span className="text-[10px] font-semibold text-teal-700 block mt-0.5">Strokes / Round</span>
          </div>

        </div>
      </div>
    </div>
  );
};

const SinglePlayerStatsGrid: React.FC<{ player: Player; stats: SeasonStatsType; onViewProfile: () => void }> = ({ player, stats, onViewProfile }) => {
  const isJonathan = player.id.includes('jonathan');
  const statItems = [
    { label: 'Starts', value: stats.starts, subtext: 'Official Events', icon: Target, colorClass: 'text-slate-900 bg-white border-slate-300' },
    { label: 'Cuts Made', value: `${stats.cuts_made}/${stats.starts}`, subtext: '100% Rate', icon: CheckCircle2, colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400/20' },
    { label: 'Top 10s', value: stats.top_10s, subtext: 'Leaderboards', icon: Trophy, colorClass: 'text-amber-800 bg-amber-50 border-amber-300' },
    { label: 'Top 25s', value: stats.top_25s, subtext: 'High Finishes', icon: Award, colorClass: 'text-blue-800 bg-blue-50 border-blue-300' },
    { label: 'Best Finish', value: stats.best_finish, subtext: 'Season High', icon: Award, colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-300' },
    { label: 'Scoring Avg', value: stats.scoring_average, subtext: 'Strokes / Rd', icon: TrendingUp, colorClass: 'text-teal-800 bg-teal-50 border-teal-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#FAF9F6] p-5 rounded-2xl border border-[#D9D6CC] shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={player.headshot}
            alt={player.display_name}
            className={`w-14 h-14 rounded-full object-cover border-2 shadow-xs ${
              isJonathan ? 'border-emerald-600' : 'border-blue-600'
            }`}
          />
          <div>
            <h3 className="text-2xl font-display font-black text-[#202421]">{player.display_name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {player.current_tours.map(t => (
                <span key={t} className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isJonathan ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onViewProfile}
          className={`px-5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] text-white ${
            isJonathan ? 'bg-[#244437] hover:bg-[#1b342a]' : 'bg-[#1E3A8A] hover:bg-[#172554]'
          }`}
        >
          <span>View Full Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {statItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all shadow-2xs ${stat.colorClass}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#656A65] block">{stat.label}</span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-black block tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] font-bold opacity-80 block mt-1 truncate">{stat.subtext}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
