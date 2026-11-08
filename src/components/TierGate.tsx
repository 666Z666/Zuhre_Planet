/**
 * TierGate Component
 *
 * Üyelik seviyesine göre içerik kısıtlaması uygular.
 * Free kullanıcılar için blur efekti ve kilit ikonu gösterir.
 * Gold/Platinum/VIP kullanıcılar içeriği görebilir.
 *
 * @module components/TierGate
 */

import React from 'react';
import { Lock, Crown, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

export type TierLevel = 'free' | 'gold' | 'platinum' | 'vip';

const TIER_ORDER: Record<TierLevel, number> = {
  free: 0,
  gold: 1,
  platinum: 2,
  vip: 3,
};

const TIER_CONFIG: Record<TierLevel, { label: string; color: string; icon: React.ReactNode; gradient: string }> = {
  free: {
    label: 'Ücretsiz',
    color: 'text-gray-400',
    icon: <Star className="w-4 h-4" />,
    gradient: 'from-gray-500 to-gray-600',
  },
  gold: {
    label: 'Gold',
    color: 'text-amber-400',
    icon: <Crown className="w-4 h-4" />,
    gradient: 'from-amber-500 to-yellow-500',
  },
  platinum: {
    label: 'Platinum',
    color: 'text-emerald-400',
    icon: <Zap className="w-4 h-4" />,
    gradient: 'from-emerald-500 to-blue-500',
  },
  vip: {
    label: 'VIP',
    color: 'text-gold-400',
    icon: <Crown className="w-4 h-4" />,
    gradient: 'from-gold-500 to-pink-500',
  },
};

interface TierGateProps {
  requiredTier: TierLevel;
  userTier?: TierLevel;
  type?: 'photo' | 'video' | 'content' | 'feature';
  message?: string;
  upgradeHref?: string;
  children: React.ReactNode;
  className?: string;
}

export function TierGate({
  requiredTier,
  userTier = 'free',
  type = 'content',
  message,
  upgradeHref = '/pricing',
  children,
  className = '',
}: TierGateProps) {
  const hasAccess = TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];

  if (hasAccess) {
    return <>{children}</>;
  }

  const tierConfig = TIER_CONFIG[requiredTier];

  const defaultMessages: Record<string, string> = {
    photo: 'Bu fotoğrafı görmek için üyeliğinizi yükseltin',
    video: 'Bu videoyu izlemek için üyeliğinizi yükseltin',
    content: 'Bu içeriğe erişmek için üyeliğinizi yükseltin',
    feature: 'Bu özelliği kullanmak için üyeliğinizi yükseltin',
  };

  const displayMessage = message || defaultMessages[type];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="blur-xl select-none pointer-events-none" aria-hidden="true">
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-3 p-4 text-center"
        >
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tierConfig.gradient} flex items-center justify-center shadow-lg`}>
            <Lock className="w-6 h-6 text-white" />
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10`}>
            <span className={tierConfig.color}>{tierConfig.icon}</span>
            <span className={`text-xs font-black uppercase tracking-wider ${tierConfig.color}`}>
              {tierConfig.label} Gerekli
            </span>
          </div>

          <p className="text-white/60 text-xs font-medium max-w-[160px] leading-relaxed">
            {displayMessage}
          </p>

          <Link href={upgradeHref}>
            <button
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${tierConfig.gradient} text-white text-xs font-black uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity`}
            >
              Yükselt
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export function TierBadge({ tier, size = 'sm' }: { tier: TierLevel; size?: 'sm' | 'md' | 'lg' }) {
  const config = TIER_CONFIG[tier];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  if (tier === 'free') return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${config.gradient} text-white font-black uppercase tracking-wider ${sizeClasses[size]}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

interface LockedPhotoGridProps {
  photos: string[];
  userTier?: TierLevel;
  freeLimit?: number;
  escortName?: string;
}

export function LockedPhotoGrid({
  photos,
  userTier = 'free',
  freeLimit = 2,
  escortName = 'Escort',
}: LockedPhotoGridProps) {
  const visiblePhotos = photos.slice(0, freeLimit);
  const lockedPhotos = photos.slice(freeLimit);
  const hasAccess = TIER_ORDER[userTier] >= TIER_ORDER['gold'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {visiblePhotos.map((photo, idx) => (
        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-black/20">
          <img src={photo} alt={`${escortName} ${idx + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {lockedPhotos.map((photo, idx) => (
        <TierGate
          key={`locked-${idx}`}
          requiredTier="gold"
          userTier={userTier}
          type="photo"
          className="aspect-square rounded-xl overflow-hidden"
        >
          <img src={photo} alt={`${escortName} ${freeLimit + idx + 1}`} className="w-full h-full object-cover" />
        </TierGate>
      ))}

      {!hasAccess && lockedPhotos.length > 0 && (
        <div className="col-span-3 mt-1 text-center">
          <p className="text-white/30 text-xs">
            <span className="text-amber-400 font-bold">{lockedPhotos.length}</span> fotoğraf daha{' '}
            <Link href="/pricing">
              <span className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer underline">
                Gold üyelik
              </span>
            </Link>{' '}
            ile görüntülenebilir
          </p>
        </div>
      )}
    </div>
  );
}

export default TierGate;
