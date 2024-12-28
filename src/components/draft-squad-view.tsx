'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shirt, Star, AlertCircle, TrendingUp, Layout, LayoutGrid } from 'lucide-react'
import { cn } from "@/lib/utils"
import { DraftSquadFormation } from "./draft-squad-formation"
import { Button } from "./ui/button"

interface SquadPlayer {
  id: number
  webName: string
  position: 'GKP' | 'DEF' | 'MID' | 'FWD'
  teamShortName: string
  status: 'available' | 'injured' | 'doubtful' | 'suspended'
  statusInfo?: string
  form: string
  totalPoints: number
  squadPosition: number
  isCaptain: boolean
  isViceCaptain: boolean
}

interface DraftSquadViewProps {
  teamName: string
  manager: string
  players: {
    starting: SquadPlayer[]
    bench: SquadPlayer[]
  }
}

function getPositionColor(position: string) {
  switch (position) {
    case 'GKP': return 'text-yellow-600 dark:text-yellow-500'
    case 'DEF': return 'text-blue-600 dark:text-blue-500'
    case 'MID': return 'text-green-600 dark:text-green-500'
    case 'FWD': return 'text-red-600 dark:text-red-500'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'available': return 'bg-green-500'
    case 'injured': return 'bg-red-500'
    case 'doubtful': return 'bg-yellow-500'
    case 'suspended': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

function PlayerCard({ player, isBench = false }: { player: SquadPlayer, isBench?: boolean }) {
  return (
    <div className={cn(
      "p-3 bg-background rounded-lg border transition-colors",
      isBench ? "opacity-90 hover:opacity-100" : "hover:bg-accent/5",
      player.status !== 'available' && "border-destructive/20"
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center bg-muted",
              getPositionColor(player.position)
            )}>
              <Shirt className="w-5 h-5" />
            </div>
            {(player.isCaptain || player.isViceCaptain) && (
              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                <Star className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{player.webName}</span>
              {player.status !== 'available' && (
                <Badge variant="outline" className="text-destructive border-destructive/50">
                  {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={getPositionColor(player.position)}>{player.position}</span>
              <span>•</span>
              <span>{player.teamShortName}</span>
              {player.statusInfo && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {player.statusInfo}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{player.totalPoints}</span>
          </div>
          <span className="text-sm text-muted-foreground">Form: {player.form}</span>
        </div>
      </div>
    </div>
  )
}

export function DraftSquadView({ teamName, manager, players }: DraftSquadViewProps) {
  const [view, setView] = useState<'list' | 'formation'>('list')

  return (
    <div className="space-y-6">
      <Card className="bg-muted/5">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{teamName}</h3>
              <p className="text-sm text-muted-foreground">Manager: {manager}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('list')}
                className={cn(view === 'list' && "bg-muted")}
              >
                <Layout className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('formation')}
                className={cn(view === 'formation' && "bg-muted")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Formation
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {view === 'list' ? (
            <div className="space-y-6">
              {/* Starting XI */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Starting XI</h4>
                </div>
                <div className="grid gap-2">
                  {players.starting.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </div>

              {/* Bench */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-muted-foreground" />
                  <h4 className="font-semibold">Bench</h4>
                </div>
                <div className="grid gap-2">
                  {players.bench.map((player) => (
                    <PlayerCard key={player.id} player={player} isBench={true} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <DraftSquadFormation players={players} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 