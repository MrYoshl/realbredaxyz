import React, { useState } from 'react';
import { Trophy, Target, Users, Star, BarChart3, TrendingUp } from 'lucide-react';
import { usePlayers } from '../hooks/usePlayers';

export default function Stats() {
  const { players, isLoading, error } = usePlayers();
  const [activeTab, setActiveTab] = useState<'eafc' | 'competitive'>('eafc');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'appearances' | 'motmAwards' | 'rating'>('goals');

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
          <p className="text-yellow-400 text-lg">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Error loading statistics: {error}</p>
        </div>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => {
    const aValue = a.stats[activeTab][sortBy];
    const bValue = b.stats[activeTab][sortBy];
    return bValue - aValue;
  });

  const totalStats = players.reduce((acc, player) => {
    const stats = player.stats[activeTab];
    return {
      appearances: acc.appearances + stats.appearances,
      goals: acc.goals + stats.goals,
      assists: acc.assists + stats.assists,
      cleanSheets: acc.cleanSheets + stats.cleanSheets,
      motmAwards: acc.motmAwards + stats.motmAwards,
    };
  }, { appearances: 0, goals: 0, assists: 0, cleanSheets: 0, motmAwards: 0 });

  const topScorer = sortedPlayers[0];
  const topAssister = [...players].sort((a, b) => 
    b.stats[activeTab].assists - a.stats[activeTab].assists
  )[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Team Statistics
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive performance data across EA FC and competitive leagues
          </p>
        </div>

        {/* League Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-2">
            <button
              onClick={() => setActiveTab('eafc')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'eafc'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              EA FC League
            </button>
            <button
              onClick={() => setActiveTab('competitive')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'competitive'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              Competitive League
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.appearances}</div>
            <div className="text-gray-300 text-sm">Total Appearances</div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.goals}</div>
            <div className="text-gray-300 text-sm">Total Goals</div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.assists}</div>
            <div className="text-gray-300 text-sm">Total Assists</div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.motmAwards}</div>
            <div className="text-gray-300 text-sm">MOTM Awards</div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
            <BarChart3 className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.cleanSheets}</div>
            <div className="text-gray-300 text-sm">Clean Sheets</div>
          </div>
        </div>

        {/* Top Performers */}
        {topScorer && topAssister && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Top Scorer</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400/30">
                  {topScorer.profileImage ? (
                    <img src={topScorer.profileImage} alt={topScorer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{topScorer.name}</div>
                  <div className="text-2xl font-bold text-yellow-400">{topScorer.stats[activeTab].goals} goals</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Top Assister</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400/30">
                  {topAssister.profileImage ? (
                    <img src={topAssister.profileImage} alt={topAssister.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{topAssister.name}</div>
                  <div className="text-2xl font-bold text-yellow-400">{topAssister.stats[activeTab].assists} assists</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-yellow-400/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <span>Player Statistics</span>
              </h3>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-black border border-yellow-400/20 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400 focus:outline-none"
                >
                  <option value="goals">Goals</option>
                  <option value="assists">Assists</option>
                  <option value="appearances">Appearances</option>
                  <option value="motmAwards">MOTM Awards</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50">
                <tr>
                  <th className="text-left py-4 px-6 text-yellow-400 font-semibold">Player</th>
                  <th className="text-center py-4 px-6 text-yellow-400 font-semibold">Apps</th>
                  <th className="text-center py-4 px-6 text-yellow-400 font-semibold">Goals</th>
                  <th className="text-center py-4 px-6 text-yellow-400 font-semibold">Assists</th>
                  <th className="text-center py-4 px-6 text-yellow-400 font-semibold">Clean Sheets</th>
                  <th className="text-center py-4 px-6 text-yellow-400 font-semibold">MOTM</th>
                  <th className="text-center py-4 px-6 text-yellow-400 font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => (
                  <tr key={player.id} className={`border-b border-yellow-400/10 ${index % 2 === 0 ? 'bg-black/20' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-yellow-400/20">
                          {player.profileImage ? (
                            <img src={player.profileImage} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-gray-400 text-sm">{player.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-6 text-white">{player.stats[activeTab].appearances}</td>
                    <td className="text-center py-4 px-6 text-white font-medium">{player.stats[activeTab].goals}</td>
                    <td className="text-center py-4 px-6 text-white font-medium">{player.stats[activeTab].assists}</td>
                    <td className="text-center py-4 px-6 text-white">{player.stats[activeTab].cleanSheets}</td>
                    <td className="text-center py-4 px-6 text-yellow-400 font-medium">{player.stats[activeTab].motmAwards}</td>
                    <td className="text-center py-4 px-6 text-white font-medium">{player.stats[activeTab].rating.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}