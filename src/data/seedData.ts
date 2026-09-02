import { Player, Tournament, Round, Sponsor, SponsorshipPackage, CareerHighlight, CareerTimelineEvent, Follower, Donation, InvestmentOpportunity, InvestorInquiry, SponsorInquiry } from '../types';

export const initialPlayers: Player[] = [
  {
    id: 'jonathan-nielsen-1',
    slug: 'jonathan',
    first_name: 'Jonathan',
    last_name: 'Nielsen',
    display_name: 'Jonathan Nielsen',
    headshot: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    hero_image: 'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1800&q=80',
    action_image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80',
    nationality: 'Denmark / USA',
    country_code: 'DK',
    residence: 'Clemson, SC / Phoenix, AZ',
    college: 'Clemson University (All-ACC, NCAA D1)',
    turned_pro: 2024,
    height: `6'2" (188 cm)`,
    bio: 'Jonathan Nielsen is a professional golfer competing on PGA TOUR Americas and the APGA Tour. A collegiate standout at Clemson University with multiple individual victories and All-ACC honors, Jonathan turned professional in 2024 and swiftly earned PGA TOUR Americas exempt status. Known for elite ball-striking, poise under pressure, and dedicated preparation, Jonathan represents the next generation of ambitious tour athletes partnering with leading brands for championship success.',
    current_tours: ['PGA TOUR Americas', 'APGA Tour'],
    home_clubs: ['Clemson Golf Club (SC)', 'Troon North Golf Club (AZ)', 'The Country Club of Birmingham (AL)'],
    instagram_url: 'https://instagram.com',
    x_url: 'https://x.com',
    linkedin_url: 'https://linkedin.com',
    website_url: 'https://nielsengolf.com/jonathan',
    active: true
  },
  {
    id: 'tim-nielsen-2',
    slug: 'tim',
    first_name: 'Tim',
    last_name: 'Nielsen',
    display_name: 'Tim Nielsen',
    headshot: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    hero_image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1800&q=80',
    action_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    nationality: 'Denmark / USA',
    country_code: 'DK',
    residence: 'Phoenix, AZ / Copenhagen, Denmark',
    college: 'Coastal Carolina University / Danish National Squad',
    turned_pro: 2023,
    height: `6'1" (185 cm)`,
    bio: 'Tim Nielsen is an international professional golfer competing full-time on the Asian Development Tour (ADT). A former Danish National Team standout with international amateur championships, Tim turned professional in 2023. Characterized by relentless work ethic, pinpoint wedge control, and strategic course management, Tim pairs competitive fire with global championship experience across Asia.',
    current_tours: ['Asian Development Tour (ADT)'],
    home_clubs: ['Silverstone Golf Club (AZ)', 'Copenhagen Golf Club (Denmark)', 'The Dunes Golf & Beach Club (SC)'],
    instagram_url: 'https://instagram.com',
    x_url: 'https://x.com',
    linkedin_url: 'https://linkedin.com',
    website_url: 'https://nielsengolf.com/tim',
    active: true
  }
];

export const initialPlayer = initialPlayers[0];

const generateHoleScores = (roundNumber: number, targetScore: number, birdieCount: number, bogeyCount: number, eagleCount: number = 0): { hole_number: number; par: number; score: number; score_to_par: number }[] => {
  const pars = [4, 4, 3, 5, 4, 3, 4, 4, 5, 4, 3, 4, 5, 4, 4, 3, 5, 4];
  const holes = pars.map((par, idx) => ({
    hole_number: idx + 1,
    par,
    score: par,
    score_to_par: 0
  }));

  if (eagleCount > 0) {
    holes[3].score = holes[3].par - 2;
    holes[3].score_to_par = -2;
  }

  const birdieHoles = roundNumber === 1 ? [1, 5, 9, 14, 15, 17] : [2, 6, 10, 13, 18];
  birdieHoles.slice(0, birdieCount).forEach(hIdx => {
    if (holes[hIdx]) {
      holes[hIdx].score = holes[hIdx].par - 1;
      holes[hIdx].score_to_par = -1;
    }
  });

  const bogeyHoles = roundNumber === 1 ? [7] : [11];
  bogeyHoles.slice(0, bogeyCount).forEach(hIdx => {
    if (holes[hIdx]) {
      holes[hIdx].score = holes[hIdx].par + 1;
      holes[hIdx].score_to_par = 1;
    }
  });

  return holes;
};

