'use client';

import { useState } from 'react';
import { StarStrikeMission, MissionDifficulty } from '../../types/game';

interface MissionBoardProps {
  missions: StarStrikeMission[];
  activeMission: StarStrikeMission | null;
  isInMission: boolean;
  onStartMission: (mission: StarStrikeMission) => Promise<boolean>;
  onCompleteMission: (success: boolean) => Promise<boolean>;
}

const difficultyColors: Record<MissionDifficulty, string> = {
  rookie: 'text-green-400 border-green-400',
  experienced: 'text-blue-400 border-blue-400',
  expert: 'text-yellow-400 border-yellow-400',
  elite: 'text-red-400 border-red-400',
};

const missionTypeIcons: Record<string, string> = {
  mining_quota: '⛏️',
  exploration: '🔍',
  convoy_escort: '🛡️',
  salvage_operation: '🔧',
};

export function MissionBoard({
  missions,
  activeMission,
  isInMission,
  onStartMission,
  onCompleteMission
}: MissionBoardProps) {
  const [selectedMission, setSelectedMission] = useState<StarStrikeMission | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartMission = async (mission: StarStrikeMission) => {
    setIsStarting(true);
    try {
      const success = await onStartMission(mission);
      if (success) {
        setSelectedMission(null);
      }
    } finally {
      setIsStarting(false);
    }
  };

  const formatTimeLimit = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // If player is in a mission, show mission progress
  if (isInMission && activeMission) {
    return (
      <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Active Mission</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{missionTypeIcons[activeMission.type]}</span>
            <div>
              <h3 className="font-semibold">{activeMission.title}</h3>
              <span className={`text-xs px-2 py-1 border rounded ${difficultyColors[activeMission.difficulty]}`}>
                {activeMission.difficulty.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-300">{activeMission.description}</p>

          <div className="bg-gray-800 rounded p-3">
            <h4 className="font-semibold mb-2">Rewards</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>XP:</span>
                <span className="text-green-400">+{activeMission.rewards.xp}</span>
              </div>
              {activeMission.rewards.resources.map((resource, index) => (
                <div key={index} className="flex justify-between">
                  <span>{resource.type.replace('_', ' ')}:</span>
                  <span className="text-blue-400">+{resource.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onCompleteMission(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold transition-colors"
            >
              Complete Mission
            </button>
            <button
              onClick={() => onCompleteMission(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold transition-colors"
            >
              Abandon
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4 text-center">Mission Board</h2>

      {missions.length === 0 ? (
        <p className="text-gray-400 text-center">No missions available</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedMission?.id === mission.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedMission(mission)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{missionTypeIcons[mission.type]}</span>
                  <h3 className="font-semibold text-sm">{mission.title}</h3>
                </div>
                <span className={`text-xs px-2 py-1 border rounded ${difficultyColors[mission.difficulty]}`}>
                  {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Reward: {mission.rewards.xp} XP</span>
                <span>Time: {formatTimeLimit(mission.timeLimit)}</span>
              </div>

              {selectedMission?.id === mission.id && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-sm text-gray-300 mb-3">{mission.description}</p>

                  {/* Requirements */}
                  {Object.keys(mission.requirements).length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 mb-1">Requirements:</h4>
                      <div className="text-xs space-y-1">
                        {mission.requirements.minShipHandling && (
                          <div>Ship Handling: {mission.requirements.minShipHandling}+</div>
                        )}
                        {mission.requirements.minMiningEfficiency && (
                          <div>Mining Efficiency: {mission.requirements.minMiningEfficiency}+</div>
                        )}
                        {mission.requirements.minNavigation && (
                          <div>Navigation: {mission.requirements.minNavigation}+</div>
                        )}
                        {mission.requirements.minCombatSkills && (
                          <div>Combat Skills: {mission.requirements.minCombatSkills}+</div>
                        )}
                        {mission.requirements.minEngineering && (
                          <div>Engineering: {mission.requirements.minEngineering}+</div>
                        )}
                        {mission.requirements.requiredRank && (
                          <div>Rank: {mission.requirements.requiredRank.replace('_', ' ')}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-400 mb-1">Rewards:</h4>
                    <div className="text-xs space-y-1">
                      <div>XP: +{mission.rewards.xp}</div>
                      {mission.rewards.traitUpgrades.map((upgrade, index) => (
                        <div key={index}>
                          {upgrade.trait.replace(/([A-Z])/g, ' $1').toLowerCase()}: +{upgrade.increase}
                        </div>
                      ))}
                      {mission.rewards.resources.map((resource, index) => (
                        <div key={index}>
                          {resource.type.replace('_', ' ')}: +{resource.amount}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartMission(mission);
                    }}
                    disabled={isStarting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded font-semibold transition-colors"
                  >
                    {isStarting ? 'Starting...' : 'Start Mission'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}