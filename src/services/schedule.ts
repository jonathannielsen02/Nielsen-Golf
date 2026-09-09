/**
 * Nielsen Golf - Google Sheets Tournament Schedule Service
 * 
 * Fetches and normalizes tournament schedules from Google Sheets
 * via Google Apps Script JSON endpoint. Single source of truth.
 */

import { Tournament, TournamentStatus, TournamentType, Round } from '../types';

export const GOOGLE_SHEETS_SCHEDULE_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbyI2_3enCFIDQRAev_hBfPIPOT-uQA557K2YB7mepE-vhm8XSDni9IeDDgUtST2UvQ/exec';

export interface GoogleSheetTournamentRow {
  event_id?: string;
  player_slug?: string;
  season?: string | number;
  event_type?: string;
  player?: string;
  start_date?: string;
  end_date?: string;
  tournament?: string;
  tour?: string;
  course?: string;
  city?: string;
  state_country?: string;
  status?: string;
  leaderboard_url?: string;
  tee_time?: string;
  round_1?: string | number;
  round_2?: string | number;
  round_3?: string | number;
  round_4?: string | number;
  finish?: string;
  score_to_par?: string | number;
  total_strokes?: string | number;
  finish_numeric?: string | number;
  made_cut?: string | boolean;
  earnings?: string | number;
  notes?: string;
}

export interface PlayerInfo {
  slug: 'jonathan' | 'tim';
  playerId: string;
  displayName: string;
}


export interface GoogleSheetPlayerRow {
  player?: string;
  bio?: string;
  training_base?: string;
  college?: string;
  turned_pro?: string | number;
  faith_statement?: string;
  journey?: string;
  career_highlights?: string;
  favorite_sports_team?: string;
  favorite_course?: string;
  favorite_hobbies?: string;
  dream_vacation?: string;
  ideal_tee_time?: string;
  [key: string]: unknown;
}

export interface GoogleSheetSiteContentRow {
  key?: string;
  reference?: string;
  text?: string;
  translation?: string;
  [key: string]: unknown;
}

export interface GoogleSheetsWorkbookResponse {
  Schedule?: GoogleSheetTournamentRow[];
  Results?: GoogleSheetTournamentRow[];
  'Site Content'?: GoogleSheetSiteContentRow[];
  Players?: GoogleSheetPlayerRow[];
  [sheetName: string]: unknown;
}

export const PGA_TOUR_AMERICAS_LEADERBOARD_URL =
  'https://www.pgatour.com/americas/leaderboard';

/**
 * Normalizes player name from Google Sheets
 * Jonathan / Jonathan Nielsen -> Jonathan Nielsen ('jonathan', 'jonathan-nielsen-1')
 * Tim / Tim Nielsen / TIm -> Tim Nielsen ('tim', 'tim-nielsen-2')
 */
export function normalizePlayer(rawPlayer?: string): PlayerInfo | null {
  if (!rawPlayer) return null;
  const p = rawPlayer.trim().toLowerCase();
  if (p.includes('jonathan')) {
    return {
      slug: 'jonathan',
      playerId: 'jonathan-nielsen-1',
      displayName: 'Jonathan Nielsen'
    };
  }
  if (p.includes('tim')) {
    return {
      slug: 'tim',
      playerId: 'tim-nielsen-2',
      displayName: 'Tim Nielsen'
    };
  }
  return null;
}

/**
 * Extracts calendar date YYYY-MM-DD from raw string or ISO date
 * Avoids any timezone shift caused by new Date() conversion
 */
export function extractCalendarDate(rawDate?: string | null): string {
  if (!rawDate) return '';
  const trimmed = String(rawDate).trim();
  if (!trimmed) return '';

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return '';
}

/**
 * Returns today's calendar date in local timezone YYYY-MM-DD
 */
export function getTodayCalendarDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats calendar dates professionally (e.g. September 14–17, 2026, or Sep 14–17)
 * Crossing months: September 30 – October 3, 2026
 * Same month: September 14–17, 2026
 * Single day: September 14, 2026
 * Crossing years: December 30, 2026 – January 2, 2027
 */
