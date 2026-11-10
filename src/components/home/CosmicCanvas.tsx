import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  OrbitControls,
  Sphere,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';

// Precision Luxury Color Palette
const COLORS = {
  primary: '#3fae86', // Zümrüt (parlak)
  secondary: '#a8e6cf' // Mint
};

// Gerçek yıldız renk sıcaklıklarına yakın palet (mavi-beyaz → beyaz → sarı → turuncu).
const STAR_TINTS = ['#9bb0ff', '#aabfff', '#cad7ff', '#f8f7ff', '#fff4ea', '#ffd2a1', '#ffcc6f'];
const STAR_TINT_WEIGHTS = [0.06, 0.1, 0.16, 0.34, 0.18, 0.1, 0.06];

function pickStarTint(): THREE.Color {
  let r = Math.random();
  for (let i = 0; i < STAR_TINTS.length; i++) {
    r -= STAR_TINT_WEIGHTS[i];
    if (r <= 0) return new THREE.Color(STAR_TINTS[i]);
  }
  return new THREE.Color(STAR_TINTS[3]);
}

/**
 * Yuvarlak, yumuşak ışımalı ve titreşen (twinkle) yıldız noktası shader'ı.
 * Varsayılan PointsMaterial kare piksel çizer; burada her nokta merkezden dışa
 * sönen bir ışık halesi olarak çizilir. uSpikes > 0 iken parlak yıldızlara
 * teleskop görüntülerindeki gibi ince kırınım ışınları eklenir.
 */
const STAR_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float tw = 0.55 + 0.45 * sin(uTime * aSpeed + aPhase);
    tw *= 0.85 + 0.15 * sin(uTime * aSpeed * 2.7 + aPhase * 1.7);
    vTwinkle = tw;
    vColor = aColor;
    gl_PointSize = max(2.0, aSize * uPixelRatio * (0.85 + 0.15 * tw) * (250.0 / max(-mvPosition.z, 1.0)));
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  uniform float uSpikes;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    if (d > 0.5) discard;
    float core = exp(-d * d * 55.0);
    float halo = exp(-d * d * 12.0) * 0.3;
    float spikes = 0.0;
    if (uSpikes > 0.0) {
      float sx = exp(-abs(p.y) * 120.0) * max(0.0, 1.0 - abs(p.x) * 2.0);
      float sy = exp(-abs(p.x) * 120.0) * max(0.0, 1.0 - abs(p.y) * 2.0);
      spikes = (sx + sy) * 0.55 * uSpikes;
    }
    float intensity = (core + halo + spikes) * vTwinkle;
    vec3 col = mix(vColor, vec3(1.0), core * 0.6);
    gl_FragColor = vec4(col * intensity, intensity * uOpacity);
  }
