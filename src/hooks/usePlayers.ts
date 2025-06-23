import { useState, useEffect } from 'react';
import { Player } from '../types';
import { supabase } from '../lib/supabase';

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      // Fetch players with timeout
      const playersPromise = supabase
        .from('players')
        .select('*')
        .order('jersey_number');

      const { data: playersData, error: playersError } = await Promise.race([
        playersPromise,
        timeoutPromise
      ]) as any;

      if (playersError) throw playersError;

      // If no players found, return empty array instead of loading forever
      if (!playersData || playersData.length === 0) {
        console.log('No players found in database');
        setPlayers([]);
        setIsLoading(false);
        return;
      }

      // Fetch stats for all players with timeout
      const statsPromise = supabase
        .from('player_stats')
        .select('*');

      const { data: statsData, error: statsError } = await Promise.race([
        statsPromise,
        timeoutPromise
      ]) as any;

      if (statsError) {
        console.warn('Error fetching stats:', statsError);
        // Continue without stats rather than failing completely
      }

      // Combine players with their stats
      const playersWithStats: Player[] = playersData.map(player => {
        const eafcStats = statsData?.find(s => s.player_id === player.id && s.league === 'eafc');
        const competitiveStats = statsData?.find(s => s.player_id === player.id && s.league === 'competitive');

        return {
          id: player.id,
          name: player.name,
          position: player.position,
          jerseyNumber: player.jersey_number,
          profileImage: player.profile_image,
          ownerId: player.owner_id,
          createdAt: new Date(player.created_at),
          stats: {
            eafc: {
              appearances: eafcStats?.appearances || 0,
              goals: eafcStats?.goals || 0,
              assists: eafcStats?.assists || 0,
              cleanSheets: eafcStats?.clean_sheets || 0,
              motmAwards: eafcStats?.motm_awards || 0,
              rating: parseFloat(eafcStats?.rating) || 0,
            },
            competitive: {
              appearances: competitiveStats?.appearances || 0,
              goals: competitiveStats?.goals || 0,
              assists: competitiveStats?.assists || 0,
              cleanSheets: competitiveStats?.clean_sheets || 0,
              motmAwards: competitiveStats?.motm_awards || 0,
              rating: parseFloat(competitiveStats?.rating) || 0,
            },
          },
        };
      });

      setPlayers(playersWithStats);
    } catch (err: any) {
      console.error('Error fetching players:', err);
      
      // Set specific error messages
      if (err.message === 'Request timeout') {
        setError('Connection timeout. Please check your internet connection and try again.');
      } else if (err.message?.includes('Failed to fetch')) {
        setError('Unable to connect to the database. Please try again later.');
      } else {
        setError(err.message || 'An error occurred while loading players');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlayerStats = async (playerId: string, league: 'eafc' | 'competitive', stats: any) => {
    try {
      const { error } = await supabase
        .from('player_stats')
        .upsert({
          player_id: playerId,
          league,
          appearances: stats.appearances,
          goals: stats.goals,
          assists: stats.assists,
          clean_sheets: stats.cleanSheets,
          motm_awards: stats.motmAwards,
          rating: stats.rating,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'player_id,league'
        });

      if (error) throw error;
      
      // Refresh players data
      await fetchPlayers();
      return true;
    } catch (err) {
      console.error('Error updating player stats:', err);
      return false;
    }
  };

  return {
    players,
    isLoading,
    error,
    refetch: fetchPlayers,
    updatePlayerStats,
  };
}