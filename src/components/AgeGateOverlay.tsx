import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/config/brand';

const AGE_CONSENT_KEY = 'zuhre_age_consent_v1';

function readAgeConsent(): boolean {
  try {
    return window.localStorage.getItem(AGE_CONSENT_KEY) === 'true';
  } catch {
    // Storage may be disabled; require consent for this page view instead of crashing.
    return false;
  }
}

export function AgeGateOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!readAgeConsent()) setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      const previous = returnFocusRef.current;
      if (previous?.isConnected) previous.focus();
      return;
    }

    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const dialog = dialogRef.current;
    const firstControl = dialog?.querySelector<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    (firstControl ?? dialog)?.focus();

    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Consent dialog is intentionally not dismissible with Escape.
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (controls.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', keepFocusInside, true);
    return () => document.removeEventListener('keydown', keepFocusInside, true);
  }, [isVisible]);

  const handleVerify = () => {
    try {
      window.localStorage.setItem(AGE_CONSENT_KEY, 'true');
    } catch {
      // Keep the accepted state only in memory for this page view.
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(16px)', scale: 1.04 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center overflow-y-auto app-background backdrop-blur-2xl p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
          aria-describedby="age-gate-description"
        >
          <div className="relative z-10 my-auto grid w-full max-w-5xl items-center gap-5 md:gap-10 px-4 py-6 md:px-6 md:py-10 md:grid-cols-2">
            <motion.img
              src={BRAND.assets.heroLogo}
              alt="Zühre Planet"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mx-auto w-full max-w-[160px] sm:max-w-[240px] md:max-w-[420px] rounded-[1.5rem] md:rounded-[2rem] shadow-[0_30px_80px_-30px_hsl(var(--brand-emerald)/0.6)]"
              draggable={false}
            />

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-5 md:space-y-8 text-center md:text-left"
            >
              <div className="space-y-3 md:space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 px-3.5 py-1 md:px-4 md:py-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] md:tracking-[0.3em] text-secondary">
                  <ShieldAlert className="h-3.5 w-3.5" /> 18+ Yetişkin İçerik
                </span>
                <h2 id="age-gate-title" className="text-3xl sm:text-5xl md:text-6xl leading-[1.05] text-3d-premium">
                  Zühre <span className="text-3d-gold">Planet</span>
                </h2>
                <p id="age-gate-description" className="mx-auto md:mx-0 max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground md:text-base">
                  Bu platform yalnızca yetişkinlere yöneliktir. Devam etmek için 18 yaşında veya daha büyük olduğunuzu
                  ve bulunduğunuz yerde bu içeriği görüntülemenin yasal olduğunu onaylayın. Bu beyan tek başına
                  kimlik veya yaş doğrulaması değildir.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 md:gap-3">
                <button
                  type="button"
                  onClick={handleVerify}
                  className="btn-cosmic group flex h-12 md:h-14 items-center justify-center gap-2.5 px-4 text-xs md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em]"
                >
                  Evet, 18 yaşında veya daha büyüğüm
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 shrink-0 transition-transform group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  onClick={() => window.location.replace('https://www.google.com')}
                  className="h-12 md:h-14 rounded-[0.9rem] border border-border px-4 text-xs md:text-sm font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                >
                  Hayır, ayrılmak istiyorum
                </button>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground/70">
                {BRAND.name} &copy; {new Date().getFullYear()}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
