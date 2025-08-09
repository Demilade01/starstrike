'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGame';

interface GameHUDProps {
  className?: string;
}

interface Notification {
  id: string;
  type: 'xp' | 'credits' | 'levelup' | 'mission' | 'achievement';
  message: string;
  value?: number;
  timestamp: number;
}

export function GameHUD({ className = "" }: GameHUDProps) {
  const { player, activeMission, isInMission } = useGame();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate progress to next rank
  const getNextRankXP = (currentXP: number, rank: string) => {
    switch (rank) {
      case 'rookie': return 100;
      case 'experienced': return 500;
      case 'foreman': return 1500;
      case 'sector_chief': return 5000;
      default: return currentXP;
    }
  };

  const nextRankXP = player ? getNextRankXP(player.totalXP, player.rank) : 100;
  const progressPercent = player ? (player.totalXP / nextRankXP) * 100 : 0;

  // Add notification system
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  };

  if (!player) {
    return (
      <div className={`fixed inset-0 pointer-events-none ${className}`}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-8 border border-blue-500/50 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Welcome to StarStrike
            </h2>
            <p className="text-gray-300 mb-4">
              Connect your wallet to join the Cosmic Mining Consortium
            </p>
            <div className="animate-pulse">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 pointer-events-none ${className} z-40`}>
      {/* Top HUD - XP and Credits - Positioned below header */}
      <div className="absolute top-20 left-4 right-4 pointer-events-auto">
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-3 py-1">
                <span className="text-white font-bold text-sm uppercase tracking-wide">
                  {player.rank.replace('_', ' ')}
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">Experience</span>
                  <span className="text-xs text-green-400 font-mono">
                    {player.totalXP} / {nextRankXP}
                  </span>
                </div>
                <div className="w-64 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Credits */}
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Credits</div>
              <div className="text-yellow-400 font-bold font-mono text-lg">
                ₡{player.credits.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-6 gap-2 text-xs">
            {[
              { name: 'Ship', value: player.traits.shipHandling, color: 'blue' },
              { name: 'Mining', value: player.traits.miningEfficiency, color: 'yellow' },
              { name: 'Nav', value: player.traits.navigation, color: 'green' },
              { name: 'Combat', value: player.traits.combatSkills, color: 'red' },
              { name: 'Eng', value: player.traits.engineering, color: 'purple' },
              { name: 'Lead', value: player.traits.leadership, color: 'orange' }
            ].map((skill) => (
              <div key={skill.name} className="text-center">
                <div className="text-gray-400 mb-1">{skill.name}</div>
                <div className={`text-${skill.color}-400 font-bold`}>{skill.value}</div>
                <div className="w-full bg-gray-800 rounded h-1">
                  <div
                    className={`h-full bg-${skill.color}-500 rounded transition-all duration-300`}
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Objective Tracker */}
      {isInMission && activeMission && (
        <div className="absolute top-20 right-4 pointer-events-auto">
          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-orange-500/50 min-w-64">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-400 font-bold text-sm">ACTIVE MISSION</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{activeMission.title}</h3>
            <div className="text-xs text-gray-300 mb-3">{activeMission.description}</div>

            {/* Mission Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="text-green-400">In Progress...</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-1/3 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative">
          <div className="w-8 h-8 border border-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0.5 h-4 bg-white/30"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-0.5 h-4 bg-white/30"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-4 h-0.5 bg-white/30"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 w-4 h-0.5 bg-white/30"></div>
        </div>
      </div>

      {/* Notifications */}
      <div className="absolute bottom-4 right-4 space-y-2 pointer-events-none">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-green-500/50 animate-slide-in-right"
          >
            <div className="flex items-center gap-2">
              {notification.type === 'xp' && <span className="text-green-400">⚡</span>}
              {notification.type === 'credits' && <span className="text-yellow-400">₡</span>}
              {notification.type === 'levelup' && <span className="text-purple-400">🚀</span>}
              {notification.type === 'mission' && <span className="text-blue-400">📋</span>}
              {notification.type === 'achievement' && <span className="text-orange-400">🏆</span>}

              <span className="text-white text-sm font-medium">
                {notification.message}
              </span>

              {notification.value && (
                <span className="text-green-400 font-bold">
                  +{notification.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50">
          <h4 className="text-white font-semibold text-sm mb-2">Controls</h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <kbd className="bg-gray-800 px-2 py-1 rounded text-xs">LMB</kbd>
              <span>Click asteroids to mine</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="bg-gray-800 px-2 py-1 rounded text-xs">RMB</kbd>
              <span>Pan camera</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="bg-gray-800 px-2 py-1 rounded text-xs">Scroll</kbd>
              <span>Zoom in/out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}