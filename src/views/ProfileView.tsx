import React, { useEffect, useMemo, useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { calculatePlayerSeasonStats, formatDateRange } from '../utils/statsCalculator';
import { ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import { Tournament } from '../types';
import { getLeaderboardUrl } from '../services/schedule';

interface ProfileViewProps { playerSlug?: string; }

export const ProfileView: React.FC<ProfileViewProps> = ({ playerSlug }) => {
  const { activeView, setActiveView, players, jonathan, tim, tournaments, results, setSelectedTournamentSlug } = useGolfData();
  const currentSlug = playerSlug || (activeView === 'tim' ? 'tim' : 'jonathan');
  const player = players.find(p => p.slug === currentSlug || p.id === currentSlug) || (currentSlug === 'tim' ? tim : jonathan) || players[0];
  const [selectedYear, setSelectedYear] = useState(2026);
  const [profileTab, setProfileTab] = useState<'overview' | 'schedule' | 'results'>('overview');
  if (!player) return null;

  const playerTournaments = tournaments.filter(t => t.player_id === player.id || t.player_id.includes(player.slug));
  const playerResults = results.filter(t => t.player_id === player.id || t.player_id.includes(player.slug));
  const availableSeasons = useMemo(() => Array.from(new Set<number>(playerResults.map(t => Number(t.season || t.start_date?.slice(0, 4))).filter((y): y is number => Number.isFinite(y)))).sort((a, b) => b - a), [playerResults]);
  useEffect(() => {
    if (availableSeasons.length > 0 && !availableSeasons.includes(selectedYear)) setSelectedYear(availableSeasons[0]);
  }, [availableSeasons, selectedYear]);
  const stats = calculatePlayerSeasonStats(results, player.slug, selectedYear);
  const preparingTournaments = playerTournaments.filter(t => t.status === 'Preparing');
  const upcomingTournaments = playerTournaments.filter(t => t.status === 'Upcoming');
  const completedTournaments = playerResults.filter(t => Number(t.season || t.start_date?.slice(0, 4)) === selectedYear);
  const currentTournament = playerTournaments.find(t => t.status === 'Current');
  const preparingTournament = playerTournaments.find(t => t.status === 'Preparing');
  const activeEvent = currentTournament || preparingTournament;

  const highlights = useMemo(() => (player.career_highlights || '').split('|').map(v => v.trim()).filter(Boolean), [player.career_highlights]);
  const quickFacts = [
    ['Favorite Sports Team', player.favorite_sports_team],
    ["Favorite Course I've Played", player.favorite_course],
    ['Favorite Hobbies', player.favorite_hobbies],
    ['Dream Vacation Destination', player.dream_vacation],
    ['Ideal Tee Time', player.ideal_tee_time]
  ].filter(([, value]) => Boolean(value));

  const handleTournamentClick = (t: Tournament) => {
    const url = getLeaderboardUrl(t);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return <div className="bg-[#FAF9F6] min-h-screen pb-16 text-[#202421]">
    <div className="bg-[#ECEAE4] border-b border-[#D9D6CC] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#656A65] uppercase tracking-widest hidden sm:inline">Player Profile:</span>
          <div className="flex bg-[#FAF9F6] p-1 rounded-lg border border-[#D9D6CC]">
            {['jonathan','tim'].map(slug => <button key={slug} onClick={() => { setActiveView(slug); window.scrollTo({top:0,behavior:'smooth'}); }} className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${player.slug === slug ? 'bg-[#244437] text-white' : 'text-[#656A65]'}`}>{slug === 'jonathan' ? 'Jonathan Nielsen' : 'Tim Nielsen'}</button>)}
          </div>
        </div>
        {currentTournament && <a href={getLeaderboardUrl(currentTournament)} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#244437] text-white text-xs font-bold uppercase"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/>LIVE: {currentTournament.name}<ExternalLink className="w-3.5 h-3.5"/></a>}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4"><div className="rounded-2xl overflow-hidden border border-[#D9D6CC] bg-[#FAF9F6] shadow-sm p-2 max-w-sm mx-auto lg:max-w-none"><div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#ECEAE4]"><img src={player.headshot} alt={player.display_name} className="w-full h-full object-cover object-top"/></div></div></div>
        <div className="lg:col-span-8 space-y-6">
          <div><div className="inline-flex px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-3">Nielsen Golf</div><h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight">{player.display_name}</h1></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF9F6] border border-[#D9D6CC] rounded-xl p-5 text-xs">
            {player.training_base && <div><span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Training Base</span><span className="font-bold text-sm mt-1 block">{player.training_base}</span></div>}
            {player.college && <div><span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">College</span><span className="font-bold text-sm mt-1 block">{player.college}</span></div>}
            {player.turned_pro && <div><span className="text-[#656A65] uppercase tracking-wider text-[10px] font-bold block">Turned Pro</span><span className="font-bold text-sm mt-1 block">{player.turned_pro}</span></div>}
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
      <div className="flex items-center gap-2 border-b border-[#D9D6CC] pb-2 overflow-x-auto">
        {[{id:'overview',label:'PROFILE & STATS'},{id:'schedule',label:`SCHEDULE (${(currentTournament?1:0)+preparingTournaments.length+upcomingTournaments.length})`},{id:'results',label:`RESULTS (${completedTournaments.length})`}].map(tab => <button key={tab.id} onClick={() => setProfileTab(tab.id as any)} className={`px-4 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase whitespace-nowrap ${profileTab===tab.id?'bg-[#244437] text-white':'text-[#656A65] hover:bg-[#ECEAE4]'}`}>{tab.label}</button>)}
      </div>

      {profileTab === 'overview' && <div className="space-y-10">
        <section className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm"><span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">About {player.display_name}</span><h2 className="text-2xl sm:text-3xl font-display font-black mt-1 mb-5 uppercase">Bio</h2><p className="max-w-4xl text-base text-[#404540] leading-relaxed whitespace-pre-line">{player.bio}</p></section>

        {player.journey && <section className="bg-[#ECEAE4] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 lg:p-10"><span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">The Story So Far</span><h3 className="text-2xl font-display font-black mt-1 mb-5 uppercase">The Journey</h3><p className="max-w-4xl text-[#404540] leading-relaxed whitespace-pre-line">{player.journey}</p></section>}

        {highlights.length > 0 && <section><span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">Milestones</span><h3 className="text-2xl font-display font-black mt-1 mb-5 uppercase">Career Highlights</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{highlights.map((h,i)=><div key={i} className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-xl p-5 font-semibold">{h}</div>)}</div></section>}

        {quickFacts.length > 0 && <section className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8"><span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">A Little More Personal</span><h3 className="text-2xl font-display font-black mt-1 mb-5 uppercase">Beyond the Course</h3><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">{quickFacts.map(([label,value])=><div key={label} className="bg-white border border-[#E2DFD7] rounded-xl p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-[#656A65] block">{label}</span><span className="text-sm font-bold mt-2 block">{value}</span></div>)}</div></section>}

        {player.faith_statement && <section className="bg-[#244437] text-white rounded-2xl p-6 sm:p-8 lg:p-10"><span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">Faith & Purpose</span><p className="max-w-4xl text-base sm:text-lg leading-relaxed mt-4 text-[#F5F3EE] whitespace-pre-line">{player.faith_statement}</p></section>}

        <section className="bg-white border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 shadow-sm"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"><div><span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">Performance</span><h3 className="text-2xl font-display font-black uppercase">Season Statistics</h3></div><div className="flex gap-1 bg-[#ECEAE4] p-1.5 rounded-xl">{(availableSeasons.length > 0 ? availableSeasons : [2026,2025,2024]).map(year=><button key={year} onClick={()=>setSelectedYear(year)} className={`px-3 py-1.5 rounded-lg text-xs font-extrabold ${selectedYear===year?'bg-[#244437] text-white':'text-[#656A65]'}`}>{year}</button>)}</div></div><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">{[['Starts',stats.starts],['Cuts Made',stats.cuts_made],['Top 10s',stats.top_10s],['Top 25s',stats.top_25s],['Best Finish',stats.best_finish],['Scoring Avg',stats.scoring_average?stats.scoring_average.toFixed(2):'—']].map(([label,value])=><div key={String(label)} className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-4 text-center"><span className="text-[10px] font-bold uppercase text-[#656A65] block">{label}</span><span className="font-mono text-xl font-black mt-2 block">{stats.starts>0?value:'Pending'}</span></div>)}</div></section>
      </div>}

      {profileTab === 'schedule' && <div className="space-y-6">
        {activeEvent && <div className="bg-[#FAF9F6] border-2 border-[#244437]/40 rounded-2xl p-6"><span className="text-[11px] font-extrabold uppercase tracking-wider text-[#244437]">{currentTournament?'Playing This Week':'Tournament Week • Preparing'}</span><h3 onClick={()=>handleTournamentClick(activeEvent)} className="text-2xl font-display font-black mt-2 cursor-pointer">{activeEvent.name}</h3><p className="text-xs text-[#656A65] mt-1">{activeEvent.course}{activeEvent.state_country?` • ${activeEvent.state_country}`:''}</p><p className="text-xs font-bold mt-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/>{formatDateRange(activeEvent.start_date,activeEvent.end_date)}</p></div>}
        <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6"><h3 className="text-xl font-display font-black uppercase mb-4">Upcoming Schedule</h3>{upcomingTournaments.length===0?<p className="text-sm text-[#656A65]">No additional upcoming events currently scheduled.</p>:<div className="grid md:grid-cols-2 gap-4">{upcomingTournaments.map(t=><button key={t.id} onClick={()=>handleTournamentClick(t)} className="text-left p-5 rounded-xl border border-[#D9D6CC] bg-[#FAF9F6]"><span className="text-[10px] font-extrabold uppercase text-[#244437]">{t.tour}</span><h4 className="font-bold mt-1">{t.name}</h4><p className="text-xs text-[#656A65] mt-1">{formatDateRange(t.start_date,t.end_date)}</p></button>)}</div>}</div>
      </div>}

      {profileTab === 'results' && <div className="bg-white border border-[#D9D6CC] rounded-2xl p-6"><h3 className="text-xl font-display font-black uppercase mb-4">{selectedYear} Tournament Results</h3>{completedTournaments.length===0?<p className="text-sm text-[#656A65]">No results entered for this season yet.</p>:<div className="divide-y divide-[#ECEAE4]">{completedTournaments.map(t=><div key={t.id} className="py-4 grid grid-cols-[1fr_auto_auto] gap-4 items-center"><div><div className="font-bold">{t.name}</div><div className="text-xs text-[#656A65]">{t.tour} • {formatDateRange(t.start_date,t.end_date)}</div></div><div className="font-mono font-black text-[#244437]">{t.final_score_to_par || '—'}</div><div className="font-mono font-black">{t.final_finish || '—'}</div></div>)}</div>}</div>}

      <div className="bg-[#244437] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6"><div><span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">Partnerships</span><h3 className="text-2xl sm:text-3xl font-display font-black uppercase">Partner with {player.display_name} & Nielsen Golf</h3></div><button onClick={()=>{setActiveView('sponsorship');window.scrollTo({top:0,behavior:'smooth'});}} className="px-6 py-3.5 rounded-lg bg-[#B49A6A] text-[#202421] text-xs font-black uppercase flex items-center gap-2">Explore Partnerships <ArrowRight className="w-4 h-4"/></button></div>
    </div>
  </div>;
};