export const initialTournaments: Tournament[] = [
  // ================= JONATHAN NIELSEN TOURNAMENTS =================
  {
    id: 'tourn-atb-classic-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-atb-classic-2026',
    name: 'ATB Classic',
    tour: 'PGA TOUR Americas',
    course: 'Northern Bear Golf Club',
    city: 'Edmonton',
    state: 'Alberta',
    country: 'Canada',
    start_date: '2026-08-27',
    end_date: '2026-08-30',
    status: 'Current',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://www.pgatour.com/americas/leaderboard',
    field_size: 156,
    final_finish: 'T12',
    final_score_to_par: '-9',
    earnings: 4850,
    purse: 225000,
    course_par: 72,
    course_yardage: 7254,
    tournament_recap: 'Through two completed rounds at Northern Bear Golf Club, Jonathan Nielsen sits in a tie for 12th at 9-under par after posting consecutive rounds in the 60s (67-68). With 11 total birdies and only two bogeys across 36 holes, he is within three shots of the top five heading into moving day.',
    rounds: [
      {
        id: 'round-atb-r1',
        player_id: 'jonathan-nielsen-1',
        tournament_id: 'tourn-atb-classic-2026',
        round_number: 1,
        score: 67,
        score_to_par: -5,
        starting_position: 'T1',
        ending_position: 'T12',
        birdies: 6,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        fairways: 11,
        greens: 15,
        putts: 28,
        recap: 'Jonathan opened the tournament with a 5-under 67, recording six birdies against one bogey. Three birdies over his final five holes helped him climb into a tie for 12th heading into Friday.',
        round_status: 'Completed',
        scorecard: generateHoleScores(1, 67, 6, 1, 0)
      },
      {
        id: 'round-atb-r2',
        player_id: 'jonathan-nielsen-1',
        tournament_id: 'tourn-atb-classic-2026',
        round_number: 2,
        score: 68,
        score_to_par: -4,
        starting_position: 'T12',
        ending_position: 'T8',
        birdies: 5,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        fairways: 10,
        greens: 14,
        putts: 27,
        recap: 'Jonathan followed his opening 67 with a 4-under 68 Friday, making five birdies against one bogey. He reached the halfway point at 9-under and moved into a tie for eighth heading into the weekend.',
        round_status: 'Completed',
        scorecard: generateHoleScores(2, 68, 5, 1, 0)
      }
    ]
  },
  {
    id: 'tourn-fortinet-cup-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-fortinet-cup-championship-2026',
    name: 'Fortinet Cup Championship',
    tour: 'PGA TOUR Americas',
    course: 'TPC Toronto at Osprey Valley (North Course)',
    city: 'Caledon',
    state: 'Ontario',
    country: 'Canada',
    start_date: '2026-09-10',
    end_date: '2026-09-13',
    status: 'Upcoming',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://www.pgatour.com/americas/leaderboard',
    field_size: 120,
    purse: 250000,
    course_par: 71,
    rounds: []
  },
  {
    id: 'tourn-apga-cisco-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-apga-cisco-invitational-2026',
    name: 'APGA Cisco Invitational',
    tour: 'APGA Tour',
    course: 'Baltusrol Golf Club (Lower Course)',
    city: 'Springfield',
    state: 'New Jersey',
    country: 'United States',
    start_date: '2026-09-24',
    end_date: '2026-09-26',
    status: 'Upcoming',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://apgatour.org/leaderboard',
    field_size: 72,
    purse: 150000,
    rounds: []
  },
  {
    id: 'tourn-apga-farmers-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-apga-tour-championship-2026',
    name: 'APGA Tour Championship',
    tour: 'APGA Tour',
    course: 'Valhalla Golf Club',
    city: 'Louisville',
    state: 'Kentucky',
    country: 'United States',
    start_date: '2026-10-22',
    end_date: '2026-10-24',
    status: 'Upcoming',
    tournament_type: 'Planned',
    leaderboard_url: 'https://apgatour.org/leaderboard',
    field_size: 64,
    purse: 150000,
    rounds: []
  },
  {
    id: 'tourn-centre-quebec-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-centre-du-quebec-open-2026',
    name: 'Centre du Québec Open',
    tour: 'PGA TOUR Americas',
    course: 'Golf Club de Drummondville',
    city: 'Drummondville',
    state: 'Quebec',
    country: 'Canada',
    start_date: '2026-08-13',
    end_date: '2026-08-16',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://www.pgatour.com/americas/leaderboard',
    field_size: 156,
    final_finish: 'T6',
    final_score_to_par: '-14',
    earnings: 8250,
    purse: 225000,
    tournament_recap: 'Jonathan delivered four consecutive under-par rounds (68-67-69-66) for a 14-under total to finish tied for 6th at the Centre du Québec Open, earning his second top-10 of the season on PGA TOUR Americas.',
    rounds: [
      {
        id: 'round-cq-1',
        player_id: 'jonathan-nielsen-1',
        tournament_id: 'tourn-centre-quebec-2026',
        round_number: 1,
        score: 68,
        score_to_par: -4,
        starting_position: 'T1',
        ending_position: 'T15',
        birdies: 5,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed',
        recap: 'Jonathan opened with a 4-under 68 featuring five birdies and a single bogey, placing him in the top 15 after round one.'
      },
      {
        id: 'round-cq-2',
        player_id: 'jonathan-nielsen-1',
        tournament_id: 'tourn-centre-quebec-2026',
        round_number: 2,
        score: 67,
        score_to_par: -5,
        starting_position: 'T15',
        ending_position: 'T9',
        birdies: 6,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed',
        recap: 'A bogey-free stretch on the back nine lifted Jonathan to a second-round 67 (-5), making the cut comfortably at 9-under.'
      },
      {
        id: 'round-cq-3',
        player_id: 'jonathan-nielsen-1',
        tournament_id: 'tourn-centre-quebec-2026',
        round_number: 3,
        score: 69,
        score_to_par: -3,
        starting_position: 'T9',
        ending_position: 'T10',
        birdies: 4,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed',
        recap: 'A steady 3-under 69 on Saturday kept Jonathan inside the top 10 at 12-under par heading into the final round.'
      },
      {
        id: 'round-cq-4',
        player_id: 'jonathan-nielsen-1',
        tournament_id: 'tourn-centre-quebec-2026',
        round_number: 4,
        score: 66,
        score_to_par: -6,
        starting_position: 'T10',
        ending_position: 'T6',
        birdies: 7,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed',
        recap: 'Jonathan fired a tournament-best 6-under 66 on Sunday with seven birdies to close at 14-under par, finishing in a tie for 6th place.'
      }
    ]
  },
  {
    id: 'tourn-ottawa-open-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-commissioners-cup-ottawa-2026',
    name: 'Commissionaires Ottawa Open',
    tour: 'PGA TOUR Americas',
    course: 'Eagle Creek Golf Club',
    city: 'Dunrobin',
    state: 'Ontario',
    country: 'Canada',
    start_date: '2026-07-23',
    end_date: '2026-07-26',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://www.pgatour.com/americas/leaderboard',
    field_size: 156,
    final_finish: 'T18',
    final_score_to_par: '-11',
    earnings: 3400,
    purse: 225000,
    tournament_recap: 'Jonathan posted scores of 70-68-69-70 (-11) to finish tied for 18th at Eagle Creek Golf Club, logging his fourth top-25 finish of the 2026 summer swing.',
    rounds: []
  },
  {
    id: 'tourn-explore-nb-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-explore-nb-open-2026',
    name: 'Explore NB Open',
    tour: 'PGA TOUR Americas',
    course: 'Mactaquac Golf Course',
    city: 'Mactaquac',
    state: 'New Brunswick',
    country: 'Canada',
    start_date: '2026-07-09',
    end_date: '2026-07-12',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://www.pgatour.com/americas/leaderboard',
    field_size: 156,
    final_finish: '3rd',
    final_score_to_par: '-18',
    earnings: 15200,
    purse: 225000,
    tournament_recap: 'Highlighting his rookie professional campaign, Jonathan notched a solo 3rd place finish at the Explore NB Open with four rounds in the 60s (66-67-68-65) for an 18-under 266 total.',
    rounds: []
  },
  {
    id: 'tourn-victoria-open-2026',
    player_id: 'jonathan-nielsen-1',
    slug: 'jonathan-beachlands-victoria-open-2026',
    name: 'Beachlands Victoria Open',
    tour: 'PGA TOUR Americas',
    course: 'Uplands Golf Club',
    city: 'Victoria',
    state: 'British Columbia',
    country: 'Canada',
    start_date: '2026-06-18',
    end_date: '2026-06-21',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://www.pgatour.com/americas/leaderboard',
    field_size: 156,
    final_finish: 'T24',
    final_score_to_par: '-8',
    earnings: 2650,
    purse: 225000,
    tournament_recap: 'Jonathan posted 69-68-71-68 (-8) at Uplands Golf Club to finish T24 in his first tournament of the North America swing.',
    rounds: []
  },

  // ================= TIM NIELSEN TOURNAMENTS (ASIAN DEVELOPMENT TOUR) =================
  {
    id: 'tourn-tim-brg-open-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-brg-open-danang-2026',
    name: 'BRG Open Golf Championship Danang',
    tour: 'Asian Development Tour (ADT)',
    course: 'Legend Danang Golf Resort (Nicklaus Course)',
    city: 'Danang',
    state: 'Danang Province',
    country: 'Vietnam',
    start_date: '2026-08-27',
    end_date: '2026-08-30',
    status: 'Current',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 144,
    final_finish: 'T14',
    final_score_to_par: '-7',
    earnings: 2850,
    purse: 100000,
    course_par: 72,
    course_yardage: 7142,
    tournament_recap: 'Tim Nielsen is in a tie for 14th at 7-under par through 36 holes at Legend Danang Golf Resort, carding crisp rounds of 69 and 68 with nine birdies and only two bogeys to contend heading into the weekend.',
    rounds: [
      {
        id: 'round-tim-brg-r1',
        player_id: 'tim-nielsen-2',
        tournament_id: 'tourn-tim-brg-open-2026',
        round_number: 1,
        score: 69,
        score_to_par: -3,
        starting_position: 'T1',
        ending_position: 'T22',
        birdies: 4,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        fairways: 12,
        greens: 14,
        putts: 28,
        recap: 'Tim opened the BRG Open with a 3-under 69 in breezy conditions in Danang, making four birdies against a single dropped shot.',
        round_status: 'Completed',
        scorecard: generateHoleScores(1, 69, 4, 1, 0)
      },
      {
        id: 'round-tim-brg-r2',
        player_id: 'tim-nielsen-2',
        tournament_id: 'tourn-tim-brg-open-2026',
        round_number: 2,
        score: 68,
        score_to_par: -4,
        starting_position: 'T22',
        ending_position: 'T14',
        birdies: 5,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        fairways: 13,
        greens: 15,
        putts: 27,
        recap: 'Tim fired a second-round 4-under 68 on Friday with five birdies, jumping eight spots into a tie for 14th place at 7-under total.',
        round_status: 'Completed',
        scorecard: generateHoleScores(2, 68, 5, 1, 0)
      }
    ]
  },
  {
    id: 'tourn-tim-combiphar-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-combiphar-players-championship-2026',
    name: 'Combiphar Players Championship',
    tour: 'Asian Development Tour (ADT)',
    course: 'Sentul Highlands Golf Club',
    city: 'Bogor',
    state: 'West Java',
    country: 'Indonesia',
    start_date: '2026-09-17',
    end_date: '2026-09-20',
    status: 'Upcoming',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 144,
    purse: 100000,
    course_par: 72,
    rounds: []
  },
  {
    id: 'tourn-tim-phuket-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-singha-laguna-phuket-open-2026',
    name: 'Singha Laguna Phuket Open',
    tour: 'Asian Development Tour (ADT)',
    course: 'Laguna Golf Phuket',
    city: 'Phuket',
    state: 'Phuket',
    country: 'Thailand',
    start_date: '2026-10-08',
    end_date: '2026-10-11',
    status: 'Upcoming',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 144,
    purse: 100000,
    course_par: 70,
    rounds: []
  },
  {
    id: 'tourn-tim-adt-championship-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-adt-tour-championship-2026',
    name: 'ADT Tour Championship',
    tour: 'Asian Development Tour (ADT)',
    course: 'Riyadh Golf Club',
    city: 'Riyadh',
    state: 'Riyadh Province',
    country: 'Saudi Arabia',
    start_date: '2026-11-12',
    end_date: '2026-11-15',
    status: 'Upcoming',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 72,
    purse: 150000,
    course_par: 72,
    rounds: []
  },
  {
    id: 'tourn-tim-selangor-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-pkns-selangor-masters-2026',
    name: 'PKNS Selangor Masters',
    tour: 'Asian Development Tour (ADT)',
    course: 'Seri Selangor Golf Club',
    city: 'Petaling Jaya',
    state: 'Selangor',
    country: 'Malaysia',
    start_date: '2026-08-06',
    end_date: '2026-08-09',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 144,
    final_finish: 'T5',
    final_score_to_par: '-15',
    earnings: 6850,
    purse: 100000,
    tournament_recap: 'Tim closed with a brilliant 7-under 64 on Sunday at Seri Selangor Golf Club to earn a top-5 finish at 15-under 269, his best finish of the 2026 ADT season.',
    rounds: [
      {
        id: 'round-tim-sel-1',
        player_id: 'tim-nielsen-2',
        tournament_id: 'tourn-tim-selangor-2026',
        round_number: 1,
        score: 68,
        score_to_par: -3,
        ending_position: 'T19',
        birdies: 5,
        bogeys: 2,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed'
      },
      {
        id: 'round-tim-sel-2',
        player_id: 'tim-nielsen-2',
        tournament_id: 'tourn-tim-selangor-2026',
        round_number: 2,
        score: 69,
        score_to_par: -2,
        ending_position: 'T15',
        birdies: 4,
        bogeys: 2,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed'
      },
      {
        id: 'round-tim-sel-3',
        player_id: 'tim-nielsen-2',
        tournament_id: 'tourn-tim-selangor-2026',
        round_number: 3,
        score: 68,
        score_to_par: -3,
        ending_position: 'T12',
        birdies: 4,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed'
      },
      {
        id: 'round-tim-sel-4',
        player_id: 'tim-nielsen-2',
        tournament_id: 'tourn-tim-selangor-2026',
        round_number: 4,
        score: 64,
        score_to_par: -7,
        ending_position: 'T5',
        birdies: 8,
        bogeys: 1,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed'
      }
    ]
  },
  {
    id: 'tourn-tim-singha-pattaya-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-singha-pattaya-open-2026',
    name: 'Singha Pattaya Open',
    tour: 'Asian Development Tour (ADT)',
    course: 'Burapha Golf Club',
    city: 'Chonburi',
    state: 'Chonburi Province',
    country: 'Thailand',
    start_date: '2026-07-09',
    end_date: '2026-07-12',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 144,
    final_finish: '3rd',
    final_score_to_par: '-16',
    earnings: 8200,
    purse: 100000,
    tournament_recap: 'Tim posted four rounds in the 60s (66-67-68-67) to claim solo 3rd place at Burapha Golf Club in Thailand.',
    rounds: []
  },
  {
    id: 'tourn-tim-indo-masters-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-indo-masters-golf-invitational-2026',
    name: 'Indo Masters Golf Invitational',
    tour: 'Asian Development Tour (ADT)',
    course: 'Imperial Klub Golf',
    city: 'Jakarta',
    state: 'Banten',
    country: 'Indonesia',
    start_date: '2026-07-23',
    end_date: '2026-07-26',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 144,
    final_finish: 'T11',
    final_score_to_par: '-9',
    earnings: 3450,
    purse: 85000,
    tournament_recap: 'Tim carded 69-70-68-68 (-9) to finish tied for 11th at Imperial Klub Golf in Jakarta.',
    rounds: []
  },
  {
    id: 'tourn-tim-taifong-2026',
    player_id: 'tim-nielsen-2',
    slug: 'tim-taifong-open-2026',
    name: 'Taifong Open',
    tour: 'Asian Development Tour (ADT)',
    course: 'Taifong Golf Club',
    city: 'Changhua',
    state: 'Changhua County',
    country: 'Taiwan',
    start_date: '2026-06-18',
    end_date: '2026-06-21',
    status: 'Completed',
    tournament_type: 'Confirmed',
    leaderboard_url: 'https://asiandevelopmenttour.com/schedule',
    field_size: 144,
    final_finish: 'T18',
    final_score_to_par: '-6',
    earnings: 2150,
    purse: 100000,
    tournament_recap: 'Tim opened his Asian Development Tour campaign with a solid T18 finish at Taifong Golf Club.',
    rounds: []
  }
];

