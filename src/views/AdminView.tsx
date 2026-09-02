import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import {
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Save,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  Radio,
  FileText,
  Send,
  User,
  PlusCircle,
  Heart,
  TrendingUp,
  Briefcase,
  DollarSign,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
  Check
} from 'lucide-react';
import { formatCurrency } from '../utils/statsCalculator';

export const AdminView: React.FC = () => {
  const {
    tournaments,
    currentTournament,
    followers,
    sponsors,
    donations,
    investmentOpportunities,
    investorInquiries,
    sponsorshipPackages,
    sponsorInquiries,
    addTournament,
    updateTournament,
    addOrUpdateRound,
    generateAiRecap,
    syncScoringFeed,
    addSponsor,
    updateSponsor,
    deleteSponsor,
    createDonation,
    createInvestmentOpportunity,
    updateInvestmentOpportunity,
    deleteInvestmentOpportunity,
    createSponsorshipPackage,
    updateSponsorshipPackage,
    deleteSponsorshipPackage,
    updateInvestorInquiryStatus,
    updateSponsorInquiryStatus,
    resetSeedData,
    players
  } = useGolfData();

  const [activeTab, setActiveTab] = useState<'round' | 'tournament' | 'partnerships' | 'sync' | 'followers'>('round');
  const [partnershipSubTab, setPartnershipSubTab] = useState<'donations' | 'investments' | 'packages' | 'sponsors' | 'inquiries'>('donations');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // --- Round Update Form State ---
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    currentTournament ? currentTournament.id : tournaments[0]?.id || ''
  );
  const [roundNumber, setRoundNumber] = useState<number>(3);
  const [roundScore, setRoundScore] = useState<number>(68);
  const [roundScoreToPar, setRoundScoreToPar] = useState<number>(-4);
  const [endingPosition, setEndingPosition] = useState<string>('T4');
  const [birdies, setBirdies] = useState<number>(6);
  const [bogeys, setBogeys] = useState<number>(2);
  const [eagles, setEagles] = useState<number>(0);
  const [putts, setPutts] = useState<number>(27);
  const [roundRecap, setRoundRecap] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isSavingRound, setIsSavingRound] = useState<boolean>(false);

  // --- New Tournament Form State ---
  const [newTourn, setNewTourn] = useState({
    name: '',
    player_id: 'jonathan',
    tour: 'PGA TOUR Americas',
    course: '',
    city: '',
    state: '',
    country: 'USA',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    season: 2026,
    status: 'Upcoming',
    tournament_type: 'Confirmed',
    leaderboard_url: '',
    purse: 225000,
    course_par: 72,
    course_yardage: 7250,
  });

  // --- Manual Donation Form State ---
  const [manualDonation, setManualDonation] = useState({
    amount: 250,
    donor_name: '',
    email: '',
    supports_both: true,
    player_id: 'jonathan-nielsen-1',
    anonymous: false,
    message: '',
    payment_provider: 'Direct Check / Wire'
  });

  // --- New Investment Opp State ---
  const [newInvestment, setNewInvestment] = useState({
    name: '2026 Season Performance Syndicate',
    season: '2026',
    funding_goal: 75000,
    amount_raised: 25000,
    minimum_investment: 5000,
    applies_to_both_players: true,
    earnings_share_description: '15% of Official Season Purse Earnings (Pro-Rata)',
    maximum_return_description: '2.5x Initial Capital Contribution',
    term_description: 'Single Calendar Season (Jan - Dec 2026)',
    investment_summary: 'Participate directly in tournament purse earnings across PGA TOUR Americas and qualifying events.',
    status: 'Open'
  });

  // --- New Sponsor Package State ---
  const [newPackage, setNewPackage] = useState({
    name: 'Title Hat Sponsor',
    tier: 'Primary Hat Partner',
    price: '$35,000 / Season',
    billing_frequency: 'Annual',
    description: 'Premier front-of-cap visibility on all televised broadcasts and tournament rounds.',
    logo_placements: 'Front of Hat, Golf Bag, Website Header',
    corporate_golf_days: 2,
    appearance_days: 2,
    exclusivity: 'Industry Exclusive',
    order: 1
  });

  // --- New Sponsor Form State ---
  const [newSponsor, setNewSponsor] = useState({
    company_name: '',
    tier: 'Supporting Partner',
    category: 'Corporate',
    website: '',
    description: '',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
    sponsored_players: 'both' as 'both' | 'jonathan' | 'tim'
  });

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const selectedTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];
  const isSelectedJonathan = selectedTournament ? selectedTournament.player_id.includes('jonathan') : true;

  // Generate AI recap for round
  const handleGenerateAiRecap = async () => {
    try {
      setIsGeneratingAi(true);
      const chosenTournament = tournaments.find((t) => t.id === selectedTournamentId);
      const golferName = chosenTournament?.player_id.includes('jonathan') ? 'Jonathan Nielsen' : 'Tim Nielsen';
      
      const payload = {
        golferName,
        tournamentName: chosenTournament?.name || 'PGA TOUR Americas Event',
        tour: chosenTournament?.tour || 'PGA TOUR Americas',
        roundNumber,
        score: roundScore,
        scoreToPar: roundScoreToPar,
        position: endingPosition,
        birdies,
        bogeys,
        eagles,
        putts,
        courseName: chosenTournament?.course || 'Championship Course'
      };

      const result = await generateAiRecap(payload);
      if (result && result.recap) {
        setRoundRecap(result.recap);
        showNotification('Generated high-performance round narrative via AI!');
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to generate AI recap. Please check connection.', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save Round
  const handleSaveRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournamentId) {
      showNotification('Please select a tournament.', 'error');
      return;
    }
    try {
      setIsSavingRound(true);
      await addOrUpdateRound(selectedTournamentId, {
        round_number: roundNumber,
        score: roundScore,
        score_to_par: roundScoreToPar,
        birdies,
        bogeys,
        eagles,
        putts,
        round_recap: roundRecap,
        round_date: new Date().toISOString().split('T')[0]
      });

      showNotification(`Saved Round ${roundNumber} (${roundScore}) for tournament!`);
    } catch (err) {
      console.error(err);
      showNotification('Failed to save round.', 'error');
    } finally {
      setIsSavingRound(false);
    }
  };

  // Add Tournament
  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTournament({
        ...newTourn,
        id: `tourn-${Date.now()}`
      } as any);
      showNotification(`Created tournament "${newTourn.name}"!`);
      setNewTourn({
        name: '',
        player_id: 'jonathan',
        tour: 'PGA TOUR Americas',
        course: '',
        city: '',
        state: '',
        country: 'USA',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        season: 2026,
        status: 'Upcoming',
        tournament_type: 'Confirmed',
        leaderboard_url: '',
        purse: 225000,
        course_par: 72,
        course_yardage: 7250,
      });
    } catch (err) {
      showNotification('Failed to create tournament.', 'error');
    }
  };

  // Sync Provider Feed
  const handleSyncProvider = async (tournId: string) => {
    try {
      await syncScoringFeed(tournId);
      showNotification('Synchronized latest scores from official leaderboard feed!');
    } catch (err) {
      showNotification('Failed to sync scoring provider.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#202421] pb-24">
      {/* Top Header Bar */}
      <div className="bg-[#FAF9F6] border-b border-[#E2DFD7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#244437] text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">
                  Management &amp; Athlete Hub
                </span>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[#202421] tracking-tight">
                  Nielsen Golf Administration
                </h1>
              </div>
            </div>

            {/* Global Reset Button for testing */}
            <button
              onClick={async () => {
                if (window.confirm('Reset all Nielsen Golf data stores to default seed values?')) {
                  await resetSeedData();
                  showNotification('Reset application data stores to default seed state.');
                }
              }}
              className="px-3.5 py-2 rounded-md bg-[#ECEAE4] hover:bg-[#dedad0] text-xs font-bold uppercase tracking-wider text-[#656A65] hover:text-[#202421] border border-[#D9D6CC] transition-colors self-start sm:self-auto"
            >
              Reset Seed Data
            </button>
          </div>

          {/* Flash Notification */}
          {statusMessage && (
            <div
              className={`mt-4 p-3.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Primary Admin Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1">
            {[
              { id: 'round', label: 'Live Score & AI Recap', icon: Radio },
              { id: 'tournament', label: 'Tournament Schedule', icon: Calendar },
              { id: 'partnerships', label: 'Partnerships (Donate / Invest / Sponsor)', icon: Heart },
              { id: 'sync', label: 'Feed Ingestion', icon: RefreshCw },
              { id: 'followers', label: 'Fan Subscribers', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#244437] text-white shadow-sm'
                      : 'bg-[#ECEAE4] hover:bg-[#dedad0] text-[#656A65] hover:text-[#202421] border border-[#D9D6CC]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ================= TAB 1: LIVE ROUND & AI RECAP ================= */}
        {activeTab === 'round' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-display font-black text-[#202421] mb-6 uppercase tracking-tight">
                Update Round &amp; AI Analysis
              </h2>

              <form onSubmit={handleSaveRound} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#656A65] font-bold uppercase mb-1">Target Tournament</label>
                  <select
                    value={selectedTournamentId}
                    onChange={(e) => setSelectedTournamentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421] font-semibold text-xs"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.player_id.includes('tim') ? '[TIM]' : '[JONATHAN]'} {t.name} ({t.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#656A65] font-bold uppercase mb-1">Round #</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={roundNumber}
                      onChange={(e) => setRoundNumber(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#656A65] font-bold uppercase mb-1">Score (Gross)</label>
                    <input
                      type="number"
                      value={roundScore}
                      onChange={(e) => setRoundScore(parseInt(e.target.value) || 72)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#656A65] font-bold uppercase mb-1">To Par (+/-)</label>
                    <input
                      type="number"
                      value={roundScoreToPar}
                      onChange={(e) => setRoundScoreToPar(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#656A65] font-bold uppercase mb-1">Position</label>
                    <input
                      type="text"
                      value={endingPosition}
                      onChange={(e) => setEndingPosition(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#656A65] font-bold uppercase mb-1">Birdies</label>
                    <input
                      type="number"
                      value={birdies}
                      onChange={(e) => setBirdies(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#656A65] font-bold uppercase mb-1">Bogeys</label>
                    <input
                      type="number"
                      value={bogeys}
                      onChange={(e) => setBogeys(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#656A65] font-bold uppercase mb-1">Putts</label>
                    <input
                      type="number"
                      value={putts}
                      onChange={(e) => setPutts(parseInt(e.target.value) || 28)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[#656A65] font-bold uppercase">Round Summary &amp; Narrative</label>
                    <button
                      type="button"
                      onClick={handleGenerateAiRecap}
                      disabled={isGeneratingAi}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#244437] hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B49A6A]" />
                      {isGeneratingAi ? 'Drafting Analysis...' : 'Auto-Generate with AI'}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={roundRecap}
                    onChange={(e) => setRoundRecap(e.target.value)}
                    placeholder="Enter or auto-generate official round report..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingRound}
                  className="w-full py-3.5 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold uppercase tracking-wider text-xs shadow-sm transition-colors"
                >
                  {isSavingRound ? 'Saving Round...' : 'Save & Publish Round'}
                </button>
              </form>
            </div>

            {/* Quick Status View */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#202421] mb-3">
                  Quick Tournament Status Switcher
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
                  {tournaments.map((t) => (
                    <div key={t.id} className="p-3 rounded-lg bg-[#ECEAE4] border border-[#D9D6CC] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#202421] block">{t.name}</span>
                        <span className="text-[#656A65] text-[11px]">{t.player_id.includes('tim') ? 'Tim' : 'Jonathan'} • Status: {t.status}</span>
                      </div>
                      <div className="flex gap-1">
                        {t.status !== 'Current' && (
                          <button
                            onClick={() => updateTournament(t.id, { status: 'Current' })}
                            className="px-2 py-1 bg-[#244437] text-white rounded text-[10px] font-bold uppercase"
                          >
                            Set Live
                          </button>
                        )}
                        {t.status === 'Current' && (
                          <button
                            onClick={() => updateTournament(t.id, { status: 'Completed' })}
                            className="px-2 py-1 bg-[#26364A] text-white rounded text-[10px] font-bold uppercase"
                          >
                            End
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TOURNAMENT SCHEDULE ================= */}
        {activeTab === 'tournament' && (
          <div className="max-w-3xl mx-auto bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-display font-black text-[#202421] mb-6 uppercase tracking-tight">
              Add Tournament to Schedule
            </h2>

            <form onSubmit={handleCreateTournament} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#656A65] font-bold uppercase mb-1">Athlete *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewTourn({ ...newTourn, player_id: 'jonathan' })}
                    className={`p-3 rounded-lg border text-center font-bold uppercase transition-all ${
                      newTourn.player_id === 'jonathan'
                        ? 'bg-[#244437] text-white border-[#244437]'
                        : 'bg-white text-[#656A65] border-[#D9D6CC]'
                    }`}
                  >
                    Jonathan Nielsen
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTourn({ ...newTourn, player_id: 'tim' })}
                    className={`p-3 rounded-lg border text-center font-bold uppercase transition-all ${
                      newTourn.player_id === 'tim'
                        ? 'bg-[#244437] text-white border-[#244437]'
                        : 'bg-white text-[#656A65] border-[#D9D6CC]'
                    }`}
                  >
                    Tim Nielsen
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#656A65] font-bold uppercase mb-1">Tournament Name *</label>
                  <input
                    type="text"
                    required
                    value={newTourn.name}
                    onChange={(e) => setNewTourn({ ...newTourn, name: e.target.value })}
                    placeholder="e.g. CRMC Championship"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                  />
                </div>

                <div>
                  <label className="block text-[#656A65] font-bold uppercase mb-1">Tour *</label>
                  <select
                    value={newTourn.tour}
                    onChange={(e) => setNewTourn({ ...newTourn, tour: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                  >
                    <option value="PGA TOUR Americas">PGA TOUR Americas</option>
                    <option value="Korn Ferry Tour">Korn Ferry Tour</option>
                    <option value="PGA TOUR">PGA TOUR</option>
                    <option value="DP World Tour">DP World Tour</option>
                    <option value="Challenge Tour">Challenge Tour</option>
                    <option value="Nordic Golf League">Nordic Golf League</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#656A65] font-bold uppercase mb-1">Course / Venue *</label>
                  <input
                    type="text"
                    required
                    value={newTourn.course}
                    onChange={(e) => setNewTourn({ ...newTourn, course: e.target.value })}
                    placeholder="Cragun's Resort (Legacy Course)"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                  />
                </div>

                <div>
                  <label className="block text-[#656A65] font-bold uppercase mb-1">City, State / Province</label>
                  <input
                    type="text"
                    value={newTourn.city}
                    onChange={(e) => setNewTourn({ ...newTourn, city: e.target.value })}
                    placeholder="Brainerd, MN"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#656A65] font-bold uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newTourn.start_date}
                    onChange={(e) => setNewTourn({ ...newTourn, start_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                  />
                </div>

                <div>
                  <label className="block text-[#656A65] font-bold uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={newTourn.end_date}
                    onChange={(e) => setNewTourn({ ...newTourn, end_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#656A65] font-bold uppercase mb-1">Leaderboard URL</label>
                <input
                  type="url"
                  value={newTourn.leaderboard_url}
                  onChange={(e) => setNewTourn({ ...newTourn, leaderboard_url: e.target.value })}
                  placeholder="https://www.pgatour.com/americas/leaderboard"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold uppercase tracking-wider text-xs shadow-sm"
              >
                Add Tournament
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 3: UNIFIED PARTNERSHIPS SECTION ================= */}
        {activeTab === 'partnerships' && (
          <div className="space-y-8">
            
            {/* Partnerships Sub-navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#D9D6CC] pb-3 overflow-x-auto">
              {[
                { id: 'donations', label: `Donations (${donations.length})`, icon: Heart },
                { id: 'investments', label: `Investments (${investmentOpportunities.length})`, icon: TrendingUp },
                { id: 'packages', label: `Sponsorship Packages (${sponsorshipPackages.length})`, icon: Briefcase },
                { id: 'sponsors', label: `Current Partners / Logo Wall (${sponsors.length})`, icon: Award },
                { id: 'inquiries', label: `Inquiries (${investorInquiries.length + sponsorInquiries.length})`, icon: FileText },
              ].map((sub) => {
                const Icon = sub.icon;
                const isSubActive = partnershipSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setPartnershipSubTab(sub.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                      isSubActive
                        ? 'bg-[#202421] text-white'
                        : 'bg-[#FAF9F6] text-[#656A65] hover:text-[#202421] border border-[#D9D6CC]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab 1: Donations */}
            {partnershipSubTab === 'donations' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-black text-xl text-[#202421]">
                      Supporter Contributions ({donations.length})
                    </h3>
                    <span className="text-xs font-bold text-[#244437]">
                      Total: {formatCurrency(donations.reduce((sum, d) => sum + (d.amount || 0), 0))}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {donations.map((don) => (
                      <div key={don.id} className="p-4 rounded-lg bg-white border border-[#E2DFD7] flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[#202421]">{don.anonymous ? 'Anonymous' : don.donor_name}</span>
                            <span className="text-[#656A65]">({don.email})</span>
                          </div>
                          {don.message && <p className="italic text-[#656A65] text-[11px] mb-1">"{don.message}"</p>}
                          <div className="text-[10px] text-[#656A65]">
                            {don.supports_both ? 'Both Brothers' : don.player_id?.includes('jonathan') ? 'Jonathan' : 'Tim'} • {don.donation_date} • {don.payment_provider}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-base text-[#244437]">{formatCurrency(don.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-lg text-[#202421] mb-4">Record Direct Donation</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await createDonation(manualDonation);
                      showNotification(`Recorded donation of ${formatCurrency(manualDonation.amount)}!`);
                      setManualDonation({
                        amount: 250,
                        donor_name: '',
                        email: '',
                        supports_both: true,
                        player_id: 'jonathan-nielsen-1',
                        anonymous: false,
                        message: '',
                        payment_provider: 'Direct Check / Wire'
                      });
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Amount ($)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={manualDonation.amount}
                        onChange={(e) => setManualDonation({ ...manualDonation, amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Donor Name</label>
                      <input
                        type="text"
                        required
                        value={manualDonation.donor_name}
                        onChange={(e) => setManualDonation({ ...manualDonation, donor_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={manualDonation.email}
                        onChange={(e) => setManualDonation({ ...manualDonation, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Athlete</label>
                      <select
                        value={manualDonation.supports_both ? 'both' : manualDonation.player_id}
                        onChange={(e) => {
                          if (e.target.value === 'both') {
                            setManualDonation({ ...manualDonation, supports_both: true, player_id: 'jonathan-nielsen-1' });
                          } else {
                            setManualDonation({ ...manualDonation, supports_both: false, player_id: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      >
                        <option value="both">Both Brothers (50/50)</option>
                        <option value="jonathan-nielsen-1">Jonathan Nielsen</option>
                        <option value="tim-nielsen-2">Tim Nielsen</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[#244437] text-white font-bold uppercase text-xs mt-2"
                    >
                      Save Manual Donation
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Investments */}
            {partnershipSubTab === 'investments' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-xl text-[#202421] mb-4">
                    Active Investment Opportunities ({investmentOpportunities.length})
                  </h3>
                  <div className="space-y-4">
                    {investmentOpportunities.map((opp) => (
                      <div key={opp.id} className="p-4 bg-white border border-[#E2DFD7] rounded-lg text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#202421]">{opp.name}</span>
                          <span className="px-2 py-0.5 rounded bg-[#26364A] text-white text-[10px] uppercase font-bold">{opp.season}</span>
                        </div>
                        <p className="text-[#656A65]">{opp.investment_summary}</p>
                        <div className="flex justify-between text-[11px] pt-2 border-t border-[#E2DFD7]">
                          <span>Goal: <strong>{formatCurrency(opp.funding_goal)}</strong></span>
                          <span>Raised: <strong>{formatCurrency(opp.amount_raised || 0)}</strong></span>
                          <span>Min: <strong>{formatCurrency(opp.minimum_investment)}</strong></span>
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            onClick={() => deleteInvestmentOpportunity(opp.id)}
                            className="text-rose-600 hover:underline text-[11px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-lg text-[#202421] mb-4">Create Investment Offering</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await createInvestmentOpportunity(newInvestment);
                      showNotification(`Created investment offering "${newInvestment.name}"!`);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Opportunity Title</label>
                      <input
                        type="text"
                        required
                        value={newInvestment.name}
                        onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#656A65] font-bold uppercase mb-1">Funding Goal ($)</label>
                        <input
                          type="number"
                          required
                          value={newInvestment.funding_goal}
                          onChange={(e) => setNewInvestment({ ...newInvestment, funding_goal: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#656A65] font-bold uppercase mb-1">Min Investment ($)</label>
                        <input
                          type="number"
                          required
                          value={newInvestment.minimum_investment}
                          onChange={(e) => setNewInvestment({ ...newInvestment, minimum_investment: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Agreement Terms &amp; Percentages</label>
                      <input
                        type="text"
                        value={newInvestment.earnings_share_description}
                        onChange={(e) => setNewInvestment({ ...newInvestment, earnings_share_description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[#26364A] text-white font-bold uppercase text-xs mt-2"
                    >
                      Publish Investment Offering
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Sponsorship Packages */}
            {partnershipSubTab === 'packages' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-xl text-[#202421] mb-4">
                    Sponsorship Packages ({sponsorshipPackages.length})
                  </h3>
                  <div className="space-y-4">
                    {sponsorshipPackages.map((pkg) => (
                      <div key={pkg.id} className="p-4 bg-white border border-[#E2DFD7] rounded-lg text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#202421]">{pkg.name}</span>
                          <span className="font-bold text-[#244437]">{pkg.price}</span>
                        </div>
                        <p className="text-[#656A65]">{pkg.description}</p>
                        <div className="text-[11px] text-[#656A65]">
                          Tier: <strong>{pkg.tier}</strong> • Golf Days: <strong>{pkg.corporate_golf_days || 0}</strong> • Exclusivity: <strong>{pkg.exclusivity || 'None'}</strong>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => deleteSponsorshipPackage(pkg.id)}
                            className="text-rose-600 hover:underline text-[11px] font-bold"
                          >
                            Delete Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-lg text-[#202421] mb-4">Create Sponsorship Tier</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await createSponsorshipPackage({
                        ...newPackage,
                        logo_placements: newPackage.logo_placements.split(',').map(s => s.trim())
                      });
                      showNotification(`Created sponsorship tier "${newPackage.name}"!`);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Package Title</label>
                      <input
                        type="text"
                        required
                        value={newPackage.name}
                        onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#656A65] font-bold uppercase mb-1">Tier Badge</label>
                        <input
                          type="text"
                          required
                          value={newPackage.tier}
                          onChange={(e) => setNewPackage({ ...newPackage, tier: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#656A65] font-bold uppercase mb-1">Price Tag</label>
                        <input
                          type="text"
                          required
                          value={newPackage.price}
                          onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newPackage.description}
                        onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[#244437] text-white font-bold uppercase text-xs mt-2"
                    >
                      Save Sponsorship Package
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Sponsors & Logo Wall */}
            {partnershipSubTab === 'sponsors' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-xl text-[#202421] mb-4">
                    Current Partner Logos ({sponsors.length})
                  </h3>
                  <div className="space-y-3">
                    {sponsors.map((s) => (
                      <div key={s.id} className="p-4 rounded-lg bg-white border border-[#E2DFD7] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img src={s.logo} alt={s.company_name} className="h-8 max-w-16 object-contain" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold text-sm text-[#202421] block">{s.company_name}</span>
                            <span className="text-[#656A65] text-[11px]">{s.tier} • {s.category}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteSponsor(s.id)}
                          className="text-rose-600 hover:underline text-[11px] font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-lg text-[#202421] mb-4">Add Partner to Logo Wall</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await addSponsor(newSponsor);
                      showNotification(`Added sponsor "${newSponsor.company_name}"!`);
                      setNewSponsor({
                        company_name: '',
                        tier: 'Supporting Partner',
                        category: 'Corporate',
                        website: '',
                        description: '',
                        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
                        sponsored_players: 'both'
                      });
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Company Name</label>
                      <input
                        type="text"
                        required
                        value={newSponsor.company_name}
                        onChange={(e) => setNewSponsor({ ...newSponsor, company_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Tier</label>
                      <select
                        value={newSponsor.tier}
                        onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      >
                        <option value="Title Partner">Title Partner</option>
                        <option value="Major Sponsor">Major Sponsor</option>
                        <option value="Equipment Partner">Equipment Partner</option>
                        <option value="Apparel Partner">Apparel Partner</option>
                        <option value="Supporting Partner">Supporting Partner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Logo Image URL</label>
                      <input
                        type="url"
                        value={newSponsor.logo}
                        onChange={(e) => setNewSponsor({ ...newSponsor, logo: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#656A65] font-bold uppercase mb-1">Website URL</label>
                      <input
                        type="url"
                        value={newSponsor.website}
                        onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9D6CC] rounded-lg text-[#202421]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[#244437] text-white font-bold uppercase text-xs mt-2"
                    >
                      Add Partner to Wall
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-tab 5: Inquiries */}
            {partnershipSubTab === 'inquiries' && (
              <div className="space-y-6">
                
                {/* Investor Inquiries Table */}
                <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-lg text-[#202421] mb-4">
                    Investor Prospectus Requests ({investorInquiries.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#D9D6CC] text-[#656A65] font-bold uppercase">
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Range</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2DFD7]">
                        {investorInquiries.map((inv) => (
                          <tr key={inv.id}>
                            <td className="py-3 px-3 font-bold text-[#202421]">{inv.name}</td>
                            <td className="py-3 px-3 text-[#656A65]">{inv.email} {inv.phone ? `• ${inv.phone}` : ''}</td>
                            <td className="py-3 px-3 font-semibold text-[#26364A]">{inv.investment_interest}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-[#ECEAE4] text-[10px] font-bold uppercase text-[#202421]">
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={inv.status}
                                onChange={(e) => updateInvestorInquiryStatus(inv.id, e.target.value)}
                                className="px-2 py-1 bg-white border border-[#D9D6CC] rounded text-[11px]"
                              >
                                <option value="New">New</option>
                                <option value="Prospectus Sent">Prospectus Sent</option>
                                <option value="In Discussion">In Discussion</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sponsor Inquiries Table */}
                <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-black text-lg text-[#202421] mb-4">
                    Corporate Sponsorship Inquiries ({sponsorInquiries.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#D9D6CC] text-[#656A65] font-bold uppercase">
                          <th className="py-2.5 px-3">Contact &amp; Company</th>
                          <th className="py-2.5 px-3">Email / Phone</th>
                          <th className="py-2.5 px-3">Budget</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2DFD7]">
                        {sponsorInquiries.map((sp) => (
                          <tr key={sp.id}>
                            <td className="py-3 px-3 font-bold text-[#202421]">{sp.name} ({sp.company})</td>
                            <td className="py-3 px-3 text-[#656A65]">{sp.email}</td>
                            <td className="py-3 px-3 font-semibold text-[#244437]">{sp.budget_range}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-[#ECEAE4] text-[10px] font-bold uppercase text-[#202421]">
                                {sp.status}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={sp.status}
                                onChange={(e) => updateSponsorInquiryStatus(sp.id, e.target.value)}
                                className="px-2 py-1 bg-white border border-[#D9D6CC] rounded text-[11px]"
                              >
                                <option value="New">New</option>
                                <option value="Deck Sent">Deck Sent</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Partner Signed">Partner Signed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= TAB 4: SCORING PROVIDER SYNC ================= */}
        {activeTab === 'sync' && (
          <div className="max-w-3xl mx-auto bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-8 shadow-sm text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#ECEAE4] border border-[#D9D6CC] text-[#244437] mx-auto flex items-center justify-center">
              <RefreshCw className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-2xl font-display font-black text-[#202421] uppercase tracking-tight">
                Scoring Provider Feed Ingestion
              </h3>
              <p className="text-xs text-[#656A65] max-w-md mx-auto mt-2">
                Pulls real-time tournament scores, round logs, and standings from official developmental tour feeds for both Jonathan and Tim Nielsen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white border border-[#E2DFD7] text-xs space-y-2">
                <span className="text-emerald-700 font-mono text-[10px] font-bold">ONLINE</span>
                <p className="text-[#202421] font-bold font-display text-sm">Jonathan Nielsen (Americas)</p>
                <p className="text-[#656A65] text-[11px]">Syncs PGA TOUR Americas official scorecard provider.</p>
                <button
                  onClick={() => {
                    const t = tournaments.find(x => x.player_id.includes('jonathan') && (x.status === 'Current' || x.status === 'Completed'));
                    if (t) handleSyncProvider(t.id);
                  }}
                  className="w-full py-2 bg-[#244437] hover:bg-[#1b342a] text-white rounded font-bold text-[11px] uppercase tracking-wider mt-2"
                >
                  Sync Jonathan's Feed
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E2DFD7] text-xs space-y-2">
                <span className="text-emerald-700 font-mono text-[10px] font-bold">ONLINE</span>
                <p className="text-[#202421] font-bold font-display text-sm">Tim Nielsen (Americas / KFT)</p>
                <p className="text-[#656A65] text-[11px]">Syncs developmental tour live scoring data.</p>
                <button
                  onClick={() => {
                    const t = tournaments.find(x => x.player_id.includes('tim') && (x.status === 'Current' || x.status === 'Completed'));
                    if (t) handleSyncProvider(t.id);
                  }}
                  className="w-full py-2 bg-[#26364A] hover:bg-[#1d2a3a] text-white rounded font-bold text-[11px] uppercase tracking-wider mt-2"
                >
                  Sync Tim's Feed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: FAN SUBSCRIBERS ================= */}
        {activeTab === 'followers' && (
          <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-display font-black text-[#202421] uppercase tracking-tight mb-4">
              Follower Subscribers ({followers.length})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-[#E2DFD7]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#ECEAE4] border-b border-[#D9D6CC] text-[#656A65] uppercase font-bold">
                    <th className="p-3">Subscriber Email</th>
                    <th className="p-3">First Name</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DFD7] bg-white text-[#202421]">
                  {followers.map((f) => (
                    <tr key={f.id}>
                      <td className="p-3 font-semibold text-[#202421]">{f.email}</td>
                      <td className="p-3">{f.first_name || 'Supporter'}</td>
                      <td className="p-3 text-[#656A65]">{new Date(f.created_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
