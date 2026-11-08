import React, { useRef, useMemo, useState, Suspense, memo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles, Trail, useTexture, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SPIRAL_TEXTURES = [
  '/assets/textures/environment/spirel1.png',
  '/assets/textures/environment/spirel2.png'
];

/** Zümrüt & Altın marka paleti (src/config/brand.ts ile uyumlu) */
const SCENE_COLORS = {
  emeraldDeep: '#0d5f45',
  emeraldGlow: '#3fae86',
  emerald: '#127a59',
  gold: '#d4af37',
  mint: '#a8e6cf',
  night: '#04140f'
};

function PostProcessingEffects({ quality, scrollProgress }: { quality: 'high' | 'low'; scrollProgress: number }) {
  if (quality === 'low') return null;

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        luminanceThreshold={0.3 - scrollProgress * 0.15}
        mipmapBlur
        intensity={1.2 + scrollProgress * 0.8}
        radius={0.2 + scrollProgress * 0.3}
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1 + scrollProgress * 0.4} />
      <ChromaticAberration
        offset={new THREE.Vector2(0.001 + scrollProgress * 0.002, 0.001 + scrollProgress * 0.002)}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}

function MouseReactiveParticles({ count, mouse }: { count: number; mouse: React.MutableRefObject<THREE.Vector2> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions, colors, sizes] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const colorPurple = new THREE.Color(SCENE_COLORS.emeraldDeep); // zümrüt derin
    const colorMagenta = new THREE.Color(SCENE_COLORS.emeraldGlow);
    const colorGold = new THREE.Color(SCENE_COLORS.gold);
    const colorRed = new THREE.Color(SCENE_COLORS.emerald);

    for (let i = 0; i < count; i++) {
      const radius = 30 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      p[i * 3 + 2] = radius * Math.cos(phi);

      const choice = Math.random();
      const target = choice < 0.4 ? colorPurple : choice < 0.7 ? colorMagenta : choice < 0.9 ? colorGold : colorRed;
      c[i * 3] = target.r;
      c[i * 3 + 1] = target.g;
      c[i * 3 + 2] = target.b;
      s[i] = 0.1 + Math.random() * 0.4;
    }
    return [p, c, s];
  }, [count]);

  const initialPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const pos = geometry.attributes.position.array as Float32Array;

    const mouseInfluence = 8;
    const returnSpeed = 0.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      const mx = mouse.current.x * mouseInfluence * (0.5 + Math.sin(state.clock.elapsedTime * 0.5 + i * 0.01) * 0.5);
      const my = mouse.current.y * mouseInfluence * (0.5 + Math.cos(state.clock.elapsedTime * 0.3 + i * 0.01) * 0.5);
      const mz = (mouse.current.x + mouse.current.y) * mouseInfluence * 0.3;

      const targetX = initialPositions[idx] + mx;
      const targetY = initialPositions[idx + 1] + my;
      const targetZ = initialPositions[idx + 2] + mz;

      pos[idx] += (targetX - pos[idx]) * delta * returnSpeed;
      pos[idx + 1] += (targetY - pos[idx + 1]) * delta * returnSpeed;
      pos[idx + 2] += (targetZ - pos[idx + 2]) * delta * returnSpeed;
    }

    geometry.attributes.position.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SeductiveNebula({ scrollProgress }: { scrollProgress: number }) {
  const textures = useTexture(SPIRAL_TEXTURES);
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    const currentHue = 330 - scrollProgress * 30;
    return Array.from({ length: 8 }).map((_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 200,
        -200 - Math.random() * 100
      ),
      texture: textures[i % 2],
      size: 250 + Math.random() * 400,
      hue: (currentHue + i * 20) % 360,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }));
  }, [textures, scrollProgress]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.children.forEach((obj, i) => {
      if (obj instanceof THREE.Sprite && obj.material && clouds[i]) {
        obj.material.rotation = time * clouds[i].rotationSpeed;
        const pulse = 0.12 + Math.sin(time * 0.5 + i) * 0.05;
        obj.material.opacity = pulse;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => {
        const color = new THREE.Color(`hsl(${c.hue}, 80%, 50%)`);
        return (
          <sprite key={`nebula-${i}`} position={c.position} scale={[c.size, c.size, 1]}>
            <spriteMaterial
              map={c.texture}
              transparent
              opacity={0.15}
              color={color}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </group>
  );
}

interface ShootingStarProps {
  direction: 'TO_SCREEN' | 'AWAY_SCREEN' | 'DIAGONAL_RL' | 'DIAGONAL_LR';
  onFinished: () => void;
}

function ShootingStar({ direction, onFinished }: ShootingStarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDying, setIsDying] = useState(false);
  const speed = 120;

  const { startPos, velocity } = useMemo(() => {
    const pos = new THREE.Vector3();
    const vel = new THREE.Vector3();
    switch (direction) {
      case 'TO_SCREEN':
        pos.set(Math.random() * 80 - 40, Math.random() * 80 - 40, -150);
        vel.set(0, 0, speed);
        break;
      case 'AWAY_SCREEN':
        pos.set(Math.random() * 80 - 40, Math.random() * 80 - 40, 0);
        vel.set(0, 0, -speed);
        break;
      default:
        pos.set(150, 80, (Math.random() - 0.5) * 50);
        vel.set(-speed, -speed * 0.5, 0);
    }
    return { startPos: pos, velocity: vel };
  }, [direction]);

  useFrame((_state, delta) => {
    if (meshRef.current && !isDying) {
      meshRef.current.position.addScaledVector(velocity, delta);
      if (meshRef.current.position.length() > 350) {
        setIsDying(true);
        setTimeout(onFinished, 500);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={startPos}>
      <Trail width={1} color={SCENE_COLORS.emeraldGlow} length={10} decay={2}>
        <mesh visible={false}><sphereGeometry args={[0.05]} /></mesh>
      </Trail>
      <mesh visible={!isDying}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </mesh>
  );
}

type Direction = 'TO_SCREEN' | 'AWAY_SCREEN' | 'DIAGONAL_RL' | 'DIAGONAL_LR';

function HybridStarField({ mouse, scrollProgress }: { mouse: React.MutableRefObject<THREE.Vector2>; scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeStars, setActiveStars] = useState<{ id: number; dir: Direction }[]>([]);
  const lastSpawnTime = useRef(0);

  const addStar = useCallback(() => {
    setActiveStars(prev => [...prev, { id: Date.now(), dir: 'TO_SCREEN' as Direction }]);
  }, []);

  const removeStar = useCallback((id: number) => {
    setActiveStars(prev => prev.filter(s => s.id !== id));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.002;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.02;

      const mouseTiltX = mouse.current.y * 0.02;
      const mouseTiltY = mouse.current.x * 0.02;
      groupRef.current.rotation.x += mouseTiltX * 0.01;
      groupRef.current.rotation.y += mouseTiltY * 0.01;
    }

    const spawnInterval = isMobile ? 25 : 15;
    if (state.clock.elapsedTime - lastSpawnTime.current > spawnInterval) {
      addStar();
      lastSpawnTime.current = state.clock.elapsedTime;
    }
  });

  const starCount = isMobile ? 1200 : 8000;
  const dustCount = isMobile ? 800 : 2000;
  const particleCount = isMobile ? 800 : 3000;

  return (
    <group ref={groupRef}>
      <Stars
        key={`stars-${starCount}`}
        radius={400}
        depth={50}
        count={starCount}
        factor={isMobile ? 4 : 3}
        saturation={0}
        fade
        speed={1}
      />
      {/* key: sayı değişirse geometri yeniden kurulur (buffer yeniden boyutlanamaz) */}
      <MouseReactiveParticles key={particleCount} count={particleCount} mouse={mouse} />
      <Sparkles
        key={`dust-${dustCount}`}
        count={dustCount}
        scale={200}
        size={isMobile ? 2.5 : 1.5}
        speed={0.2}
        opacity={0.3}
        color={SCENE_COLORS.emeraldGlow}
      />
      <Suspense fallback={null}>
        <SeductiveNebula scrollProgress={scrollProgress} />
      </Suspense>
      {activeStars.map(star => (
        <ShootingStar
          key={star.id}
          direction={star.dir}
          onFinished={() => removeStar(star.id)}
        />
      ))}
    </group>
  );
}

function MouseTracker({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const { pointer } = useThree();

  useFrame(() => {
    mouse.current.x += (pointer.x * 2 - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.y * 2 - mouse.current.y) * 0.05;
  });

  return null;
}

function ScrollTracker({ onScroll }: { onScroll: (progress: number) => void }) {
  useFrame(() => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / maxScroll, 1);
    onScroll(progress);
  });
  return null;
}

export default memo(function UniverseScene() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [dpr, setDpr] = useState(isMobile ? 1 : 1.5);
  const [quality, setQuality] = useState<'high' | 'low'>(isMobile ? 'low' : 'high');
  const [scrollProgress, setScrollProgress] = useState(0);
  const mouse = useRef(new THREE.Vector2(0, 0));

  return (
    <div className="w-full h-full bg-[#04140f] fixed inset-0 -z-50 overflow-hidden pointer-events-none" aria-hidden="true">
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance'
        }}
        dpr={dpr}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setQuality('low');
          }}
          onIncline={() => {
            if (!isMobile) {
              setDpr(1.5);
              setQuality('high');
            }
          }}
        />

        <color attach="background" args={[SCENE_COLORS.night]} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={isMobile ? 65 : 45} near={0.1} far={1500} />

        <ambientLight intensity={0.3} />
        <pointLight position={[50, 50, 100]} intensity={1.5} color={SCENE_COLORS.emeraldGlow} />
        <pointLight position={[-50, -30, 50]} intensity={0.8} color={SCENE_COLORS.emeraldDeep} />
        <pointLight position={[0, -60, 80]} intensity={0.5} color={SCENE_COLORS.gold} />

        <MouseTracker mouse={mouse} />
        <ScrollTracker onScroll={setScrollProgress} />

        <Suspense fallback={null}>
          <HybridStarField mouse={mouse} scrollProgress={scrollProgress} />
        </Suspense>

        <PostProcessingEffects quality={quality} scrollProgress={scrollProgress} />
      </Canvas>

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#04140f] to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04140f] to-transparent opacity-80" />
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at center, transparent 0%, ${SCENE_COLORS.night} 100%)`,
        opacity: 0.3 + scrollProgress * 0.3,
        mixBlendMode: 'multiply'
      }} />
    </div>
  );
});
