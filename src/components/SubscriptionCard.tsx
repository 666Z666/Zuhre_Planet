import React from 'react';
import { Check, X, Crown, Zap, Gift } from 'lucide-react';

interface SubscriptionBenefit {
  name: string;
  monthlyPrice: number;
  features: string[];
}

interface SubscriptionCardProps {
  tier: 'free' | 'gold' | 'platinum' | 'vip';
  benefits: SubscriptionBenefit;
  currentTier?: 'free' | 'gold' | 'platinum' | 'vip';
  subscriptionEndsAt?: Date;
  onUpgradeClick?: (tier: string) => void;
}

/**
 * Üyelik Kartı Bileşeni
 * 
 * Üyelik seviyeleri ve avantajlarını gösterir
 */
export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  tier,
  benefits,
  currentTier,
  subscriptionEndsAt,
  onUpgradeClick,
}) => {
  const isCurrentTier = tier === currentTier;

  // Tier rengini belirle
  const getTierColor = (t: string) => {
    const colors: Record<string, string> = {
      free: 'var(--text-secondary)',
      gold: 'var(--gold)',
      platinum: 'var(--platinum)',
      vip: 'var(--vip)',
    };
    return colors[t] || 'var(--text-secondary)';
  };

  // Tier ikonunu belirle
  const getTierIcon = (t: string) => {
    switch (t) {
      case 'vip':
        return <Crown size={24} />;
      case 'platinum':
        return <Zap size={24} />;
      case 'gold':
        return <Gift size={24} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-lg p-6 border transition-all ${isCurrentTier ? 'ring-2' : ''}`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: getTierColor(tier),
        boxShadow: isCurrentTier ? `0 0 0 2px ${getTierColor(tier)}` : undefined,
      }}
    >
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div style={{ color: getTierColor(tier) }}>
            {getTierIcon(tier)}
          </div>
          <h3 className="text-lg font-bold" style={{ color: getTierColor(tier) }}>
            {benefits.name}
          </h3>
        </div>
        {isCurrentTier && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${getTierColor(tier)}20`,
              color: getTierColor(tier),
            }}
          >
            Mevcut
          </span>
        )}
      </div>

      {/* Fiyat */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        {benefits.monthlyPrice > 0 ? (
          <div>
            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              ₺{benefits.monthlyPrice.toFixed(2)}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              /ay
            </span>
          </div>
        ) : (
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Ücretsiz
          </div>
        )}
      </div>

      {/* Özellikler */}
      <div className="mb-6 space-y-2">
        {benefits.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check size={18} style={{ color: 'var(--success)', marginTop: '2px' }} />
            <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Durum */}
      {isCurrentTier && subscriptionEndsAt && (
        <div
          className="p-3 rounded-lg mb-4 text-sm"
          style={{
            backgroundColor: `${getTierColor(tier)}20`,
            color: getTierColor(tier),
          }}
        >
          Üyeliğiniz {new Date(subscriptionEndsAt).toLocaleDateString('tr-TR')} tarihinde sona erecek
        </div>
      )}

      {/* Düğme */}
      {!isCurrentTier && (
        <button
          onClick={() => onUpgradeClick?.(tier)}
          className="w-full py-2 rounded-lg font-semibold transition-colors"
          style={{
            backgroundColor: getTierColor(tier),
            color: tier === 'platinum' ? '#000' : '#fff',
          }}
        >
          {benefits.monthlyPrice > 0 ? 'Yükselt' : 'Seç'}
        </button>
      )}
    </div>
  );
};

export default SubscriptionCard;
