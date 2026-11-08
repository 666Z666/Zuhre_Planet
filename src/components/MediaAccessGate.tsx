/**
 * Media Access Gate Component
 * Tier-based medya erişim kısıtlamaları ve blur efektleri
 */

import React, { useState } from 'react';
import { Lock, Video, Image, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface MediaAccessGateProps {
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  mediaIndex: number; // Hangi sırada olduğu
  userTier: 'guest' | 'free' | 'gold' | 'platinum' | 'vip';
  userStatus: 'guest' | 'pending' | 'approved';
  escortApprovalStatus: 'pending' | 'approved';
  maxVisibleCount: number; // Bu tier için görülebilecek maksimum sayı
  blurLevel: number; // 0-100
  isLocked: boolean;
  lockReason?: string;
  requiredTier?: 'gold' | 'platinum' | 'vip';
  onUnlock?: () => void;
  className?: string;
}

export function MediaAccessGate({
  mediaType,
  mediaUrl,
  mediaIndex,
  userTier,
  userStatus,
  escortApprovalStatus,
  maxVisibleCount,
  blurLevel,
  isLocked,
  lockReason,
  requiredTier,
  onUnlock,
  className = '',
}: MediaAccessGateProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Erişim kontrolü
  const isApproved = escortApprovalStatus === 'approved';
  const isUserApproved = userStatus === 'approved';
  const isWithinLimit = mediaIndex < maxVisibleCount || maxVisibleCount === -1;
  const canAccess = isApproved && isUserApproved && isWithinLimit && !isLocked;

  // Blur efekti CSS
  const blurStyle = canAccess ? { filter: `blur(${blurLevel}px)` } : { filter: `blur(${Math.max(blurLevel, 50)}px)` };

  // Erişim reddedilme nedenleri
  const getDenialReason = () => {
    if (!isApproved) {
      return 'Bu medya henüz onaylanmamıştır';
    }
    if (!isUserApproved) {
      return 'Profiliniz onaylanmalıdır';
    }
    if (!isWithinLimit) {
      return `Bu tier (${userTier}) için sadece ${maxVisibleCount} medya görebilirsiniz`;
    }
    if (isLocked) {
      return lockReason || 'Bu medyaya erişim izniniz yoktur';
    }
    return 'Erişim reddedildi';
  };

  // Gerekli tier'i göster
  const getTierUpgradeMessage = () => {
    if (requiredTier === 'platinum') {
      return 'Platinum tier ile tüm medyaları görebilirsiniz';
    }
    if (requiredTier === 'vip') {
      return 'VIP tier ile tüm medyaları görebilirsiniz';
    }
    if (requiredTier === 'gold') {
      return 'Gold tier ile daha fazla medya görebilirsiniz';
    }
    return 'Tier yükselterek daha fazla medya görebilirsiniz';
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Medya Konteyner */}
      <div
        className="relative w-full aspect-square rounded-lg overflow-hidden bg-black/20 border border-white/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Medya */}
        {mediaType === 'photo' ? (
          <img
            src={mediaUrl}
            alt={`Fotoğraf ${mediaIndex + 1}`}
            className="w-full h-full object-cover"
            style={blurStyle}
          />
        ) : (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover"
            style={blurStyle}
          />
        )}

        {/* Overlay - Erişim Reddedildi */}
        {!canAccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          >
            <Lock className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-white font-bold text-center text-sm mb-2">{getDenialReason()}</p>
            {requiredTier && (
              <p className="text-white/60 text-xs text-center mb-3">{getTierUpgradeMessage()}</p>
            )}
            {onUnlock && (
              <button
                onClick={onUnlock}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase hover:bg-emerald-500/30 transition-all"
              >
                Tier Yükselt
              </button>
            )}
          </motion.div>
        )}

        {/* Overlay - Hover Efekti */}
        {canAccess && isHovered && blurLevel > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white text-xs font-bold">Bulanıklık Uygulanmış</p>
              <p className="text-white/60 text-xs">VIP tier ile temiz görebilirsiniz</p>
            </div>
          </motion.div>
        )}

        {/* Medya Türü İkonu */}
        <div className="absolute top-2 right-2 bg-black/60 rounded-lg p-2">
          {mediaType === 'photo' ? (
            <Image className="w-4 h-4 text-emerald-400" />
          ) : (
            <Video className="w-4 h-4 text-gold-400" />
          )}
        </div>

        {/* Sıra Numarası */}
        <div className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-2 py-1">
          <p className="text-white text-xs font-bold">{mediaIndex + 1}</p>
        </div>
      </div>

      {/* Bilgi Kartı */}
      {!canAccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 left-0 right-0 bg-black/90 border border-white/10 rounded-lg p-3 text-xs text-white/70 hidden group-hover:block z-10"
        >
          <p className="font-bold text-white mb-1">Erişim Reddedildi</p>
          <p>{getDenialReason()}</p>
          {requiredTier && (
            <p className="text-emerald-400 mt-2">💡 {getTierUpgradeMessage()}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default MediaAccessGate;