export const initialSponsors: Sponsor[] = [
  {
    id: 'sponsor-eventide',
    company_name: 'Eventide Investments',
    logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
    website: 'https://www.eventideinvestments.com',
    tier: 'Premier Partner',
    category: 'Investment & Financial Services',
    description: 'Values-based investment management firm supporting Jonathan Nielsen’s pursuit of excellence across professional tour golf.',
    featured: true,
    active: true,
    sponsored_players: 'jonathan',
    supports_jonathan: true,
    supports_tim: false,
    supports_both: false,
    display_order: 1
  },
  {
    id: 'sponsor-titleist-fj',
    company_name: 'Titleist & FJ',
    logo: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=400&q=80',
    website: 'https://www.titleist.com',
    tier: 'Premier Partner',
    category: 'Equipment & Footwear',
    description: 'Industry-leading golf balls, equipment, tour staff bags, and FootJoy performance footwear powering Jonathan Nielsen on tour.',
    featured: true,
    active: true,
    sponsored_players: 'jonathan',
    supports_jonathan: true,
    supports_tim: false,
    supports_both: false,
    display_order: 2
  },
  {
    id: 'sponsor-sqairz',
    company_name: 'SQAIRZ',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    website: 'https://sqairz.com',
    tier: 'Official Partner',
    category: 'Performance Golf Footwear',
    description: 'Groundbreaking biomechanics and performance footwear designed for maximum ground force production and rotational swing balance for Jonathan Nielsen.',
    featured: true,
    active: true,
    sponsored_players: 'jonathan',
    supports_jonathan: true,
    supports_tim: false,
    supports_both: false,
    display_order: 3
  },
  {
    id: 'sponsor-mayor-clothing',
    company_name: 'Mayor Clothing',
    logo: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    website: 'https://www.mayorclothing.com',
    tier: 'Official Partner',
    category: 'Apparel & Lifestyle',
    description: 'Tour apparel, luxury polos, and modern golf lifestyle clothing outfitting Jonathan Nielsen on and off the course.',
    featured: true,
    active: true,
    sponsored_players: 'jonathan',
    supports_jonathan: true,
    supports_tim: false,
    supports_both: false,
    display_order: 4
  },
  {
    id: 'sponsor-new-level',
    company_name: 'New Level Equipment',
    logo: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80',
    website: 'https://newlevelgolf.com',
    tier: 'Premier Partner',
    category: 'Golf Equipment & Forged Irons',
    description: 'High-performance forged irons, wedges, and precision equipment crafted for elite ball-strikers, fueling Tim Nielsen on the Asian Development Tour (ADT).',
    featured: true,
    active: true,
    sponsored_players: 'tim',
    supports_jonathan: false,
    supports_tim: true,
    supports_both: false,
    display_order: 5
  }
];

