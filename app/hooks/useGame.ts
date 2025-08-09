'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { GameState, PlayerData, StarStrikeMission, PlayerTraits, ConsortiumRank } from '../types/game';
import { getHoneycombClient } from '../lib/honeycomb/client';
import { MissionManager } from '../lib/honeycomb/missions';

const defaultTraits: PlayerTraits = {
  shipHandling: 10,
  miningEfficiency: 5,
  leadership: 0,
  navigation: 15,
  combatSkills: 5,
  engineering: 10,
};

export function useGame() {
  const { publicKey, connected } = useWallet();
  const [gameState, setGameState] = useState<GameState>({
    isLoading: false,
    player: null,
    availableMissions: [],
    activeMission: null,
    isInMission: false,
  });

  const honeycombClient = useMemo(() => getHoneycombClient(), []);
  const missionManager = useMemo(() => new MissionManager(honeycombClient), [honeycombClient]);

  // Calculate consortium rank based on XP and leadership
  const calculateRank = useCallback((xp: number, leadership: number): ConsortiumRank => {
    if (xp >= 5000 && leadership >= 75) return 'board_member';
    if (xp >= 1500 && leadership >= 50) return 'sector_chief';
    if (xp >= 500 && leadership >= 25) return 'foreman';
    if (xp >= 100) return 'experienced';
    return 'rookie';
  }, []);

  // Initialize player data when wallet connects
  const initializePlayer = useCallback(async () => {
    if (!publicKey || !connected) {
      setGameState(prev => ({ ...prev, player: null }));
      return;
    }

    setGameState(prev => ({ ...prev, isLoading: true }));

    try {
      // For MVP, create mock player data
      // In production, this would fetch from Honeycomb Protocol
      const totalXP = 0; // Would be fetched from blockchain
      const traits = defaultTraits; // Would be fetched from blockchain
      const rank = calculateRank(totalXP, traits.leadership);

      const playerData: PlayerData = {
        publicKey,
        traits,
        rank,
        totalXP,
        credits: 1000, // Starting credits
        activeMissions: [],
      };

      // Load available missions
      const missions = await missionManager.getActiveMissions(publicKey);

      setGameState(prev => ({
        ...prev,
        player: playerData,
        availableMissions: missions,
        isLoading: false,
      }));

    } catch (error) {
      console.error('Failed to initialize player:', error);
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  }, [publicKey, connected]);

  // Start a mission
  const startMission = useCallback(async (mission: StarStrikeMission) => {
    if (!gameState.player) return false;

    // Check if player meets requirements
    const { requirements } = mission;
    const { traits, rank } = gameState.player;

    if (requirements.minShipHandling && traits.shipHandling < requirements.minShipHandling) {
      console.log('Insufficient ship handling skill');
      return false;
    }
    if (requirements.minMiningEfficiency && traits.miningEfficiency < requirements.minMiningEfficiency) {
      console.log('Insufficient mining efficiency');
      return false;
    }
    if (requirements.minNavigation && traits.navigation < requirements.minNavigation) {
      console.log('Insufficient navigation skill');
      return false;
    }
    if (requirements.minCombatSkills && traits.combatSkills < requirements.minCombatSkills) {
      console.log('Insufficient combat skills');
      return false;
    }
    if (requirements.minEngineering && traits.engineering < requirements.minEngineering) {
      console.log('Insufficient engineering skill');
      return false;
    }
    if (requirements.requiredRank) {
      const rankOrder = ['rookie', 'experienced', 'foreman', 'sector_chief', 'board_member'];
      if (rankOrder.indexOf(rank) < rankOrder.indexOf(requirements.requiredRank)) {
        console.log('Insufficient rank');
        return false;
      }
    }

    // Start the mission
    setGameState(prev => ({
      ...prev,
      activeMission: mission,
      isInMission: true,
    }));

    return true;
  }, [gameState.player]);

  // Complete a mission
  const completeMission = useCallback(async (success: boolean = true) => {
    if (!gameState.activeMission || !gameState.player) return false;

    try {
      if (success) {
        // Apply mission rewards
        const mission = gameState.activeMission;
        const updatedTraits = { ...gameState.player.traits };
        let totalXPGained = mission.rewards.xp;

        // Apply trait upgrades
        mission.rewards.traitUpgrades.forEach(upgrade => {
          updatedTraits[upgrade.trait] = Math.min(100, updatedTraits[upgrade.trait] + upgrade.increase);
        });

        // Calculate credits gained
        const creditsGained = mission.rewards.resources
          .filter(r => r.type === 'credits')
          .reduce((total, r) => total + r.amount, 0);

        const updatedPlayer: PlayerData = {
          ...gameState.player,
          traits: updatedTraits,
          totalXP: gameState.player.totalXP + totalXPGained,
          credits: gameState.player.credits + creditsGained,
          rank: calculateRank(gameState.player.totalXP + totalXPGained, updatedTraits.leadership),
        };

        setGameState(prev => ({
          ...prev,
          player: updatedPlayer,
          activeMission: null,
          isInMission: false,
        }));

        console.log('Mission completed successfully!', {
          xpGained: totalXPGained,
          creditsGained,
          traitUpgrades: mission.rewards.traitUpgrades,
        });
      } else {
        // Mission failed - no rewards
        setGameState(prev => ({
          ...prev,
          activeMission: null,
          isInMission: false,
        }));
      }

      return true;
    } catch (error) {
      console.error('Failed to complete mission:', error);
      return false;
    }
  }, [gameState.activeMission, gameState.player, calculateRank]);

  // Refresh missions
  const refreshMissions = useCallback(async () => {
    if (!publicKey) return;

    try {
      const missions = await missionManager.getActiveMissions(publicKey);
      setGameState(prev => ({
        ...prev,
        availableMissions: missions,
      }));
    } catch (error) {
      console.error('Failed to refresh missions:', error);
    }
  }, [publicKey]);

  // Initialize when wallet connects
  useEffect(() => {
    initializePlayer();
  }, [initializePlayer]);

  return {
    ...gameState,
    startMission,
    completeMission,
    refreshMissions,
    initializePlayer,
  };
}