'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { PlayerShip } from './PlayerShip';
import { AsteroidField } from './AsteroidField';
import { SpaceStation } from './SpaceStation';
import { useGame } from '../../hooks/useGame';

// Loading component for 3D scene
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white text-lg">Loading StarStrike...</div>
    </div>
  );
}

// Error boundary for 3D scene
function SceneErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('3D Scene Error:', error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">3D Scene Error - Please refresh</div>
      </div>
    );
  }
}

// Enhanced space environment with game objects
function SpaceEnvironment() {
  const { player, isInMission } = useGame();

  return (
    <>
      {/* Starfield background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />

      {/* Directional light (sun) */}
      <directionalLight
        position={[20, 20, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Space Station */}
      <SpaceStation position={[0, 0, -25]} />

      {/* Player Ship */}
      {player && (
        <PlayerShip position={[0, 0, 5]} />
      )}

      {/* Asteroid Field - only show when connected */}
      {player && (
        <AsteroidField count={25} radius={20} />
      )}

      {/* Additional space ambiance */}
      <pointLight
        position={[-30, 10, -10]}
        color="#4338ca"
        intensity={0.3}
        distance={50}
      />
      <pointLight
        position={[30, -10, 10]}
        color="#dc2626"
        intensity={0.2}
        distance={40}
      />
    </>
  );
}

interface Scene3DProps {
  className?: string;
}

export function Scene3D({ className = "" }: Scene3DProps) {
  return (
        <div className={`w-full h-full bg-black ${className}`}>
      <Canvas>
        <SceneErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            {/* Camera setup */}
            <PerspectiveCamera makeDefault position={[8, 6, 10]} />

            {/* Camera controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={80}
              target={[0, 0, 0]}
              enableDamping={true}
              dampingFactor={0.05}
            />

            {/* Space environment */}
            <SpaceEnvironment />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>
    </div>
  );
}