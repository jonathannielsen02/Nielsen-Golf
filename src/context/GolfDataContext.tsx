import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Player,
  Tournament,
  Sponsor,
  SponsorshipPackage,
  CareerHighlight,
  CareerTimelineEvent,
  Follower,
  SeasonStats,
  FollowPreference,
  Donation,
  InvestmentOpportunity,
  InvestorInquiry,
  SponsorInquiry
} from '../types';
import { calculatePlayerSeasonStats } from '../utils/statsCalculator';

interface GolfDataContextType {
  players: Player[];
  jonathan: Player | null;
  tim: Player | null;
  tournaments: Tournament[];
  jonathanTournaments: Tournament[];
  timTournaments: Tournament[];
  sponsors: Sponsor[];
  sponsorshipPackages: SponsorshipPackage[];
  donations: Donation[];
  investmentOpportunities: InvestmentOpportunity[];
  investorInquiries: InvestorInquiry[];
  sponsorInquiries: SponsorInquiry[];
  careerHighlights: CareerHighlight[];
  careerTimeline: CareerTimelineEvent[];
  followers: Follower[];
  jonathanSeasonStats: SeasonStats;
  timSeasonStats: SeasonStats;
  jonathanCurrentTournament: Tournament | null;
  timCurrentTournament: Tournament | null;
  jonathanNextTournament: Tournament | null;
  timNextTournament: Tournament | null;
  jonathanLatestRoundInfo: { round: any; tournament: Tournament } | null;
  timLatestRoundInfo: { round: any; tournament: Tournament } | null;
  isAnyPlayerLive: boolean;
  isBothPlayersLive: boolean;
  isLoading: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedTournamentSlug: string | null;
  setSelectedTournamentSlug: (slug: string | null) => void;
  refreshData: () => Promise<void>;
  addTournament: (data: Partial<Tournament>) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<Tournament>;
  addOrUpdateRound: (roundData: any) => Promise<any>;
  generateAiRecap: (roundData: any) => Promise<string>;
  generateTournamentRecap: (tournamentId: string) => Promise<string>;
  syncScoringFeed: (tournamentId: string, provider?: string) => Promise<any>;
  subscribeFollower: (email: string, firstName?: string, preference?: FollowPreference) => Promise<any>;
  addSponsor: (sponsorData: Partial<Sponsor>) => Promise<any>;
  updateSponsor: (id: string, sponsorData: Partial<Sponsor>) => Promise<any>;
  deleteSponsor: (id: string) => Promise<any>;
  createDonation: (data: Partial<Donation>) => Promise<any>;
  createInvestmentOpportunity: (data: Partial<InvestmentOpportunity>) => Promise<any>;
  updateInvestmentOpportunity: (id: string, data: Partial<InvestmentOpportunity>) => Promise<any>;
  submitInvestorInquiry: (data: Partial<InvestorInquiry>) => Promise<any>;
  updateInvestorInquiry: (id: string, data: Partial<InvestorInquiry>) => Promise<any>;
  createSponsorshipPackage: (data: Partial<SponsorshipPackage>) => Promise<any>;
  updateSponsorshipPackage: (id: string, data: Partial<SponsorshipPackage>) => Promise<any>;
  submitSponsorInquiry: (data: Partial<SponsorInquiry>) => Promise<any>;
  updateSponsorInquiry: (id: string, data: Partial<SponsorInquiry>) => Promise<any>;
  updatePlayerBio: (slug: string, playerData: Partial<Player>) => Promise<any>;
  resetSeedData: () => Promise<void>;
  getPlayerBySlugOrId: (identifier: string) => Player | null;
  getTournamentsForPlayer: (identifier: string) => Tournament[];
}

const GolfDataContext = createContext<GolfDataContextType | undefined>(undefined);

