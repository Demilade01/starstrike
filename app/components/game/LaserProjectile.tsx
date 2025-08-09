'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

interface LaserProjectileProps {
  startPosition: Vector3;
  direction: Vector3;
  speed?: number;
  lifetime?: number;
  onDestroy: () => void;
}

export function LaserProjectile({
  startPosition,
  direction,
  speed = 25,
  lifetime = 3,
  onDestroy
}: LaserProjectileProps) {
  const projectileRef = useRef<Mesh>(null);
  const trailRef = useRef<Mesh>(null);
  const velocity = useRef(direction.clone().normalize().multiplyScalar(speed));
  const timeAlive = useRef(0);

  useFrame((state, delta) => {
    if (!projectileRef.current) return;

    timeAlive.current += delta;

    // Move projectile
    const movement = velocity.current.clone().multiplyScalar(delta);
    projectileRef.current.position.add(movement);

    // Update trail
    if (trailRef.current) {
      trailRef.current.position.copy(projectileRef.current.position);
      trailRef.current.lookAt(
        projectileRef.current.position.clone().add(velocity.current)
      );
    }

    // Destroy after lifetime
    if (timeAlive.current >= lifetime) {
      onDestroy();
    }
  });

  useEffect(() => {
    if (projectileRef.current) {
      projectileRef.current.position.copy(startPosition);
    }
  }, [startPosition]);

  return (
    <group>
      {/* Main projectile */}
      <mesh ref={projectileRef}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial
          color="#00ffff"
          emissive="#0088cc"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Energy trail */}
      <mesh ref={trailRef}>
        <cylinderGeometry args={[0.02, 0.04, 0.8]} />
        <meshBasicMaterial
          color="#00aaff"
          emissive="#0066aa"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={projectileRef}>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Point light for illumination */}
      <pointLight
        position={projectileRef.current?.position || [0, 0, 0]}
        color="#00ffff"
        intensity={1}
        distance={3}
      />
    </group>
  );
}
