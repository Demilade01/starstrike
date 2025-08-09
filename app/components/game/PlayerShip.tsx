'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Group, MathUtils } from 'three';
import { useGame } from '../../hooks/useGame';
import { LaserProjectile } from './LaserProjectile';

interface PlayerShipProps {
  position?: [number, number, number];
}

interface ShipMovement {
  velocity: Vector3;
  acceleration: Vector3;
  angularVelocity: number;
  targetRotation: number;
  isThrusting: boolean;
  thrusterIntensity: number;
}

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  rotateLeft: boolean;
  rotateRight: boolean;
  shoot: boolean;
}

interface Projectile {
  id: number;
  startPosition: Vector3;
  direction: Vector3;
}

export function PlayerShip({ position = [0, 0, 0] }: PlayerShipProps) {
  const shipRef = useRef<Group>(null);
  const mainHullRef = useRef<Mesh>(null);
  const leftThrusterRef = useRef<Mesh>(null);
  const rightThrusterRef = useRef<Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const [keys, setKeys] = useState<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    rotateLeft: false,
    rotateRight: false,
    shoot: false,
  });

  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [weaponCooldown, setWeaponCooldown] = useState(0);
  const [muzzleFlash, setMuzzleFlash] = useState({ left: false, right: false });
  const projectileIdCounter = useRef(0);

  const [movement, setMovement] = useState<ShipMovement>({
    velocity: new Vector3(0, 0, 0),
    acceleration: new Vector3(0, 0, 0),
    angularVelocity: 0,
    targetRotation: 0,
    isThrusting: false,
    thrusterIntensity: 0,
  });

  const { player } = useGame();
  const { camera } = useThree();

  // Ship stats based on player traits - enhanced for better movement
  const shipStats = {
    maxSpeed: 8 + (player?.traits.shipHandling || 0) * 0.3,
    acceleration: 15 + (player?.traits.shipHandling || 0) * 0.8,
    deceleration: 8 + (player?.traits.shipHandling || 0) * 0.4,
    maneuverability: 2.5 + (player?.traits.shipHandling || 0) * 0.1,
    rotationSpeed: 3 + (player?.traits.shipHandling || 0) * 0.15,
    miningRate: 1 + (player?.traits.miningEfficiency || 0) * 0.03,
    cargoCapacity: 100 + (player?.traits.engineering || 0) * 5,
    weaponCooldownTime: Math.max(0.1, 0.3 - (player?.traits.combatSkills || 0) * 0.005),
    weaponDamage: 10 + (player?.traits.combatSkills || 0) * 0.5,
  };

  // Keyboard event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    switch (key) {
      case 'w':
      case 'arrowup':
        setKeys(prev => ({ ...prev, forward: true }));
        break;
      case 's':
      case 'arrowdown':
        setKeys(prev => ({ ...prev, backward: true }));
        break;
      case 'a':
      case 'arrowleft':
        setKeys(prev => ({ ...prev, left: true }));
        break;
      case 'd':
      case 'arrowright':
        setKeys(prev => ({ ...prev, right: true }));
        break;
      case 'q':
        setKeys(prev => ({ ...prev, rotateLeft: true }));
        break;
      case 'e':
        setKeys(prev => ({ ...prev, rotateRight: true }));
        break;
      case ' ':
      case 'space':
        event.preventDefault();
        setKeys(prev => ({ ...prev, shoot: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    switch (key) {
      case 'w':
      case 'arrowup':
        setKeys(prev => ({ ...prev, forward: false }));
        break;
      case 's':
      case 'arrowdown':
        setKeys(prev => ({ ...prev, backward: false }));
        break;
      case 'a':
      case 'arrowleft':
        setKeys(prev => ({ ...prev, left: false }));
        break;
      case 'd':
      case 'arrowright':
        setKeys(prev => ({ ...prev, right: false }));
        break;
      case 'q':
        setKeys(prev => ({ ...prev, rotateLeft: false }));
        break;
      case 'e':
        setKeys(prev => ({ ...prev, rotateRight: false }));
        break;
      case ' ':
      case 'space':
        setKeys(prev => ({ ...prev, shoot: false }));
        break;
    }
  }, []);

  // Setup keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Shooting function
  const fireWeapons = useCallback(() => {
    if (weaponCooldown > 0 || !shipRef.current) return;

    const ship = shipRef.current;
    const forward = new Vector3(0, 0, 1);
    forward.applyQuaternion(ship.quaternion);

    // Fire from both weapon hardpoints
    const leftWeaponPos = ship.position.clone().add(new Vector3(-0.6, 0, 1.5).applyQuaternion(ship.quaternion));
    const rightWeaponPos = ship.position.clone().add(new Vector3(0.6, 0, 1.5).applyQuaternion(ship.quaternion));

    const newProjectiles: Projectile[] = [
      {
        id: projectileIdCounter.current++,
        startPosition: leftWeaponPos,
        direction: forward,
      },
      {
        id: projectileIdCounter.current++,
        startPosition: rightWeaponPos,
        direction: forward,
      }
    ];

    setProjectiles(prev => [...prev, ...newProjectiles]);
    setWeaponCooldown(shipStats.weaponCooldownTime);

    // Trigger muzzle flash
    setMuzzleFlash({ left: true, right: true });
    setTimeout(() => setMuzzleFlash({ left: false, right: false }), 100);
  }, [weaponCooldown, shipStats.weaponCooldownTime]);

  // Remove projectile by id
  const removeProjectile = useCallback((id: number) => {
    setProjectiles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Physics and movement update
  useFrame((state, delta) => {
    if (!shipRef.current) return;

    const ship = shipRef.current;
    const isThrusting = keys.forward || keys.backward || keys.left || keys.right;

    // Update weapon cooldown
    if (weaponCooldown > 0) {
      setWeaponCooldown(prev => Math.max(0, prev - delta));
    }

    // Handle shooting
    if (keys.shoot && weaponCooldown <= 0) {
      fireWeapons();
    }

    // Update movement state
    setMovement(prev => {
      const newMovement = { ...prev };

      // Calculate thrust direction based on current rotation
      const thrustDirection = new Vector3();
      let thrustMagnitude = 0;

      if (keys.forward) {
        thrustDirection.z -= 1;
        thrustMagnitude += 1;
      }
      if (keys.backward) {
        thrustDirection.z += 0.6; // Reverse thrust is weaker
        thrustMagnitude += 0.6;
      }
      if (keys.left) {
        thrustDirection.x -= 0.8;
        thrustMagnitude += 0.8;
      }
      if (keys.right) {
        thrustDirection.x += 0.8;
        thrustMagnitude += 0.8;
      }

      // Apply ship rotation to thrust direction
      thrustDirection.applyQuaternion(ship.quaternion);
      thrustDirection.normalize();

      // Calculate acceleration
      if (isThrusting) {
        newMovement.acceleration.copy(thrustDirection);
        newMovement.acceleration.multiplyScalar(shipStats.acceleration * thrustMagnitude);
        newMovement.isThrusting = true;
        newMovement.thrusterIntensity = Math.min(1, newMovement.thrusterIntensity + delta * 4);
      } else {
        newMovement.acceleration.set(0, 0, 0);
        newMovement.isThrusting = false;
        newMovement.thrusterIntensity = Math.max(0, newMovement.thrusterIntensity - delta * 2);
      }

      // Apply acceleration to velocity
      const accelerationThisFrame = newMovement.acceleration.clone().multiplyScalar(delta);
      newMovement.velocity.add(accelerationThisFrame);

      // Apply deceleration when not thrusting
      if (!isThrusting) {
        const deceleration = shipStats.deceleration * delta;
        if (newMovement.velocity.length() > deceleration) {
          const decelerationVector = newMovement.velocity.clone().normalize().multiplyScalar(-deceleration);
          newMovement.velocity.add(decelerationVector);
        } else {
          newMovement.velocity.set(0, 0, 0);
        }
      }

      // Limit max speed
      if (newMovement.velocity.length() > shipStats.maxSpeed) {
        newMovement.velocity.normalize().multiplyScalar(shipStats.maxSpeed);
      }

      // Handle rotation
      if (keys.rotateLeft) {
        newMovement.angularVelocity = shipStats.rotationSpeed;
      } else if (keys.rotateRight) {
        newMovement.angularVelocity = -shipStats.rotationSpeed;
      } else {
        newMovement.angularVelocity *= 0.9; // Gradual stop
      }

      return newMovement;
    });

    // Apply movement to ship
    const velocityThisFrame = movement.velocity.clone().multiplyScalar(delta);
    ship.position.add(velocityThisFrame);

    // Apply rotation
    if (Math.abs(movement.angularVelocity) > 0.01) {
      ship.rotateY(movement.angularVelocity * delta);
    }

    // Visual effects based on movement
    if (mainHullRef.current) {
      // Hover effect
      const hoverScale = hovered ? 1.05 : 1;
      const targetScale = hoverScale + movement.thrusterIntensity * 0.02;
      mainHullRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), delta * 5);

      // Banking effect during turns
      const bankAngle = -movement.angularVelocity * 0.3;
      mainHullRef.current.rotation.z = MathUtils.lerp(mainHullRef.current.rotation.z, bankAngle, delta * 3);
    }

    // Thruster visual feedback
    if (leftThrusterRef.current && rightThrusterRef.current) {
      const thrusterGlow = 1 + movement.thrusterIntensity * 0.5;
      leftThrusterRef.current.scale.setScalar(thrusterGlow);
      rightThrusterRef.current.scale.setScalar(thrusterGlow);
    }

    // Keep camera following ship at a distance
    if (camera && movement.velocity.length() > 0.1) {
      const targetPosition = ship.position.clone().add(new Vector3(8, 6, 10));
      camera.position.lerp(targetPosition, delta * 0.5);
      camera.lookAt(ship.position);
    }
  });

  return (
    <group
      ref={shipRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Hull - Sleek elongated design */}
      <mesh ref={mainHullRef}>
        <capsuleGeometry args={[0.6, 2.5, 4, 8]} />
        <meshStandardMaterial
          color={hovered ? "#4a9eff" : "#2563eb"}
          emissive="#001133"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Forward Hull Section */}
      <mesh position={[0, 0, 1.8]}>
        <coneGeometry args={[0.4, 1.2, 8]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#000822"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Rear Hull Section */}
      <mesh position={[0, 0, -1.8]}>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial
          color="#1e3a8a"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Port Wing */}
      <group position={[-0.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.15, 2]} />
          <meshStandardMaterial
            color="#1e40af"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Wing tip */}
        <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.4, 4]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Starboard Wing */}
      <group position={[0.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.15, 2]} />
          <meshStandardMaterial
            color="#1e40af"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Wing tip */}
        <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.4, 4]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Engine Nacelles */}
      <group>
        {/* Port Engine */}
        <mesh ref={leftThrusterRef} position={[-1.4, 0, -0.8]}>
          <cylinderGeometry args={[0.2, 0.35, 1.6, 12]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive={movement.isThrusting ? "#660000" : "#330000"}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Starboard Engine */}
        <mesh ref={rightThrusterRef} position={[1.4, 0, -0.8]}>
          <cylinderGeometry args={[0.2, 0.35, 1.6, 12]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive={movement.isThrusting ? "#660000" : "#330000"}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Engine Connecting Struts */}
        <mesh position={[-0.7, 0, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.08, 0.6, 6]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0.7, 0, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.08, 0.6, 6]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Cockpit Canopy */}
      <mesh position={[0, 0.4, 0.8]}>
        <sphereGeometry args={[0.5, 12, 8]} />
        <meshStandardMaterial
          color="#60a5fa"
          transparent
          opacity={0.6}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>

      {/* Sensor Array */}
      <mesh position={[0, 0.2, 2.2]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#064e3b"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Weapon Hardpoints */}
      <group>
        {/* Left Weapon Mount */}
        <mesh position={[-0.6, 0, 1.5]}>
          <cylinderGeometry args={[0.08, 0.12, 0.4, 8]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive={muzzleFlash.left ? "#ff0000" : "#330000"}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Right Weapon Mount */}
        <mesh position={[0.6, 0, 1.5]}>
          <cylinderGeometry args={[0.08, 0.12, 0.4, 8]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive={muzzleFlash.right ? "#ff0000" : "#330000"}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Muzzle Flash Effects */}
        {muzzleFlash.left && (
          <mesh position={[-0.6, 0, 1.7]}>
            <sphereGeometry args={[0.15]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {muzzleFlash.right && (
          <mesh position={[0.6, 0, 1.7]}>
            <sphereGeometry args={[0.15]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
      </group>

      {/* Navigation Lights */}
      <mesh position={[-1.6, 0, 0.5]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[1.6, 0, 0.5]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#16a34a"
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Engine Exhaust Glow */}
      {movement.isThrusting && (
        <>
          {/* Port Engine Glow */}
          <mesh position={[-1.4, 0, -1.8]}>
            <sphereGeometry args={[0.4 * movement.thrusterIntensity]} />
            <meshBasicMaterial
              color="#ff6b4a"
              transparent
              opacity={0.6 * movement.thrusterIntensity}
            />
          </mesh>

          {/* Starboard Engine Glow */}
          <mesh position={[1.4, 0, -1.8]}>
            <sphereGeometry args={[0.4 * movement.thrusterIntensity]} />
            <meshBasicMaterial
              color="#ff6b4a"
              transparent
              opacity={0.6 * movement.thrusterIntensity}
            />
          </mesh>
        </>
      )}

      {/* Dynamic Engine Lighting */}
      <pointLight
        position={[-1.4, 0, -1.5]}
        color="#ff6b4a"
        intensity={movement.thrusterIntensity * 2}
        distance={5}
      />
      <pointLight
        position={[1.4, 0, -1.5]}
        color="#ff6b4a"
        intensity={movement.thrusterIntensity * 2}
        distance={5}
      />

      {/* Render Projectiles */}
      {projectiles.map((projectile) => (
        <LaserProjectile
          key={projectile.id}
          startPosition={projectile.startPosition}
          direction={projectile.direction}
          onDestroy={() => removeProjectile(projectile.id)}
        />
      ))}

      {/* Ship Status Display */}
      {hovered && (
        <group position={[0, 2.5, 0]}>
          <mesh>
            <planeGeometry args={[4, 1.5]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Status lights */}
          <mesh position={[-1.5, 0.3, 0.01]}>
            <circleGeometry args={[0.1]} />
            <meshStandardMaterial
              color={movement.isThrusting ? "#22c55e" : "#374151"}
              emissive={movement.isThrusting ? "#16a34a" : "#000000"}
            />
          </mesh>
          <mesh position={[-1.0, 0.3, 0.01]}>
            <circleGeometry args={[0.1]} />
            <meshStandardMaterial
              color={movement.velocity.length() > 0.1 ? "#3b82f6" : "#374151"}
              emissive={movement.velocity.length() > 0.1 ? "#1d4ed8" : "#000000"}
            />
          </mesh>
          <mesh position={[-0.5, 0.3, 0.01]}>
            <circleGeometry args={[0.1]} />
            <meshStandardMaterial
              color={Math.abs(movement.angularVelocity) > 0.1 ? "#f59e0b" : "#374151"}
              emissive={Math.abs(movement.angularVelocity) > 0.1 ? "#d97706" : "#000000"}
            />
          </mesh>
          <mesh position={[0, 0.3, 0.01]}>
            <circleGeometry args={[0.1]} />
            <meshStandardMaterial
              color={weaponCooldown <= 0 ? "#22c55e" : "#dc2626"}
              emissive={weaponCooldown <= 0 ? "#16a34a" : "#991b1b"}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}