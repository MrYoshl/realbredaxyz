export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          discord_id: string | null;
          role: 'admin' | 'owner' | 'user';
          owned_player_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          discord_id?: string | null;
          role?: 'admin' | 'owner' | 'user';
          owned_player_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          discord_id?: string | null;
          role?: 'admin' | 'owner' | 'user';
          owned_player_id?: string | null;
          created_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          name: string;
          position: 'GK' | 'DEF' | 'MID' | 'FWD';
          jersey_number: number;
          profile_image: string | null;
          owner_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: 'GK' | 'DEF' | 'MID' | 'FWD';
          jersey_number: number;
          profile_image?: string | null;
          owner_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: 'GK' | 'DEF' | 'MID' | 'FWD';
          jersey_number?: number;
          profile_image?: string | null;
          owner_id?: string | null;
          created_at?: string;
        };
      };
      player_stats: {
        Row: {
          id: string;
          player_id: string;
          league: 'eafc' | 'competitive';
          appearances: number;
          goals: number;
          assists: number;
          clean_sheets: number;
          motm_awards: number;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          league: 'eafc' | 'competitive';
          appearances?: number;
          goals?: number;
          assists?: number;
          clean_sheets?: number;
          motm_awards?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          league?: 'eafc' | 'competitive';
          appearances?: number;
          goals?: number;
          assists?: number;
          clean_sheets?: number;
          motm_awards?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}