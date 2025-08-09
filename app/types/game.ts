import { PublicKey } from '@solana/web3.js';

// Player progression types
export type ConsortiumRank = 'rookie' | 'experienced' | 'foreman' | 'sector_chief' | 'board_member';

export interface PlayerTraits {
  shipHandling: number;      // 0-100: Ship maneuverability and speed
  miningEfficiency: number;  // 0-100: Resource extraction rate
  leadership: number;        // 0-100: Consortium voting power
  navigation: number;        // 0-100: Access to distant sectors
  combatSkills: number;      // 0-100: Defense against pirates
  engineering: number;       // 0-100: Ship system optimization
}

export interface PlayerData {
  publicKey: PublicKey;
  traits: PlayerTraits;
  rank: ConsortiumRank;
  totalXP: number;
  credits: number;
  activeMissions: string[];
}

// Mission system types
export type MissionType = 'mining_quota' | 'exploration' | 'convoy_escort' | 'salvage_operation';
export type MissionDifficulty = 'rookie' | 'experienced' | 'expert' | 'elite';

export interface MissionRequirement {
  minShipHandling?: number;
  minMiningEfficiency?: number;
  minNavigation?: number;
  minCombatSkills?: number;
  minEngineering?: number;
  minLeadership?: number;
  requiredRank?: ConsortiumRank;
}

export interface TraitUpgrade {
  trait: keyof PlayerTraits;
  increase: number;
  requirements?: {
    minCurrentValue?: number;
    completedMissions?: string[];
    consortiumRank?: ConsortiumRank;
  };
}

export interface Resource {
  type: 'basic_minerals' | 'rare_elements' | 'credits' | 'consortium_tokens';
  amount: number;
}

export interface MissionRewards {
  xp: number;
  traitUpgrades: TraitUpgrade[];
  resources: Resource[];
}

export interface StarStrikeMission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  requirements: MissionRequirement;
  rewards: MissionRewards;
  timeLimit: number; // seconds
  difficulty: MissionDifficulty;
  isActive: boolean;
  completedBy: PublicKey[];
  createdAt: number;
}

export interface MissionCompletionProof {
  missionId: string;
  completionTime: number;
  efficiency: number; // 0-100
  resourcesCollected: Resource[];
  signature: string;
}

// Game state types
export interface GameState {
  isLoading: boolean;
  player: PlayerData | null;
  availableMissions: StarStrikeMission[];
  activeMission: StarStrikeMission | null;
  isInMission: boolean;
}

// 3D Scene types
export interface SceneState {
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  isInShip: boolean;
  currentSector: string;
}