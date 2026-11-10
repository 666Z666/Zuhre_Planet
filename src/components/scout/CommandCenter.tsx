/**
 * Zühre Planet V4.0 - Galaxy Scout CommandCenter
 * 
 * Global AI Assistant UI with Holographic Glassmorphism and Intent actions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, X, Zap, Star } from 'lucide-react';
import { useLocation } from 'wouter';
import { ZMaiaAvatar } from '../ui/ZMaiaAvatar';
import { 
  Dialog, 
  DialogContent, 
  DialogOverlay, 
  DialogPortal 
} from '@/components/ui/dialog';
import { scoutService } from '@/services/scoutService';
import { toast } from 'sonner';
import { useLuxuryTheme } from '@/contexts/LuxuryThemeContext';

export default function CommandCenter() {
  const { toggleStealthMode } = useLuxuryTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global CTRL+K Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setResponse('Sizin için ne arzu edebilirim, Kaptan? Galaksi emrinizde.');
    } else {
      setInput('');
      setResponse(null);
    }
  }, [isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const action = scoutService.analyze(input);
    setResponse(action.response);

    setTimeout(() => {
      if (action.type === 'NAVIGATE') {
        setLocation(action.payload);
        setIsOpen(false);
      } else if (action.type === 'SEARCH') {
        setLocation(`/catalog?q=${encodeURIComponent(action.payload)}`);
        setIsOpen(false);
      } else if (action.type === 'ACTION') {
        if (action.payload === 'TOGGLE_STEALTH') {
          toggleStealthMode();
          setTimeout(() => setIsOpen(false), 800);
        } else if (action.payload === 'CLEAR_TRAIL') {
          toast.success("Kozmik izler temizlendi.");
          setTimeout(() => setIsOpen(false), 800);
        }
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-[12px] transition-all duration-300" />
        <DialogContent className="fixed left-1/2 top-1/2 z-[200] w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 p-4 md:p-10 outline-none border-none bg-transparent">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
            className="glass-extreme p-10 rounded-[4rem] border border-primary/20 shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)] overflow-hidden relative group"
            style={{ perspective: '1000px' }}
          >
            {/* Animated Background Highlights */}
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-secondary/10 blur-[100px] rounded-full animate-pulse delay-700" />

            {/* Header Area */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-6">
                <ZMaiaAvatar size={64} status={response ? 'talking' : (input ? 'thinking' : 'idle')} />
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Z-MAIA <span className="text-primary italic">KONSİYERJ</span></h2>
                  <p className="text-[10px] font-black italic tracking-[0.4em] text-white/30 mt-2 uppercase">NEBULA SPIRIT — V5.1 ACTIVE</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                aria-label="Konsiyerji Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* AI Voice Output (Mock) */}
            <AnimatePresence mode="wait">
              {response && (
                <motion.div 
                  key={response}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="mb-10 p-6 rounded-[2rem] bg-white/5 border border-white/5 italic text-white/80 font-medium tracking-wide relative z-10 shadow-inner"
                >
                  <div className="absolute top-[-10px] left-8 px-3 py-1 bg-primary text-[8px] font-black uppercase tracking-widest text-white rounded-lg group-hover:shadow-[0_0_15px_#d4af37]">Z-MAIA RESPONSE</div>
                  {response}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Hints */}
            <div className="flex gap-3 mb-6 relative z-10">
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" /> [Enter] Gönder
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                  <Zap className="w-3.5 h-3.5" /> [CTRL+K] Kapat
               </div>
            </div>

            {/* Main Command Input */}
            <form onSubmit={handleCommand} className="relative z-10 group">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-8 h-8 text-primary/50 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                ref={inputRef}
                type="text"
                placeholder="NE ARZU EDERSİNİZ?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-24 bg-black/40 border-2 border-white/10 rounded-[2.5rem] pl-24 pr-32 outline-none focus:border-primary/50 focus:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] transition-all text-xl font-black italic tracking-[0.2em] uppercase text-white placeholder:text-white/10"
              />
              <button 
                type="submit"
                className="absolute right-4 top-4 bottom-4 px-10 bg-primary hover:bg-white hover:text-black text-white rounded-[1.8rem] font-black italic uppercase text-[12px] tracking-[0.2em] transition-all shadow-xl group-hover:scale-[1.02]"
              >
                İCRA ET
              </button>
            </form>

            {/* Quick Actions Footer */}
            <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
               {[
                 { icon: Search, label: 'KATALOG', path: '/catalog' },
                 { icon: Star, label: 'VIP ELITE', path: '/vip' },
                 { icon: Zap, label: 'PANELİM', path: '/dashboard' },
                 { icon: X, label: 'OTURUMU Kapat', action: () => toast.info('Oturum kapatma planlanıyor...') },
               ].map((act, i) => (
                 <motion.button 
                   key={i}
                   whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                   onClick={() => act.path ? (setLocation(act.path), setIsOpen(false)) : act.action?.()}
                   className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-white/5 bg-transparent group/btn transition-all"
                 >
                   <act.icon className="w-4 h-4 text-primary/40 group-hover/btn:text-primary transition-colors" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover/btn:text-white">{act.label}</span>
                 </motion.button>
               ))}
            </div>

          </motion.div>

        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
