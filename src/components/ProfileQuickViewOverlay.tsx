import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListingProfile } from '@/types/domain';
import { VipPremiumCard } from './VipPremiumCard';
import { StandardCard } from './StandardCard';
import { X } from 'lucide-react';

interface ProfileQuickViewOverlayProps {
  profile: ListingProfile | null;
  onClose: () => void;
}

export const ProfileQuickViewOverlay: React.FC<ProfileQuickViewOverlayProps> = ({ profile, onClose }) => {
  if (!profile) return null;

  const isVip = profile.tier === 'diamond' || profile.tier === 'elite';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Card Container */}
        <motion.div
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 w-full max-w-lg"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 md:-right-12 p-3 text-white/50 hover:text-white transition-colors glass-panel border-none rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="transform scale-95 md:scale-105">
            {isVip ? (
              <VipPremiumCard escort={profile} isOverlay={true} />
            ) : (
              <StandardCard profile={profile} isOverlay={true} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
