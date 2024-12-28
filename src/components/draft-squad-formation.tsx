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

const FORMATIONS: Record<string, Record<string, [number, number][]>> = {
  '4-4-2': {
    GKP: [[50, 87]], // Moved goalkeeper down slightly
    DEF: [[15, 65], [38, 65], [62, 65], [85, 65]], // Defenders stay at same position
    MID: [[15, 40], [38, 40], [62, 40], [85, 40]],
    FWD: [[35, 15], [65, 15]]
  },
  '4-3-3': {
    GKP: [[50, 87]],
    DEF: [[15, 65], [38, 65], [62, 65], [85, 65]],
    MID: [[35, 40], [50, 40], [65, 40]],
    FWD: [[25, 15], [50, 15], [75, 15]]
  },
  '3-5-2': {
    GKP: [[50, 87]],
    DEF: [[30, 65], [50, 65], [70, 65]],
    MID: [[15, 40], [35, 40], [50, 40], [65, 40], [85, 40]],
    FWD: [[35, 15], [65, 15]]
  }
};

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
    'ARS': 'ars',
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
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform hover:scale-110"
              onError={(e) => {
                console.log('Kit image failed to load for:', player.teamShortName);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="absolute -top-1.5 -right-1.5 flex gap-1.5">
              {player.isCaptain && (
                <div className="bg-primary rounded-full p-1.5 shadow-md">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
              )}
              <div className="bg-background/90 backdrop-blur-sm rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-md cursor-pointer hover:bg-background/95">
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
              </div>
            </div>
          </div>
          <div className="text-[9px] sm:text-xs font-medium text-center line-clamp-1 text-white drop-shadow-md mt-1.5 max-w-[100px] sm:max-w-[120px]">
            {player.webName}
          </div>
          {player.status !== 'available' && (
            <div className="text-[8px] sm:text-[10px] text-destructive font-medium drop-shadow-md mt-0.5">
              {player.status.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-[8px] sm:text-[10px] text-white/90 mt-0.5 drop-shadow-md">
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
    'ARS': 'ars',
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
      <Card className="p-3 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shirt className="w-5 h-5 text-muted-foreground" />
          <h4 className="font-semibold text-lg">Substitutes</h4>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-10 w-full place-items-center">
            {players.bench.map(player => (
              <div 
                key={player.id} 
                className="flex flex-col items-center w-full max-w-[140px]"
              >
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img 
                        src={`/kit-images/${teamCodeMap[player.teamShortName] || 'default-kit'}-2024.png`}
                        alt={player.teamShortName}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform hover:scale-110"
                        onError={(e) => {
                          console.log('Bench kit image failed to load for:', player.teamShortName);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="absolute -top-1.5 -right-1.5 flex gap-1.5">
                        {player.isCaptain && (
                          <div className="bg-primary rounded-full p-1.5 shadow-md">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className="bg-background/90 backdrop-blur-sm rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-md cursor-pointer hover:bg-background/95">
                          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm sm:text-base font-medium text-center line-clamp-1 mt-2">
                      {player.webName}
                    </div>
                    {player.status !== 'available' && (
                      <div className="text-xs sm:text-sm text-destructive font-medium mt-1">
                        {player.status.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
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