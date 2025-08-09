'use client';

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
    completeMission
  } = useGame();



  return (
    <div className="w-full h-screen bg-black text-white flex flex-col relative">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center relative z-50 min-h-[80px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StarStrike
          </h1>
          <span className="text-sm text-gray-400">Cosmic Mining Consortium</span>
          {isLoading && (
            <span className="text-xs text-yellow-400 animate-pulse">Loading...</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Network: <span className="text-blue-400">{process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}</span>
          </div>
          <div className="relative">
            <WalletButton />
          </div>
        </div>
      </header>

            {/* Main game area */}
      <main className="flex-1 relative">
        {/* 3D Scene */}
        <Scene3D className="absolute inset-0" />

        {/* Game HUD Overlay */}
        <GameHUD />

        {/* Mission Board - Only show when not in mission */}
        {connected && player && !isInMission && (
          <div className="absolute top-32 left-4 pointer-events-auto z-50">
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