export const initialSponsorshipPackages: SponsorshipPackage[] = [
  {
    id: 'tier-supporting',
    name: 'Supporting Partner',
    tier: 'Supporting Partner',
    applies_to_both_players: true,
    price: '$3,000 or $250/month',
    billing_frequency: '$3,000 / Season or $250/mo',
    description: 'Entry-level corporate partnership offering digital alignment, website partner recognition, social media results features, and tournament badge access.',
    logo_placements: ['Website Partner Roster & Direct Link', 'Collar or Hat Side Placement Consideration', 'Social Media Tagging on Results'],
    corporate_golf_days: '1 Corporate Golf & Clinic Day (Up to 4 Guests)',
    appearance_days: '1 Regional Appearance / Clinic',
    website_benefits: ['Partner directory listing with direct backlink', 'Logo placement on official website footer'],
    social_benefits: ['Quarterly social media shoutout', 'Tagged tournament results posts'],
    digital_benefits: ['Monthly Social Media Mention', 'Website Profile Recognition', 'Quarterly Sponsor Newsletter Updates'],
    exclusivity: 'Non-exclusive',
    additional_benefits: ['Signed Memorabilia & Flag', 'Season Pass for Tournament Week Access'],
    applies_to: 'both',
    active: true
  },
  {
    id: 'tier-official',
    name: 'Official Partner',
    tier: 'Official Partner',
    applies_to_both_players: true,
    price: '$6,000 or $500/month',
    billing_frequency: '$6,000 / Season or $500/mo',
    description: 'Designed for established companies desiring prominent sleeve apparel branding, executive client entertainment, and custom co-branded digital storytelling.',
    logo_placements: ['Right or Left Sleeve Tour Apparel Logo', 'Golf Bag Side Pocket Integration', 'Digital Media Banner Feature'],
    corporate_golf_days: '2 Corporate Golf & Client Hospitality Days (Up to 8 Guests)',
    appearance_days: '2 Keynote or Clinic Appearances',
    website_benefits: ['Featured homepage and partner section logo', 'Dedicated partner highlight profile'],
    social_benefits: ['Bi-weekly tournament recap inclusion', 'Custom video and story posts'],
    digital_benefits: ['Dedicated Video Feature / Co-Branded Content', 'Official Partner Badge on Player Site', 'Bi-weekly Tournament Recap Inclusion'],
    exclusivity: 'Industry category consideration',
    additional_benefits: ['Exclusive Client Dinner & Pro-Am Coordination', 'Category Exclusivity Consideration', 'Signed Staff Bag & Gear'],
    applies_to: 'both',
    active: true
  },
  {
    id: 'tier-premier',
    name: 'Premier Partner',
    tier: 'Premier Partner',
    applies_to_both_players: true,
    price: '$12,000 or $1,000/month',
    billing_frequency: '$12,000 / Season or $1,000/mo',
    description: 'The highest tier of athlete partnership, offering prime front-of-hat and chest apparel positions, VIP client entertainment, and full brand ambassador rights.',
    logo_placements: ['Front Chest / Primary Apparel Position', 'Front of Cap / Visor Option', 'Prominent Bag Branding & Tour Staff Representation'],
    corporate_golf_days: '4 Full Corporate Golf Days, Outings, or Clinics (Nationwide & International)',
    appearance_days: '4 National or International Days',
    website_benefits: ['Hero Homepage Co-Branding', 'Dedicated brand story page', 'Continuous partner banner'],
    social_benefits: ['Co-branded campaign series', 'Behind-the-scenes access and tour vlog features'],
    digital_benefits: ['Hero Homepage Co-Branding', 'Custom Video Commercials & Behind-the-Scenes Series', 'Full Licensing & Name-Image-Likeness (NIL/Pro) Rights'],
    exclusivity: 'Full category exclusivity guarantee',
    additional_benefits: ['Full Category Exclusivity', 'Custom Employee Golf Clinic Series', 'VIP Tournament Access & Inside-the-Ropes Experiences'],
    applies_to: 'both',
    active: true
  }
];

