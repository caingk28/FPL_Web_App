import { NextResponse } from 'next/server'
import type { DraftLeague, DraftTeam, DraftPlayer, DraftSquad, SquadInfo, SquadPlayer } from '@/types/draft'

// Helper function to map element type to position string
function getPosition(elementType: number): 'GKP' | 'DEF' | 'MID' | 'FWD' {
  switch (elementType) {
    case 1: return 'GKP'
    case 2: return 'DEF'
    case 3: return 'MID'
    case 4: return 'FWD'
    default: throw new Error(`Invalid element type: ${elementType}`)
  }
}

// Helper function to map player status
function getStatus(
  status: string,
  chanceNextRound: number | null,
  chanceThisRound: number | null
): { status: 'available' | 'injured' | 'doubtful' | 'suspended', info?: string } {
  if (status === 'a') return { status: 'available' }
  if (status === 'i') return { status: 'injured' }
  if (status === 's') return { status: 'suspended' }
  if (chanceNextRound !== null && chanceNextRound < 100) {
    return { 
      status: 'doubtful',
      info: `${chanceNextRound}% chance of playing`
    }
  }
  return { status: 'available' }
}

export async function POST(request: Request) {
  try {
    const { leagueId, teamId } = await request.json()
    console.log('Received request with:', { leagueId, teamId })

    if (!leagueId || !teamId) {
      console.log('Missing required parameters')
      return NextResponse.json(
        { error: 'League ID and Team ID are required' },
        { status: 400 }
      )
    }

    // Log URLs being fetched
    console.log('Fetching from URLs:', {
      league: `https://draft.premierleague.com/api/league/${leagueId}/details`,
      bootstrap: 'https://draft.premierleague.com/api/bootstrap-static',
      public: `https://draft.premierleague.com/api/entry/${teamId}/public`
    })

    // First batch of requests
    const [leagueResponse, bootstrapResponse, publicResponse] = await Promise.all([
      fetch(`https://draft.premierleague.com/api/league/${leagueId}/details`),
      fetch('https://draft.premierleague.com/api/bootstrap-static'),
      fetch(`https://draft.premierleague.com/api/entry/${teamId}/public`)
    ])

    // Log response statuses
    console.log('Initial response statuses:', {
      league: leagueResponse.status,
      bootstrap: bootstrapResponse.status,
      public: publicResponse.status
    })

    if (!leagueResponse.ok || !bootstrapResponse.ok || !publicResponse.ok) {
      console.log('Failed responses:', {
        league: leagueResponse.ok ? 'OK' : 'Failed',
        bootstrap: bootstrapResponse.ok ? 'OK' : 'Failed',
        public: publicResponse.ok ? 'OK' : 'Failed'
      })
      throw new Error('Failed to fetch initial data')
    }

    // Parse initial responses
    console.log('Parsing initial response data...')
    const leagueData: { league: DraftLeague, league_entries: DraftTeam[] } = await leagueResponse.json()
    const bootstrapData: { elements: DraftPlayer[], teams: { id: number, short_name: string }[] } = await bootstrapResponse.json()
    const publicData = await publicResponse.json()

    // Get current event (gameweek) from public data
    const currentEvent = publicData.entry.current_event || 1
    console.log('Current event:', currentEvent)

    // Fetch event (gameweek) data
    console.log('Fetching event data:', `https://draft.premierleague.com/api/entry/${teamId}/event/${currentEvent}`)
    const eventResponse = await fetch(`https://draft.premierleague.com/api/entry/${teamId}/event/${currentEvent}`)

    if (!eventResponse.ok) {
      console.log('Failed to fetch event data:', eventResponse.status)
      throw new Error('Failed to fetch event data')
    }

    const eventData = await eventResponse.json()
    console.log('Event data received')

    // Find the team in the league
    const team = leagueData.league_entries.find(entry => entry.entry_id.toString() === teamId)
    if (!team) {
      console.log('Team not found in league. Team ID:', teamId)
      return NextResponse.json(
        { error: 'Team not found in league' },
        { status: 404 }
      )
    }

    // Transform squad data using event data
    const transformedPlayers: SquadPlayer[] = eventData.picks.map(pick => {
      const player = bootstrapData.elements.find(p => p.id === pick.element)
      if (!player) throw new Error(`Player not found: ${pick.element}`)

      const team = bootstrapData.teams.find(t => t.id === player.team)
      if (!team) throw new Error(`Team not found: ${player.team}`)

      const status = getStatus(
        player.status,
        player.chance_of_playing_next_round,
        player.chance_of_playing_this_round
      )

      return {
        id: player.id,
        webName: player.web_name,
        position: getPosition(player.element_type),
        teamShortName: team.short_name,
        status: status.status,
        statusInfo: status.info,
        form: player.form,
        totalPoints: player.total_points,
        squadPosition: pick.position,
        isCaptain: pick.is_captain,
        isViceCaptain: pick.is_vice_captain
      }
    })

    // Split into starting and bench
    const squadInfo: SquadInfo = {
      manager: `${team.player_first_name} ${team.player_last_name}`,
      teamName: team.entry_name,
      players: {
        starting: transformedPlayers.filter(p => p.squadPosition <= 11)
          .sort((a, b) => a.squadPosition - b.squadPosition),
        bench: transformedPlayers.filter(p => p.squadPosition > 11)
          .sort((a, b) => a.squadPosition - b.squadPosition)
      }
    }

    return NextResponse.json(squadInfo)

  } catch (error) {
    console.error('Detailed error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch squad data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 