export const GolfDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorshipPackages, setSponsorshipPackages] = useState<SponsorshipPackage[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [investmentOpportunities, setInvestmentOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [investorInquiries, setInvestorInquiries] = useState<InvestorInquiry[]>([]);
  const [sponsorInquiries, setSponsorInquiries] = useState<SponsorInquiry[]>([]);
  const [careerHighlights, setCareerHighlights] = useState<CareerHighlight[]>([]);
  const [careerTimeline, setCareerTimeline] = useState<CareerTimelineEvent[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('home');
  const [selectedTournamentSlug, setSelectedTournamentSlug] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [
        playersRes,
        tournsRes,
        sponsorsRes,
        packagesRes,
        followersRes,
        donationsRes,
        investmentsRes,
        investorInqRes,
        sponsorInqRes
      ] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/tournaments'),
        fetch('/api/sponsors'),
        fetch('/api/sponsorship-packages'),
        fetch('/api/followers'),
        fetch('/api/donations'),
        fetch('/api/investments'),
        fetch('/api/investor-inquiries'),
        fetch('/api/sponsor-inquiries')
      ]);

      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setPlayers(playersData);
      }

      if (tournsRes.ok) {
        const tournsData = await tournsRes.json();
        setTournaments(tournsData);
      }

      if (sponsorsRes.ok) {
        const spData = await sponsorsRes.json();
        setSponsors(spData);
      }

      if (packagesRes.ok) {
        const pkgData = await packagesRes.json();
        setSponsorshipPackages(pkgData);
      }

      if (followersRes.ok) {
        const fData = await followersRes.json();
        setFollowers(fData);
      }

      if (donationsRes.ok) {
        const dData = await donationsRes.json();
        setDonations(dData);
      }

      if (investmentsRes.ok) {
        const invData = await investmentsRes.json();
        setInvestmentOpportunities(invData);
      }

      if (investorInqRes.ok) {
        const inqData = await investorInqRes.json();
        setInvestorInquiries(inqData);
      }

      if (sponsorInqRes.ok) {
        const spInqData = await sponsorInqRes.json();
        setSponsorInquiries(spInqData);
      }

      // Fetch individual highlights and timelines
      const [jRes, tRes] = await Promise.all([
        fetch('/api/players/jonathan'),
        fetch('/api/players/tim')
      ]);
      const highlights: CareerHighlight[] = [];
      const timeline: CareerTimelineEvent[] = [];
      if (jRes.ok) {
        const jd = await jRes.json();
        if (jd.careerHighlights) highlights.push(...jd.careerHighlights);
        if (jd.careerTimeline) timeline.push(...jd.careerTimeline);
      }
      if (tRes.ok) {
        const td = await tRes.json();
        if (td.careerHighlights) highlights.push(...td.careerHighlights);
        if (td.careerTimeline) timeline.push(...td.careerTimeline);
      }
      setCareerHighlights(highlights);
      setCareerTimeline(timeline);

    } catch (error) {
      console.error('Failed to fetch golf data from server:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const jonathan = players.find(p => p.slug === 'jonathan' || p.id === 'jonathan-nielsen-1') || players[0] || null;
  const tim = players.find(p => p.slug === 'tim' || p.id === 'tim-nielsen-2') || players[1] || null;

  const jonathanTournaments = tournaments.filter(t => t.player_id === 'jonathan-nielsen-1' || t.player_id === 'jonathan' || (jonathan && t.player_id === jonathan.id));
  const timTournaments = tournaments.filter(t => t.player_id === 'tim-nielsen-2' || t.player_id === 'tim' || (tim && t.player_id === tim.id));

  // Current Tournaments
  const jonathanCurrentTournament = jonathanTournaments.find(t => t.status === 'Current') || null;
  const timCurrentTournament = timTournaments.find(t => t.status === 'Current') || null;

  const isAnyPlayerLive = Boolean(jonathanCurrentTournament || timCurrentTournament);
  const isBothPlayersLive = Boolean(jonathanCurrentTournament && timCurrentTournament);

  // Upcoming Tournaments
  const jonathanUpcoming = jonathanTournaments
    .filter(t => t.status === 'Upcoming')
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  const jonathanNextTournament = jonathanUpcoming[0] || null;

  const timUpcoming = timTournaments
    .filter(t => t.status === 'Upcoming')
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  const timNextTournament = timUpcoming[0] || null;

  // Latest Completed Round for Jonathan
  let jonathanLatestRoundInfo: { round: any; tournament: Tournament } | null = null;
  if (jonathanCurrentTournament && jonathanCurrentTournament.rounds && jonathanCurrentTournament.rounds.length > 0) {
    const comp = jonathanCurrentTournament.rounds.filter(r => r.round_status === 'Completed');
    if (comp.length > 0) {
      jonathanLatestRoundInfo = { round: comp[comp.length - 1], tournament: jonathanCurrentTournament };
    }
  }
  if (!jonathanLatestRoundInfo) {
    const compTourns = jonathanTournaments
      .filter(t => t.status === 'Completed' && t.rounds && t.rounds.length > 0)
      .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
    if (compTourns.length > 0 && compTourns[0].rounds) {
      const compRounds = compTourns[0].rounds.filter(r => r.round_status === 'Completed');
      if (compRounds.length > 0) {
        jonathanLatestRoundInfo = { round: compRounds[compRounds.length - 1], tournament: compTourns[0] };
      }
    }
  }

  // Latest Completed Round for Tim
  let timLatestRoundInfo: { round: any; tournament: Tournament } | null = null;
  if (timCurrentTournament && timCurrentTournament.rounds && timCurrentTournament.rounds.length > 0) {
    const comp = timCurrentTournament.rounds.filter(r => r.round_status === 'Completed');
    if (comp.length > 0) {
      timLatestRoundInfo = { round: comp[comp.length - 1], tournament: timCurrentTournament };
    }
  }
  if (!timLatestRoundInfo) {
    const compTourns = timTournaments
      .filter(t => t.status === 'Completed' && t.rounds && t.rounds.length > 0)
      .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
    if (compTourns.length > 0 && compTourns[0].rounds) {
      const compRounds = compTourns[0].rounds.filter(r => r.round_status === 'Completed');
      if (compRounds.length > 0) {
        timLatestRoundInfo = { round: compRounds[compRounds.length - 1], tournament: compTourns[0] };
      }
    }
  }

  const jonathanSeasonStats = calculatePlayerSeasonStats(tournaments, 'jonathan', 2026);
  const timSeasonStats = calculatePlayerSeasonStats(tournaments, 'tim', 2026);

  const getPlayerBySlugOrId = (identifier: string): Player | null => {
    return players.find(p => p.slug === identifier || p.id === identifier || (identifier === 'jonathan' && p.slug === 'jonathan') || (identifier === 'tim' && p.slug === 'tim')) || null;
  };

  const getTournamentsForPlayer = (identifier: string): Tournament[] => {
    if (identifier === 'jonathan' || identifier === 'jonathan-nielsen-1') {
      return jonathanTournaments;
    }
    if (identifier === 'tim' || identifier === 'tim-nielsen-2') {
      return timTournaments;
    }
    return tournaments;
  };

  const addTournament = async (data: Partial<Tournament>): Promise<Tournament> => {
    const res = await fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const created = await res.json();
    await refreshData();
    return created;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    const res = await fetch(`/api/tournaments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const updated = await res.json();
    await refreshData();
    return updated;
  };

  const addOrUpdateRound = async (roundData: any) => {
    const res = await fetch('/api/rounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roundData)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const generateAiRecap = async (roundData: any): Promise<string> => {
    const res = await fetch('/api/ai/generate-recap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roundData)
    });
    const data = await res.json();
    return data.recap;
  };

  const generateTournamentRecap = async (tournamentId: string): Promise<string> => {
    const res = await fetch('/api/ai/generate-tournament-recap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId })
    });
    const data = await res.json();
    await refreshData();
    return data.recap;
  };

  const syncScoringFeed = async (tournamentId: string, provider?: string) => {
    const res = await fetch('/api/scoring-provider/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournament_id: tournamentId, provider })
    });
    const data = await res.json();
    await refreshData();
    return data;
  };

  const subscribeFollower = async (email: string, firstName?: string, preference: FollowPreference = 'both') => {
    const res = await fetch('/api/followers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first_name: firstName, follow_preference: preference })
    });
    const data = await res.json();
    await refreshData();
    return data;
  };

  const addSponsor = async (sponsorData: Partial<Sponsor>) => {
    const res = await fetch('/api/sponsors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sponsorData)
    });
    const data = await res.json();
    await refreshData();
    return data;
  };

  const updateSponsor = async (id: string, sponsorData: Partial<Sponsor>) => {
    const res = await fetch(`/api/sponsors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sponsorData)
    });
    const data = await res.json();
    await refreshData();
    return data;
  };

  const deleteSponsor = async (id: string) => {
    const res = await fetch(`/api/sponsors/${id}`, { method: 'DELETE' });
    const data = await res.json();
    await refreshData();
    return data;
  };

  const createDonation = async (data: Partial<Donation>) => {
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const createInvestmentOpportunity = async (data: Partial<InvestmentOpportunity>) => {
    const res = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const updateInvestmentOpportunity = async (id: string, data: Partial<InvestmentOpportunity>) => {
    const res = await fetch(`/api/investments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const submitInvestorInquiry = async (data: Partial<InvestorInquiry>) => {
    const res = await fetch('/api/investor-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const updateInvestorInquiry = async (id: string, data: Partial<InvestorInquiry>) => {
    const res = await fetch(`/api/investor-inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const createSponsorshipPackage = async (data: Partial<SponsorshipPackage>) => {
    const res = await fetch('/api/sponsorship-packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const updateSponsorshipPackage = async (id: string, data: Partial<SponsorshipPackage>) => {
    const res = await fetch(`/api/sponsorship-packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const submitSponsorInquiry = async (data: Partial<SponsorInquiry>) => {
    const res = await fetch('/api/sponsor-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const updateSponsorInquiry = async (id: string, data: Partial<SponsorInquiry>) => {
    const res = await fetch(`/api/sponsor-inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    await refreshData();
    return result;
  };

  const updatePlayerBio = async (slug: string, playerData: Partial<Player>) => {
    const res = await fetch(`/api/players/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    });
    const data = await res.json();
    await refreshData();
    return data;
  };

  const resetSeedData = async () => {
    await fetch('/api/reset-seed', { method: 'POST' });
    await refreshData();
  };

  return (
    <GolfDataContext.Provider
      value={{
        players,
        jonathan,
        tim,
        tournaments,
        jonathanTournaments,
        timTournaments,
        sponsors,
        sponsorshipPackages,
        donations,
        investmentOpportunities,
        investorInquiries,
        sponsorInquiries,
        careerHighlights,
        careerTimeline,
        followers,
        jonathanSeasonStats,
        timSeasonStats,
        jonathanCurrentTournament,
        timCurrentTournament,
        jonathanNextTournament,
        timNextTournament,
        jonathanLatestRoundInfo,
        timLatestRoundInfo,
        isAnyPlayerLive,
        isBothPlayersLive,
        isLoading,
        activeView,
        setActiveView,
        selectedTournamentSlug,
        setSelectedTournamentSlug,
        refreshData,
        addTournament,
        updateTournament,
        addOrUpdateRound,
        generateAiRecap,
        generateTournamentRecap,
        syncScoringFeed,
        subscribeFollower,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        createDonation,
        createInvestmentOpportunity,
        updateInvestmentOpportunity,
        submitInvestorInquiry,
        updateInvestorInquiry,
        createSponsorshipPackage,
        updateSponsorshipPackage,
        submitSponsorInquiry,
        updateSponsorInquiry,
        updatePlayerBio,
        resetSeedData,
        getPlayerBySlugOrId,
        getTournamentsForPlayer
      }}
    >
      {children}
    </GolfDataContext.Provider>
  );
};

export const useGolfData = () => {
  const context = useContext(GolfDataContext);
  if (!context) {
    throw new Error('useGolfData must be used within a GolfDataProvider');
  }
  return context;
};