export const initialDonations: Donation[] = [
  {
    id: 'don-1',
    donor_name: 'David & Karen Miller',
    email: 'miller.family@example.com',
    amount: 500,
    supports_both: true,
    payment_provider: 'Stripe',
    payment_status: 'Completed',
    donation_date: '2026-08-20',
    public_recognition: true,
    anonymous: false,
    message: 'Best of luck to both Jonathan and Tim on tour! Rooting for you every week.'
  },
  {
    id: 'don-2',
    donor_name: 'Clemson Golf Alumni Supporter',
    email: 'supporter@clemson.edu',
    amount: 250,
    player_id: 'jonathan-nielsen-1',
    supports_both: false,
    payment_provider: 'Stripe',
    payment_status: 'Completed',
    donation_date: '2026-08-22',
    public_recognition: true,
    anonymous: false,
    message: 'Go Tigers! Keep grinding Jonathan.'
  },
  {
    id: 'don-3',
    donor_name: 'Anonymous Supporter',
    email: 'fan@golfsupport.org',
    amount: 1000,
    supports_both: true,
    payment_provider: 'Stripe',
    payment_status: 'Completed',
    donation_date: '2026-08-25',
    public_recognition: false,
    anonymous: true,
    message: 'Safe travels on tour.'
  }
];

