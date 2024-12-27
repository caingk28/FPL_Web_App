interface TeamData {
  teamName: string;
  points: number;
  playerName: string;
  rank?: number;
  history?: Array<{
    event: number;
    points: number;
    total_points: number;
    rank: number;
    rank_sort: number;
    overall_rank: number;
    bank: number;
    value: number;
    event_transfers: number;
    event_transfers_cost: number;
    points_on_bench: number;
  }>;
}

interface LeagueData {
  leagueName: string;
  standings: Array<{
    entry_name: string;
    player_name: string;
    rank: number;
    total: number;
  }>;
}

interface DraftLeagueData {
  league: {
    name: string;
    id: number;
  };
  standings: Array<{
    team_name: string;
    player_name: string;
    rank: number;
    total: number;
  }>;
}

export async function fetchTeamData(teamId: string, isDraft: boolean = false): Promise<{ data?: TeamData; error?: string }> {
  try {
    const response = await fetch('/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId, isDraft }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Failed to fetch team data' };
    }

    return { data };
  } catch (error) {
    console.error('Error fetching team data:', error);
    return { error: 'An error occurred while fetching team data' };
  }
}

export async function fetchLeagueData(leagueId: string, isDraft: boolean = false): Promise<{ data?: LeagueData | DraftLeagueData; error?: string }> {
  try {
    const response = await fetch('/api/league', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leagueId, isDraft }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Failed to fetch league data' };
    }

    return { data };
  } catch (error) {
    console.error('Error fetching league data:', error);
    return { error: 'An error occurred while fetching league data' };
  }
} 