'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../wallet/WalletButton';
import { Scene3D } from '../game/Scene3D';
import { MissionBoard } from '../game/MissionBoard';
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
    completeMission
  } = useGame();

  // Calculate next rank XP requirement
  const getNextRankXP = (currentXP: number, rank: string) => {
    switch (rank) {
      case 'rookie': return 100;
      case 'experienced': return 500;
      case 'foreman': return 1500;
      case 'sector_chief': return 5000;
      default: return currentXP;
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StarStrike
          </h1>
          <span className="text-sm text-gray-400">Cosmic Mining Consortium</span>
          {isLoading && (
            <span className="text-xs text-yellow-400">Loading...</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Network: <span className="text-blue-400">{process.env.NEXT_PUBLIC_SOLANA_NETWORK}</span>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main game area */}
      <main className="flex-1 relative">
        {/* 3D Scene */}
        <Scene3D className="absolute inset-0" />

        {/* Game UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Mission Board - Left Side */}
          {connected && player && (
            <div className="absolute top-4 left-4 pointer-events-auto">
              <MissionBoard
                missions={availableMissions}
                activeMission={activeMission}
                isInMission={isInMission}
                onStartMission={startMission}
                onCompleteMission={completeMission}
              />
            </div>
          )}

          {/* Player Info */}
          <div className="absolute top-4 right-4 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Pilot Status</h3>
              {connected && player ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rank:</span>
                    <span className="text-blue-400 capitalize">{player.rank.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">XP:</span>
                    <span className="text-green-400">
                      {player.totalXP} / {getNextRankXP(player.totalXP, player.rank)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Credits:</span>
                    <span className="text-yellow-400">{player.credits.toLocaleString()}</span>
                  </div>

                  {/* Traits */}
                  <div className="mt-3 pt-2 border-t border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-400 mb-1">Skills</h4>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>Ship: {player.traits.shipHandling}</div>
                      <div>Mining: {player.traits.miningEfficiency}</div>
                      <div>Nav: {player.traits.navigation}</div>
                      <div>Combat: {player.traits.combatSkills}</div>
                      <div>Engineering: {player.traits.engineering}</div>
                      <div>Leadership: {player.traits.leadership}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className="text-red-400">Not Connected</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls Help */}
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-semibold mb-2">Controls</h3>
              <div className="space-y-1 text-xs text-gray-300">
                <div>Left Click + Drag: Rotate camera</div>
                <div>Right Click + Drag: Pan view</div>
                <div>Scroll: Zoom in/out</div>
              </div>
            </div>
          </div>

                    {/* Welcome/Status Message */}
          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <div className={`backdrop-blur-sm rounded-lg p-4 border ${
              connected
                ? isInMission
                  ? 'bg-orange-600/80 border-orange-500/50'
                  : 'bg-green-600/80 border-green-500/50'
                : 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 border-blue-500/50'
            }`}>
              <h3 className="text-lg font-semibold mb-1">
                {!connected
                  ? 'Welcome to StarStrike!'
                  : isInMission
                    ? 'Mining in Progress!'
                    : 'Ready for Missions!'
                }
              </h3>
              <p className="text-sm text-gray-200">
                {!connected
                  ? 'Connect your wallet to begin your mining consortium journey.'
                  : isInMission
                    ? 'Click on asteroids to mine them! Complete 5 to finish the mission.'
                    : 'Select a mission from the board to begin mining.'
                }
              </p>
            </div>
          </div>

          {/* Mining Instructions - Only show during missions */}
          {connected && isInMission && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-500/50 text-center">
                <h3 className="text-xl font-bold mb-2 text-orange-400">Mining Mode Active</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Click on asteroids to mine them with your laser!
                </p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span>Basic Minerals</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>Rare Elements</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span>Mineable</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}