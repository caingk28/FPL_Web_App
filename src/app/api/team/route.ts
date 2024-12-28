import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { teamId, isDraft } = await request.json()

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required." },
        { status: 400 }
      )
    }

    if (isDraft) {
      return NextResponse.json(
        { 
          error: "Draft FPL requires authentication. Please sign in at https://draft.premierleague.com first and use your league ID instead of team ID.",
          requiresAuth: true 
        },
        { status: 401 }
      )
    } else {
      // Regular FPL endpoints
      try {
        const [detailsResponse, historyResponse] = await Promise.all([
          axios.get(`https://fantasy.premierleague.com/api/entry/${teamId}/`),
          axios.get(`https://fantasy.premierleague.com/api/entry/${teamId}/history/`)
        ])

        const details = detailsResponse.data
        const history = historyResponse.data

        return NextResponse.json({
          teamName: details.name,
          points: details.summary_overall_points || details.overall_points || 0,
          playerName: `${details.player_first_name || ''} ${details.player_last_name || ''}`.trim(),
          rank: details.summary_overall_rank || details.overall_rank,
          history: history.current || []
        })
      } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message)
        if (error.response?.status === 404) {
          return NextResponse.json(
            { error: "Team not found. Please check the Team ID." },
            { status: 404 }
          )
        }
        throw error
      }
    }
  } catch (error) {
    console.error("Error fetching team data:", error)
    return NextResponse.json(
      { error: "Unable to fetch team data. Please check the Team ID." },
      { status: 500 }
    )
  }
}