`;

interface StarLayerProps {
  count: number;
  radiusMin: number;
  radiusMax: number;
  sizeMin: number;
  sizeMax: number;
  opacity: number;
  spikes?: number;
  tint?: 'star' | 'brand';
  rotationSpeed?: number;
}

function StarLayer({
  count, radiusMin, radiusMax, sizeMin, sizeMax, opacity,
  spikes = 0, tint = 'star', rotationSpeed = 0,
}: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const gl = useThree((s) => s.gl);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const brandA = new THREE.Color(COLORS.primary);
    const brandB = new THREE.Color(COLORS.secondary);
    for (let i = 0; i < count; i++) {
      const r = radiusMin + Math.random() * (radiusMax - radiusMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = tint === 'brand' ? brandA.clone().lerp(brandB, Math.random()) : pickStarTint();
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      // Çoğu yıldız küçük, azı büyük: gerçek gökyüzündeki parlaklık dağılımına yakın.
      sizes[i] = sizeMin + Math.pow(Math.random(), 3) * (sizeMax - sizeMin);
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.6 + Math.random() * 2.2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return g;
  }, [count, radiusMin, radiusMax, sizeMin, sizeMax, tint]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uOpacity: { value: opacity },
      uSpikes: { value: spikes },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [gl, opacity, spikes]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
    if (pointsRef.current && rotationSpeed) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * rotationSpeed;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

/**
 * Kayan yıldız (meteor): parlak bir baş ve arkasında sönerek incelen ışık kuyruğu.
 * Kamera önündeki bir düzlemde, hareket yönüne hizalı çizilir; böylece kamera
 * dönse de her zaman görünür ve kare bir kutu gibi değil, gerçek bir iz gibi görünür.
 */
const METEOR_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const METEOR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    // vUv.x: 0 = kuyruk ucu, 1 = baş
    float along = vUv.x;
    float across = abs(vUv.y - 0.5) * 2.0;
    // Kuyruk başa doğru kalınlaşır ve parlaklaşır.
    float width = mix(0.08, 1.0, pow(along, 1.6));
    float body = smoothstep(width, 0.0, across);
    float tail = pow(along, 2.4);
    // Baştaki sıcak çekirdek
    float head = exp(-pow((1.0 - along) * 9.0, 2.0)) * exp(-across * across * 6.0);
    float intensity = body * tail + head * 1.6;
    vec3 col = mix(uColor, vec3(1.0), clamp(head + tail * 0.4, 0.0, 1.0));
    gl_FragColor = vec4(col * intensity, intensity * uOpacity);
  }
`;

const HALO_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5);
    float glow = exp(-d * d * 40.0) + exp(-d * d * 400.0) * 1.5;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), 0.5) * glow, glow * uOpacity);
  }
