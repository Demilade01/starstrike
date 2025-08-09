'use client';

import { WalletButton } from '../wallet/WalletButton';
import { Scene3D } from '../game/Scene3D';

export function GameLayout() {
  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StarStrike
          </h1>
          <span className="text-sm text-gray-400">Cosmic Mining Consortium</span>
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
          {/* HUD Elements */}
          <div className="absolute top-4 left-4 pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Mission Status</h3>
              <p className="text-gray-300 text-sm">No active missions</p>
            </div>
          </div>

          {/* Player Info */}
          <div className="absolute top-4 right-4 pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Pilot Status</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Rank:</span>
                  <span className="text-blue-400">Rookie Miner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">XP:</span>
                  <span className="text-green-400">0 / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Help */}
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-semibold mb-2">Controls</h3>
              <div className="space-y-1 text-xs text-gray-300">
                <div>Left Click + Drag: Rotate camera</div>
                <div>Right Click + Drag: Pan view</div>
                <div>Scroll: Zoom in/out</div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm rounded-lg p-4 border border-blue-500/50">
              <h3 className="text-lg font-semibold mb-1">Welcome to StarStrike!</h3>
              <p className="text-sm text-gray-200">
                Connect your wallet to begin your mining consortium journey.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}