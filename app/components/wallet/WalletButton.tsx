'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors" />

      {connected && publicKey && (
        <div className="text-sm text-gray-300">
          <span className="text-green-400">●</span> Connected
        </div>
      )}
    </div>
  );
}