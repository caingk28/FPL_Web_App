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
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="font-bold text-xl text-gray-900">{teamData.teamName}</h3>
        <p className="text-sm text-gray-600 mt-1">Manager: {teamData.playerName}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
          <p className="text-sm font-medium text-gray-600">Total Points</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{teamData.points}</p>
        </div>
        {!isDraft && teamData.rank && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
            <p className="text-sm font-medium text-gray-600">Overall Rank</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{teamData.rank.toLocaleString()}</p>
          </div>
        )}
      </div>
      {!isDraft && teamData.history && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Recent Gameweeks</h4>
          <div className="space-y-2">
            {teamData.history.slice(-5).map((gw: any) => (
              <div 
                key={`gw-${gw.event}`} 
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all"
              >
                <span className="font-medium text-gray-900">GW{gw.event}</span>
                <span className="text-gray-600">{gw.points} pts</span>
                <span className="text-sm text-gray-500">Rank: {gw.rank.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderLeagueData = (leagueData: any) => (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="font-bold text-xl text-gray-900">{leagueData.leagueName}</h3>
        <p className="text-sm text-gray-600 mt-1">{leagueData.leagueType} League</p>
        {leagueData.currentGameweek > 0 && (
          <p className="text-sm text-gray-600 mt-1">Current Gameweek: {leagueData.currentGameweek}</p>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">League Standings</h4>
        <div className="space-y-3">
          {leagueData.standings.slice(0, 10).map((standing: any) => (
            <div 
              key={`standing-${standing.rank}-${standing.entry_name}`} 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">#{standing.rank}</span>
                    <span className="font-medium text-gray-900">{standing.entry_name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{standing.player_name}</p>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-gray-900">{standing.total} pts</span>
                    {standing.last_gameweek && (
                      <span className="text-sm text-gray-600">
                        GW{standing.last_gameweek.event}: {standing.last_gameweek.points} pts
                      </span>
                    )}
                  </div>
                  {leagueData.leagueType === 'Draft' && (
                    <p className="text-sm text-gray-600 mt-1 font-medium">
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
    <Card className="w-full max-w-xl mx-auto shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          FPL Data Lookup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="draft-mode"
              checked={isDraft}
              onCheckedChange={setIsDraft}
            />
            <Label htmlFor="draft-mode" className="font-medium">Draft Mode</Label>
          </div>
        </div>

        {isDraft && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            <p className="text-sm font-medium">
              Draft FPL requires authentication. Please:
            </p>
            <ol className="list-decimal ml-4 mt-2 text-sm space-y-1">
              <li>Sign in at <a href="https://draft.premierleague.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">draft.premierleague.com</a></li>
              <li>Use your League ID instead of Team ID</li>
              <li>Switch to the League tab below</li>
            </ol>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'team' | 'league')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="team" disabled={isDraft} className="text-sm font-medium">Team</TabsTrigger>
            <TabsTrigger value="league" className="text-sm font-medium">League</TabsTrigger>
          </TabsList>
          <TabsContent value="team" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-id">Team ID</Label>
                <Input
                  id="team-id"
                  type="text"
                  placeholder="Enter your FPL Team ID (e.g., 91928)"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={isLoading || isDraft}
                  className="transition-all duration-200"
                />
                <p className="text-sm text-gray-500">Find your Team ID in the URL when viewing your team on fantasy.premierleague.com</p>
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all duration-200 hover:opacity-90" 
                disabled={isLoading || isDraft}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span>Loading...</span>
                  </span>
                ) : (
                  'Get Team Data'
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="league" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="league-id">League ID</Label>
                <Input
                  id="league-id"
                  type="text"
                  placeholder={`Enter your ${isDraft ? 'Draft ' : ''}League ID (e.g., 314)`}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
                <p className="text-sm text-gray-500">
                  {isDraft 
                    ? "Find your Draft League ID in the URL when viewing your league on draft.premierleague.com" 
                    : "Find your League ID in the URL when viewing your league on fantasy.premierleague.com"
                  }
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all duration-200 hover:opacity-90" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span>Loading...</span>
                  </span>
                ) : (
                  `Get ${isDraft ? 'Draft ' : ''}League Data`
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {isLoading && (
          <div className="p-4 bg-gray-50 text-gray-600 rounded-lg border border-gray-100 animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            <p className="text-sm font-medium text-center mt-2">Loading {activeTab === 'team' ? 'team' : 'league'} data...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in duration-200">
            {data.type === 'team' ? renderTeamData(data.data) : renderLeagueData(data.data)}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 