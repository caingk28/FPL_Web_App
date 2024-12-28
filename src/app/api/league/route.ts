import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { leagueId, isDraft } = await request.json()

    if (!leagueId) {
      return NextResponse.json(
        { error: "League ID is required." },
        { status: 400 }
      )
    }

    try {
      if (isDraft) {
        // Draft FPL endpoints
        const leagueResponse = await axios.get(
          `https://draft.premierleague.com/api/league/${leagueId}/details`
        )

        const leagueData = leagueResponse.data
        const leagueEntries = leagueData.league_entries || []

        // Fetch each team's event history
        const teamsHistory = await Promise.all(
          leagueEntries.map(async (entry: any) => {
            try {
              const historyResponse = await axios.get(
                `https://draft.premierleague.com/api/entry/${entry.entry_id}/history`
              )
              return {
                entry_id: entry.entry_id,
                history: historyResponse.data
              }
            } catch (error) {
              console.error(`Error fetching history for team ${entry.entry_id}:`, error)
              return {
                entry_id: entry.entry_id,
                history: { history: [] }
              }
            }
          })
        )

        // Sort entries by total points
        const standings = leagueEntries.map(entry => {
          const teamHistory = teamsHistory.find(h => h.entry_id === entry.entry_id)?.history.history || []
          const lastGameweek = teamHistory.length > 0 ? teamHistory[teamHistory.length - 1] : null
          const totalPoints = teamHistory.reduce((sum: number, gw: any) => sum + (gw.points || 0), 0)

          return {
            rank: entry.rank || 0,
            entry_name: entry.entry_name,
            player_name: `${entry.player_first_name} ${entry.player_last_name}`.trim(),
            total: totalPoints,
            last_gameweek: lastGameweek ? {
              event: lastGameweek.event,
              points: lastGameweek.points || 0
            } : null,
            matches_played: entry.matches_played || 0,
            matches_won: entry.matches_won || 0,
            matches_drawn: entry.matches_drawn || 0,
            matches_lost: entry.matches_lost || 0
          }
        }).sort((a, b) => (b.total - a.total))

        // Update ranks based on sorted positions
        standings.forEach((standing, index) => {
          standing.rank = index + 1
        })

        return NextResponse.json({
          leagueName: leagueData.league.name,
          leagueType: 'Draft',
          standings: standings,
          currentGameweek: leagueData.league.current_event || 0
        })
      } else {
        // Regular FPL endpoints
        const response = await axios.get(
          `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`
        )

        const leagueData = response.data
        const standings = (leagueData.standings?.results || []).map((standing: any) => ({
          rank: standing.rank || 0,
          entry_name: standing.entry_name || '',
          player_name: standing.player_name || '',
          total: standing.total || 0,
          last_gameweek: standing.event_total ? {
            event: leagueData.current_event || 0,
            points: standing.event_total
          } : null
        }))

        return NextResponse.json({
          leagueName: leagueData.league?.name || '',
          leagueType: 'Regular',
          standings: standings,
          currentGameweek: leagueData.current_event || 0
        })
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message)
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: `${isDraft ? 'Draft ' : ''}League not found. Please check the League ID.` },
          { status: 404 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error("Error fetching league data:", error)
    return NextResponse.json(
      { error: "Unable to fetch league data. Please check the League ID." },
      { status: 500 }
    )
  }
}