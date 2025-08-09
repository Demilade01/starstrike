'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../wallet/WalletButton';
import { Scene3D } from '../game/Scene3D';
import { MissionBoard } from '../game/MissionBoard';
import { GameHUD } from './GameHUD';
import { useGame } from '../../hooks/useGame';

export function GameLayout() {
  const { connected } = useWallet();
  const {
    isLoading,
    player,
    availableMissions,
    activeMission,
    isInMission,
    startMission,
    completeMission,
    resetGameState
  } = useGame();

  // Activity tracking
  const [recentActivity, setRecentActivity] = useState<string>('');
  const [showActivity, setShowActivity] = useState(false);

  // Track player activity changes
  useEffect(() => {
    if (!connected) {
      setRecentActivity('');
      setShowActivity(false);
      return;
    }

    if (isInMission && activeMission) {
      setRecentActivity(`Mining in progress...`);
      setShowActivity(true);
    } else if (connected && player) {
      setRecentActivity('Ready for action');
      setShowActivity(true);
    }

    // Auto-hide activity after some time
    if (recentActivity) {
      const timer = setTimeout(() => setShowActivity(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [connected, isInMission, activeMission, player, recentActivity]);

  // Listen for mission changes to show feedback
  useEffect(() => {
    if (isInMission && activeMission) {
      setRecentActivity(`Started: ${activeMission.title}`);
      setShowActivity(true);
    }
  }, [isInMission, activeMission?.id]);



  return (
    <div className="w-full h-screen bg-black text-white flex flex-col relative">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-50 min-h-[80px] gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StarStrike
          </h1>
          <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">Cosmic Mining Consortium</span>

          {/* Dynamic Status Indicators */}
          <div className="flex items-center gap-1 sm:gap-3 ml-2 sm:ml-4 flex-wrap">
            {isLoading && (
              <span className="text-xs text-yellow-400 animate-pulse">Loading...</span>
            )}

            {/* Connection Status */}
            {connected ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 hidden sm:inline">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-xs text-red-400 hidden sm:inline">Disconnected</span>
              </div>
            )}

            {/* Player Status */}
            {player && (
              <div className="flex items-center gap-1 sm:gap-3">
                <span className="text-xs text-blue-400">
                  {player.rank.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-yellow-400">
                  ₡{player.credits.toLocaleString()}
                </span>
                <span className="text-xs text-green-400 hidden sm:inline">
                  XP: {player.totalXP}
                </span>
              </div>
            )}

            {/* Mission Status */}
            {isInMission && activeMission ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-green-600/20 px-2 sm:px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-medium">
                  {activeMission.type === 'mining_quota' ? '⛏️' : '🔍'}
                  <span className="hidden sm:inline ml-1">
                    {activeMission.type === 'mining_quota' ? 'Mining' : 'Exploring'}
                  </span>
                </span>
              </div>
            ) : connected && player ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-blue-600/20 px-2 sm:px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-300 font-medium">
                  🚀<span className="hidden sm:inline ml-1">Ready</span>
                </span>
              </div>
            ) : null}

            {/* Recent Activity - Hide on mobile */}
            {showActivity && recentActivity && (
              <div className="hidden md:flex items-center gap-2 bg-yellow-600/20 px-3 py-1 rounded-full animate-slide-in-right">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-yellow-300 font-medium">
                  {recentActivity}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
          {/* Activity Indicator - Hide on mobile */}
          {connected && player && (
            <div className="text-xs text-gray-400 hidden lg:block">
              {isInMission ? (
                <div className="flex items-center gap-2">
                  <span>Active:</span>
                  <span className="text-orange-400 font-medium truncate max-w-32">{activeMission?.title}</span>
                </div>
              ) : (
                <span>Missions: <span className="text-blue-400">{availableMissions.length}</span></span>
              )}
            </div>
          )}

          <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
            <span className="hidden md:inline">Network: </span>
            <span className="text-blue-400">{process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}</span>
          </div>

          {/* Reset Button for Debugging */}
          {connected && (
            <button
              onClick={resetGameState}
              className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 px-2 py-1 rounded border border-red-600/50 transition-colors"
              title="Reset Game State"
            >
              🔄 Reset
            </button>
          )}

          <div className="relative">
            <WalletButton />
          </div>
        </div>
      </header>

            {/* Main game area */}
      <main className="flex-1 relative">
        {/* 3D Scene */}
        <Scene3D className="absolute inset-0" />

        {/* Welcome Instructions - show when wallet not connected */}
        {!connected && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/95 backdrop-blur-sm text-white p-8 rounded-lg border border-gray-600 max-w-md mx-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Welcome to StarStrike!</h2>
              <div className="space-y-3 text-gray-300">
                <p>🚀 A blockchain space mining game powered by Honeycomb Protocol</p>
                <p>📋 To start playing:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Connect your Solana wallet (top-right)</li>
                  <li>Select a mission from the board</li>
                  <li>Click asteroids to mine them</li>
                  <li>Complete missions to earn XP and credits</li>
                </ol>
              </div>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg animate-pulse">
                  <span>👆</span>
                  <span>Connect your wallet to begin!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mission Selection Guide - show when connected but no mission */}
        {connected && player && !isInMission && (
          <div className="absolute top-36 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
            <div className="bg-blue-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg border border-blue-400/50 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Select a mission to start mining!</span>
                <span className="text-blue-200">👈 Check the mission board</span>
              </div>
            </div>
          </div>
        )}

        {/* Mining Mode Active Indicator */}
        {isInMission && activeMission && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
            <div className="bg-green-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg border border-green-400/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">
                  {activeMission.type === 'mining_quota' ? 'Mining Mode Active' : 'Exploration Mode Active'}
                </span>
                <div className="text-green-200 text-sm">
                  Click asteroids to mine • Goal: {activeMission.type === 'mining_quota' ? 'Mine 5 asteroids' : 'Explore and collect samples'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game HUD Overlay */}
        {connected && <GameHUD />}

        {/* Mission Board - Only show when not in mission */}
        {connected && player && !isInMission && (
          <div className="absolute top-36 left-4 pointer-events-auto z-50">
            <MissionBoard
              missions={availableMissions}
              activeMission={activeMission}
              isInMission={isInMission}
              onStartMission={startMission}
              onCompleteMission={completeMission}
            />
          </div>
        )}
      </main>
    </div>
  );
}