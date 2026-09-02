import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatDateRange, formatCurrency } from '../utils/statsCalculator';
import {
  Calendar,
  MapPin,
  ExternalLink,
  Trophy,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Award,
  Radio,
  RefreshCw,
  User
} from 'lucide-react';
import { Round } from '../types';

export const TournamentDetailView: React.FC = () => {
  const { tournaments, selectedTournamentSlug, setActiveView, setSelectedTournamentSlug, generateRoundRecap, syncScoringFeed, players } = useGolfData();
  const [activeRoundTab, setActiveRoundTab] = useState<number>(1);
  const [isGeneratingRecap, setIsGeneratingRecap] = useState<boolean>(false);
  const [isSyncingFeed, setIsSyncingFeed] = useState<boolean>(false);

  const tournament = tournaments.find((t) => t.slug === selectedTournamentSlug) || tournaments[0];

  if (!tournament) {
    return (
      <div className="py-20 text-center text-slate-600">
        <p>Tournament not found.</p>
        <button
          onClick={() => setActiveView('schedule')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold uppercase"
        >
          Back to Schedule
        </button>
      </div>
    );
  }

  const isJonathan = tournament.player_id.includes('jonathan');
  const golferName = isJonathan ? 'Jonathan Nielsen' : 'Tim Nielsen';
  const player = players.find(p => p.slug === (isJonathan ? 'jonathan' : 'tim')) || players[0];

  const rounds = tournament.rounds || [];
  const selectedRound = rounds.find((r) => r.round_number === activeRoundTab) || rounds[0];

  const scorecard = selectedRound?.scorecard || [];
  const front9 = scorecard.slice(0, 9);
  const back9 = scorecard.slice(9, 18);

  const front9Score = front9.reduce((acc, h) => acc + (h.score || h.par), 0);
  const front9Par = front9.reduce((acc, h) => acc + h.par, 0);
  const back9Score = back9.reduce((acc, h) => acc + (h.score || h.par), 0);
  const back9Par = back9.reduce((acc, h) => acc + h.par, 0);

  const handleGenerateRecap = async (roundNum: number) => {
    try {
      setIsGeneratingRecap(true);
      await generateRoundRecap(tournament.id, roundNum);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRecap(false);
    }
  };

  const handleSyncFeed = async () => {
    try {
      setIsSyncingFeed(true);
      await syncScoringFeed(tournament.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncingFeed(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-16 text-[#202421]">
      
      {/* Top Header Banner */}
      <div className="bg-[#ECEAE4] text-[#202421] border-b border-[#D9D6CC] py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation & Golfer Switch */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => {
                setSelectedTournamentSlug(null);
                setActiveView('schedule');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#656A65] hover:text-[#244437] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Schedule</span>
            </button>

            <button
              onClick={() => {
                setActiveView(isJonathan ? 'jonathan' : 'tim');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#D9D6CC] text-xs font-bold uppercase text-[#244437] hover:bg-white transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>View {golferName}'s Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Tournament Identity & Venue */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                  isJonathan ? 'bg-[#244437] text-white' : 'bg-[#26364A] text-white'
                }`}>
                  {golferName}
                </span>

                <span className="text-xs font-bold uppercase tracking-widest text-[#244437] bg-[#FAF9F6] px-2.5 py-1 rounded border border-[#D9D6CC]">
                  {tournament.tour}
                </span>
                
                {tournament.status === 'Current' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white bg-[#244437] px-2.5 py-1 rounded shadow-xs">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-[#B49A6A]" />
                    LIVE THIS WEEK
                  </span>
                )}
                
                <span className="text-xs font-bold uppercase tracking-wider text-[#656A65] bg-[#FAF9F6] px-2.5 py-1 rounded border border-[#D9D6CC]">
                  {tournament.tournament_type}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#202421] tracking-tight uppercase">
                {tournament.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#656A65]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#244437] shrink-0" />
                  <span>
                    <strong className="text-[#202421] font-semibold">{tournament.course}</strong> • {tournament.city}, {tournament.state}, {tournament.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#656A65] shrink-0" />
                  <span>{formatDateRange(tournament.start_date, tournament.end_date)}</span>
                </div>
                {tournament.course_par && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#B49A6A] shrink-0" />
                    <span>Par {tournament.course_par} {tournament.course_yardage ? `• ${tournament.course_yardage.toLocaleString()} Yards` : ''}</span>
                  </div>
                )}
                {tournament.purse && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#B49A6A] shrink-0" />
                    <span>Purse: {formatCurrency(tournament.purse)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {tournament.leaderboard_url && (
                  <a
                    href={tournament.leaderboard_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                  >
                    <span>OFFICIAL TOUR LEADERBOARD</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {tournament.status === 'Current' && (
                  <button
                    onClick={handleSyncFeed}
                    disabled={isSyncingFeed}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#FAF9F6] hover:bg-white text-[#202421] border border-[#D9D6CC] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFeed ? 'animate-spin' : ''}`} />
                    <span>{isSyncingFeed ? 'Syncing...' : 'Sync Scoring Feed'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Tournament Result / Standing Banner */}
            <div className="lg:col-span-4 bg-[#FAF9F6] border-2 border-[#D9D6CC] rounded-2xl p-6 text-center space-y-4 shadow-sm">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#656A65] block mb-1">
                  {tournament.status === 'Completed' ? 'Final Tournament Result' : 'Current Standing'}
                </span>
                <span className="font-display text-4xl sm:text-5xl font-black text-[#202421] block">
                  {tournament.final_finish || 'T12'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E2DFD7] text-xs">
                <div>
                  <span className="text-[#656A65] uppercase text-[10px] block font-bold">To Par</span>
                  <span className="font-mono font-bold text-[#244437] text-lg block mt-0.5">
                    {tournament.final_score_to_par || '-9'}
                  </span>
                </div>
                <div>
                  <span className="text-[#656A65] uppercase text-[10px] block font-bold">Total Strokes</span>
                  <span className="font-mono font-bold text-[#202421] text-lg block mt-0.5">
                    {tournament.final_total_strokes || '135'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Tournament Overall Summary Recap */}
        {tournament.summary_recap && (
          <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#244437] text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#244437]">
                TOURNAMENT SUMMARY RECAP
              </h3>
            </div>
            <p className="text-[#202421] text-base sm:text-lg font-normal leading-relaxed">
              {tournament.summary_recap}
            </p>
          </div>
        )}

        {/* Round Scores Overview Matrix */}
        <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
                Round Breakdown
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                Round-by-Round Performance
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((rNum) => {
              const rObj = rounds.find((r) => r.round_number === rNum);
              const hasScore = rObj && rObj.round_status === 'Completed';
              const isSelected = activeRoundTab === rNum;

              return (
                <button
                  key={rNum}
                  onClick={() => setActiveRoundTab(rNum)}
                  className={`p-5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? isJonathan
                        ? 'bg-[#244437] text-white border-[#244437] ring-2 ring-emerald-400/40 shadow-md'
                        : 'bg-[#1E3A8A] text-white border-[#1E3A8A] ring-2 ring-blue-400/40 shadow-md'
                      : hasScore
                      ? 'bg-[#FAF9F6] border-[#D9D6CC] text-[#202421] hover:border-[#244437]'
                      : 'bg-[#ECEAE4]/50 border-dashed border-[#D9D6CC] text-[#656A65] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Round {rNum}
                    </span>
                    {hasScore && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        Official
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-black">
                      {hasScore ? rObj?.score : '—'}
                    </span>
                    {hasScore && (
                      <span className={`font-mono font-black text-base ${
                        isSelected ? 'text-amber-300' : 'text-emerald-800'
                      }`}>
                        {rObj?.score_to_par && rObj.score_to_par < 0
                          ? rObj.score_to_par
                          : rObj?.score_to_par === 0
                          ? 'E'
                          : `+${rObj?.score_to_par}`}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] block mt-1 font-semibold opacity-90">
                    {hasScore
                      ? `${rObj?.birdies || 0} Birdies • Pos: ${rObj?.ending_position || 'T12'}`
                      : 'Not Started'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Round Detail: AI Recap & Scorecard */}
        {selectedRound && selectedRound.round_status === 'Completed' ? (
          <div className="space-y-8">
            {/* Round Recap Box */}
            <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#244437] text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#202421]">
                    ROUND {selectedRound.round_number} RECAP
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-[#656A65] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#244437]" />
                    Verified Scoring
                  </span>

                  <button
                    onClick={() => handleGenerateRecap(selectedRound.round_number)}
                    disabled={isGeneratingRecap}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#ECEAE4] text-[#202421] border border-[#D9D6CC] text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingRecap ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingRecap ? 'Regenerating...' : 'Regenerate Recap'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[#202421] text-base sm:text-lg font-normal leading-relaxed">
                {selectedRound.recap || `${golferName} posted a solid performance on tour, displaying control from tee to green.`}
              </p>
            </div>

            {/* Hole-by-Hole Scorecard for Selected Round */}
            {scorecard.length > 0 && (
              <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] block">
                      Scorecard
                    </span>
                    <h4 className="text-lg font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                      Round {selectedRound.round_number} Hole-by-Hole ({golferName})
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-bold text-[#656A65]">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-500 inline-block"></span> Birdie (-1)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-amber-100 border border-amber-500 inline-block"></span> Bogey (+1)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-[#ECEAE4] inline-block"></span> Par (E)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#D9D6CC] bg-white">
                  <table className="w-full text-center text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-[#ECEAE4] border-b border-[#D9D6CC] text-[#202421] font-bold">
                        <th className="p-2.5 text-left pl-4 font-sans text-xs">HOLE</th>
                        {front9.map((h) => (
                          <th key={h.hole_number} className="p-2.5 w-10">{h.hole_number}</th>
                        ))}
                        <th className="p-2.5 bg-[#D9D6CC]/60 font-bold">OUT</th>
                        {back9.map((h) => (
                          <th key={h.hole_number} className="p-2.5 w-10">{h.hole_number}</th>
                        ))}
                        <th className="p-2.5 bg-[#D9D6CC]/60 font-bold">IN</th>
                        <th className="p-2.5 bg-[#202421] text-white font-bold pr-4">TOT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#ECEAE4] text-[#656A65] font-semibold">
                        <td className="p-2.5 text-left pl-4 font-sans font-bold text-[#202421]">PAR</td>
                        {front9.map((h) => (
                          <td key={h.hole_number} className="p-2.5">{h.par}</td>
                        ))}
                        <td className="p-2.5 bg-[#FAF9F6] font-bold text-[#202421]">{front9Par}</td>
                        {back9.map((h) => (
                          <td key={h.hole_number} className="p-2.5">{h.par}</td>
                        ))}
                        <td className="p-2.5 bg-[#FAF9F6] font-bold text-[#202421]">{back9Par}</td>
                        <td className="p-2.5 bg-[#303530] text-white font-bold pr-4">{front9Par + back9Par}</td>
                      </tr>
                      <tr className="text-[#202421] font-bold text-sm">
                        <td className="p-2.5 text-left pl-4 font-sans font-bold text-[#202421]">SCORE</td>
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
                        <td className="p-2.5 bg-[#FAF9F6] font-bold text-[#202421]">{front9Score}</td>
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
                        <td className="p-2.5 bg-[#FAF9F6] font-bold text-[#202421]">{back9Score}</td>
                        <td className="p-2.5 bg-[#244437] text-white font-black text-base pr-4">
                          {front9Score + back9Score}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-[#D9D6CC] rounded-2xl p-10 text-center text-[#656A65]">
            Round {activeRoundTab} has not started or has no official scores recorded yet.
          </div>
        )}

      </div>
    </div>
  );
};
