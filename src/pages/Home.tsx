import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Trophy, Target, Star, RefreshCw } from 'lucide-react';
import { usePlayers } from '../hooks/usePlayers';

export default function Home() {
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
          <p className="text-yellow-400 text-lg">Loading squad data...</p>
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
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Data</h2>
          <p className="text-red-400 mb-6">{error}</p>
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

  const totalGoals = players.reduce((sum, player) => 
    sum + player.stats.eafc.goals + player.stats.competitive.goals, 0
  );
  
  const totalMatches = players.reduce((sum, player) => 
    sum + player.stats.eafc.appearances + player.stats.competitive.appearances, 0
  );
  
  const totalMotm = players.reduce((sum, player) => 
    sum + player.stats.eafc.motmAwards + player.stats.competitive.motmAwards, 0
  );

  const topScorer = players.length > 0 ? players.reduce((top, player) => {
    const playerGoals = player.stats.eafc.goals + player.stats.competitive.goals;
    const topGoals = top.stats.eafc.goals + top.stats.competitive.goals;
    return playerGoals > topGoals ? player : top;
  }) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-4 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-6 py-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src="/Resources/Badge.png" 
                  alt="Real Breda CF" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-white">Real Breda CF</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Pro Clubs
              <span className="block text-yellow-400">Excellence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Welcome to the home of Real Breda CF, where passion meets performance in EA FC Pro Clubs. 
              Track our journey, celebrate our victories, and witness the rise of legends.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/squad"
                className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25"
              >
                Meet the Squad
              </Link>
              <Link
                to="/stats"
                className="border-2 border-yellow-400/50 text-yellow-400 px-8 py-4 rounded-xl font-bold text-lg hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
              >
                View Statistics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Season Highlights
            </h2>
            <p className="text-gray-300 text-lg">
              Our performance across EA FC and competitive leagues
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center hover:border-yellow-400/40 transition-colors duration-300">
              <Target className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{totalGoals}</div>
              <div className="text-gray-300">Total Goals</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center hover:border-yellow-400/40 transition-colors duration-300">
              <BarChart3 className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{totalMatches}</div>
              <div className="text-gray-300">Total Matches</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center hover:border-yellow-400/40 transition-colors duration-300">
              <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{totalMotm}</div>
              <div className="text-gray-300">MOTM Awards</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center hover:border-yellow-400/40 transition-colors duration-300">
              <Users className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{players.length}</div>
              <div className="text-gray-300">Squad Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Player */}
      {topScorer && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Star className="w-8 h-8 text-yellow-400" />
                    <span className="text-xl font-bold text-yellow-400">Top Scorer</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    {topScorer.name}
                  </h3>
                  
                  <div className="flex items-center space-x-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      #{topScorer.jerseyNumber}
                    </span>
                    <span className="text-gray-300 text-lg">{topScorer.position}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {topScorer.stats.eafc.goals + topScorer.stats.competitive.goals}
                      </div>
                      <div className="text-gray-300 text-sm">Goals</div>
                    </div>
                    <div className="bg-black/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {topScorer.stats.eafc.assists + topScorer.stats.competitive.assists}
                      </div>
                      <div className="text-gray-300 text-sm">Assists</div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/player/${topScorer.id}`}
                    className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-300"
                  >
                    <span>View Profile</span>
                  </Link>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-yellow-400/30">
                      {topScorer.profileImage ? (
                        <img
                          src={topScorer.profileImage}
                          alt={topScorer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Users className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center text-2xl font-bold">
                      {topScorer.jerseyNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/squad"
              className="group bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-8 hover:border-yellow-400/40 hover:bg-gray-900/70 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <Users className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                  Squad Overview
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Meet our talented roster of players, organized by position. Discover each player's 
                unique skills and contributions to the team's success.
              </p>
            </Link>
            
            <Link
              to="/stats"
              className="group bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-8 hover:border-yellow-400/40 hover:bg-gray-900/70 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <BarChart3 className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                  Detailed Statistics
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Dive deep into our performance metrics across EA FC and competitive leagues. 
                Compare players and track our progress throughout the season.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}