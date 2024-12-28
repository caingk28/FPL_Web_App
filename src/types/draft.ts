// Draft League Types
export interface DraftLeague {
  id: number;
  name: string;
  created: string;
  closed: boolean;
  max_entries: number;
  league_type: string;
  scoring: string;
  league_points_for_win: number;
  league_points_for_loss: number;
  league_points_for_draw: number;
  ko_first_round: number;
  min_ko_rounds: number;
  draft_pick_time_limit: number;
  draft_status: string;
  trades_time_limit: number;
  squad_size: number;
  squad_max_play: number;
  ko_rounds: number;
  code_privacy: string;
  trades: string;
  transactions: string;
  processing_status: string;
}

// Draft Team Types
export interface DraftTeam {
  id: number;
  entry_id: number;
  entry_name: string;
  player_first_name: string;
  player_last_name: string;
  short_name: string;
  waiver_pick: number;
  matches_won: number;
  matches_drawn: number;
  matches_lost: number;
  total_points: number;
  rank: number;
}

// Player Types
export interface DraftPlayer {
  id: number;
  element_type: number; // 1: GKP, 2: DEF, 3: MID, 4: FWD
  first_name: string;
  second_name: string;
  web_name: string;
  team: number;
  status: string;
  chance_of_playing_next_round: number | null;
  chance_of_playing_this_round: number | null;
  news: string;
  news_added: string | null;
  total_points: number;
  form: string;
}

// Squad Types
export interface DraftSquad {
  entry_id: number;
  picks: DraftPick[];
}

export interface DraftPick {
  element: number; // Player ID
  position: number; // Position in squad (1-15)
  is_captain: boolean;
  is_vice_captain: boolean;
  multiplier: number;
}

// Combined Squad Info (what we'll return from our API)
export interface SquadInfo {
  manager: string;
  teamName: string;
  players: {
    starting: SquadPlayer[];
    bench: SquadPlayer[];
  };
}

export interface SquadPlayer {
  id: number;
  webName: string;
  position: 'GKP' | 'DEF' | 'MID' | 'FWD';
  teamShortName: string;
  status: 'available' | 'injured' | 'doubtful' | 'suspended';
  statusInfo?: string;
  form: string;
  totalPoints: number;
  squadPosition: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
} 