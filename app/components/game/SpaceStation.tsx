'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface SpaceStationProps {
  position?: [number, number, number];
}

export function SpaceStation({ position = [0, 0, -20] }: SpaceStationProps) {
  const stationRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);

  // Animate rotating rings
  useFrame(() => {
    if (ring1Ref.current && ring1Ref.current.rotation) {
      ring1Ref.current.rotation.y += 0.005;
    }
    if (ring2Ref.current && ring2Ref.current.rotation) {
      ring2Ref.current.rotation.y -= 0.003;
    }
  });

  return (
    <group position={position}>
      {/* Central Hub */}
      <mesh ref={stationRef}>
        <cylinderGeometry args={[2, 2, 4, 16]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
          emissive="#0f172a"
        />
      </mesh>

      {/* Docking Bays */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 2) * 3,
            0,
            Math.sin((i * Math.PI) / 2) * 3
          ]}
          rotation={[0, (i * Math.PI) / 2, 0]}
        >
          <boxGeometry args={[1, 0.5, 1.5]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Rotating Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[6, 0.3, 8, 24]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.7}
          roughness={0.3}
          emissive="#1e293b"
        />
      </mesh>

      {/* Rotating Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[8, 0.2, 6, 20]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.7}
          roughness={0.3}
          emissive="#334155"
        />
      </mesh>

      {/* Communication Arrays */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 3) * 10,
            Math.sin(i) * 2,
            Math.sin((i * Math.PI) / 3) * 10
          ]}
        >
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Station Lights */}
      <pointLight
        position={[0, 0, 0]}
        color="#60a5fa"
        intensity={1}
        distance={15}
      />

      {/* Navigation Lights */}
      {[...Array(8)].map((_, i) => (
        <pointLight
          key={i}
          position={[
            Math.cos((i * Math.PI) / 4) * 7,
            Math.sin(i * 0.5) * 3,
            Math.sin((i * Math.PI) / 4) * 7
          ]}
          color={i % 2 === 0 ? "#ef4444" : "#22c55e"}
          intensity={0.5}
          distance={5}
        />
      ))}

      {/* Solar Panels */}
      {[...Array(4)].map((_, i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh position={[12, 2, 0]} rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[4, 0.1, 2]} />
            <meshStandardMaterial
              color="#1e40af"
              metalness={0.1}
              roughness={0.1}
              emissive="#1e3a8a"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[12, -2, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[4, 0.1, 2]} />
            <meshStandardMaterial
              color="#1e40af"
              metalness={0.1}
              roughness={0.1}
              emissive="#1e3a8a"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}