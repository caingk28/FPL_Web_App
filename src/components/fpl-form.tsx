'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useFPLData } from '@/hooks/use-fpl-data'

export function FPLForm() {
  const [id, setId] = useState('')
  const { isLoading, error, data, fetchData } = useFPLData()
  const [activeTab, setActiveTab] = useState<'team' | 'league'>('team')
  const [isDraft, setIsDraft] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id.trim()) return
    await fetchData(id, activeTab, isDraft)
  }

  const renderTeamData = (teamData: any) => (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-lg">{teamData.teamName}</h3>
        <p className="text-sm text-gray-600">Manager: {teamData.playerName}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Points</p>
          <p className="text-lg font-bold">{teamData.points}</p>
        </div>
        {!isDraft && teamData.rank && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Overall Rank</p>
            <p className="text-lg font-bold">{teamData.rank.toLocaleString()}</p>
          </div>
        )}
      </div>
      {!isDraft && teamData.history && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Recent Gameweeks</h4>
          <div className="space-y-2">
            {teamData.history.slice(-5).map((gw: any) => (
              <div key={`gw-${gw.event}`} className="flex justify-between text-sm">
                <span>GW{gw.event}</span>
                <span>{gw.points} pts</span>
                <span>Rank: {gw.rank.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderLeagueData = (leagueData: any) => (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-lg">{leagueData.leagueName}</h3>
        <p className="text-sm text-gray-600">{leagueData.leagueType} League</p>
        {leagueData.currentGameweek > 0 && (
          <p className="text-sm text-gray-600">Current Gameweek: {leagueData.currentGameweek}</p>
        )}
      </div>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">League Standings</h4>
        <div className="space-y-3">
          {leagueData.standings.slice(0, 10).map((standing: any) => (
            <div 
              key={`standing-${standing.rank}-${standing.entry_name}`} 
              className="bg-white p-3 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">#{standing.rank} {standing.entry_name}</span>
                  <p className="text-sm text-gray-600">{standing.player_name}</p>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-bold">{standing.total} pts</span>
                    {standing.last_gameweek && (
                      <span className="text-sm text-gray-600">
                        GW{standing.last_gameweek.event}: {standing.last_gameweek.points} pts
                      </span>
                    )}
                  </div>
                  {leagueData.leagueType === 'Draft' && (
                    <p className="text-sm text-gray-600 mt-1">
                      {standing.matches_won}W {standing.matches_drawn}D {standing.matches_lost}L
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          FPL Data Lookup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Switch
            id="draft-mode"
            checked={isDraft}
            onCheckedChange={setIsDraft}
          />
          <Label htmlFor="draft-mode">Draft Mode</Label>
        </div>

        {isDraft && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md">
            <p className="text-sm">
              Draft FPL requires authentication. Please:
            </p>
            <ol className="list-decimal ml-4 mt-2 text-sm">
              <li>Sign in at <a href="https://draft.premierleague.com" target="_blank" rel="noopener noreferrer" className="underline">draft.premierleague.com</a></li>
              <li>Use your League ID instead of Team ID</li>
              <li>Switch to the League tab below</li>
            </ol>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'team' | 'league')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team" disabled={isDraft}>Team</TabsTrigger>
            <TabsTrigger value="league">League</TabsTrigger>
          </TabsList>
          <TabsContent value="team">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter Team ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isLoading || isDraft}
              />
              <Button type="submit" className="w-full" disabled={isLoading || isDraft}>
                {isLoading ? 'Loading...' : 'Get Team Data'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="league">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder={`Enter ${isDraft ? 'Draft ' : ''}League ID`}
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Loading...' : `Get ${isDraft ? 'Draft ' : ''}League Data`}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            {data.type === 'team' ? renderTeamData(data.data) : renderLeagueData(data.data)}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 