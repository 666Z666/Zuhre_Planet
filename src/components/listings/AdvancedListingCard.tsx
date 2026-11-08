import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, MapPin, Heart, Eye, MessageCircle, ChevronRight, Badge, Zap, Clock, Play } from 'lucide-react';

interface AdvancedListingCardProps {
  id: number;
  image: string;
  videoPreview?: string;
  stageName: string;
  city: string;
  age: number;
  rating: number;
  reviewCount: number;
  tier: 'free' | 'gold' | 'platinum' | 'vip';
  isBoosted?: boolean;
  isVerified?: boolean;
  isApprovedCustomer?: boolean;
  price?: number;
  responseTime?: string;
  onViewClick?: () => void;
  onLikeClick?: () => void;
  onMessageClick?: () => void;
  onQuickViewClick?: () => void;
  isLiked?: boolean;
}

export const AdvancedListingCard: React.FC<AdvancedListingCardProps> = ({
  id,
  image,
  videoPreview = "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-woman-in-a-red-dress-1461-preview.mp4",
  stageName,
  city,
  age,
  rating,
  reviewCount,
  tier,
  isBoosted = false,
  isVerified = false,
  isApprovedCustomer = false,
  price,
  responseTime,
  onViewClick,
  onLikeClick,
  onMessageClick,
  onQuickViewClick,
  isLiked = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
        videoRef.current.play().catch(() => {});
    }
  };

  const getTierColor = (t: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string, shadow: string }> = {
      free: { bg: 'bg-white/10', text: 'text-white/60', icon: '⭐', shadow: 'shadow-white/5' },
      gold: { bg: 'bg-primary/20', text: 'text-primary', icon: '🏆', shadow: 'shadow-primary/20' },
      platinum: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: '💎', shadow: 'shadow-emerald-500/20' },
      vip: { bg: 'bg-secondary/20', text: 'text-secondary', icon: '👑', shadow: 'shadow-secondary/20' },
    };
    return colors[t] || colors.free;
  };

  const tierColor = getTierColor(tier);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20, 
          delay: id * 0.05 
        }}
        viewport={{ once: true }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onViewClick}
        className="group relative w-full h-[540px] rounded-[2.5rem] glass-layered border border-white/5 cursor-pointer perspective-1000 transition-all duration-500 hover:shadow-[0_0_80px_rgba(var(--primary-rgb),0.2)] hover:border-primary/20"
      >
        <div className="absolute inset-0 z-10 rounded-[2.5rem] border border-white/10 pointer-events-none group-hover:border-primary/30 transition-colors" />

        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden bg-black">
          <img
            src={image}
            alt={stageName}
            className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
          />
          
          <video
            ref={videoRef}
            src={videoPreview}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20" style={{ transform: "translateZ(50px)" }}>
           <div className={`px-4 py-2 rounded-2xl backdrop-blur-xl border border-white/10 ${tierColor.bg} ${tierColor.text} ${tierColor.shadow} text-[10px] font-black italic uppercase tracking-widest flex items-center gap-2`}>
              {tierColor.icon} {tier}
           </div>
           
           {isVerified && (
             <div className="w-10 h-10 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center text-primary shadow-xl shadow-primary/20">
                <Badge className="w-5 h-5" />
             </div>
           )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col gap-4" style={{ transform: "translateZ(40px)" }}>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                    {stageName}
                 </h3>
                 {isBoosted && <Zap className="w-4 h-4 text-primary animate-pulse" />}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase italic tracking-widest leading-none">
                 <MapPin className="w-3 h-3" /> {city} 
                 <span className="text-primary/50">/</span> 
                 {age} YAŞ
              </div>
           </div>

           <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                 <Star className="w-3 h-3 text-primary fill-primary" />
                 <span className="text-[10px] font-black italic text-white">{rating.toFixed(1)}</span>
                 <span className="text-[9px] font-black italic text-white/20">({reviewCount})</span>
              </div>
              
              {price && (
                <div className="text-lg font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform">
                   ₺{price}<span className="text-[10px] text-white/40">/SA</span>
                </div>
              )}
           </div>

           {/* Hover Actions */}
           <div className={`flex gap-2 transition-all duration-500 overflow-hidden ${isHovered ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); onMessageClick?.(); }}
                className="flex-1 h-12 rounded-2xl bg-primary text-white font-black italic text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                 MESAJ GÖNDER
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onLikeClick?.(); }}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-500 transition-all"
              >
                 <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              </button>
           </div>
        </div>

        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 transition-all duration-700 ${isHovered ? 'scale-0 opacity-0' : 'scale-100 opacity-60'}`}>
           <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1 fill-white" />
           </div>
        </div>
      </motion.div>

      {showQuickView && (
        <QuickViewModal
          stageName={stageName}
          city={city}
          age={age}
          rating={rating}
          reviewCount={reviewCount}
          tier={tier}
          isVerified={isVerified}
          price={price}
          responseTime={responseTime}
          onClose={() => setShowQuickView(false)}
          onViewFull={onViewClick}
          onMessage={onMessageClick}
        />
      )}
    </>
  );
};

interface QuickViewModalProps {
  stageName: string;
  city: string;
  age: number;
  rating: number;
  reviewCount: number;
  tier: string;
  isVerified: boolean;
  price?: number;
  responseTime?: string;
  onClose: () => void;
  onViewFull?: () => void;
  onMessage?: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  stageName,
  city,
  age,
  rating,
  reviewCount,
  tier,
  isVerified,
  price,
  responseTime,
  onClose,
  onViewFull,
  onMessage,
}) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="rounded-[3rem] p-12 max-w-xl w-full bg-[#0a0a0f] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">{stageName}</h2>
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-white/40 uppercase italic tracking-widest">
            <MapPin size={12} />
            <span>{city}</span>
            <span className="text-primary">/</span>
            <span>{age} yaş</span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(rating) ? 'fill-primary text-primary' : 'text-white/10'}
                />
              ))}
            </div>
            <span className="text-sm font-black italic text-white">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="text-center">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Elite Tier</p>
            <p className="font-black text-primary italic uppercase">{tier}</p>
          </div>
          {responseTime && (
            <div className="text-center">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Response Time</p>
              <p className="font-black text-white italic uppercase">{responseTime}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onMessage}
            className="flex-1 h-16 rounded-2xl bg-white text-black font-black italic text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
          >
            MESAJ GÖNDER
          </button>
          <button
            onClick={() => {
              onViewFull?.();
              onClose();
            }}
            className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black italic text-xs uppercase tracking-widest hover:border-white/40 transition-all"
          >
            DETAYLI PROFİL
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedListingCard;
