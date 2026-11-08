/**
 * Zühre Planet V3.1 - Cinematic Age Gate
 * 
 * Slow-reveal overlay to set the sensual atmosphere and verify age.
 * High-fidelity blur (40px+) and premium magenta typography.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/config/brand';

export function AgeGateOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasVerified = localStorage.getItem('zuhre_age_verified');
    if (!hasVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('zuhre_age_verified', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(16px)', scale: 1.04 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto app-background backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
        >
          <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 px-6 py-10 md:grid-cols-2">
            <motion.img
              src={BRAND.assets.heroLogo}
              alt="Zühre Planet"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mx-auto w-full max-w-[420px] rounded-[2rem] shadow-[0_30px_80px_-30px_hsl(var(--brand-emerald)/0.6)]"
              draggable={false}
            />

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-8 text-center md:text-left"
            >
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
                  <ShieldAlert className="h-3.5 w-3.5" /> 18+ Yetişkin İçerik
                </span>
                <h2 id="age-gate-title" className="text-5xl md:text-6xl leading-[1.05] text-3d-premium">
                  Zühre <span className="text-3d-gold">Planet</span>
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                  Bu platform yalnızca yetişkinlere yöneliktir. Devam etmek için 18 yaşından büyük olduğunuzu
                  ve bulunduğunuz yerde bu içeriği görüntülemenin yasal olduğunu onaylayın.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleVerify}
                  autoFocus
                  className="btn-cosmic group flex h-14 items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                >
                  Evet, 18 yaşından büyüğüm
                  <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                </button>
                <button
                  onClick={() => window.location.replace('https://www.google.com')}
                  className="h-14 rounded-[0.9rem] border border-border text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                >
                  Hayır, ayrılmak istiyorum
                </button>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground/70">
                {BRAND.name} &copy; {new Date().getFullYear()}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
