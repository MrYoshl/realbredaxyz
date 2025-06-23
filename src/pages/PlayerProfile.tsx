import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { User, Trophy, Target, Star, Edit, Save, X, Calendar, Award } from 'lucide-react';
import { usePlayers } from '../hooks/usePlayers';
import { useAuth } from '../contexts/AuthContext';

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { players, updatePlayerStats, isLoading } = usePlayers();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStats, setEditedStats] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const player = players.find(p => p.id === id);

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
          <p className="text-yellow-400 text-lg">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return <Navigate to="/squad" replace />;
  }

  const canEdit = user && (
    user.role === 'admin' || 
    (user.role === 'owner' && user.ownedPlayerId === player.id)
  );

  const handleEditStart = () => {
    setEditedStats({
      eafc: { ...player.stats.eafc },
      competitive: { ...player.stats.competitive }
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditedStats(null);
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    if (!editedStats) return;
    
    setIsSaving(true);
    
    try {
      // Update both leagues
      const eafcSuccess = await updatePlayerStats(player.id, 'eafc', editedStats.eafc);
      const competitiveSuccess = await updatePlayerStats(player.id, 'competitive', editedStats.competitive);
      
      if (eafcSuccess && competitiveSuccess) {
        setIsEditing(false);
        setEditedStats(null);
      } else {
        alert('Failed to update stats. Please try again.');
      }
    } catch (error) {
      console.error('Error saving stats:', error);
      alert('Failed to update stats. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateStat = (league: 'eafc' | 'competitive', stat: string, value: string) => {
    setEditedStats({
      ...editedStats,
      [league]: {
        ...editedStats[league],
        [stat]: stat === 'rating' ? parseFloat(value) || 0 : parseInt(value) || 0
      }
    });
  };

  const currentStats = isEditing ? editedStats : player.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Player Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center lg:items-start space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400/30">
                  {player.profileImage ? (
                    <img
                      src={player.profileImage}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xl font-bold">
                  {player.jerseyNumber}
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{player.name}</h1>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {player.position}
                  </span>
                  <span className="text-gray-300">
                    {player.position === 'GK' ? 'Goalkeeper' :
                     player.position === 'DEF' ? 'Defender' :
                     player.position === 'MID' ? 'Midfielder' : 'Forward'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-black/50 rounded-lg p-4 text-center">
                  <Target className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {player.stats.eafc.goals + player.stats.competitive.goals}
                  </div>
                  <div className="text-gray-300 text-sm">Total Goals</div>
                </div>
                <div className="bg-black/50 rounded-lg p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {player.stats.eafc.assists + player.stats.competitive.assists}
                  </div>
                  <div className="text-gray-300 text-sm">Total Assists</div>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEditStart}
                      className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Stats</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleEditSave}
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={handleEditCancel}
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EA FC Stats */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">EA FC League</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(currentStats.eafc).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-yellow-400/10">
                  <span className="text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateStat('eafc', key, e.target.value)}
                      className="bg-black border border-yellow-400/20 text-white rounded px-2 py-1 w-20 text-right"
                      step={key === 'rating' ? '0.1' : '1'}
                      min="0"
                      max={key === 'rating' ? '10' : undefined}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {key === 'rating' ? value.toFixed(1) : value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Stats */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Competitive League</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(currentStats.competitive).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-yellow-400/10">
                  <span className="text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateStat('competitive', key, e.target.value)}
                      className="bg-black border border-yellow-400/20 text-white rounded px-2 py-1 w-20 text-right"
                      step={key === 'rating' ? '0.1' : '1'}
                      min="0"
                      max={key === 'rating' ? '10' : undefined}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {key === 'rating' ? value.toFixed(1) : value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Career Highlights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {player.stats.eafc.motmAwards + player.stats.competitive.motmAwards}
              </div>
              <div className="text-gray-300 text-sm">Man of the Match Awards</div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {player.stats.eafc.appearances + player.stats.competitive.appearances}
              </div>
              <div className="text-gray-300 text-sm">Total Appearances</div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {player.stats.eafc.cleanSheets + player.stats.competitive.cleanSheets}
              </div>
              <div className="text-gray-300 text-sm">Clean Sheets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}