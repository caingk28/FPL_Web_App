'use client'

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Star, Shirt, Info } from "lucide-react"
import type { SquadPlayer } from "@/types/draft"

interface FormationProps {
  players: {
    starting: SquadPlayer[]
    bench: SquadPlayer[]
  }
}

const FORMATIONS = {
  '4-4-2': {
    GKP: [[50, 90]], // Moved goalkeeper closer to bottom
    DEF: [[15, 70], [38, 70], [62, 70], [85, 70]], // Spread defenders wider
    MID: [[15, 45], [38, 45], [62, 45], [85, 45]], // Spread midfielders wider
    FWD: [[35, 20], [65, 20]] // Spread forwards wider and higher up
  },
  '4-3-3': {
    GKP: [[50, 90]],
    DEF: [[15, 70], [38, 70], [62, 70], [85, 70]],
    MID: [[35, 45], [50, 45], [65, 45]],
    FWD: [[25, 20], [50, 20], [75, 20]]
  },
  '3-5-2': {
    GKP: [[50, 90]],
    DEF: [[30, 70], [50, 70], [70, 70]],
    MID: [[15, 45], [35, 45], [50, 45], [65, 45], [85, 45]],
    FWD: [[35, 20], [65, 20]]
  }
}

function detectFormation(players: SquadPlayer[]): keyof typeof FORMATIONS {
  const positions = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('Detected positions:', positions);

  if (positions.DEF === 4 && positions.MID === 4 && positions.FWD === 2) return '4-4-2'
  if (positions.DEF === 4 && positions.MID === 3 && positions.FWD === 3) return '4-3-3'
  if (positions.DEF === 3 && positions.MID === 5 && positions.FWD === 2) return '3-5-2'
  
  // Log the default case
  console.log('Using default formation 4-4-2');
  return '4-4-2' // default formation
}

function PlayerPosition({ player, position: [x, y] }: { player: SquadPlayer, position: [number, number] }) {
  const teamCodeMap: Record<string, string> = {
    'ARS': 'arsenal',
    'AVL': 'astonvilla',
    'BOU': 'bou',
    'BRE': 'brentford',
    'BHA': 'brighton',
    'CHE': 'chelsea',
    'CRY': 'crystal',
    'EVE': 'everton',
    'FUL': 'fulham',
    'IPS': 'ipswich',
    'LEI': 'leicester',
    'LIV': 'liv',
    'MCI': 'mancity',
    'MUN': 'manutd',
    'NEW': 'newcastle',
    'NFO': 'nfo',
    'TOT': 'tottenham',
    'WHU': 'westham',
    'WOL': 'wolves'
  };

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={`/kit-images/${teamCodeMap[player.teamShortName] || 'default-kit'}-2024.png`}
              alt={player.teamShortName}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              onError={(e) => {
                console.log('Kit image failed to load for:', player.teamShortName);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="absolute -top-1 -right-1 flex gap-1">
              {player.isCaptain && (
                <div className="bg-primary rounded-full p-1 shadow-md">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                </div>
              )}
              <div className="bg-background/90 backdrop-blur-sm rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-md cursor-pointer">
                <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-foreground" />
              </div>
            </div>
          </div>
          <div className="text-xs sm:text-sm font-medium text-center line-clamp-1 text-white drop-shadow-md mt-1">
            {player.webName}
          </div>
          {player.status !== 'available' && (
            <div className="text-[10px] sm:text-xs text-destructive font-medium drop-shadow-md mt-0.5">
              {player.status.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-[10px] sm:text-xs text-white/90 mt-0.5 drop-shadow-md">
            {player.teamShortName}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DraftSquadFormation({ players }: FormationProps) {
  const formation = detectFormation(players.starting);
  const formationPositions = FORMATIONS[formation];
  
  console.log('Formation:', formation);
  console.log('Starting XI:', players.starting.map(p => `${p.webName} (${p.position})`));
  console.log('Bench players:', players.bench.map(p => `${p.webName} (${p.position})`));

  // Group players by position for easier assignment
  const playersByPosition = players.starting.reduce((acc, player) => {
    if (!acc[player.position]) acc[player.position] = [];
    acc[player.position].push(player);
    return acc;
  }, {} as Record<string, SquadPlayer[]>);

  const teamCodeMap: Record<string, string> = {
    'ARS': 'arsenal',
    'AVL': 'astonvilla',
    'BOU': 'bou',
    'BRE': 'brentford',
    'BHA': 'brighton',
    'CHE': 'chelsea',
    'CRY': 'crystal',
    'EVE': 'everton',
    'FUL': 'fulham',
    'IPS': 'ipswich',
    'LEI': 'leicester',
    'LIV': 'liv',
    'MCI': 'mancity',
    'MUN': 'manutd',
    'NEW': 'newcastle',
    'NFO': 'nfo',
    'TOT': 'tottenham',
    'WHU': 'westham',
    'WOL': 'wolves'
  };

  return (
    <div className="w-full space-y-4">
      {/* Formation View */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[2/1.2] bg-[#12a34b] rounded-lg overflow-hidden">
        {/* Pitch markings */}
        <div className="absolute inset-2 sm:inset-4 border-2 border-white/40">
          <div className="absolute left-0 right-0 top-[33%] border-t-2 border-white/40" />
          <div className="absolute w-[40%] h-[20%] left-[30%] top-0 border-2 border-white/40" />
          <div className="absolute w-[40%] h-[20%] left-[30%] bottom-0 border-2 border-white/40" />
          <div className="absolute w-[20%] h-[10%] left-[40%] top-0 border-2 border-white/40" />
          <div className="absolute w-[20%] h-[10%] left-[40%] bottom-0 border-2 border-white/40" />
          <div className="absolute left-1/2 top-1/2 w-16 sm:w-24 h-16 sm:h-24 rounded-full border-2 border-white/40 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white/40 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Players */}
        {Object.entries(formationPositions).map(([position, positions]) => 
          positions.map((coords, idx) => {
            const player = playersByPosition[position]?.[idx];
            if (!player) {
              console.log(`No player found for position ${position} index ${idx}`);
              return null;
            }
            return (
              <PlayerPosition 
                key={player.id} 
                player={player} 
                position={coords}
              />
            );
          })
        )}
      </div>

      {/* Bench */}
      <Card className="p-2 sm:p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold">Substitutes</h4>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 w-full place-items-center">
            {players.bench.map(player => (
              <div 
                key={player.id} 
                className="flex flex-col items-center w-full max-w-[120px]"
              >
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img 
                        src={`/kit-images/${teamCodeMap[player.teamShortName] || 'default-kit'}-2024.png`}
                        alt={player.teamShortName}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        onError={(e) => {
                          console.log('Bench kit image failed to load for:', player.teamShortName);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="absolute -top-1 -right-1 flex gap-1">
                        {player.isCaptain && (
                          <div className="bg-primary rounded-full p-1 shadow-md">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className="bg-background/90 backdrop-blur-sm rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-md cursor-pointer">
                          <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-center line-clamp-1 mt-1">
                      {player.webName}
                    </div>
                    {player.status !== 'available' && (
                      <div className="text-[10px] sm:text-xs text-destructive font-medium mt-0.5">
                        {player.status.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                      {player.teamShortName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
} 