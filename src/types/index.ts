export interface User {
  id: string;
  username: string;
  discordId?: string | null;
  role: 'admin' | 'owner' | 'user';
  ownedPlayerId?: string | null;
  createdAt: Date;
}

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  jerseyNumber: number;
  profileImage?: string | null;
  stats: PlayerStats;
  ownerId?: string | null;
  createdAt: Date;
}

export interface PlayerStats {
  eafc: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    motmAwards: number;
    rating: number;
  };
  competitive: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    motmAwards: number;
    rating: number;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}