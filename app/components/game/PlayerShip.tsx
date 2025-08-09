'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGame } from '../../hooks/useGame';

interface PlayerShipProps {
  position?: [number, number, number];
}

export function PlayerShip({ position = [0, 0, 0] }: PlayerShipProps) {
  const shipRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { player } = useGame();

  // Ship stats based on player traits
  const shipStats = {
    maxSpeed: 10 + (player?.traits.shipHandling || 0) * 0.5,
    maneuverability: 1 + (player?.traits.shipHandling || 0) * 0.02,
    miningRate: 1 + (player?.traits.miningEfficiency || 0) * 0.03,
    cargoCapacity: 100 + (player?.traits.engineering || 0) * 5,
  };

    // Animate ship with gentle floating motion
  useFrame((state) => {
    if (shipRef.current && state.clock) {
      // Gentle floating motion
      shipRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Subtle rotation based on ship handling trait
      shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;

      // Hover effect
      if (hovered) {
        shipRef.current.scale.setScalar(1.1);
      } else {
        shipRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Main Ship Body */}
      <mesh
        ref={shipRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Ship Hull - elongated diamond shape */}
        <coneGeometry args={[0.8, 3, 6]} />
        <meshStandardMaterial
          color={hovered ? "#4a9eff" : "#2563eb"}
          emissive="#001133"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Engine Thrusters */}
      <mesh position={[-1.2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.8, 8]} />
        <meshStandardMaterial
          color="#ff6b4a"
          emissive="#330011"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.8, 8]} />
        <meshStandardMaterial
          color="#ff6b4a"
          emissive="#330011"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Ship Wings */}
      <mesh position={[0, 0, -0.5]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2, 0.1, 0.3]} />
        <meshStandardMaterial
          color="#1e40af"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.3, 1]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshStandardMaterial
          color="#60a5fa"
          transparent
          opacity={0.7}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Engine Glow Effect */}
      <pointLight
        position={[-1.2, 0, -0.5]}
        color="#ff6b4a"
        intensity={0.5}
        distance={3}
      />
      <pointLight
        position={[1.2, 0, -0.5]}
        color="#ff6b4a"
        intensity={0.5}
        distance={3}
      />

      {/* Ship Info Display (when hovered) */}
      {hovered && (
        <group position={[0, 2, 0]}>
          {/* Simple floating text effect - we'll enhance this later */}
          <mesh>
            <planeGeometry args={[3, 1]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}