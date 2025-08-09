'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGame } from '../../hooks/useGame';

interface Asteroid {
  id: string;
  position: [number, number, number];
  size: number;
  rotationSpeed: [number, number, number];
  resources: 'basic_minerals' | 'rare_elements';
  mined: boolean;
}

interface AsteroidFieldProps {
  count?: number;
  radius?: number;
}

export function AsteroidField({ count = 20, radius = 15 }: AsteroidFieldProps) {
  const { isInMission, activeMission, completeMission } = useGame();
  const [minedAsteroids, setMinedAsteroids] = useState<Set<string>>(new Set());
  const [miningProgress, setMiningProgress] = useState<{ [key: string]: number }>({});
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);

  // Generate random asteroids only on client side
  useEffect(() => {
    const asteroidList: Asteroid[] = [];

    for (let i = 0; i < count; i++) {
      // Generate random position in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * radius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      asteroidList.push({
        id: `asteroid_${i}`,
        position: [x, y, z],
        size: Math.max(0.3, 0.3 + Math.random() * 0.7), // Ensure minimum size
        rotationSpeed: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        ],
        resources: Math.random() > 0.7 ? 'rare_elements' : 'basic_minerals',
        mined: false,
      });
    }

    setAsteroids(asteroidList);
  }, [count, radius]);

  const handleAsteroidClick = async (asteroid: Asteroid) => {
    if (!isInMission || !activeMission || minedAsteroids.has(asteroid.id) || !asteroid.id) return;

    // Start mining animation
    setMiningProgress(prev => ({ ...prev, [asteroid.id]: 0 }));

    // Simulate mining time (2 seconds)
    const miningInterval = setInterval(() => {
      setMiningProgress(prev => {
        const current = prev[asteroid.id] || 0;
        const newProgress = current + 10;

        if (newProgress >= 100) {
          clearInterval(miningInterval);

          // Mark asteroid as mined
          setMinedAsteroids(prev => new Set([...prev, asteroid.id]));

          // Check if mission is complete
          const totalMined = minedAsteroids.size + 1;
          if (activeMission.type === 'mining_quota' && totalMined >= 5) {
            // Complete the mission after mining 5 asteroids
            setTimeout(() => {
              completeMission(true);
              setMinedAsteroids(new Set()); // Reset for next mission
              setMiningProgress({});
            }, 500);
          }

          return { ...prev, [asteroid.id]: 100 };
        }

        return { ...prev, [asteroid.id]: newProgress };
      });
    }, 100);
  };

  // Don't render anything until asteroids are generated
  if (asteroids.length === 0) {
    return null;
  }

  return (
    <group>
      {asteroids.map((asteroid) => (
        <AsteroidMesh
          key={asteroid.id}
          asteroid={asteroid}
          isMined={minedAsteroids.has(asteroid.id)}
          miningProgress={miningProgress[asteroid.id] || 0}
          canMine={isInMission && activeMission?.type === 'mining_quota'}
          onClick={() => handleAsteroidClick(asteroid)}
        />
      ))}
    </group>
  );
}

interface AsteroidMeshProps {
  asteroid: Asteroid;
  isMined: boolean;
  miningProgress: number;
  canMine: boolean;
  onClick: () => void;
}

function AsteroidMesh({ asteroid, isMined, miningProgress, canMine, onClick }: AsteroidMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate asteroid rotation
  useFrame(() => {
    if (meshRef.current && asteroid.rotationSpeed) {
      meshRef.current.rotation.x += asteroid.rotationSpeed[0];
      meshRef.current.rotation.y += asteroid.rotationSpeed[1];
      meshRef.current.rotation.z += asteroid.rotationSpeed[2];
    }
  });

  const getAsteroidColor = () => {
    if (isMined) return "#666666"; // Dark gray when mined
    if (hovered && canMine) return "#4ade80"; // Green when hoverable
    if (asteroid.resources === 'rare_elements') return "#fbbf24"; // Gold for rare
    return "#a3a3a3"; // Gray for basic
  };

  const getEmissiveColor = () => {
    if (miningProgress > 0) return "#ff4444"; // Red glow when mining
    if (hovered && canMine) return "#22c55e"; // Green glow when hoverable
    return "#000000";
  };

  return (
    <group position={asteroid.position}>
      {/* Main Asteroid */}
      <mesh
        ref={meshRef}
        onClick={canMine ? onClick : undefined}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isMined ? 0.7 : 1}
      >
        {/* Irregular asteroid shape */}
        <dodecahedronGeometry args={[asteroid.size, 0]} />
        <meshStandardMaterial
          color={getAsteroidColor()}
          emissive={getEmissiveColor()}
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Mining Progress Ring */}
      {miningProgress > 0 && miningProgress < 100 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[asteroid.size * 1.2, asteroid.size * 1.4, 32]} />
          <meshBasicMaterial
            color="#ff4444"
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Resource Indicator */}
      {asteroid.resources === 'rare_elements' && !isMined && (
        <mesh position={[0, asteroid.size + 0.3, 0]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Mining Laser Effect */}
      {miningProgress > 0 && miningProgress < 100 && (
        <group>
          <pointLight
            position={[0, 0, 0]}
            color="#ff4444"
            intensity={2}
            distance={5}
          />
          {/* Particle effect simulation with small spheres */}
          {[...Array(5)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * asteroid.size * 2,
                (Math.random() - 0.5) * asteroid.size * 2,
                (Math.random() - 0.5) * asteroid.size * 2,
              ]}
            >
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshStandardMaterial
                color="#ff6666"
                emissive="#ff4444"
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}