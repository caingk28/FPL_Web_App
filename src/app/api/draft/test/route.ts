import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { leagueId } = await request.json()
    console.log('Testing draft API with league ID:', leagueId)

    if (!leagueId) {
      return NextResponse.json(
        { error: 'League ID is required' },
        { status: 400 }
      )
    }

    // Test all required endpoints
    const endpoints = [
      `https://draft.premierleague.com/api/league/${leagueId}/details`,
      `https://draft.premierleague.com/api/bootstrap-static`,
      // We'll get the entry ID from league details before testing squad endpoint
    ]

    console.log('Testing endpoints:', endpoints)

    const results = await Promise.all(
      endpoints.map(async (url) => {
        try {
          console.log(`Fetching ${url}...`)
          const response = await fetch(url)
          
          if (!response.ok) {
            console.error(`Failed to fetch ${url}:`, {
              status: response.status,
              statusText: response.statusText
            })
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
          }

          const data = await response.json()
          console.log(`Successfully fetched ${url}`)
          
          return {
            endpoint: url,
            status: response.status,
            data: data
          }
        } catch (error) {
          console.error(`Error fetching ${url}:`, error)
          throw error
        }
      })
    )

    // If we got league details successfully, try to get a team's squad
    if (results[0].data.league_entries?.length > 0) {
      const firstTeamId = results[0].data.league_entries[0].entry_id
      console.log('Testing squad endpoint with team ID:', firstTeamId)
      
      const squadUrl = `https://draft.premierleague.com/api/entry/${firstTeamId}/squad`
      const squadResponse = await fetch(squadUrl)
      
      if (squadResponse.ok) {
        const squadData = await squadResponse.json()
        results.push({
          endpoint: squadUrl,
          status: squadResponse.status,
          data: squadData
        })
      } else {
        console.error('Failed to fetch squad data:', {
          status: squadResponse.status,
          statusText: squadResponse.statusText
        })
      }
    }

    return NextResponse.json({
      message: 'API endpoints tested successfully',
      results
    })

  } catch (error) {
    console.error('Error testing draft API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test draft API endpoints',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 