import React from 'react';
import { Link } from 'react-router-dom';
import { User, Trophy, Target } from 'lucide-react';
import { Player } from '../../types';

interface PlayerCardProps {
  player: Player;
  showStats?: boolean;
}

export default function PlayerCard({ player, showStats = false }: PlayerCardProps) {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK':
        return 'bg-green-500';
      case 'DEF':
        return 'bg-blue-500';
      case 'MID':
        return 'bg-purple-500';
      case 'FWD':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPositionName = (position: string) => {
    switch (position) {
      case 'GK':
        return 'Goalkeeper';
      case 'DEF':
        return 'Defender';
      case 'MID':
        return 'Midfielder';
      case 'FWD':
        return 'Forward';
      default:
        return position;
    }
  };

  return (
    <Link
      to={`/player/${player.id}`}
      className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 hover:bg-gray-900/70 transition-all duration-300 group"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-400/30 group-hover:border-yellow-400/60 transition-colors duration-300">
            {player.profileImage ? (
              <img
                src={player.profileImage}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Jersey Number */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">
            {player.jerseyNumber}
          </div>
        </div>

        {/* Player Info */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
            {player.name}
          </h3>
          
          <div className="flex items-center justify-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPositionColor(player.position)}`}>
              {player.position}
            </span>
            <span className="text-sm text-gray-400">{getPositionName(player.position)}</span>
          </div>
        </div>

        {/* Quick Stats */}
        {showStats && (
          <div className="w-full pt-4 border-t border-yellow-400/20">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <Target className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-400">Goals</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {player.stats.eafc.goals + player.stats.competitive.goals}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-400">MOTM</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {player.stats.eafc.motmAwards + player.stats.competitive.motmAwards}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}