import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshTransmissionMaterial, 
  Environment, 
  Sparkles, 
  PerspectiveCamera, 
  ContactShadows,
  Center,
  TorusKnot,
  Sphere,
  Icosahedron,
  Caustics
} from '@react-three/drei';
import * as THREE from 'three';

// --- GEOMETRY COMPONENTS ---

interface TransmissionMeshProps {
  geometry: React.ComponentType;
  materialProps: Record<string, unknown>;
  [key: string]: unknown;
}

const TransmissionMesh = ({ geometry: Geometry, materialProps, ...props }: TransmissionMeshProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y += 0.005;
    mesh.current.rotation.x += 0.002;
    mesh.current.position.y += Math.sin(t * 2) * 0.002;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} {...props}>
        <Geometry />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </Float>
  );
};

// --- THEME-SPECIFIC ENVIRONMENTS ---

const DiamondEnvironment = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <Sparkles count={isMobile ? 20 : 80} scale={20} size={2} speed={0.5} opacity={0.4} color="#ffd700" />
    <ambientLight intensity={0.5} />
    <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} color="#ffffff" />
    <pointLight position={[-10, 5, -10]} color="#fbbf24" intensity={2} />
    <Environment preset="city" />
  </>
);

const OceanEnvironment = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <Sparkles count={isMobile ? 30 : 100} scale={30} size={4} speed={0.3} opacity={0.2} color="#3fae86" />
    <ambientLight intensity={0.2} />
    <spotLight position={[5, 15, 10]} angle={0.3} penumbra={1} intensity={2} color="#ec4899" />
    <pointLight position={[-15, -5, -5]} color="#0891b2" intensity={3} />
    {!isMobile && (
      <Caustics
        color="#3fae86"
        position={[0, -5, 0]}
        scale={[20, 10, 20]}
        intensity={0.5}
        causticsOnly={false}
        backside={true}
      />
    )}
    <Environment preset="night" />
  </>
);

const VelvetEnvironment = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <Sparkles count={isMobile ? 20 : 60} scale={15} size={3} speed={0.2} opacity={0.5} color="#ef4444" />
    <ambientLight intensity={0.4} />
    <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={1} color="#be123c" />
    <pointLight position={[10, -10, 10]} color="#881337" intensity={4} />
    <Environment preset="studio" />
  </>
);

const MinimalistEnvironment = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <Sparkles count={isMobile ? 10 : 30} scale={20} size={1} speed={0.1} opacity={0.2} color="#ffffff" />
    <ambientLight intensity={0.8} />
    <spotLight position={[0, 20, 10]} angle={0.1} penumbra={1} intensity={0.5} color="#ffffff" />
    {!isMobile && (
      <Caustics
        color="#ffffff"
        position={[0, -5, 0]}
        scale={[20, 20, 20]}
        intensity={0.2}
        causticsOnly={false}
        backside={true}
      />
    )}
    <Environment preset="warehouse" />
  </>
);

// --- MAIN SCENE ---

const SceneContent = ({ concept, isMobile }: { concept: string, isMobile: boolean }) => {
  const materialProps = useMemo(() => ({
    thickness: concept === 'minimalist' ? 0.2 : 1,
    backside: true,
    samples: isMobile ? 4 : 16,
    resolution: isMobile ? 256 : 512,
    transmission: 1,
    roughness: concept === 'minimalist' ? 0.05 : 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
    ior: concept === 'minimalist' ? 1.2 : 2.4,
    color: concept === 'diamond' ? '#ffd700' : concept === 'ocean' ? '#3fae86' : concept === 'velvet' ? '#ef4444' : '#ffffff',
    chromaticAberration: concept === 'minimalist' ? 0.02 : 0.2,
    anisotropy: 0.1,
    distortion: concept === 'ocean' ? 0.5 : 0,
    distortionScale: 0.5,
    temporalDistortion: 0,
  }), [concept, isMobile]);

  return (
    <Center>
      {/* Central Hero Object */}
      {concept === 'ocean' ? (
        <TransmissionMesh 
          geometry={() => <TorusKnot args={[1, 0.4, isMobile ? 64 : 128, isMobile ? 16 : 32]} />}
          materialProps={materialProps}
          scale={isMobile ? 1.2 : 1.8}
          position={[0, 0, 0]}
        />
      ) : concept === 'minimalist' ? (
        <TransmissionMesh 
          geometry={() => <Sphere args={[1, isMobile ? 32 : 64]} />}
          materialProps={materialProps}
          scale={isMobile ? 1.2 : 1.8}
          position={[0, 0, 0]}
        />
      ) : (
        <TransmissionMesh 
          geometry={() => <Icosahedron args={[1, 0]} />}
          materialProps={materialProps}
          scale={isMobile ? 1.2 : 1.8}
          position={[0, 0, 0]}
        />
      )}
      
      {/* Surrounding Elements */}
      {concept !== 'minimalist' && Array.from({ length: isMobile ? 3 : 5 }).map((_, i) => (
        <TransmissionMesh 
          key={i}
          geometry={() => <Icosahedron args={[0.5, 0]} />}
          materialProps={{ ...materialProps, transmission: 0.8 }}
          scale={0.5}
          position={[
            Math.cos(i * (Math.PI * 2 / 5)) * (isMobile ? 3 : 5),
            Math.sin(i * (Math.PI * 2 / 5)) * (isMobile ? 2 : 3),
            Math.sin(i * (Math.PI * 2 / 5)) * -2
          ]}
        />
      ))}

      {!isMobile && <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={25} blur={1.5} far={6} />}
    </Center>
  );
};

export const LuxuryScene = ({ className = '', concept = 'diamond' }: { className?: string, concept?: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Env = concept === 'ocean' ? OceanEnvironment : concept === 'velvet' ? VelvetEnvironment : concept === 'minimalist' ? MinimalistEnvironment : DiamondEnvironment;

  return (
    <div className={`w-full h-full ${className} transition-opacity duration-1000`}>
      <Canvas shadows={!isMobile} dpr={isMobile ? 1 : [1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 20 : 15]} fov={30} />
        <Env isMobile={isMobile} />
        <React.Suspense fallback={null}>
          <SceneContent concept={concept} isMobile={isMobile} />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default LuxuryScene;
