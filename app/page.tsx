import { StarStrikeWalletProvider } from './components/wallet/WalletProvider';
import { GameLayout } from './components/ui/GameLayout';
import { ClientOnly } from './components/ClientOnly';

export default function Home() {
  return (
    <ClientOnly
      fallback={
        <div className="w-full h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              StarStrike
            </h1>
            <p className="text-gray-400">Loading Cosmic Mining Consortium...</p>
          </div>
        </div>
      }
    >
      <StarStrikeWalletProvider>
        <GameLayout />
      </StarStrikeWalletProvider>
    </ClientOnly>
  );
}
