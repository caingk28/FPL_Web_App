import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DraftLeagueDetailsProps {
  data: {
    leagueName: string;
    standings: Array<{
      entry_name: string;
      player_name: string;
      rank: number;
      total: number;
      matches_won: number;
      matches_drawn: number;
      matches_lost: number;
      matches?: Array<{
        event: number;
        points: number;
        opponent: string;
        result: 'W' | 'D' | 'L';
      }>;
    }>;
    transactions?: Array<{
      date: string;
      type: 'waiver' | 'free';
      player_in: string;
      player_out: string;
      manager: string;
    }>;
  };
}

export function DraftLeagueDetails({ data }: DraftLeagueDetailsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{data.leagueName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="squads">Squads</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="standings" className="mt-4">
            <div className="space-y-4">
              {data.standings.map((team) => (
                <div
                  key={`${team.rank}-${team.entry_name}`}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">#{team.rank}</span>
                      <span className="font-medium text-gray-900">{team.entry_name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{team.player_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{team.total} pts</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {team.matches_won}W {team.matches_drawn}D {team.matches_lost}L
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="mt-4">
            <div className="space-y-4">
              {data.standings.map((team) => (
                team.matches?.map((match) => (
                  <div
                    key={`${team.entry_name}-gw${match.event}`}
                    className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">GW{match.event}</p>
                        <p className="text-sm text-gray-600">{team.entry_name} vs {match.opponent}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${
                          match.result === 'W' ? 'text-green-600' :
                          match.result === 'L' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {match.result}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{match.points} pts</p>
                      </div>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <div className="space-y-4">
              {data.transactions?.map((transaction, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {transaction.type === 'waiver' ? 'Waiver Transfer' : 'Free Transfer'}
                      </p>
                      <p className="font-medium text-gray-900 mt-1">
                        {transaction.player_in} ↔ {transaction.player_out}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{transaction.manager}</p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="squads" className="mt-4">
            <p className="text-gray-600 text-center">Squad information will be added in the next update</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 