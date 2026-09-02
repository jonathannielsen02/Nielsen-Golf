import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  initialPlayers,
  initialTournaments,
  initialSponsors,
  initialSponsorshipPackages,
  initialCareerHighlights,
  initialCareerTimeline,
  initialFollowers,
  initialDonations,
  initialInvestmentOpportunities,
  initialInvestorInquiries,
  initialSponsorInquiries
} from './src/data/seedData';
import { Tournament, Round, Sponsor, Follower, Player, Donation, InvestmentOpportunity, InvestorInquiry, SponsorInquiry, SponsorshipPackage } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server-side in-memory data store for both players
let players: Player[] = JSON.parse(JSON.stringify(initialPlayers));
let tournaments: Tournament[] = JSON.parse(JSON.stringify(initialTournaments));
let sponsors: Sponsor[] = JSON.parse(JSON.stringify(initialSponsors));
let sponsorshipPackages: SponsorshipPackage[] = JSON.parse(JSON.stringify(initialSponsorshipPackages));
let careerHighlights = JSON.parse(JSON.stringify(initialCareerHighlights));
let careerTimeline = JSON.parse(JSON.stringify(initialCareerTimeline));
let followers: Follower[] = JSON.parse(JSON.stringify(initialFollowers));
let donations: Donation[] = JSON.parse(JSON.stringify(initialDonations));
let investmentOpportunities: InvestmentOpportunity[] = JSON.parse(JSON.stringify(initialInvestmentOpportunities));
let investorInquiries: InvestorInquiry[] = JSON.parse(JSON.stringify(initialInvestorInquiries));
let sponsorInquiries: SponsorInquiry[] = JSON.parse(JSON.stringify(initialSponsorInquiries));
let contactInquiries: any[] = [];

// Lazy / Safe Gemini AI initialization
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set in environment.');
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Fallback deterministic recap builder if API key is missing
function generateDeterministicRoundRecap(data: any): string {
  const {
    playerName = 'Jonathan',
    roundNumber = 1,
    score = 68,
    scoreToPar = -4,
    birdies = 5,
    bogeys = 1,
    eagles = 0,
    endingPosition = 'T12'
  } = data;

  const toParText = typeof scoreToPar === 'number'
    ? (scoreToPar < 0 ? `${Math.abs(scoreToPar)}-under` : scoreToPar === 0 ? 'even-par' : `${scoreToPar}-over`)
    : scoreToPar;

  let eagleText = eagles > 0 ? `, highlighted by ${eagles === 1 ? 'an eagle' : `${eagles} eagles`},` : '';
  let bogeysText = bogeys === 1 ? 'one bogey' : `${bogeys} bogeys`;
  let birdiesText = birdies === 1 ? 'one birdie' : `${birdies} birdies`;

  return `${playerName} posted a ${toParText} ${score} in Round ${roundNumber}, carding ${birdiesText}${eagleText} against ${bogeysText}. Following the round, he moved to ${endingPosition} on the tournament leaderboard.`;
}

