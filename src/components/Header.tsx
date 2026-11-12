/**
 * Zühre Planet V3.1 - Cinematic Header
 * 
 * Anamorphic, thin, and sensual header design with "Foggy Glass" effect.
 */

import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ROUTES, getDashboardRouteByRole } from '@/constants/routes';
import { ThemeIcon } from './ui/ThemeIcon';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/brand/Logo';

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full pointer-events-auto backdrop-blur-[32px] border-b border-border/60 bg-background/85 shadow-[0_4px_30px_rgba(4,20,15,0.25)]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-16 sm:h-20 md:h-24">

          {/* Logo — src/config/brand.ts + src/components/brand/Logo.tsx */}
          <Link href={ROUTES.HOME} aria-label="Zühre Planet ana sayfa">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer flex items-center group"
            >
              <Logo size={56} showTagline className="max-sm:[&_.text-brand-wordmark]:text-[0.95rem] max-sm:[&_img]:size-9" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { name: 'Keşfet', path: ROUTES.CATALOG, icon: 'star' as const },
              { name: 'VIP', path: ROUTES.VIP, icon: 'zap' as const, special: true },
            ].map((item) => (
               <Link key={item.name} href={item.path}>
                <motion.div
                  whileHover={{ y: -1 }}
                  className={`relative flex items-center gap-1.5 cursor-pointer group px-3 py-2 rounded-xl transition-all duration-300
                    ${location === item.path ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
                >
                  {item.icon && <ThemeIcon type={item.icon} size={13} className={item.special ? 'text-secondary' : 'text-primary/70'} />}
                  <span className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors
                    ${item.special ? 'text-secondary' : ''}`}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            ))}
            {/* The Red Room — special */}
            <Link href={ROUTES.RED_ROOM}>
              <motion.div
                whileHover={{ y: -1 }}
                className={`relative flex items-center gap-1.5 cursor-pointer px-3 py-2 rounded-xl border transition-all duration-300
                  ${location === ROUTES.RED_ROOM
                    ? 'bg-red-900/40 border-red-700/50 text-red-300'
                    : 'border-red-900/20 text-red-400/60 hover:border-red-700/40 hover:text-red-300 hover:bg-red-900/20'
                  }`}
              >
                <ThemeIcon type="eye" size={13} />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Red Room</span>
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse ml-1" />
              </motion.div>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <LanguageSwitcher />
            <div className="hidden lg:flex items-center gap-6 border-l border-border pl-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href={getDashboardRouteByRole(user?.role)}>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 px-6 py-3 rounded-full bg-foreground/5 border border-border hover:border-primary/50 transition-all cursor-pointer backdrop-blur-md"
                    >
                      <ThemeIcon type="user" size={16} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground italic">
                        {user?.role === 'admin' ? 'KOMUTAN' : (user?.role === 'escort' ? 'PARTNER' : 'ÜYE')}
                      </span>
                    </motion.div>
                  </Link>
                </div>
              ) : (
                <Link href={ROUTES.LOGIN}>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.4)' }}
                    className="bg-primary text-primary-foreground px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl transition-all"
                  >
                    {t('common.login')}
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2.5 sm:p-3 bg-foreground/5 rounded-2xl border border-border text-primary hover:bg-foreground/10 transition-colors"
              aria-label={mobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="fixed top-16 sm:top-20 left-3 right-3 max-h-[calc(100vh-5rem)] overflow-y-auto border border-primary/30 p-6 sm:p-8 flex flex-col gap-6 lg:hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] bg-[#050c09]/95 backdrop-blur-3xl rounded-3xl z-[110]"
            >
              <nav className="flex flex-col gap-2">
                {[
                  { name: 'Ana Sayfa', path: ROUTES.HOME, icon: 'home' as const },
                  { name: 'Katalog & Keşfet', path: ROUTES.CATALOG, icon: 'star' as const },
                  { name: 'Yıldızlar Vitrini', path: '/escorts', icon: 'star' as const },
                  { name: 'VIP Elite Club', path: ROUTES.VIP, color: 'text-secondary', icon: 'zap' as const },
                  { name: 'İlan Paketleri', path: ROUTES.PRICING, icon: 'shield' as const },
                  { name: 'SSS', path: ROUTES.FAQ, icon: 'shield' as const },
                  { name: 'Destek & İletişim', path: ROUTES.SUPPORT, icon: 'user' as const },
                ].map((item) => (
                  <Link key={item.path} href={item.path}>
                    <span 
                      onClick={() => setMobileMenuOpen(false)} 
                      className={`text-sm sm:text-base flex items-center gap-3.5 font-bold uppercase tracking-widest transition-colors py-2.5 px-3 rounded-xl hover:bg-white/5 cursor-pointer
                        ${location === item.path ? 'text-primary bg-primary/10' : (item.color || 'text-foreground/80')}`}
                    >
                      <ThemeIcon type={item.icon} size={18} /> {item.name}
                    </span>
                  </Link>
                ))}
                {/* Red Room */}
                <Link href={ROUTES.RED_ROOM}>
                  <span
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm sm:text-base flex items-center gap-3.5 font-bold uppercase tracking-widest text-red-400 py-2.5 px-3 rounded-xl hover:bg-red-950/30 cursor-pointer"
                  >
                    <ThemeIcon type="eye" size={18} /> Red Room
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </span>
                </Link>
              </nav>

              <div className="h-px bg-foreground/10 w-full" />
              
              {!isAuthenticated ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href={ROUTES.LOGIN}>
                    <button 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] italic shadow-xl shadow-primary/20"
                    >
                      GİRİŞ YAP
                    </button>
                  </Link>
                  <Link href={ROUTES.REGISTER_CLIENT}>
                    <button 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="w-full bg-white/5 border border-white/15 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] italic hover:bg-white/10 transition-colors"
                    >
                      KAYIT OL
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href={getDashboardRouteByRole(user?.role)}>
                    <button onClick={() => setMobileMenuOpen(false)} className="w-full bg-foreground/5 border border-border text-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest italic">
                       PANELİM
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}
