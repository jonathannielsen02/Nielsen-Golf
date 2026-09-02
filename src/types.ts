export type TournamentStatus = 'Current' | 'Upcoming' | 'Completed' | 'Cancelled';
export type TournamentType = 'Confirmed' | 'Planned' | 'Qualifier' | 'Pending';
export type RoundStatus = 'Completed' | 'In Progress' | 'Scheduled';
export type SponsorTier = 'Premier Partner' | 'Official Partner' | 'Supporting Partner';
export type PlayerFilter = 'all' | 'jonathan' | 'tim';
export type FollowPreference = 'jonathan' | 'tim' | 'both';

export interface HoleScore {
  hole_number: number;
  par: number;
  score: number;
  score_to_par: number; // -2, -1, 0, 1, 2
}

export interface Round {
  id: string;
  player_id: string;
  tournament_id: string;
  round_number: number;
  score: number;
  score_to_par: number | string; // e.g. -5 or "-5"
  starting_position?: string;
  ending_position: string; // e.g. "T12"
  birdies: number;
  bogeys: number;
  eagles: number;
  double_bogeys: number;
  fairways?: number; // out of 14
  greens?: number; // out of 18
  putts?: number;
  recap?: string;
  round_status: RoundStatus;
  scorecard?: HoleScore[];
}

export interface Tournament {
  id: string;
  player_id: string; // 'jonathan-nielsen-1' | 'tim-nielsen-2'
  slug: string;
  name: string;
  tour: string; // e.g. "PGA TOUR Americas", "Challenge Tour", "DP World Tour"
  course: string;
  city: string;
  state: string;
  country: string;
  start_date: string; // ISO or YYYY-MM-DD
  end_date: string;
  status: TournamentStatus;
  tournament_type: TournamentType;
  leaderboard_url: string;
  field_size?: number;
  final_finish?: string; // e.g. "T12"
  final_score_to_par?: string; // e.g. "-12"
  earnings?: number;
  purse?: number;
  course_par?: number;
  course_yardage?: number;
  tournament_recap?: string;
  rounds?: Round[];
}

export interface Player {
  id: string;
  slug: string; // 'jonathan' | 'tim'
  first_name: string;
  last_name: string;
  display_name: string;
  headshot: string;
  hero_image: string;
  action_image: string;
  nationality: string;
  country_code: string;
  residence: string;
  college: string;
  turned_pro: number;
  height: string;
  bio: string;
  current_tours: string[];
  home_clubs: string[];
  instagram_url?: string;
  x_url?: string;
  linkedin_url?: string;
  website_url?: string;
  active: boolean;
}

export interface Sponsor {
  id: string;
  company_name: string;
  logo: string;
  website: string;
  tier: SponsorTier;
  category: string;
  description: string;
  featured: boolean;
  active: boolean;
  sponsored_players?: 'jonathan' | 'tim' | 'both';
  supports_jonathan: boolean;
  supports_tim: boolean;
  supports_both: boolean;
  display_order: number;
}

export interface SponsorshipPackage {
  id: string;
  name: string;
  tier: SponsorTier;
  player_id?: string;
  applies_to_both_players: boolean;
  price?: string;
  billing_frequency?: string; // e.g. 'Annual', 'Per Season', 'Quarterly'
  logo_placements: string[];
  corporate_golf_days?: string;
  appearance_days?: string;
  website_benefits?: string[];
  social_benefits?: string[];
  digital_benefits: string[];
  exclusivity?: string;
  description: string;
  additional_benefits?: string[];
  applies_to?: 'jonathan' | 'tim' | 'both';
  active: boolean;
}

export interface Donation {
  id: string;
  donor_name?: string;
  email: string;
  amount: number;
  player_id?: string; // 'jonathan-nielsen-1' | 'tim-nielsen-2'
  supports_both: boolean;
  payment_provider: string; // 'Stripe' | 'Card' | 'Manual'
  payment_status: 'Completed' | 'Pending' | 'Refunded';
  donation_date: string;
  public_recognition: boolean;
  anonymous: boolean;
  message?: string;
}

export interface InvestmentOpportunity {
  id: string;
  name: string;
  season: string; // e.g. "2026-2027 Season"
  player_id?: string;
  applies_to_both_players: boolean;
  funding_goal: number;
  amount_raised: number;
  minimum_investment: number;
  earnings_share_description: string;
  maximum_return_description: string;
  term_description: string;
  investment_summary: string;
  risk_disclosure: string;
  active: boolean;
}

export interface InvestorInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  investment_interest: string; // e.g. "$5,000 - $10,000"
  player_preference: 'jonathan' | 'tim' | 'both';
  accredited_investor?: boolean;
  message?: string;
  created_at: string;
  status: 'New' | 'In Discussion' | 'Agreement Sent' | 'Closed';
}

export interface SponsorInquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  player_preference: 'jonathan' | 'tim' | 'both';
  budget_range?: string;
  areas_of_interest: string[]; // e.g. ['Apparel Branding', 'Corporate Golf', 'Social Media']
  message?: string;
  created_at: string;
  status: 'New' | 'In Discussion' | 'Proposal Sent' | 'Active Partner';
}

export interface CareerHighlight {
  id: string;
  player_id: string;
  year: number | string;
  title: string;
  category: 'Win' | 'Tour Status' | 'Top Finish' | 'College Achievement' | 'Notable';
  description: string;
  image_optional?: string;
}

export interface CareerTimelineEvent {
  id: string;
  player_id: string;
  period: string;
  title: string;
  organization: string;
  description: string;
  highlights: string[];
}

export interface Follower {
  id: string;
  email: string;
  first_name_optional?: string;
  follow_preference: FollowPreference;
  signup_date: string;
  active: boolean;
}

export interface SeasonStats {
  player_id?: string;
  year: number | string;
  starts: number;
  cuts_made: number;
  top_10s: number;
  top_25s: number;
  wins: number;
  best_finish: string;
  scoring_average: number;
  earnings: number;
}
