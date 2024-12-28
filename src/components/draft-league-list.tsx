'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"

interface TeamDisplay {
  entry_id: number
  entry_name: string
  player_first_name: string
  player_last_name: string
  rank: number
  total: number
}

interface DraftLeagueListProps {
  teams: TeamDisplay[]
  onTeamSelect: (teamId: number) => void
  selectedTeamId: number | null
}

export function DraftLeagueList({ teams, onTeamSelect, selectedTeamId }: DraftLeagueListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">League Teams</h3>
      <div className="grid gap-3">
        {teams.map((team) => (
          <div 
            key={team.entry_id}
            className={`p-4 rounded-lg border transition-colors cursor-pointer ${
              selectedTeamId === team.entry_id 
                ? 'bg-primary/5 border-primary' 
                : 'bg-card hover:bg-accent'
            }`}
            onClick={() => onTeamSelect(team.entry_id)}
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
  )
} 