function generateDeterministicTournamentRecap(t: Tournament, playerName: string = 'Jonathan Nielsen'): string {
  const rounds = t.rounds || [];
  const completedRounds = rounds.filter(r => r.round_status === 'Completed');
  const scoresStr = completedRounds.map(r => r.score).join('-');
  const finish = t.final_finish || 'completed play';
  const scoreToPar = t.final_score_to_par || 'even';

  return `${playerName} completed the ${t.name} with a final finish of ${finish} at ${scoreToPar} par. Over ${completedRounds.length} tournament rounds (${scoresStr}), he maintained consistent scoring to secure a top standing in the ${t.tour} event.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ================= API ROUTES =================

  // Players Profile Endpoints
  app.get('/api/players', (req, res) => {
    res.json(players);
  });

  app.get('/api/players/:slug', (req, res) => {
    const slug = req.params.slug;
    const player = players.find(p => p.slug === slug || p.id === slug) || players[0];
    const pHighlights = careerHighlights.filter(h => h.player_id === player.id);
    const pTimeline = careerTimeline.filter(t => t.player_id === player.id);
    res.json({ player, careerHighlights: pHighlights, careerTimeline: pTimeline });
  });

  app.put('/api/players/:slug', (req, res) => {
    const slug = req.params.slug;
    const idx = players.findIndex(p => p.slug === slug || p.id === slug);
    if (idx === -1) {
      return res.status(404).json({ error: 'Player not found' });
    }
    players[idx] = { ...players[idx], ...req.body };
    res.json({ success: true, player: players[idx] });
  });

  // Tournaments
  app.get('/api/tournaments', (req, res) => {
    const { status, tour, year, player_id } = req.query;
    let list = [...tournaments];

    if (player_id) {
      list = list.filter(t => t.player_id === player_id || (player_id === 'jonathan' && t.player_id.includes('jonathan')) || (player_id === 'tim' && t.player_id.includes('tim')));
    }
    if (status) {
      list = list.filter(t => t.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (tour) {
      list = list.filter(t => t.tour.toLowerCase().includes((tour as string).toLowerCase()));
    }
    if (year) {
      list = list.filter(t => t.start_date.startsWith(year as string));
    }

    res.json(list);
  });

  app.get('/api/tournaments/:slug', (req, res) => {
    const tournament = tournaments.find(t => t.slug === req.params.slug || t.id === req.params.slug);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(tournament);
  });

  app.post('/api/tournaments', (req, res) => {
    const playerId = req.body.player_id || players[0].id;
    const targetPlayer = players.find(p => p.id === playerId) || players[0];
    const prefix = targetPlayer.slug;

    const newTournament: Tournament = {
      id: `tourn-${Date.now()}`,
      player_id: playerId,
      slug: req.body.slug || `${prefix}-${req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${new Date().getFullYear()}`,
      name: req.body.name,
      tour: req.body.tour || 'PGA TOUR Americas',
      course: req.body.course,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country || 'USA',
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status || 'Upcoming',
      tournament_type: req.body.tournament_type || 'Confirmed',
      leaderboard_url: req.body.leaderboard_url || 'https://www.pgatour.com/americas/leaderboard',
      field_size: Number(req.body.field_size) || 156,
      final_finish: req.body.final_finish,
      final_score_to_par: req.body.final_score_to_par,
      earnings: req.body.earnings ? Number(req.body.earnings) : undefined,
      purse: req.body.purse ? Number(req.body.purse) : undefined,
      course_par: req.body.course_par ? Number(req.body.course_par) : 72,
      course_yardage: req.body.course_yardage ? Number(req.body.course_yardage) : undefined,
      rounds: req.body.rounds || []
    };

    // If status is Current for this player, update other tournaments for THIS PLAYER ONLY
    if (newTournament.status === 'Current') {
      tournaments.forEach(t => {
        if (t.player_id === playerId && t.status === 'Current') {
          t.status = 'Completed';
        }
      });
    }

    tournaments.unshift(newTournament);
    res.status(201).json(newTournament);
  });

  app.put('/api/tournaments/:id', (req, res) => {
    const idx = tournaments.findIndex(t => t.id === req.params.id || t.slug === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const updated = { ...tournaments[idx], ...req.body };

    // If setting to Current, demote other Current tournaments for THIS PLAYER ONLY
    if (req.body.status === 'Current') {
      tournaments.forEach(t => {
        if (t.player_id === updated.player_id && t.id !== updated.id && t.status === 'Current') {
          t.status = 'Completed';
        }
      });
    }

    tournaments[idx] = updated;
    res.json(updated);
  });

  // Rounds Management
  app.post('/api/rounds', async (req, res) => {
    const { tournament_id, round_number, score, score_to_par, ending_position, birdies, bogeys, eagles, double_bogeys, fairways, greens, putts, round_status, scorecard, auto_generate_recap } = req.body;

    const tIdx = tournaments.findIndex(t => t.id === tournament_id || t.slug === tournament_id);
    if (tIdx === -1) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const tournament = tournaments[tIdx];
    const player = players.find(p => p.id === tournament.player_id) || players[0];

    if (!tournament.rounds) {
      tournament.rounds = [];
    }

    let recap = req.body.recap;
    if (auto_generate_recap && !recap) {
      try {
        const ai = getGeminiClient();
        if (ai) {
          const prompt = `You are an expert professional sports journalist for professional golfer ${player.display_name}.
Generate a concise, strictly factual round recap (40-80 words) based EXCLUSIVELY on the following structured golf scoring data:

Player: ${player.display_name}
Tournament: ${tournament.name} (${tournament.tour})
Round: ${round_number}
Score: ${score}
Score to Par: ${scoreToParFormat(score_to_par)}
Position After Round: ${ending_position}
Birdies: ${birdies}
Bogeys: ${bogeys}
Eagles: ${eagles || 0}
Double Bogeys: ${double_bogeys || 0}
Fairways: ${fairways ? `${fairways}/14` : 'N/A'}
Greens in Regulation: ${greens ? `${greens}/18` : 'N/A'}
Putts: ${putts || 'N/A'}

STRICT RULES:
1. Only make statements supported by the structured scoring data. Use the player's name (${player.first_name}) accurately.
2. Do NOT speculate or invent information about driving distance, ball striking, wind, weather, putting feel, momentum, shot quality, emotions, or pressure.
3. Keep the tone professional, polished, factual, sports journalism style.`;

          const aiResp = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
          });
          recap = aiResp.text?.trim() || generateDeterministicRoundRecap({ ...req.body, playerName: player.first_name });
        } else {
          recap = generateDeterministicRoundRecap({ ...req.body, playerName: player.first_name });
        }
      } catch (err) {
        console.error('Error generating AI recap:', err);
        recap = generateDeterministicRoundRecap({ ...req.body, playerName: player.first_name });
      }
    }

    const newRound: Round = {
      id: `round-${Date.now()}`,
      player_id: player.id,
      tournament_id: tournament.id,
      round_number: Number(round_number),
      score: Number(score),
      score_to_par: score_to_par,
      ending_position: ending_position || 'T12',
      birdies: Number(birdies) || 0,
      bogeys: Number(bogeys) || 0,
      eagles: Number(eagles) || 0,
      double_bogeys: Number(double_bogeys) || 0,
      fairways: fairways ? Number(fairways) : undefined,
      greens: greens ? Number(greens) : undefined,
      putts: putts ? Number(putts) : undefined,
      recap: recap || '',
      round_status: round_status || 'Completed',
      scorecard: scorecard || []
    };

    const existingRIdx = tournament.rounds.findIndex(r => r.round_number === newRound.round_number);
    if (existingRIdx !== -1) {
      tournament.rounds[existingRIdx] = newRound;
    } else {
      tournament.rounds.push(newRound);
    }

    tournament.rounds.sort((a, b) => a.round_number - b.round_number);
    tournament.final_finish = newRound.ending_position;
    const totalToPar = tournament.rounds.reduce((acc, curr) => acc + (typeof curr.score_to_par === 'number' ? curr.score_to_par : parseInt(curr.score_to_par) || 0), 0);
    tournament.final_score_to_par = totalToPar === 0 ? 'E' : (totalToPar > 0 ? `+${totalToPar}` : `${totalToPar}`);

    tournaments[tIdx] = tournament;
    res.status(201).json({ round: newRound, tournament });
  });

  // Dedicated AI Round Recap Generator Endpoint
  app.post('/api/ai/generate-recap', async (req, res) => {
    try {
      const {
        playerName = 'Jonathan Nielsen',
        tournamentName = 'ATB Classic',
        tour = 'PGA TOUR Americas',
        roundNumber = 1,
        score = 67,
        scoreToPar = -5,
        startingPosition,
        endingPosition = 'T12',
        birdies = 6,
        bogeys = 1,
        eagles = 0,
        doubleBogeys = 0,
        holeScores
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        const fallback = generateDeterministicRoundRecap({
          playerName: playerName.split(' ')[0],
          roundNumber,
          score,
          scoreToPar,
          birdies,
          bogeys,
          eagles,
          endingPosition
        });
        return res.json({ recap: fallback });
      }

      let holeDetails = '';
      if (holeScores && Array.isArray(holeScores)) {
        holeDetails = `Hole-by-hole: ${holeScores.map((h: any) => `Hole ${h.hole_number} (Par ${h.par}): ${h.score}`).join(', ')}`;
      }

      const prompt = `You are a sports journalist crafting a factual round summary for professional golfer ${playerName}.
Write a 45-80 word professional sports recap based ONLY on these facts:

- Golfer: ${playerName}
- Tournament: ${tournamentName} (${tour})
- Round: ${roundNumber}
- Score: ${score} (${scoreToParFormat(scoreToPar)})
- Leaderboard Position: ${endingPosition} ${startingPosition ? `(started round at ${startingPosition})` : ''}
- Scoring Details: ${birdies} birdies, ${bogeys} bogeys, ${eagles} eagles, ${doubleBogeys} double bogeys
${holeDetails}

MANDATORY RULES:
1. Strictly factual. Do not mention ball striking, wind, weather, crowd, putting strokes, or emotions unless stated above.
2. Use professional golf terminology (e.g. "5-under 67", "carded six birdies against one bogey", "moved into a tie for 12th").
3. Concise, single paragraph. Use the correct first name (${playerName.split(' ')[0]}).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const recap = response.text?.trim() || generateDeterministicRoundRecap({ ...req.body, playerName: playerName.split(' ')[0] });
      res.json({ recap });
    } catch (err: any) {
      console.error('Gemini API recap generation failed:', err);
      const fallback = generateDeterministicRoundRecap(req.body);
      res.json({ recap: fallback });
    }
  });

  // Dedicated AI Tournament Recap Generator
  app.post('/api/ai/generate-tournament-recap', async (req, res) => {
    try {
      const { tournamentId } = req.body;
      const tournament = tournaments.find(t => t.id === tournamentId || t.slug === tournamentId);
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      const player = players.find(p => p.id === tournament.player_id) || players[0];

      const ai = getGeminiClient();
      if (!ai) {
        const recap = generateDeterministicTournamentRecap(tournament, player.display_name);
        tournament.tournament_recap = recap;
        return res.json({ recap });
      }

      const completedRounds = (tournament.rounds || []).filter(r => r.round_status === 'Completed');
      const roundDetails = completedRounds.map(r => `Round ${r.round_number}: ${r.score} (${scoreToParFormat(r.score_to_par)}), ${r.birdies} birdies, ${r.bogeys} bogeys, Pos: ${r.ending_position}`).join('\n');

      const prompt = `Write a factual 60-100 word tournament recap for professional golfer ${player.display_name} at the ${tournament.name} (${tournament.tour}) at ${tournament.course} in ${tournament.city}, ${tournament.state}.

Facts:
- Final Finish: ${tournament.final_finish || 'Completed'}
- Final Score to Par: ${tournament.final_score_to_par}
- Earnings: ${tournament.earnings ? `$${tournament.earnings}` : 'N/A'}
- Rounds Played:
${roundDetails}

RULES:
- Be strictly factual based only on the scores and stats provided.
- Do NOT invent conditions or psychological narratives.
- Mention best round, total birdies, and final result.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const recap = response.text?.trim() || generateDeterministicTournamentRecap(tournament, player.display_name);
      tournament.tournament_recap = recap;
      res.json({ recap });
    } catch (err: any) {
      console.error('Gemini API tournament recap error:', err);
      res.status(500).json({ error: 'Failed to generate recap' });
    }
  });

  // Scoring Provider Abstraction & Live Sync Simulator
  app.post('/api/scoring-provider/sync', async (req, res) => {
    const { tournament_id, provider = 'Official Tour Live Scoring' } = req.body;
    const tIdx = tournaments.findIndex(t => t.id === tournament_id || t.slug === tournament_id);
    if (tIdx === -1) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const t = tournaments[tIdx];
    const player = players.find(p => p.id === t.player_id) || players[0];
    const currentRoundCount = t.rounds?.length || 0;
    const nextRoundNum = currentRoundCount + 1;

    if (nextRoundNum <= 4) {
      const simulatedScores = player.slug === 'jonathan' ? [67, 68, 66, 69] : [70, 68, 67, 68];
      const simScore = simulatedScores[nextRoundNum - 1] || 68;
      const par = t.course_par || 72;
      const simToPar = simScore - par;
      const simBirdies = simScore < par ? 5 : 3;
      const simBogeys = 1;

      const pars = [4, 4, 3, 5, 4, 3, 4, 4, 5, 4, 3, 4, 5, 4, 4, 3, 5, 4];
      const scorecard = pars.map((p, idx) => {
        let sc = p;
        if (idx === 3 || idx === 14 || idx === 17) sc = p - 1;
        if (idx === 7) sc = p + 1;
        return {
          hole_number: idx + 1,
          par: p,
          score: sc,
          score_to_par: sc - p
        };
      });

      const newRound: Round = {
        id: `round-sync-${Date.now()}`,
        player_id: player.id,
        tournament_id: t.id,
        round_number: nextRoundNum,
        score: simScore,
        score_to_par: simToPar,
        ending_position: `T${Math.max(4, 12 - nextRoundNum * 2)}`,
        birdies: simBirdies,
        bogeys: simBogeys,
        eagles: 0,
        double_bogeys: 0,
        fairways: 11,
        greens: 14,
        putts: 28,
        round_status: 'Completed',
        recap: generateDeterministicRoundRecap({
          playerName: player.first_name,
          roundNumber: nextRoundNum,
          score: simScore,
          scoreToPar: simToPar,
          birdies: simBirdies,
          bogeys: simBogeys,
          endingPosition: `T${Math.max(4, 12 - nextRoundNum * 2)}`
        }),
        scorecard
      };

      if (!t.rounds) t.rounds = [];
      t.rounds.push(newRound);
      t.final_finish = newRound.ending_position;

      const totalToPar = t.rounds.reduce((acc, r) => acc + (typeof r.score_to_par === 'number' ? r.score_to_par : parseInt(r.score_to_par) || 0), 0);
      t.final_score_to_par = totalToPar === 0 ? 'E' : (totalToPar > 0 ? `+${totalToPar}` : `${totalToPar}`);

      if (nextRoundNum === 4) {
        t.status = 'Completed';
        t.earnings = player.slug === 'jonathan' ? 12500 : 9200;
        t.tournament_recap = generateDeterministicTournamentRecap(t, player.display_name);
      }

      tournaments[tIdx] = t;
      res.json({
        success: true,
        message: `Successfully synced Round ${nextRoundNum} for ${player.display_name} from ${provider}`,
        tournament: t
      });
    } else {
      res.json({
        success: true,
        message: `All 4 rounds are already complete for ${t.name}`,
        tournament: t
      });
    }
  });

  // ================= PARTNERSHIP SYSTEM ENDPOINTS =================

  // Donations
  app.get('/api/donations', (req, res) => {
    res.json(donations);
  });

  app.post('/api/donations', (req, res) => {
    const { donor_name, email, amount, player_id, supports_both = true, payment_provider = 'Stripe', public_recognition = true, anonymous = false, message } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid donation amount is required' });
    }
    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      donor_name: anonymous ? 'Anonymous Supporter' : (donor_name || 'Supporter'),
      email: email || 'donor@example.com',
      amount: Number(amount),
      player_id: supports_both ? undefined : player_id,
      supports_both: Boolean(supports_both),
      payment_provider,
      payment_status: 'Completed',
      donation_date: new Date().toISOString().split('T')[0],
      public_recognition: Boolean(public_recognition),
      anonymous: Boolean(anonymous),
      message: message || ''
    };
    donations.unshift(newDonation);
    res.status(201).json({ success: true, message: 'Thank you for supporting Nielsen Golf!', donation: newDonation });
  });

  // Investments
  app.get('/api/investments', (req, res) => {
    res.json(investmentOpportunities);
  });

  app.post('/api/investments', (req, res) => {
    const newOpp: InvestmentOpportunity = {
      id: `inv-${Date.now()}`,
      name: req.body.name || 'New Season Funding Program',
      season: req.body.season || '2027 Season',
      player_id: req.body.player_id,
      applies_to_both_players: req.body.applies_to_both_players ?? true,
      funding_goal: Number(req.body.funding_goal) || 50000,
      amount_raised: Number(req.body.amount_raised) || 0,
      minimum_investment: Number(req.body.minimum_investment) || 5000,
      earnings_share_description: req.body.earnings_share_description || '',
      maximum_return_description: req.body.maximum_return_description || '',
      term_description: req.body.term_description || '',
      investment_summary: req.body.investment_summary || '',
      risk_disclosure: req.body.risk_disclosure || '',
      active: req.body.active ?? true
    };
    investmentOpportunities.push(newOpp);
    res.status(201).json(newOpp);
  });

  app.put('/api/investments/:id', (req, res) => {
    const idx = investmentOpportunities.findIndex(o => o.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Investment opportunity not found' });
    investmentOpportunities[idx] = { ...investmentOpportunities[idx], ...req.body };
    res.json(investmentOpportunities[idx]);
  });

  // Investor Inquiries
  app.get('/api/investor-inquiries', (req, res) => {
    res.json(investorInquiries);
  });

  app.post('/api/investor-inquiries', (req, res) => {
    const { name, email, phone, investment_interest, player_preference = 'both', accredited_investor = false, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const newInquiry: InvestorInquiry = {
      id: `inq-inv-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      investment_interest: investment_interest || '$5,000 - $10,000',
      player_preference,
      accredited_investor: Boolean(accredited_investor),
      message: message || '',
      created_at: new Date().toISOString(),
      status: 'New'
    };
    investorInquiries.unshift(newInquiry);
    res.status(201).json({ success: true, message: 'Investment inquiry received. The Nielsen Golf management team will be in touch shortly.', inquiry: newInquiry });
  });

  app.put('/api/investor-inquiries/:id', (req, res) => {
    const idx = investorInquiries.findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });
    investorInquiries[idx] = { ...investorInquiries[idx], ...req.body };
    res.json(investorInquiries[idx]);
  });

  // Sponsors
  app.get('/api/sponsors', (req, res) => {
    // Sort by display order
    const sorted = [...sponsors].sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
    res.json(sorted);
  });

  app.post('/api/sponsors', (req, res) => {
    const newSponsor: Sponsor = {
      id: `sponsor-${Date.now()}`,
      company_name: req.body.company_name,
      logo: req.body.logo || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
      website: req.body.website || 'https://example.com',
      tier: req.body.tier || 'Supporting Partner',
      category: req.body.category || 'Corporate Partner',
      description: req.body.description || '',
      featured: Boolean(req.body.featured),
      active: req.body.active ?? true,
      sponsored_players: req.body.sponsored_players || 'both',
      supports_jonathan: req.body.supports_jonathan ?? (req.body.sponsored_players === 'jonathan' || req.body.sponsored_players === 'both'),
      supports_tim: req.body.supports_tim ?? (req.body.sponsored_players === 'tim' || req.body.sponsored_players === 'both'),
      supports_both: req.body.supports_both ?? (req.body.sponsored_players === 'both'),
      display_order: Number(req.body.display_order) || sponsors.length + 1
    };
    sponsors.push(newSponsor);
    res.status(201).json(newSponsor);
  });

  app.put('/api/sponsors/:id', (req, res) => {
    const idx = sponsors.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Sponsor not found' });
    sponsors[idx] = { ...sponsors[idx], ...req.body };
    res.json(sponsors[idx]);
  });

  app.delete('/api/sponsors/:id', (req, res) => {
    sponsors = sponsors.filter(s => s.id !== req.params.id);
    res.json({ success: true, message: 'Sponsor removed' });
  });

  // Sponsorship Packages
  app.get('/api/sponsorship-packages', (req, res) => {
    res.json(sponsorshipPackages);
  });

  app.post('/api/sponsorship-packages', (req, res) => {
    const newPkg: SponsorshipPackage = {
      id: `pkg-${Date.now()}`,
      name: req.body.name || 'New Sponsorship Package',
      tier: req.body.tier || 'Official Partner',
      player_id: req.body.player_id,
      applies_to_both_players: req.body.applies_to_both_players ?? true,
      price: req.body.price || 'Contact for Proposal',
      billing_frequency: req.body.billing_frequency || 'Annual / Season',
      logo_placements: req.body.logo_placements || [],
      corporate_golf_days: req.body.corporate_golf_days || '1 Day',
      appearance_days: req.body.appearance_days || '1 Day',
      website_benefits: req.body.website_benefits || [],
      social_benefits: req.body.social_benefits || [],
      digital_benefits: req.body.digital_benefits || [],
      exclusivity: req.body.exclusivity || 'Non-exclusive',
      description: req.body.description || '',
      additional_benefits: req.body.additional_benefits || [],
      applies_to: req.body.applies_to || 'both',
      active: req.body.active ?? true
    };
    sponsorshipPackages.push(newPkg);
    res.status(201).json(newPkg);
  });

  app.put('/api/sponsorship-packages/:id', (req, res) => {
    const idx = sponsorshipPackages.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Package not found' });
    sponsorshipPackages[idx] = { ...sponsorshipPackages[idx], ...req.body };
    res.json(sponsorshipPackages[idx]);
  });

  // Sponsor Inquiries
  app.get('/api/sponsor-inquiries', (req, res) => {
    res.json(sponsorInquiries);
  });

  app.post('/api/sponsor-inquiries', (req, res) => {
    const { name, company, email, phone, player_preference = 'both', budget_range, areas_of_interest = [], message } = req.body;
    if (!name || !company || !email) {
      return res.status(400).json({ error: 'Name, company, and email are required' });
    }
    const newInquiry: SponsorInquiry = {
      id: `inq-sp-${Date.now()}`,
      name,
      company,
      email,
      phone: phone || '',
      player_preference,
      budget_range: budget_range || 'Flexible',
      areas_of_interest: Array.isArray(areas_of_interest) ? areas_of_interest : [areas_of_interest],
      message: message || '',
      created_at: new Date().toISOString(),
      status: 'New'
    };
    sponsorInquiries.unshift(newInquiry);
    res.status(201).json({ success: true, message: 'Sponsorship inquiry received. We look forward to connecting!', inquiry: newInquiry });
  });

  app.put('/api/sponsor-inquiries/:id', (req, res) => {
    const idx = sponsorInquiries.findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });
    sponsorInquiries[idx] = { ...sponsorInquiries[idx], ...req.body };
    res.json(sponsorInquiries[idx]);
  });

  // Followers & Newsletter
  app.get('/api/followers', (req, res) => {
    res.json(followers);
  });

  app.post('/api/followers', (req, res) => {
    const { email, first_name, follow_preference = 'both' } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const existing = followers.find(f => f.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.follow_preference = follow_preference;
      if (first_name) existing.first_name_optional = first_name;
      return res.json({ message: 'Subscription preferences updated for Nielsen Golf!', follower: existing });
    }

    const newFollower: Follower = {
      id: `fol-${Date.now()}`,
      email,
      first_name_optional: first_name,
      follow_preference,
      signup_date: new Date().toISOString().split('T')[0],
      active: true
    };

    followers.push(newFollower);
    res.status(201).json({ message: 'Successfully subscribed to Nielsen Golf updates', follower: newFollower });
  });

  // Contact Inquiries
  app.post('/api/contact', (req, res) => {
    const inquiry = {
      id: `inq-${Date.now()}`,
      ...req.body,
      received_at: new Date().toISOString()
    };
    contactInquiries.push(inquiry);
    res.status(201).json({ success: true, message: 'Your message has been delivered to the Nielsen Golf team.' });
  });

  // Reset / Seed Data
  app.post('/api/reset-seed', (req, res) => {
    players = JSON.parse(JSON.stringify(initialPlayers));
    tournaments = JSON.parse(JSON.stringify(initialTournaments));
    sponsors = JSON.parse(JSON.stringify(initialSponsors));
    sponsorshipPackages = JSON.parse(JSON.stringify(initialSponsorshipPackages));
    careerHighlights = JSON.parse(JSON.stringify(initialCareerHighlights));
    careerTimeline = JSON.parse(JSON.stringify(initialCareerTimeline));
    followers = JSON.parse(JSON.stringify(initialFollowers));
    donations = JSON.parse(JSON.stringify(initialDonations));
    investmentOpportunities = JSON.parse(JSON.stringify(initialInvestmentOpportunities));
    investorInquiries = JSON.parse(JSON.stringify(initialInvestorInquiries));
    sponsorInquiries = JSON.parse(JSON.stringify(initialSponsorInquiries));
    contactInquiries = [];
    res.json({ success: true, message: 'Nielsen Golf data reset to initial state' });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite Middleware integration for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nielsen Golf Platform running on http://localhost:${PORT}`);
  });
}

function scoreToParFormat(scoreToPar: number | string): string {
  if (typeof scoreToPar === 'number') {
    if (scoreToPar < 0) return `${scoreToPar} (${Math.abs(scoreToPar)}-under)`;
    if (scoreToPar === 0) return 'E (Even)';
    return `+${scoreToPar} (${scoreToPar}-over)`;
  }
  return scoreToPar;
}

startServer();
