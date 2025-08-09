import { StarStrikeWalletProvider } from './components/wallet/WalletProvider';
import { GameLayout } from './components/ui/GameLayout';

export default function Home() {
  return (
    <StarStrikeWalletProvider>
      <GameLayout />
    </StarStrikeWalletProvider>
  );
}
