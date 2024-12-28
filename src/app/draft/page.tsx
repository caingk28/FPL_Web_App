'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DraftLeagueList } from "@/components/draft-league-list"
import { DraftSquadView } from "@/components/draft-squad-view"
import { DraftLeagueListSkeleton } from "@/components/draft-league-list-skeleton"
import { DraftSquadViewSkeleton } from "@/components/draft-squad-view-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, AlertCircle } from 'lucide-react'

export default function DraftPage() {
  const [loading, setLoading] = useState(false)
  const [loadingSquad, setLoadingSquad] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [squadData, setSquadData] = useState<any | null>(null)

  const loadLeagueData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/draft/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leagueId: '49117' }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load league data')
      }

      // Extract teams from the league data
      const leagueData = data.results[0].data
      const teamsWithRank = leagueData.league_entries.map((entry: any) => {
        const standing = leagueData.standings.find((s: any) => s.league_entry === entry.id)
        return {
          ...entry,
          rank: standing?.rank || 0,
          total: standing?.total || 0
        }
      }).sort((a: any, b: any) => a.rank - b.rank)

      setTeams(teamsWithRank)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadSquadData = async (teamId: number) => {
    setLoadingSquad(true)
    setError(null)
    try {
      const response = await fetch('/api/draft/squad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          leagueId: '49117',
          teamId: teamId.toString()
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load squad data')
      }

      setSquadData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoadingSquad(false)
    }
  }

  const handleTeamSelect = (teamId: number) => {
    setSelectedTeamId(teamId)
    loadSquadData(teamId)
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight">FPL Draft League</CardTitle>
          <CardDescription className="text-lg">
            View league standings and team squads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center">
              <Button 
                onClick={loadLeagueData}
                disabled={loading}
                size="lg"
                className="min-w-[200px]"
              >
                {loading ? 'Loading...' : 'Load League Data'}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            {(teams.length > 0 || loading) && (
              <Tabs defaultValue="teams" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="teams" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    League Table
                  </TabsTrigger>
                  <TabsTrigger value="squad" disabled={!selectedTeamId} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Squad View
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="teams">
                  {loading ? (
                    <DraftLeagueListSkeleton />
                  ) : (
                    <DraftLeagueList 
                      teams={teams}
                      onTeamSelect={handleTeamSelect}
                      selectedTeamId={selectedTeamId}
                    />
                  )}
                </TabsContent>

                <TabsContent value="squad">
                  {loadingSquad ? (
                    <DraftSquadViewSkeleton />
                  ) : (
                    squadData && <DraftSquadView {...squadData} />
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 