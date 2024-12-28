'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeagueEntry {
  entry_id: number
  entry_name: string
  id: number
  player_first_name: string
  player_last_name: string
  short_name: string
}

interface Standing {
  league_entry: number
  rank: number
  total: number
  event_total: number
}

interface TeamDisplay extends LeagueEntry {
  rank: number
  total: number
  event_total: number
}

export default function DraftTest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)
  const [squadData, setSquadData] = useState<any | null>(null)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)

  const testDraftApi = async () => {
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
        throw new Error(data.error || 'Failed to test API')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const testSquadApi = async () => {
    if (!selectedTeamId) {
      setError('Please select a team first')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/draft/squad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          leagueId: '49117',
          teamId: selectedTeamId.toString()
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch squad data')
      }

      setSquadData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Combine league entries with standings
  const getTeamList = (): TeamDisplay[] => {
    if (!results?.results?.[0]?.data) return []

    const leagueData = results.results[0].data
    const entries: LeagueEntry[] = leagueData.league_entries || []
    const standings: Standing[] = leagueData.standings || []

    return entries.map(entry => {
      const standing = standings.find(s => s.league_entry === entry.id)
      return {
        ...entry,
        rank: standing?.rank || 0,
        total: standing?.total || 0,
        event_total: standing?.event_total || 0
      }
    }).sort((a, b) => a.rank - b.rank)
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Draft API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="league" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="league">League Test</TabsTrigger>
              <TabsTrigger value="squad">Squad Test</TabsTrigger>
            </TabsList>

            <TabsContent value="league" className="space-y-4">
              <Button 
                onClick={testDraftApi}
                disabled={loading}
              >
                {loading ? 'Testing League API...' : 'Test League API'}
              </Button>

              {results && (
                <div className="space-y-4">
                  <h3 className="font-semibold">League Teams</h3>
                  <div className="grid gap-3">
                    {getTeamList().map((team) => (
                      <div 
                        key={team.entry_id}
                        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                          selectedTeamId === team.entry_id 
                            ? 'bg-primary/5 border-primary' 
                            : 'bg-card hover:bg-accent'
                        }`}
                        onClick={() => setSelectedTeamId(team.entry_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{team.entry_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Manager: {team.player_first_name} {team.player_last_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Rank: {team.rank}</p>
                            <p className="text-sm text-muted-foreground">
                              Points: {team.total}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="squad" className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={testSquadApi}
                  disabled={loading || !selectedTeamId}
                >
                  {loading ? 'Loading Squad...' : 'Load Squad'}
                </Button>
                {!selectedTeamId && (
                  <p className="text-sm text-muted-foreground">
                    Select a team from the League tab first
                  </p>
                )}
              </div>

              {squadData && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">{squadData.teamName}</h3>
                    <p className="text-sm text-gray-600 mb-4">Manager: {squadData.manager}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Starting XI</h4>
                        <div className="grid gap-2">
                          {squadData.players.starting.map((player: any) => (
                            <div key={player.id} className="p-2 bg-white rounded border">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{player.webName}</span>
                                  <span className="text-sm text-gray-500 ml-2">({player.position})</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {player.teamShortName}
                                  {player.isCaptain && ' (C)'}
                                  {player.isViceCaptain && ' (VC)'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Bench</h4>
                        <div className="grid gap-2">
                          {squadData.players.bench.map((player: any) => (
                            <div key={player.id} className="p-2 bg-white rounded border">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{player.webName}</span>
                                  <span className="text-sm text-gray-500 ml-2">({player.position})</span>
                                </div>
                                <div className="text-sm text-gray-600">{player.teamShortName}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg mt-4">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 