`;

const METEOR_TINTS = ['#ffffff', '#dff7ff', '#a8e6cf', '#ffe7b0'];

interface MeteorState {
  active: boolean;
  wait: number;
  t: number;
  duration: number;
  start: THREE.Vector2;
  dir: THREE.Vector2;
  travel: number;
  length: number;
}

function Meteor({ initialDelay }: { initialDelay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const forward = useMemo(() => new THREE.Vector3(), []);

  const state = useRef<MeteorState>({
    active: false, wait: initialDelay, t: 0, duration: 1,
    start: new THREE.Vector2(), dir: new THREE.Vector2(1, -0.5).normalize(), travel: 30, length: 9,
  });

  const trailMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: METEOR_VERTEX,
    fragmentShader: METEOR_FRAGMENT,
    uniforms: { uColor: { value: new THREE.Color('#ffffff') }, uOpacity: { value: 0 } },
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  }), []);

  const haloMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: METEOR_VERTEX,
    fragmentShader: HALO_FRAGMENT,
    uniforms: { uColor: { value: new THREE.Color('#ffffff') }, uOpacity: { value: 0 } },
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  }), []);

  useEffect(() => () => { trailMaterial.dispose(); haloMaterial.dispose(); }, [trailMaterial, haloMaterial]);

  const launch = () => {
    const s = state.current;
    // Görünür alanın üst/yan kısımlarından, aşağı doğru çapraz süzülür.
    const fromLeft = Math.random() < 0.5;
    s.start.set(fromLeft ? -14 - Math.random() * 10 : 14 + Math.random() * 10, 4 + Math.random() * 10);
    // Soldan gelen sağ-aşağı, sağdan gelen sol-aşağı süzülür (yataydan 14–34° eğimli).
    const a = fromLeft ? -(0.25 + Math.random() * 0.35) : Math.PI + 0.25 + Math.random() * 0.35;
    s.dir.set(Math.cos(a), Math.sin(a)).normalize();
    s.travel = 18 + Math.random() * 16;
    s.length = 6 + Math.random() * 7;
    s.duration = 0.7 + Math.random() * 0.9;
    s.t = 0;
    s.active = true;
    const tint = new THREE.Color(METEOR_TINTS[Math.floor(Math.random() * METEOR_TINTS.length)]);
    trailMaterial.uniforms.uColor.value.copy(tint);
    haloMaterial.uniforms.uColor.value.copy(tint);
  };

  useFrame((_three, delta) => {
    const group = groupRef.current;
    const trail = trailRef.current;
    const halo = haloRef.current;
    if (!group || !trail || !halo) return;

    // Meteor düzlemini kameranın 30 birim önüne sabitle (kamera dönse de görünür kalsın).
    camera.getWorldDirection(forward);
    group.position.copy(camera.position).addScaledVector(forward, 30);
    group.quaternion.copy(camera.quaternion);

    const s = state.current;
    const dt = Math.min(delta, 0.05);
    if (!s.active) {
      s.wait -= dt;
      trail.visible = false;
      halo.visible = false;
      if (s.wait <= 0) launch();
      return;
    }

    s.t += dt / s.duration;
    if (s.t >= 1) {
      s.active = false;
      s.wait = 2.5 + Math.random() * 6;
      trail.visible = false;
      halo.visible = false;
      return;
    }

    // Hızlı belirme, yavaş sönme; hareket hafifçe yavaşlar (atmosfer sürtünmesi hissi).
    const fade = Math.min(1, s.t / 0.12) * Math.pow(1 - s.t, 1.4);
    const eased = 1 - Math.pow(1 - s.t, 1.6);
    const headX = s.start.x + s.dir.x * s.travel * eased;
    const headY = s.start.y + s.dir.y * s.travel * eased;
    const len = s.length * (0.35 + 0.65 * Math.min(1, s.t / 0.3));
    const angle = Math.atan2(s.dir.y, s.dir.x);

    trail.visible = true;
    halo.visible = true;
    trail.position.set(headX - s.dir.x * len * 0.5, headY - s.dir.y * len * 0.5, 0);
    trail.rotation.set(0, 0, angle);
    trail.scale.set(len, 0.16, 1);
    halo.position.set(headX, headY, 0);
    halo.scale.setScalar(1.1);
    trailMaterial.uniforms.uOpacity.value = fade;
    haloMaterial.uniforms.uOpacity.value = fade;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={trailRef} material={trailMaterial} visible={false} renderOrder={10}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={haloRef} material={haloMaterial} visible={false} renderOrder={11}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
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

export function CosmicCanvas() {
  return (
    // fixed: tuval ekran boyutunda kalır. absolute iken tüm sayfa boyunca (binlerce px) uzuyor,
    // görüş alanı dikeyde gerilip yıldızlar seyrek ve küçük görünüyordu.
    <div className="fixed inset-0 z-0 bg-[#020205] pointer-events-none" aria-hidden="true" role="presentation">
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

        {/* Uzak yıldız alanı: gerçek renk sıcaklıkları, yumuşak ışıma, hafif titreşim */}
        <StarLayer count={9000} radiusMin={90} radiusMax={150} sizeMin={1.2} sizeMax={5.5} opacity={1} />
        {/* Az sayıda parlak yıldız: kırınım ışınlı */}
        <StarLayer count={130} radiusMin={80} radiusMax={130} sizeMin={8} sizeMax={15} opacity={1} spikes={1} />
        {/* Yakın marka renkli toz bulutu, yavaşça döner */}
        <StarLayer count={1400} radiusMin={25} radiusMax={75} sizeMin={0.25} sizeMax={0.9} opacity={0.5} tint="brand" rotationSpeed={0.015} />

        {/* Elements */}
        <Planet position={[-22, 12, -15]} scale={2.5} texturePath="/textures/lava.jpg" color={COLORS.secondary} />
        <Planet position={[25, -15, -20]} scale={2.2} texturePath="/textures/ice.jpg" color={COLORS.primary} />
        <Planet position={[8, 20, -30]} scale={4} texturePath="/textures/stone.jpg" color="#888888" />

        <Meteor initialDelay={1.2} />
        <Meteor initialDelay={4.5} />
        <Meteor initialDelay={8} />

        <fog attach="fog" args={['#020205', 40, 100]} />
      </Canvas>
    </div>
  );
}
