import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // İlk render'da gerçek değeri oku: aksi halde false→true geçişi (ör. mobilde)
  // bağımlı bileşenleri iki kez kurar (3D sahnede buffer yeniden boyutlanma hatası).
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