export function formatCalendarDateRange(
  startDateStr?: string,
  endDateStr?: string,
  options: { shortMonth?: boolean; hideYear?: boolean } = {}
): string {
  const startCal = extractCalendarDate(startDateStr);
  const endCal = extractCalendarDate(endDateStr) || startCal;

  if (!startCal) return '';

  const parseParts = (s: string) => {
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return {
      year: parseInt(m[1], 10),
      month: parseInt(m[2], 10),
      day: parseInt(m[3], 10)
    };
  };

  const start = parseParts(startCal);
  const end = parseParts(endCal) || start;
  if (!start) return startCal;

  const monthNamesLong = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const months = options.shortMonth ? monthNamesShort : monthNamesLong;
  const sMonth = months[start.month - 1];
  const eMonth = end ? months[end.month - 1] : sMonth;

  // Single day
  if (!end || (start.year === end.year && start.month === end.month && start.day === end.day)) {
    return options.hideYear ? `${sMonth} ${start.day}` : `${sMonth} ${start.day}, ${start.year}`;
  }

  // Same month, same year: "September 14–17, 2026" or "Sep 14–17"
  if (start.year === end.year && start.month === end.month) {
    return options.hideYear
      ? `${sMonth} ${start.day}–${end.day}`
      : `${sMonth} ${start.day}–${end.day}, ${start.year}`;
  }

  // Different month, same year: "September 30 – October 3, 2026"
  if (start.year === end.year) {
    return options.hideYear
      ? `${sMonth} ${start.day} – ${eMonth} ${end.day}`
      : `${sMonth} ${start.day} – ${eMonth} ${end.day}, ${start.year}`;
  }

  // Different year: "December 30, 2026 – January 2, 2027"
  return `${sMonth} ${start.day}, ${start.year} – ${eMonth} ${end.day}, ${end.year}`;
}

/**
 * Combines city and state_country cleanly:
 * "Victoria, Canada", "Charlotte, NC", "Scottsdale, AZ"
 * Handles missing fields without trailing commas
 */
export function formatLocation(city?: string, stateCountry?: string): string {
  const c = city?.trim() || '';
  const sc = stateCountry?.trim() || '';
  if (c && sc) {
    return `${c}, ${sc}`;
  }
  return c || sc || '';
}

/**
 * Formats venue and location together
 * e.g. "Uplands GC • Victoria, Canada"
 * Omits empty parts cleanly without empty separators
 */
export function formatVenue(course?: string, city?: string, stateCountry?: string): string {
  const crs = course?.trim() || '';
  const loc = formatLocation(city, stateCountry);
  if (crs && loc) {
    return `${crs} • ${loc}`;
  }
  return crs || loc || '';
}

/**
 * Validates external URL:
 * Must be non-empty, not placeholder like "URL" or "TBD", and must start with http/https
 */
export function isValidUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === 'url' ||
    trimmed.toLowerCase() === 'tbd' ||
    trimmed.toLowerCase() === 'none' ||
    trimmed.toLowerCase() === 'n/a'
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns the best live-scoring URL for a tournament.
 * A sheet-provided URL always wins. PGA TOUR Americas events fall back to
 * the tour leaderboard so routine schedule updates do not require a URL.
 */