export const initialInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: 'inv-opp-jonathan',
    name: 'Jonathan Nielsen — Player Investment Presentation',
    season: '2026-2027 Tour Season',
    player_id: 'jonathan-nielsen-1',
    applies_to_both_players: false,
    funding_goal: 45000,
    amount_raised: 28000,
    minimum_investment: 5000,
    earnings_share_description: 'Contractual performance participation terms and percentage return schedule detailed in confidential deck.',
    maximum_return_description: 'Preferred return hurdle and structured repayment cap.',
    term_description: '24-month multi-stage agreement covering PGA TOUR Americas & APGA Tour.',
    investment_summary: 'Comprehensive player investment proposal outlining terms of the agreement, return percentage structures, full tournament budget schedules, and career advancement trajectory for Jonathan Nielsen.',
    risk_disclosure: 'Professional golf participation agreements involve performance and athletic risk. Formal investment contracts and term sheets provided upon request.',
    active: true
  },
  {
    id: 'inv-opp-tim',
    name: 'Tim Nielsen — Player Investment Presentation',
    season: '2026-2027 Tour Season',
    player_id: 'tim-nielsen-2',
    applies_to_both_players: false,
    funding_goal: 35000,
    amount_raised: 20000,
    minimum_investment: 5000,
    earnings_share_description: 'Contractual performance participation terms and percentage return schedule detailed in confidential deck.',
    maximum_return_description: 'Preferred return hurdle and structured repayment cap.',
    term_description: '24-month multi-stage agreement covering Asian Development Tour (ADT).',
    investment_summary: 'Comprehensive player investment proposal outlining terms of the agreement, return percentage structures, ADT/Asian Tour operational budget, and career advancement trajectory for Tim Nielsen.',
    risk_disclosure: 'Professional golf participation agreements involve performance and athletic risk. Formal investment contracts and term sheets provided upon request.',
    active: true
  }
];

