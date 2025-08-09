'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

// Loading component for 3D scene
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white text-lg">Loading StarStrike...</div>
    </div>
  );
}

// Basic space environment
function SpaceEnvironment() {
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
      <ambientLight intensity={0.3} />

      {/* Directional light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Basic test objects */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4a9eff" emissive="#001133" />
      </mesh>

      <mesh position={[3, 0, -2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ff6b4a" />
      </mesh>
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
        <Suspense fallback={<LoadingScreen />}>
          {/* Camera setup */}
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />

          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={50}
          />

          {/* Space environment */}
          <SpaceEnvironment />
        </Suspense>
      </Canvas>
    </div>
  );
}