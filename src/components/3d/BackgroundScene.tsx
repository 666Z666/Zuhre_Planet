import { lazy, Suspense, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/** three.js (~1 MB) yalnızca gerektiğinde, ayrı bir chunk olarak yüklenir */
const UniverseScene = lazy(() => import('./UniverseScene'));

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Tüm sayfaların arkasındaki sahne.
 * - Koyu mod + hareket serbest + WebGL var → 3D "Zümrüt Gece" evreni
 * - Aksi halde (açık mod, prefers-reduced-motion, WebGL yok, kaydet-veri modu) → statik marka gradyanı
 */
export function BackgroundScene() {
  const { actualTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setCanRender3D(hasWebGL() && !saveData);
  }, []);

  const staticBg = <div className="app-background fixed inset-0 -z-50 pointer-events-none" aria-hidden="true" />;

  if (actualTheme !== 'dark' || reducedMotion || !canRender3D) {
    return staticBg;
  }

  return (
    <Suspense fallback={staticBg}>
      <UniverseScene />
    </Suspense>
  );
}

export default BackgroundScene;
