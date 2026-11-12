import React from 'react';
import { Star, MapPin, Heart, Eye, Share2, Badge } from 'lucide-react';

interface PremiumListingCardProps {
  id: number;
  image: string;
  stageName: string;
  city: string;
  age: number;
  rating: number;
  reviewCount: number;
  tier: 'free' | 'gold' | 'platinum' | 'vip';
  isBoosted?: boolean;
  isVerified?: boolean;
  price?: number;
  onViewClick?: () => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
}

/**
 * Premium İlan Kartı Bileşeni
 * 
 * Glassmorphism efekti, hover animasyonları ve modern tasarım
 */
export const PremiumListingCard: React.FC<PremiumListingCardProps> = ({
  id: _id,
  image,
  stageName,
  city,
  age,
  rating,
  reviewCount,
  tier,
  isBoosted = false,
  isVerified = false,
  price,
  onViewClick,
  onLikeClick,
  isLiked = false,
}) => {
  const getTierColor = (t: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      free: { bg: 'bg-gray-200', text: 'text-gray-800' },
      gold: { bg: 'bg-yellow-200', text: 'text-yellow-800' },
      platinum: { bg: 'bg-slate-300', text: 'text-slate-900' },
      vip: { bg: 'bg-pink-200', text: 'text-pink-800' },
    };
    return colors[t] || colors.free;
  };

  const tierColor = getTierColor(tier);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
      onClick={onViewClick}
    >
      {/* Arka Plan Kartı */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* Görsel Konteyner */}
      <div className="relative h-80 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={image}
          alt={stageName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Üst Rozet Alanı */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {/* Tier Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${tierColor.bg} ${tierColor.text} border border-white/20`}
          >
            {tier.toUpperCase()}
          </div>

          {/* Boost Badge */}
          {isBoosted && (
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
              ⭐ Öne Çıkartılmış
            </div>
          )}
        </div>

        {/* Alt İşlem Butonları (Hover) */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick?.();
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-md ${
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-800 hover:bg-white'
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            Beğen
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="py-2 px-4 rounded-lg bg-white/80 text-gray-800 hover:bg-white transition-all backdrop-blur-md flex items-center justify-center"
            title="Paylaş"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div
        className="p-4 relative z-5"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Başlık */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              {stageName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <MapPin size={14} />
              <span>{city}</span>
              <span className="text-gray-400">•</span>
              <span>{age} yaş</span>
            </div>
          </div>

          {/* Onaylı Badge */}
          {isVerified && (
            <div
              className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              title="Onaylı"
            >
              <Badge size={16} />
            </div>
          )}
        </div>

        {/* Puanlama */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({reviewCount})
          </span>
        </div>

        {/* Alt Bilgiler */}
        <div className="flex items-center justify-between pt-3 border-t border-white/30">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Eye size={14} />
            <span>Görüntüle</span>
          </div>

          {price && (
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ₺{price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumListingCard;
