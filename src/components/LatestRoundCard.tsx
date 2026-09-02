import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { Sparkles, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { Round, Tournament, Player } from '../types';

export const LatestRoundCard: React.FC = () => {
  const {
    jonathan,
    tim,
    jonathanLatestRoundInfo,
    timLatestRoundInfo,
    setActiveView,
    setSelectedTournamentSlug
  } = useGolfData();

  const [selectedPlayerSlug, setSelectedPlayerSlug] = useState<'jonathan' | 'tim'>('jonathan');
  const [showScorecard, setShowScorecard] = useState(false);

  const activeInfo = selectedPlayerSlug === 'jonathan' ? jonathanLatestRoundInfo : timLatestRoundInfo;
  const activePlayer = selectedPlayerSlug === 'jonathan' ? jonathan : tim;

  if (!activeInfo || !activeInfo.round || !activePlayer) {
    return null;
  }

  const { round, tournament } = activeInfo;

  const handleViewTournament = () => {
    setSelectedTournamentSlug(tournament.slug);
    setActiveView('tournament-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toParDisplay = typeof round.score_to_par === 'number'
    ? (round.score_to_par < 0 ? `${round.score_to_par}` : round.score_to_par === 0 ? 'E' : `+${round.score_to_par}`)
    : round.score_to_par;

  const scorecard = round.scorecard || [];
  const front9 = scorecard.slice(0, 9);
  const back9 = scorecard.slice(9, 18);

  const front9Score = front9.reduce((acc, h) => acc + (h.score || h.par), 0);
  const front9Par = front9.reduce((acc, h) => acc + h.par, 0);
  const back9Score = back9.reduce((acc, h) => acc + (h.score || h.par), 0);
  const back9Par = back9.reduce((acc, h) => acc + h.par, 0);

  return (
    <section className="py-12 md:py-16 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Player Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-black tracking-widest uppercase">
                Round-by-Round Analysis
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {tournament.name} • {tournament.tour}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-950 mt-1 uppercase tracking-tight">
              Latest Completed Round Recap
            </h2>
          </div>

          {/* Player Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setSelectedPlayerSlug('jonathan')}
              className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                selectedPlayerSlug === 'jonathan'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <img
                src={jonathan?.headshot}
                alt="Jonathan"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>Jonathan Nielsen</span>
            </button>

            <button
              onClick={() => setSelectedPlayerSlug('tim')}
              className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                selectedPlayerSlug === 'tim'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <img
                src={tim?.headshot}
                alt="Tim"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>Tim Nielsen</span>
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
          
          {/* Top Score Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 items-center border-b border-slate-200/80 pb-8">
            
            {/* Golfer & Round Badge */}
            <div className="col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
                {activePlayer.display_name}
              </span>
              <span className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                ROUND {round.round_number}
              </span>
              <span className="text-xs font-medium text-slate-500 mt-0.5 block">
                18 Holes Completed
              </span>
            </div>

            {/* Total Strokes Score */}
            <div className="col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
                Strokes
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display text-4xl sm:text-5xl font-black text-slate-950">
                  {round.score}
                </span>
                <span className="font-display text-2xl sm:text-3xl font-black text-emerald-600">
                  {toParDisplay}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 mt-0.5 block">
                Official Card
              </span>
            </div>

            {/* Standing after round */}
            <div className="col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
                Position After Round
              </span>
              <span className="font-display text-3xl sm:text-4xl font-black text-slate-900 mt-0.5 block">
                {round.ending_position || 'T12'}
              </span>
              <span className="text-xs font-medium text-emerald-700 mt-0.5 block">
                On Leaderboard
              </span>
            </div>

            {/* Birdies & Bogeys Stat */}
            <div className="col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
                Key Scoring Stats
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-900 rounded text-xs font-bold">
                  {round.birdies} Birdies
                </span>
                <span className="px-2 py-1 bg-rose-100 text-rose-900 rounded text-xs font-bold">
                  {round.bogeys} {round.bogeys === 1 ? 'Bogey' : 'Bogeys'}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 mt-1 block">
                {round.eagles ? `${round.eagles} Eagles • ` : ''}{round.putts ? `${round.putts} Putts` : 'Clean Card'}
              </span>
            </div>

            {/* Action toggle for hole-by-hole */}
            {scorecard.length > 0 && (
              <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex lg:justify-end">
                <button
                  onClick={() => setShowScorecard(!showScorecard)}
                  className="w-full lg:w-auto px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>{showScorecard ? 'Hide Scorecard' : 'View Hole-by-Hole'}</span>
                  {showScorecard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}

          </div>

          {/* AI-Generated Round Recap Section */}
          <div className="mt-8 pt-2">
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
                    AUTOMATED ROUND RECAP
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Factual Sports Recap
                </span>
              </div>

              <p className="text-slate-800 text-base sm:text-lg font-normal leading-relaxed">
                {round.recap || `${activePlayer.first_name} completed a solid round on tour, maintaining sharp execution across 18 holes.`}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span>Course: <strong className="text-slate-800 font-semibold">{tournament.course}</strong></span>
                  <span>Tour: <strong className="text-slate-800 font-semibold">{tournament.tour}</strong></span>
                </div>

                <button
                  onClick={handleViewTournament}
                  className="font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider flex items-center gap-1"
                >
                  <span>View Full Tournament Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Interactive Hole-by-Hole Scorecard */}
          {showScorecard && scorecard.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  {activePlayer.display_name} — Round {round.round_number} Scorecard
                </h4>
                <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 border border-emerald-600"></span> Birdie (-1)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-rose-100 border border-rose-400"></span> Bogey (+1)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-slate-200"></span> Par (E)
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-center text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-2.5 text-left pl-4 font-sans text-xs">HOLE</th>
                      {front9.map((h) => (
                        <th key={h.hole_number} className="p-2.5 w-10">{h.hole_number}</th>
                      ))}
                      <th className="p-2.5 bg-slate-200/80 font-bold">OUT</th>
                      {back9.map((h) => (
                        <th key={h.hole_number} className="p-2.5 w-10">{h.hole_number}</th>
                      ))}
                      <th className="p-2.5 bg-slate-200/80 font-bold">IN</th>
                      <th className="p-2.5 bg-slate-900 text-white font-bold pr-4">TOT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 text-slate-500 font-medium">
                      <td className="p-2.5 text-left pl-4 font-sans font-bold text-slate-600">PAR</td>
                      {front9.map((h) => (
                        <td key={h.hole_number} className="p-2.5">{h.par}</td>
                      ))}
                      <td className="p-2.5 bg-slate-100 font-bold text-slate-700">{front9Par}</td>
                      {back9.map((h) => (
                        <td key={h.hole_number} className="p-2.5">{h.par}</td>
                      ))}
                      <td className="p-2.5 bg-slate-100 font-bold text-slate-700">{back9Par}</td>
                      <td className="p-2.5 bg-slate-800 text-white font-bold pr-4">{front9Par + back9Par}</td>
                    </tr>
                    <tr className="text-slate-900 font-bold text-sm">
                      <td className="p-2.5 text-left pl-4 font-sans font-bold text-slate-900">SCORE</td>
                      {front9.map((h) => {
                        const diff = h.score_to_par;
                        let badgeClass = 'score-par';
                        if (diff <= -2) badgeClass = 'score-eagle';
                        else if (diff === -1) badgeClass = 'score-birdie';
                        else if (diff === 1) badgeClass = 'score-bogey';
                        else if (diff >= 2) badgeClass = 'score-double';

                        return (
                          <td key={h.hole_number} className="p-2">
                            <span className={badgeClass}>{h.score}</span>
                          </td>
                        );
                      })}
                      <td className="p-2.5 bg-slate-100 font-bold text-slate-900">{front9Score}</td>
                      {back9.map((h) => {
                        const diff = h.score_to_par;
                        let badgeClass = 'score-par';
                        if (diff <= -2) badgeClass = 'score-eagle';
                        else if (diff === -1) badgeClass = 'score-birdie';
                        else if (diff === 1) badgeClass = 'score-bogey';
                        else if (diff >= 2) badgeClass = 'score-double';

                        return (
                          <td key={h.hole_number} className="p-2">
                            <span className={badgeClass}>{h.score}</span>
                          </td>
                        );
                      })}
                      <td className="p-2.5 bg-slate-100 font-bold text-slate-900">{back9Score}</td>
                      <td className="p-2.5 bg-emerald-700 text-white font-black text-base pr-4">
                        {front9Score + back9Score}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
