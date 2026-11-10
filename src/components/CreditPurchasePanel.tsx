/**
 * Credit Purchase Panel Component
 * Kredi paketleri, satın alma ve fiyatlandırma
 */

import React, { useState } from 'react';
import { Zap, ShoppingCart, TrendingDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  discount?: number;
  isPopular?: boolean;
  description?: string;
}

interface CreditPurchasePanelProps {
  currentCredits: number;
  userTier: 'free' | 'gold' | 'platinum' | 'vip';
  onPurchase?: (packageId: string, credits: number, price: number) => Promise<void>;
  className?: string;
}

const DEFAULT_PACKAGES: CreditPackage[] = [
  {
    id: 'pkg-1',
    name: 'Başlangıç',
    credits: 50,
    price: 49.99,
    description: '50 kredi',
  },
  {
    id: 'pkg-2',
    name: 'Popüler',
    credits: 150,
    price: 129.99,
    discount: 13,
    isPopular: true,
    description: '150 kredi + 13% indirim',
  },
  {
    id: 'pkg-3',
    name: 'Ekonomik',
    credits: 300,
    price: 229.99,
    discount: 23,
    description: '300 kredi + 23% indirim',
  },
  {
    id: 'pkg-4',
    name: 'Premium',
    credits: 600,
    price: 399.99,
    discount: 33,
    description: '600 kredi + 33% indirim',
  },
];

// Tier'e göre kredi indirim
const TIER_DISCOUNT: Record<string, number> = {
  free: 0,
  gold: 10,
  platinum: 20,
  vip: 30,
};

export function CreditPurchasePanel({
  currentCredits,
  userTier,
  onPurchase,
  className = '',
}: CreditPurchasePanelProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const tierDiscount = TIER_DISCOUNT[userTier];

  const handlePurchase = async (pkg: CreditPackage) => {
    setSelectedPackage(pkg.id);
    setShowPaymentMethod(true);

    setIsPurchasing(true);
    try {
      // Tier indirimini hesapla
      const finalPrice = pkg.price * (1 - tierDiscount / 100);
      await onPurchase?.(pkg.id, pkg.credits, finalPrice);
      setShowPaymentMethod(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Satın alma hatası:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const calculateFinalPrice = (basePrice: number): number => {
    return basePrice * (1 - tierDiscount / 100);
  };

  const calculateCreditPerTL = (credits: number, price: number): number => {
    return Math.round((credits / price) * 100) / 100;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Başlık */}
      <div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Kredi Satın Al
        </h2>
        <p className="text-white/40 text-sm mt-1">Mesajlaşma ve özel özellikler için kredi satın al</p>
      </div>

      {/* Mevcut Kredi */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-white">Mevcut Kredi</span>
          <Zap className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-4xl font-black text-yellow-400">{currentCredits}</p>
        <p className="text-white/40 text-xs mt-2">
          {currentCredits === 0
            ? 'Kredi satın alarak mesajlaşmaya başla'
            : `${currentCredits} kredi ile ${currentCredits} mesaj gönderebilirsin`}
        </p>
      </div>

      {/* Tier İndirim Bilgisi */}
      {tierDiscount > 0 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 font-bold text-sm">Tier İndirimi</p>
            <p className="text-green-300/70 text-xs mt-1">
              {userTier.toUpperCase()} tier'i olarak tüm kredi paketlerinde <span className="font-bold">{tierDiscount}% indirim</span> alıyorsun!
            </p>
          </div>
        </div>
      )}

      {/* Kredi Paketleri */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-sm">Paketler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEFAULT_PACKAGES.map((pkg, idx) => {
            const finalPrice = calculateFinalPrice(pkg.price);
            const creditPerTL = calculateCreditPerTL(pkg.credits, finalPrice);
            const isSelected = selectedPackage === pkg.id;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : pkg.isPopular
                      ? 'border-yellow-500/30 bg-yellow-500/5'
                      : 'border-white/10 bg-black/20 hover:border-white/20'
                }`}
                onClick={() => setSelectedPackage(isSelected ? null : pkg.id)}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-[10px] font-black text-yellow-400">POPÜLERr</span>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  {/* Paket Adı */}
                  <h4 className="font-bold text-white mb-2">{pkg.name}</h4>

                  {/* Kredi Sayısı */}
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-black text-emerald-400">{pkg.credits}</span>
                    <span className="text-white/40 text-sm">kredi</span>
                  </div>

                  {/* Fiyat */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        {finalPrice.toFixed(2)} ₺
                      </span>
                      {pkg.price !== finalPrice && (
                        <span className="text-sm text-white/40 line-through">
                          {pkg.price.toFixed(2)} ₺
                        </span>
                      )}
                    </div>
                    {pkg.discount && (
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400 font-bold">{pkg.discount}% indirim</span>
                      </div>
                    )}
                  </div>

                  {/* Kredi/TL Oranı */}
                  <div className="mb-4 p-2 bg-black/30 rounded-lg">
                    <p className="text-[10px] text-white/40">Kredi/TL</p>
                    <p className="text-sm font-bold text-emerald-400">{creditPerTL} kredi/₺</p>
                  </div>

                  {/* Satın Al Butonu */}
                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={isPurchasing && isSelected}
                    className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                      pkg.isPopular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white'
                        : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isPurchasing && isSelected ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Satın Al
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ödeme Yöntemi */}
      {showPaymentMethod && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <h3 className="font-bold text-white">Ödeme Yöntemi Seçin</h3>

          <div className="space-y-2">
            {[
              { id: 'card', name: 'Kredi Kartı', icon: '💳' },
              { id: 'bank', name: 'Banka Transferi', icon: '🏦' },
              { id: 'wallet', name: 'E-Cüzdan', icon: '📱' },
            ].map((method) => (
              <label
                key={method.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/10 hover:border-white/20 cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  defaultChecked={method.id === 'card'}
                  className="w-4 h-4 accent-emerald-400"
                />
                <span className="text-lg">{method.icon}</span>
                <span className="text-white font-medium text-sm">{method.name}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              disabled={isPurchasing}
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase transition-all hover:bg-emerald-500/30 disabled:opacity-50"
            >
              {isPurchasing ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
            </button>
            <button
              onClick={() => setShowPaymentMethod(false)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase transition-all hover:bg-white/10"
            >
              İptal
            </button>
          </div>
        </motion.div>
      )}

      {/* Bilgi */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
        <p className="text-blue-300 text-xs font-bold">💡 Kredi Sistemi</p>
        <ul className="text-blue-300/70 text-[10px] space-y-1">
          <li>• 1 mesaj = 1 kredi</li>
          <li>• 1 dakika call = 5 kredi</li>
          <li>• 1 dakika video call = 10 kredi</li>
          <li>• Tier'ine göre indirim al (Free: 0%, Gold: 10%, Platinum: 20%, VIP: 30%)</li>
          <li>• Günlük ücretsiz mesaj hakkını kullan (Free: 3, Gold: 5, Platinum: 10, VIP: Sınırsız)</li>
        </ul>
      </div>
    </div>
  );
}

export default CreditPurchasePanel;
