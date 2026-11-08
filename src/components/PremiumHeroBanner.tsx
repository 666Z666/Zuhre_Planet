/**
 * Zühre Planet V3.2 - Professional Seductive Hero Banner
 * 
 * High-fidelity moving background with Ken Burns effect,
 * parallax mouse interaction, and 'Heat Haze' distortion filters.
 * Features the Shadow-X Erotica cinematic asset.
 */

import React from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { ShieldCheck } from 'lucide-react';
import { LipsIcon, MaskIcon, HeelsIcon } from './ui/SensualIcons';

interface PremiumHeroBannerProps {
  title: string;
  subtitle: string;
}

export const PremiumHeroBanner: React.FC<PremiumHeroBannerProps> = ({
  title,
  subtitle,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 40, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 40, damping: 25 });

  const moveX = useTransform(mouseX, [-0.5, 0.5], ["2vw", "-2vw"]);
  const moveY = useTransform(mouseY, [-0.5, 0.5], ["2vh", "-2vh"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    x.set(e.clientX / innerWidth - 0.5);
    y.set(e.clientY / innerHeight - 0.5);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`relative min-h-[95vh] flex items-center justify-center overflow-hidden anamorphic-container bg-black`}
    >
      {/* BACKGROUND LAYER: Cinematic Moving Image (NSFW/Seductive) */}
      <motion.div 
        style={{ 
          x: moveX, 
          y: moveY,
          scale: 1.15 
        }}
        animate={{ 
          scale: [1.15, 1.25, 1.15],
          rotate: [-1, 1, -1] 
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.1] brightness-[0.4] contrast-125 saturate-150"
          style={{ 
            backgroundImage: `url('/v32_seductive_hero_preview_1775283015375.png')`, // High-fidelity cinematic asset
          }}
        />
        
        {/* HEAT HAZE / STEAM OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay animate-pulse duration-5000" />
      </motion.div>

      {/* Cinematic Vignette & Anamorphic Masking */}
      <div className="absolute inset-0 z-[1] shadow-[inset_0_0_20vw_rgba(0,0,0,1)] pointer-events-none" />
      <div className="absolute inset-0 z-[1] opacity-[0.08] pointer-events-none bg-[url('/textures/noise.svg')] mix-blend-overlay contrast-200" />

      {/* CONTENT LAYER */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-12 text-center space-y-16">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(30px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="inline-flex items-center gap-4 px-10 py-3 rounded-full bg-black/60 border border-primary/40 backdrop-blur-3xl mb-4 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
          >
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">SHADOW PROTOCOL: SECURE & LUXURY EROTICA</span>
          </motion.div>

          <div className="relative">
            <motion.h1 
              initial={{ opacity: 0, y: 100, filter: 'blur(40px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 0.3, ease: "circOut" }}
              className="text-[8vw] md:text-[10vw] font-black italic uppercase tracking-[-0.08em] leading-[0.8] text-white drop-shadow-[0_0_60px_rgba(var(--primary-rgb),0.6)] font-orbitron"
            >
              {title.split(' ')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-slow drop-shadow-none">
                 {title.split(' ')[1] || 'PLANET'}
              </span>
            </motion.h1>
            
            {/* Satin Reflection Flare */}
            <motion.div 
              animate={{ x: [-1000, 1000], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              className="absolute top-0 left-0 w-20 h-full bg-white/20 skew-x-[-45deg] blur-xl pointer-events-none"
            />
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="text-lg md:text-3xl font-black uppercase tracking-[0.6em] text-white/40 italic max-w-6xl mx-auto leading-relaxed"
          >
             {subtitle}
          </motion.p>
        </div>

        {/* Stats Section: Premium Seductive Hub */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-white/5"
        >
          <StatComponent icon={<LipsIcon size={28} />} number="12,500+" label="ARZULU ÜYE" />
          <StatComponent icon={<HeelsIcon size={28} />} number="4.9/5.0" label="SEKSİ DENEYİM" color="text-secondary" />
          <StatComponent icon={<MaskIcon size={28} />} number="850+" label="GİZEMLİ PARTNER" />
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1.8 }}
           className="flex flex-col md:flex-row items-center justify-center gap-8 mt-24"
        >
           <button className="h-24 px-20 bg-primary text-white rounded-full font-black uppercase tracking-[0.4em] italic text-sm hover:scale-110 transition-all shadow-[0_0_60px_rgba(212,175,55,0.5)] border border-primary/50">
              HEMEN KEŞFET
           </button>
           <button className="h-24 px-20 bg-black/60 border border-white/10 backdrop-blur-3xl text-white rounded-full font-black uppercase tracking-[0.4em] italic text-sm hover:border-primary hover:bg-primary/5 transition-all">
              VİP ELİTE GİRİŞ
           </button>
        </motion.div>
      </div>

      {/* Heat Haze Distortion (SVG Filter Injection point via CSS) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-radial from-primary/10 to-transparent" />
      
      {/* Cinematic Horizontal Anamorphic Flare */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/40 blur-[4px] mix-blend-screen opacity-60 animate-pulse" />
    </div>
  );
};

const StatComponent = ({ icon, number, label, color = "text-primary" }: { icon: React.ReactNode, number: string, label: string, color?: string }) => (
  <div className="glass-panel p-12 group hover:border-primary/60 transition-all border-white/5 bg-black/40 hover:scale-105 duration-700">
     <div className={`mb-6 ${color} group-hover:scale-150 transition-transform duration-1000 flex justify-center drop-shadow-[0_0_15px_rgba(var(--primary-rgb),1)]`}>
        {icon}
     </div>
     <div className="text-4xl font-black font-orbitron uppercase text-white mb-2 drop-shadow-2xl">{number}</div>
     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic group-hover:text-white transition-colors">{label}</div>
  </div>
);
