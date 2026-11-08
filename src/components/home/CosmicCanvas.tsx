import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  OrbitControls, 
  Sphere, 
  Stars,
  Text,
  useTexture,
  Center
} from '@react-three/drei';
import * as THREE from 'three';

// Precision Luxury Color Palette
const COLORS = {
  primary: '#3fae86', // Zümrüt (parlak)
  secondary: '#a8e6cf', // Mint
  gold: '#d4af37', // Altın
  white: '#f5efe1', // Fildişi
  deepSpace: '#04140f'
};

/**
 * Breathing 3D Text Header
 */
function CosmicHeader() {
  const groupRef = useRef<THREE.Group>(null);
  const textRef1 = useRef<any>(null);
  const textRef2 = useRef<any>(null);
  const textRef3 = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Soft breathing scale animation
    const breath = 1 + Math.sin(t * 1.5) * 0.03;
    if (groupRef.current) {
      groupRef.current.scale.set(breath, breath, breath);
    }

    // Individual floating and glowing
    if (textRef2.current) {
       // "PARLAK" glowing effect
       const glow = 0.5 + Math.sin(t * 2) * 0.5;
       textRef2.current.material.emissiveIntensity = glow;
    }
  });

  const commonProps = {
    // Self-hosted marka fontu (Türkçe karakter destekli; harici URL Suspense'i kilitliyordu)
    font: "/fonts/cormorant-garamond-700-tr.woff",
    anchorX: "center" as const,
    anchorY: "middle" as const,
    letterSpacing: -0.05,
  };

  return (
    <Center position={[0, 2, 0]}>
      <group ref={groupRef}>
        <Text 
          ref={textRef1}
          {...commonProps}
          fontSize={5.5}
          position={[0, 6, 0]}
          fontWeight={900}
        >
          GECENİN
          <meshStandardMaterial color={COLORS.white} />
        </Text>

        <Text 
          ref={textRef2}
          {...commonProps}
          fontSize={8.5}
          position={[0, 0, 0]}
          fontWeight={900}
        >
          PARLAK
          <meshStandardMaterial 
            color={COLORS.primary} 
            emissive={COLORS.primary} 
            emissiveIntensity={1}
          />
        </Text>

        <Text 
          ref={textRef3}
          {...commonProps}
          fontSize={5.5}
          position={[0, -6, 0]}
          fontWeight={900}
        >
          YILDIZLARI
          <meshStandardMaterial color={COLORS.white} />
        </Text>
      </group>
    </Center>
  );
}

interface PlanetProps {
  position: [number, number, number];
  scale: number;
  texturePath: string;
  rotationSpeed?: number;
  color?: string;
}

/**
 * Realistic Planet with Textures
 */
function Planet({ position, scale, texturePath, rotationSpeed = 0.005, color = "#ffffff" }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(texturePath) as THREE.Texture;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.z += rotationSpeed * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.7} 
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.1}
        />
        <Sphere args={[1.05, 32, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} />
        </Sphere>
      </mesh>
    </Float>
  );
}

/**
 * Dynamic Shooting Star Effect
 */
function ShootingStar() {
  const [active, setActive] = useState(false);
  const lineRef = useRef<THREE.Mesh>(null);
  const startPos = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, -30), []);
  const endPos = useMemo(() => new THREE.Vector3(startPos.x + 30, startPos.y - 20, startPos.z), [startPos]);
  const progress = useRef(0);

  useFrame((_state, delta) => {
    if (!active && Math.random() < 0.002) { setActive(true); progress.current = 0; }
    if (active && lineRef.current) {
      progress.current += delta * 1.5;
      lineRef.current.position.lerpVectors(startPos, endPos, progress.current);
      if (progress.current >= 1) {
        setActive(false);
        startPos.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, -30);
        endPos.set(startPos.x + 30, startPos.y - 20, startPos.z);
      }
    }
  });

  if (!active) return null;
  return (
    <mesh ref={lineRef}>
      <boxGeometry args={[0.08, 0.08, 3]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
}

/**
 * Enhanced Particle Swarm
 */
function EliteParticleSwarm() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1500;
  const [positions, colors] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const colorA = new THREE.Color(COLORS.primary);
    const colorB = new THREE.Color(COLORS.secondary);
    for (let i = 0; i < count; i++) {
        const r = 25 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        p[i*3] = r * Math.sin(phi) * Math.cos(theta);
        p[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        p[i*3+2] = r * Math.cos(phi);
        const mix = Math.random();
        const target = colorA.clone().lerp(colorB, mix);
        c[i*3] = target.r; c[i*3+1] = target.g; c[i*3+2] = target.b;
    }
    return [p, c];
  }, []);
  useFrame((state) => { if (pointsRef.current) pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015; });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} vertexColors transparent opacity={0.5} sizeAttenuation 
        blending={THREE.AdditiveBlending} depthWrite={false}
      />
    </points>
  );
}

export function CosmicCanvas() {
  return (
    <div className="absolute inset-0 z-0 bg-[#020205]">
      <Canvas 
        camera={{ position: [0, 0, 45], fov: 45 }}
        gl={{ 
          antialias: true, alpha: true,
          powerPreference: "high-performance",
          stencil: false, depth: true
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[20, 20, 20]} intensity={2} color={COLORS.primary} />
        <pointLight position={[-20, -20, -20]} intensity={1.5} color={COLORS.secondary} />
        
        <OrbitControls 
          enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} 
          maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} 
        />

        <Stars radius={100} depth={50} count={6000} factor={6} saturation={0} fade speed={1} />
        <EliteParticleSwarm />
        
        {/* The 3D Header */}
        <CosmicHeader />
        
        {/* Elements */}
        <Planet position={[-22, 12, -15]} scale={2.5} texturePath="/textures/lava.jpg" color={COLORS.secondary} />
        <Planet position={[25, -15, -20]} scale={2.2} texturePath="/textures/ice.jpg" color={COLORS.primary} />
        <Planet position={[8, 20, -30]} scale={4} texturePath="/textures/stone.jpg" color="#888888" />

        <Sparkles count={250} scale={50} size={3} speed={0.4} opacity={0.3} color="#ffffff" />
        <ShootingStar />
        <ShootingStar />
        
        <fog attach="fog" args={['#020205', 40, 100]} />
      </Canvas>
    </div>
  );
}