export const initialInvestorInquiries: InvestorInquiry[] = [
  {
    id: 'inq-inv-1',
    name: 'Robert Vance',
    email: 'rvance@vanceholdings.com',
    phone: '(480) 555-0192',
    investment_interest: '$10,000 - $25,000',
    player_preference: 'both',
    accredited_investor: true,
    message: 'Interested in reviewing the 2027 Season contract terms and learning more about the earnings distribution schedule for both Jonathan and Tim.',
    created_at: '2026-08-24T14:30:00Z',
    status: 'In Discussion'
  },
  {
    id: 'inq-inv-2',
    name: 'Thomas Lindqvist',
    email: 'tlindqvist@nordicpartners.dk',
    phone: '+45 20 12 34 56',
    investment_interest: '$5,000 - $10,000',
    player_preference: 'tim',
    accredited_investor: true,
    message: 'Followed Tim since his amateur days in Denmark. Would like to review terms for his European and US campaign.',
    created_at: '2026-08-28T09:15:00Z',
    status: 'New'
  }
];

export const initialSponsorInquiries: SponsorInquiry[] = [
  {
    id: 'inq-sp-1',
    name: 'Sarah Jenkins',
    company: 'Apex Performance Eyewear',
    email: 'sjenkins@apexeyewear.com',
    phone: '(312) 555-0144',
    player_preference: 'both',
    budget_range: '$15,000 - $35,000',
    areas_of_interest: ['Apparel Branding', 'Hat Branding', 'Social Media', 'Corporate Golf'],
    message: 'We are looking for modern athletic ambassadors on tour to represent our polarized sport sunglasses line.',
    created_at: '2026-08-27T16:20:00Z',
    status: 'Proposal Sent'
  },
  {
    id: 'inq-sp-2',
    name: 'Henrik Mortensen',
    company: 'Copenhagen Financial Tech',
    email: 'hm@cphfintech.dk',
    phone: '+45 40 98 76 54',
    player_preference: 'both',
    budget_range: '$35,000+',
    areas_of_interest: ['Apparel Branding', 'Corporate Golf', 'Client Entertainment', 'Website Presence'],
    message: 'Interested in discussing a Premier Partnership covering chest and hat logo placements for the 2027 tour season.',
    created_at: '2026-08-29T11:00:00Z',
    status: 'New'
  }
];

export const initialCareerHighlights: CareerHighlight[] = [
  // Jonathan Highlights
  {
    id: 'hl-j1',
    player_id: 'jonathan-nielsen-1',
    year: 2026,
    title: '3rd Place — Explore NB Open',
    category: 'Top Finish',
    description: 'Shot 18-under par (66-67-68-65) on PGA TOUR Americas in New Brunswick, earning largest career professional check.'
  },
  {
    id: 'hl-j2',
    player_id: 'jonathan-nielsen-1',
    year: 2026,
    title: 'T6 Finish — Centre du Québec Open',
    category: 'Top Finish',
    description: 'Fired closing round 66 (-6) at Golf Club de Drummondville to solidify top-15 standing on the Fortinet Cup points list.'
  },
  {
    id: 'hl-j3',
    player_id: 'jonathan-nielsen-1',
    year: 2024,
    title: 'Turned Professional & Earned Tour Status',
    category: 'Tour Status',
    description: 'Graduated from Clemson University and advanced through Q-School to secure PGA TOUR Americas card.'
  },
  {
    id: 'hl-j4',
    player_id: 'jonathan-nielsen-1',
    year: 2024,
    title: 'NCAA Division I All-ACC Team Selection',
    category: 'College Achievement',
    description: 'Led Clemson Men’s Golf in stroke average (70.18), securing two individual tournament titles and NCAA Championship berth.'
  },
  {
    id: 'hl-j5',
    player_id: 'jonathan-nielsen-1',
    year: 2023,
    title: 'Individual Champion — Clemson Invitational',
    category: 'Win',
    description: 'Captured individual victory at The Cliffs at Keowee Falls with a 3-round total of 12-under par.'
  },

  // Tim Highlights
  {
    id: 'hl-t1',
    player_id: 'tim-nielsen-2',
    year: 2026,
    title: '3rd Place — Singha Pattaya Open (ADT)',
    category: 'Top Finish',
    description: 'Shot 16-under par (66-67-68-67) at Burapha Golf Club in Thailand on the Asian Development Tour.'
  },
  {
    id: 'hl-t2',
    player_id: 'tim-nielsen-2',
    year: 2026,
    title: 'T5 Finish — PKNS Selangor Masters (ADT)',
    category: 'Top Finish',
    description: 'Fired closing round 7-under 64 at Seri Selangor Golf Club to secure his second ADT top-5 of the season.'
  },
  {
    id: 'hl-t3',
    player_id: 'tim-nielsen-2',
    year: 2025,
    title: 'Asian Development Tour Full Exempt Status',
    category: 'Tour Status',
    description: 'Earned full playing privileges across the Asian Development Tour (ADT) following dominant qualifying performance.'
  },
  {
    id: 'hl-t4',
    player_id: 'tim-nielsen-2',
    year: 2023,
    title: 'Danish National Amateur Team Medalist',
    category: 'Win',
    description: 'Helped lead Danish National Amateur Squad to podium finish at the European Amateur Team Championship.'
  }
];

