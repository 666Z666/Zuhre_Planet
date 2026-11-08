import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Lock, Play } from 'lucide-react';

interface PhantomMediaBoxProps {
  url: string;
  type: 'image' | 'video';
}

export function PhantomMediaBox({ url, type }: PhantomMediaBoxProps) {
  const [hasError, setHasError] = useState(false);
  const isVideo = type === 'video';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
      <div className="relative aspect-video min-w-[220px] max-w-[420px]">
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80 text-white/50">
            <ImageIcon className="h-8 w-8" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">
              Medya yüklenemedi
            </span>
          </div>
        ) : isVideo ? (
          <video
            src={url}
            controls
            preload="metadata"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={url}
            alt="Mesaj medya eki"
            loading="lazy"
            decoding="async"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5" />
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-xl">
          {isVideo ? <Play className="h-3 w-3 text-gold-300" /> : <ImageIcon className="h-3 w-3 text-emerald-300" />}
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/70">
            {isVideo ? 'Video' : 'Görsel'}
          </span>
        </div>
        <motion.div
          aria-hidden="true"
          animate={{ x: ['-120%', '140%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-white/10 blur-xl"
        />
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 bg-black/30 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
        <Lock className="h-3 w-3" />
        Phantom medya protokolü
      </div>
    </div>
  );
}
