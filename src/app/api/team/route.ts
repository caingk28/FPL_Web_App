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

        return NextResponse.json({
          teamName: detailsResponse.data.name,
          points: detailsResponse.data.summary_overall_points,
          playerName: detailsResponse.data.player_first_name + ' ' + detailsResponse.data.player_last_name,
          rank: detailsResponse.data.summary_overall_rank,
          history: historyResponse.data.current
        })
      } catch (error: any) {
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