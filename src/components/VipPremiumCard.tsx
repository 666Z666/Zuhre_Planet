/**
 * VipPremiumCard Component
 * 
 * Premium animated card component for VIP escorts with enhanced visual effects.
 */

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle2, Star, MapPin, Heart, ChevronRight, Sparkles } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';
import { VerifiedBadge } from './VerifiedBadge';
import { ListingProfile } from '@/types/domain';

import { Link, useLocation } from 'wouter';

interface VipPremiumCardProps {
  escort: ListingProfile;
  onClick?: (escortId: string) => void;
  onQuickView?: (profile: ListingProfile) => void;
  isOverlay?: boolean;
}

export const VipPremiumCard = React.memo(function VipPremiumCard({ escort, onClick, onQuickView, isOverlay = false }: VipPremiumCardProps) {
  const { theme } = useTheme();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';

  const handleClick = () => {
    if (onClick) {
      onClick(String(escort.id));
    } else if (!isOverlay && onQuickView) {
      onQuickView(escort);
    } else {
      setLocation(`/profile/${escort.id}`);
    }
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[3/4.8] group cursor-pointer content-layer perspective-2000"
      onClick={handleClick}
    >
      <Card className="w-full h-full glass-panel overflow-hidden border-none transition-all duration-700">
        <CardContent className="p-0 h-full relative">
          {/* 3D Glow & Animated Gradient Effect */}
          <div className={`absolute inset-0 opacity-30 pointer-events-none transition-all duration-1000
              ${isDark ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.2),transparent_70%)]'}`} />

          {/* Image Section */}
          <div className="absolute inset-0 z-0">
            <motion.img
              src={escort.avatarUrl || escort.coverImage}
              alt={escort.displayName}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:brightness-110"
            />

            {/* Premium Overlays - Multi-layered */}
            <div className={`absolute inset-0 opacity-90 transition-all duration-1000
                ${isDark
                ? 'bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent'
                : 'bg-gradient-to-t from-slate-950/60 via-transparent to-transparent'}`} />
            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 transition-opacity duration-1000" />
          </div>

          {/* Content - Floating in 3D */}
          <div className="relative h-full flex flex-col justify-between p-8 z-10" style={{ transform: "translateZ(80px)" }}>
            {/* Top Badges */}
            <div className="flex justify-between items-start elevate-3">
              <Badge className="bg-gradient-to-r from-gold-600 via-primary to-accent text-white border-none shadow-[0_0_20px_rgba(139,92,246,0.5)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.25em] animate-pulse italic rounded-full">
                <Crown className="w-4 h-4 mr-1.5 drop-shadow-md" />
                ULTRA VIP
              </Badge>
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="p-3 rounded-full glass-panel border-none text-white hover:bg-red-500/80 transition-all shadow-xl backdrop-blur-3xl"
              >
                <Heart className="w-5 h-5 fill-current" />
              </motion.div>
            </div>

            {/* Bottom Info */}
            <div className="space-y-6 elevate-3">
              <div className="flex items-center gap-2.5">
                {escort.hasVerifiedBadge && (
                  <VerifiedBadge size="sm" />
                )}
                <Badge className="bg-white/10 backdrop-blur-3xl text-white border border-white/20 px-3 py-1 text-[8px] font-black uppercase tracking-[0.15em] italic rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" /> POPÜLER
                </Badge>
              </div>

              <div className="perspective-1000">
                <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] h-premium text-3d leading-tight">
                  {escort.displayName}
                </h2>
                <div className="flex items-center text-white/90 font-black text-[11px] uppercase tracking-[0.15em]">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {escort.city}<span className="mx-1.5 text-white/30">/</span>{escort.district}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/20">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em] mb-0.5">Saatlik Ücret</span>
                  <span className="text-3xl font-black text-white">₺{escort.rates?.hourly}</span>
                </div>
                <div className="flex items-center gap-1.5 glass-panel border-white/20 px-4 py-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-base font-black text-white">{escort.rating || '5.0'}</span>
                </div>
              </div>

              <Button className="w-full py-8 bg-white text-black hover:bg-primary hover:text-white font-black text-xs uppercase tracking-[0.3em] italic rounded-3xl transition-all shadow-xl group/btn">
                PROFİLİ İNCELE
                <ChevronRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-3 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default VipPremiumCard;
