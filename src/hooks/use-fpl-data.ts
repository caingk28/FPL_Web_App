import { useState } from 'react';
import { fetchTeamData, fetchLeagueData } from '@/lib/api';

interface FPLData {
  type: 'team' | 'league';
  data: any;
}

export function useFPLData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FPLData | null>(null);

  const fetchData = async (id: string, type: 'team' | 'league', isDraft: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = type === 'team' 
        ? await fetchTeamData(id, isDraft)
        : await fetchLeagueData(id, isDraft);

      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData({
          type,
          data: result.data
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    data,
    fetchData
  };
} 