export function getLeaderboardUrl(tournament?: Pick<Tournament, 'tour' | 'leaderboard_url'> | null): string {
  if (!tournament) return '';
  if (isValidUrl(tournament.leaderboard_url)) return tournament.leaderboard_url.trim();

  const normalizedTour = (tournament.tour || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (normalizedTour.includes('pga tour americas')) {
    return PGA_TOUR_AMERICAS_LEADERBOARD_URL;
  }

  return '';
}

/**
 * Subtracts calendar days from a YYYY-MM-DD date string without timezone drift.
 * Pure calendar-date math using UTC date components.
 */
export function subtractCalendarDays(calDateStr: string, days: number): string {
  const match = (calDateStr || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '';
  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10) - 1; // 0-indexed for Date UTC
  const d = parseInt(match[3], 10);

  const utcDate = new Date(Date.UTC(y, m, d));
  utcDate.setUTCDate(utcDate.getUTCDate() - days);

  const resY = utcDate.getUTCFullYear();
  const resM = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const resD = String(utcDate.getUTCDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
}

/**
 * Determines tournament category (Current, Preparing, Upcoming, Completed, Cancelled)
 * based on calendar dates and status from the sheet:
 * - CANCELLED: Cancelled events must never appear as PREPARING or CURRENT
 * - COMPLETED: Today is after end_date (or raw status is 'Completed')
 * - CURRENT: Today is on or after start_date AND today is on or before end_date
 * - PREPARING: Today is at least start_date minus 3 days AND today is before start_date
 *   (reflects travel day, practice round, and final prep before competition starts)
 * - UPCOMING: Today is earlier than start_date minus 3 days
 */
export function determineTournamentStatus(
  startDateCal: string,
  endDateCal: string,
  rawStatus?: string,
  todayCal: string = getTodayCalendarDate()
): TournamentStatus {
  const statusLower = (rawStatus || '').trim().toLowerCase();

  // Cancelled events must never appear as PREPARING or CURRENT
  if (statusLower === 'cancelled') {
    return 'Cancelled';
  }

  if (statusLower === 'completed') {
    return 'Completed';
  }

  const effectiveEnd = endDateCal || startDateCal;

  // COMPLETED: today is after end_date
  if (effectiveEnd && effectiveEnd < todayCal) {
    return 'Completed';
  }

  // CURRENT: today is on or after start_date AND today is on or before end_date
  if (startDateCal && effectiveEnd && todayCal >= startDateCal && todayCal <= effectiveEnd) {
    return 'Current';
  }

  if (startDateCal && startDateCal === todayCal) {
    return 'Current';
  }

  // PREPARING vs UPCOMING:
  // PREPARING: today is at least start_date minus 3 calendar days AND today is before start_date
  if (startDateCal && todayCal < startDateCal) {
    const prepStartCal = subtractCalendarDays(startDateCal, 3);
    if (prepStartCal && todayCal >= prepStartCal) {
      return 'Preparing';
    }
    // UPCOMING: today is earlier than start_date minus 3 days
    return 'Upcoming';
  }

  return 'Upcoming';
}

/**
 * Normalizes tournament_type badge (Confirmed, Planned, Qualifier, Pending, etc.)
 */
export function normalizeTournamentType(rawStatus?: string): TournamentType {
  const s = (rawStatus || '').trim();
  const lower = s.toLowerCase();
  if (lower === 'confirmed') return 'Confirmed';
  if (lower === 'planned') return 'Planned';
  if (lower === 'qualifier' || lower.includes('qualif')) return 'Qualifier';
  if (lower === 'pending') return 'Pending';
  return 'Confirmed';
}

/**
 * Creates a URL-friendly slug
 */
function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Transforms a raw row from Google Sheets into our typed Tournament model
 */
export function transformSheetRowToTournament(
  row: GoogleSheetTournamentRow,
  index: number,
  todayCal: string = getTodayCalendarDate()
): Tournament | null {
  // Check if row has minimum necessary info (filter out blank rows in Google Sheets)
  const rawTournamentName = (row.tournament || '').trim();
  const rawStartDate = (row.start_date || '').trim();
  const rawPlayer = (row.player || '').trim();

  if (!rawTournamentName && !rawStartDate) {
    return null; // Empty row
  }

  const playerInfo = normalizePlayer(rawPlayer);
  const playerId = playerInfo ? playerInfo.playerId : 'jonathan-nielsen-1';
  const playerSlug = playerInfo ? playerInfo.slug : 'jonathan';
  const playerName = playerInfo ? playerInfo.displayName : (rawPlayer || 'Jonathan Nielsen');

  const startDateCal = extractCalendarDate(row.start_date);
  const endDateCal = extractCalendarDate(row.end_date) || startDateCal;

  // Fallback tournament name if blank in sheet
  const tourName = (row.tour || '').trim();
  const tournamentName =
    rawTournamentName ||
    (tourName ? `${tourName} Tournament` : 'Scheduled Tournament');

  const status = determineTournamentStatus(startDateCal, endDateCal, row.status, todayCal);
  const tournamentType = normalizeTournamentType(row.status);

  const baseSlug = createSlug(`${playerSlug}-${tournamentName}-${startDateCal || index}`);
  const id = `sheet-${playerSlug}-${startDateCal || index}-${index}`;

  // Parse round scores
  const rounds: Round[] = [];
  const rawRoundValues = [row.round_1, row.round_2, row.round_3, row.round_4];
  rawRoundValues.forEach((val, idx) => {
    const roundNum = idx + 1;
    const strVal = String(val ?? '').trim();
    if (strVal !== '') {
      const numScore = parseInt(strVal, 10);
      rounds.push({
        id: `${id}-r${roundNum}`,
        player_id: playerId,
        tournament_id: id,
        round_number: roundNum,
        score: isNaN(numScore) ? 0 : numScore,
        score_to_par: '',
        ending_position: '',
        birdies: 0,
        bogeys: 0,
        eagles: 0,
        double_bogeys: 0,
        round_status: 'Completed'
      });
    }
  });

  const finishVal = String(row.finish ?? '').trim();
  const scoreToParVal = String(row.score_to_par ?? '').trim();
  const teeTimeVal = String(row.tee_time ?? '').trim();
  const leaderboardUrl = String(row.leaderboard_url ?? '').trim();

  // Extract year for season
  const yearFromDate = startDateCal ? parseInt(startDateCal.slice(0, 4), 10) : 2026;
  const explicitSeason = parseInt(String(row.season ?? ''), 10);
  const season = !isNaN(explicitSeason) ? explicitSeason : (isNaN(yearFromDate) ? 2026 : yearFromDate);

  return {
    id: String(row.event_id ?? '').trim() || id,
    player_id: playerId,
    slug: baseSlug,
    name: tournamentName,
    tour: tourName || 'Professional Golf Tour',
    course: (row.course || '').trim(),
    city: (row.city || '').trim(),
    state: (row.state_country || '').trim(),
    country: (row.state_country || '').trim(),
    state_country: (row.state_country || '').trim(),
    start_date: startDateCal,
    end_date: endDateCal,
    status,
    tournament_type: tournamentType,
    leaderboard_url: leaderboardUrl,
    final_finish: finishVal || undefined,
    final_score_to_par: scoreToParVal || undefined,
    finish: finishVal || undefined,
    score_to_par: scoreToParVal || undefined,
    tee_time: teeTimeVal || undefined,
    notes: (row.notes || '').trim() || undefined,
    rounds: rounds.length > 0 ? rounds : undefined,
    round_1: row.round_1 !== undefined && String(row.round_1).trim() !== '' ? row.round_1 : undefined,
    round_2: row.round_2 !== undefined && String(row.round_2).trim() !== '' ? row.round_2 : undefined,
    round_3: row.round_3 !== undefined && String(row.round_3).trim() !== '' ? row.round_3 : undefined,
    round_4: row.round_4 !== undefined && String(row.round_4).trim() !== '' ? row.round_4 : undefined,
    player_name: playerName,
    season,
    event_id: String(row.event_id ?? '').trim() || undefined,
    event_type: String(row.event_type ?? '').trim() || undefined,
    total_strokes: String(row.total_strokes ?? '').trim() !== '' ? Number(row.total_strokes) : undefined,
    finish_numeric: String(row.finish_numeric ?? '').trim() !== '' ? Number(row.finish_numeric) : undefined,
    made_cut: String(row.made_cut ?? '').trim() !== ''
      ? ['true', 'yes', '1'].includes(String(row.made_cut).trim().toLowerCase())
      : undefined,
    earnings: String(row.earnings ?? '').trim() !== '' ? Number(row.earnings) : undefined
  };
}

export function transformResultRowToTournament(
  row: GoogleSheetTournamentRow,
  index: number
): Tournament | null {
  const result = transformSheetRowToTournament(row, index);
  if (!result) return null;
  return {
    ...result,
    id: String(row.event_id ?? '').trim() || `result-${result.id}`,
    status: 'Completed',
    tournament_type: String(row.event_type ?? '').toLowerCase().includes('qualif') ? 'Qualifier' : result.tournament_type
  };
}


/**
 * In-memory schedule cache
 */
let cachedTournaments: Tournament[] | null = null;
let cachedResults: Tournament[] = [];
let cachedSiteContent: GoogleSheetSiteContentRow[] = [];
let cachedPlayers: GoogleSheetPlayerRow[] = [];
let lastFetchTime: number = 0;
let pendingFetchPromise: Promise<ScheduleFetchResult> | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export interface ScheduleFetchResult {
  tournaments: Tournament[];
  results: Tournament[];
  siteContent: GoogleSheetSiteContentRow[];
  players: GoogleSheetPlayerRow[];
  currentTournaments: Tournament[];
  preparingTournaments: Tournament[];
  upcomingTournaments: Tournament[];
  completedTournaments: Tournament[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  lastUpdated: Date | null;
}

/**
 * Sorts tournaments according to user instructions:
 * 1. Current tournaments first
 * 2. Preparing tournaments (3 calendar days before start date)
 * 3. Upcoming tournaments by nearest start date first
 * 4. Completed tournaments by most recent end date first
 */
export function sortTournaments(tournaments: Tournament[]): Tournament[] {
  const current = tournaments
    .filter((t) => t.status === 'Current')
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  const preparing = tournaments
    .filter((t) => t.status === 'Preparing')
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  const upcoming = tournaments
    .filter((t) => t.status === 'Upcoming')
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  const completed = tournaments
    .filter((t) => t.status === 'Completed')
    .sort((a, b) => b.end_date.localeCompare(a.end_date));

  const cancelled = tournaments
    .filter((t) => t.status === 'Cancelled')
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  return [...current, ...preparing, ...upcoming, ...completed, ...cancelled];
}

/**
 * Fetches tournament data directly from the Google Apps Script Web App endpoint.
 * Single source of truth. Handles network errors gracefully with tasteful fallback.
 */
export async function fetchScheduleFromGoogleSheets(
  forceRefresh: boolean = false
): Promise<ScheduleFetchResult> {
  const now = Date.now();

  // Return cached result if valid and not force refresh
  if (!forceRefresh && cachedTournaments && now - lastFetchTime < CACHE_TTL_MS) {
    const sorted = sortTournaments(cachedTournaments);
    return {
      tournaments: sorted,
      results: cachedResults,
      siteContent: cachedSiteContent,
      players: cachedPlayers,
      currentTournaments: sorted.filter((t) => t.status === 'Current'),
      preparingTournaments: sorted.filter((t) => t.status === 'Preparing'),
      upcomingTournaments: sorted.filter((t) => t.status === 'Upcoming'),
      completedTournaments: sorted.filter((t) => t.status === 'Completed'),
      isLoading: false,
      isError: false,
      errorMessage: null,
      lastUpdated: new Date(lastFetchTime)
    };
  }

  // Deduplicate in-flight fetch
  if (pendingFetchPromise && !forceRefresh) {
    return pendingFetchPromise;
  }

  pendingFetchPromise = (async () => {
    try {
      const response = await fetch(GOOGLE_SHEETS_SCHEDULE_ENDPOINT, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const rawData = await response.json();

      // Backward compatible: old endpoint returned Schedule directly as an array.
      // New endpoint returns every sheet tab in one object.
      const workbook: GoogleSheetsWorkbookResponse = Array.isArray(rawData)
        ? { Schedule: rawData }
        : rawData;

      if (!workbook || typeof workbook !== 'object') {
        throw new Error('Invalid JSON data format');
      }

      const scheduleRows = Array.isArray(workbook.Schedule) ? workbook.Schedule : [];
      const resultRows = Array.isArray(workbook.Results) ? workbook.Results : [];
      const siteContentRows = Array.isArray(workbook['Site Content']) ? workbook['Site Content'] : [];
      const playerRows = Array.isArray(workbook.Players) ? workbook.Players : [];

      const todayCal = getTodayCalendarDate();
      const parsedTournaments: Tournament[] = [];
      const parsedResults: Tournament[] = [];

      scheduleRows.forEach((row: GoogleSheetTournamentRow, idx: number) => {
        const item = transformSheetRowToTournament(row, idx, todayCal);
        if (item) parsedTournaments.push(item);
      });

      resultRows.forEach((row: GoogleSheetTournamentRow, idx: number) => {
        const item = transformResultRowToTournament(row, idx);
        if (item) parsedResults.push(item);
      });

      const sorted = sortTournaments(parsedTournaments);
      const sortedResults = parsedResults.sort((a, b) => b.end_date.localeCompare(a.end_date));

      cachedTournaments = sorted;
      cachedResults = sortedResults;
      cachedSiteContent = siteContentRows;
      cachedPlayers = playerRows;
      lastFetchTime = Date.now();

      return {
        tournaments: sorted,
        results: sortedResults,
        siteContent: siteContentRows,
        players: playerRows,
        currentTournaments: sorted.filter((t) => t.status === 'Current'),
        preparingTournaments: sorted.filter((t) => t.status === 'Preparing'),
        upcomingTournaments: sorted.filter((t) => t.status === 'Upcoming'),
        completedTournaments: sorted.filter((t) => t.status === 'Completed'),
        isLoading: false,
        isError: false,
        errorMessage: null,
        lastUpdated: new Date(lastFetchTime)
      };
    } catch (err) {
      console.warn('Google Sheets schedule endpoint unavailable:', err);

      // Return cached tournaments if available, else empty array with friendly message
      const fallbackList = cachedTournaments ? sortTournaments(cachedTournaments) : [];
      return {
        tournaments: fallbackList,
        results: cachedResults,
        siteContent: cachedSiteContent,
        players: cachedPlayers,
        currentTournaments: fallbackList.filter((t) => t.status === 'Current'),
        preparingTournaments: fallbackList.filter((t) => t.status === 'Preparing'),
        upcomingTournaments: fallbackList.filter((t) => t.status === 'Upcoming'),
        completedTournaments: fallbackList.filter((t) => t.status === 'Completed'),
        isLoading: false,
        isError: true,
        errorMessage: 'Schedule temporarily unavailable.',
        lastUpdated: lastFetchTime ? new Date(lastFetchTime) : null
      };
    } finally {
      pendingFetchPromise = null;
    }
  })();

  return pendingFetchPromise;
}
