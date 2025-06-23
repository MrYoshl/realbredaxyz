import React from 'react';
import { usePlayers } from '../hooks/usePlayers';
import PlayerCard from '../components/UI/PlayerCard';
import { RefreshCw } from 'lucide-react';

export default function Squad() {
  const { players, isLoading, error, refetch } = usePlayers();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
            <img 
              src="/Resources/Badge.png" 
              alt="Real Breda CF" 
              className="w-full h-full object-cover animate-pulse"
            />
          </div>
          <p className="text-yellow-400 text-lg">Loading squad...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
            <img 
              src="/Resources/Badge.png" 
              alt="Real Breda CF" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Squad</h2>
          <p className="text-red-400 text-lg mb-6">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // If no players but no error, show empty state
  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Squad
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Meet the talented individuals who make Real Breda CF a force to be reckoned with 
              in Pro Clubs competition.
            </p>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-12">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6">
                <img 
                  src="/Resources/Badge.png" 
                  alt="Real Breda CF" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Squad Coming Soon</h2>
              <p className="text-gray-300 mb-6">
                Our players are currently being added to the system. Check back soon to meet the team!
              </p>
              <button
                onClick={refetch}
                className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const playersByPosition = {
    GK: players.filter(p => p.position === 'GK'),
    DEF: players.filter(p => p.position === 'DEF'),
    MID: players.filter(p => p.position === 'MID'),
    FWD: players.filter(p => p.position === 'FWD'),
  };

  const positionTitles = {
    GK: 'Goalkeepers',
    DEF: 'Defenders',
    MID: 'Midfielders',
    FWD: 'Forwards',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Squad
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the talented individuals who make Real Breda CF a force to be reckoned with 
            in Pro Clubs competition.
          </p>
        </div>

        {/* Squad by Position */}
        <div className="space-y-16">
          {Object.entries(playersByPosition).map(([position, positionPlayers]) => (
            <section key={position} className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {positionTitles[position as keyof typeof positionTitles]}
                </h2>
                <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>
              
              {positionPlayers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {positionPlayers.map((player) => (
                    <PlayerCard key={player.id} player={player} showStats />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No players in this position yet.</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Squad Stats Summary */}
        <div className="mt-16 bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Squad Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">
                {playersByPosition.GK.length}
              </div>
              <div className="text-gray-300">Goalkeepers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">
                {playersByPosition.DEF.length}
              </div>
              <div className="text-gray-300">Defenders</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">
                {playersByPosition.MID.length}
              </div>
              <div className="text-gray-300">Midfielders</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">
                {playersByPosition.FWD.length}
              </div>
              <div className="text-gray-300">Forwards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}