export const initialCareerTimeline: CareerTimelineEvent[] = [
  // Jonathan Timeline
  {
    id: 'tl-j1',
    player_id: 'jonathan-nielsen-1',
    period: '2025 – Present',
    title: 'PGA TOUR Americas & APGA Tour Campaign',
    organization: 'PGA TOUR Americas / APGA Tour',
    description: 'Full-time touring professional competing across North America. Multiple top-10 finishes and positioning for Korn Ferry Tour advancement.',
    highlights: ['Solo 3rd at Explore NB Open (-18)', 'T6 at Centre du Québec Open (-14)', 'Top-20 Fortinet Cup Points Rank']
  },
  {
    id: 'tl-j2',
    player_id: 'jonathan-nielsen-1',
    period: '2024',
    title: 'Professional Debut & Tour Card',
    organization: 'Professional Golf',
    description: 'Turned professional following senior NCAA season. Earned immediate PGA TOUR Americas exempt status through qualifying tournament series.',
    highlights: ['Earned Americas Tour exempt card', 'Made 6 consecutive cuts in debut season', 'Signed initial equipment partner Titleist']
  },
  {
    id: 'tl-j3',
    player_id: 'jonathan-nielsen-1',
    period: '2020 – 2024',
    title: 'NCAA Division I Collegiate Golf',
    organization: 'Clemson University Tigers',
    description: 'Four-year starter and team leader. Earned All-ACC honors, recorded two individual college victories, and qualified for NCAA Nationals.',
    highlights: ['Clemson Invitational Champion', '2x All-ACC Selection', '70.21 Career College Scoring Average']
  },

  // Tim Timeline
  {
    id: 'tl-t1',
    player_id: 'tim-nielsen-2',
    period: '2025 – Present',
    title: 'Asian Development Tour (ADT) Professional Campaign',
    organization: 'Asian Development Tour (ADT)',
    description: 'Full-time touring professional competing across Asia on the ADT, locking up multiple top-5 finishes and contending in the ADT Order of Merit.',
    highlights: ['Solo 3rd at Singha Pattaya Open (-16)', 'T5 at PKNS Selangor Masters (-15)', 'Top-15 ADT Order of Merit Standing']
  },
  {
    id: 'tl-t2',
    player_id: 'tim-nielsen-2',
    period: '2023 – 2024',
    title: 'Professional Debut & International Progression',
    organization: 'Professional Golf / Asian Development Tour',
    description: 'Launched professional career following decorated amateur years, securing full playing privileges across the Asian Development Tour.',
    highlights: ['Maiden professional top-10 in debut year', 'Secured ADT full exempt status']
  },
  {
    id: 'tl-t3',
    player_id: 'tim-nielsen-2',
    period: '2019 – 2023',
    title: 'Collegiate Golf & Danish National Team',
    organization: 'NCAA D1 / Danish National Team',
    description: 'Represented Denmark in European Team Championships and competed at top tier collegiate level in the United States.',
    highlights: ['European Team Championship Medalist', 'Top-100 World Amateur Ranking']
  }
];

export const initialFollowers: Follower[] = [
  {
    id: 'fol-1',
    email: 'golf-supporter@clemson.edu',
    first_name_optional: 'Marcus',
    follow_preference: 'both',
    signup_date: '2026-08-01',
    active: true
  },
  {
    id: 'fol-2',
    email: 'fan@pgatour.com',
    first_name_optional: 'Sarah',
    follow_preference: 'jonathan',
    signup_date: '2026-08-15',
    active: true
  },
  {
    id: 'fol-3',
    email: 'danish-golf-fan@copenhagen.dk',
    first_name_optional: 'Christian',
    follow_preference: 'tim',
    signup_date: '2026-08-20',
    active: true
  }
];
