/**
 * Referral Management Panel Component
 * Referral kod oluşturma, yönetimi ve istatistikleri
 */

import React, { useState, useMemo } from 'react';
import {
  Copy,
  Share2,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  Gift,
  Link2,
  Calendar,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralCode {
  id: string;
  code: string;
  createdAt: Date;
  usageCount: number;
  maxUsageCount?: number;
  expiresAt?: Date;
  isActive: boolean;
  totalRewards: number;
}

interface ReferralStats {
  totalReferrals: number;
  totalRewards: number;
  thisMonthReferrals: number;
  thisMonthRewards: number;
  activeCodes: number;
}

interface ReferralManagementPanelProps {
  userMemberId: string;
  username: string;
  userTier: 'free' | 'gold' | 'platinum' | 'vip';
  stats: ReferralStats;
  referralCodes: ReferralCode[];
  onCreateCode?: () => Promise<void>;
  onDeleteCode?: (codeId: string) => Promise<void>;
  className?: string;
}

export function ReferralManagementPanel({
  userMemberId,
  username,
  userTier,
  stats,
  referralCodes,
  onCreateCode,
  onDeleteCode,
  className = '',
}: ReferralManagementPanelProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCodeConfig, setNewCodeConfig] = useState({
    maxUsage: '',
    expiryDays: '30',
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareCode = (code: string) => {
    const shareLink = `https://zuhreplanet.com/register?ref=${code}`;
    const message = `Merhaba! ${username} tarafından Zühre Planet'e davet edildim. Referral kodum: ${code}\n\n${shareLink}\n\nBu linki kullanarak kaydol ve biz ikimiz de ödüller kazan!`;

    if (navigator.share) {
      navigator.share({
        title: 'Zühre Planet Referral',
        text: message,
        url: shareLink,
      });
    } else {
      navigator.clipboard.writeText(message);
      alert('Mesaj kopyalandı!');
    }
  };

  const handleCreateCode = async () => {
    setIsCreatingCode(true);
    try {
      await onCreateCode?.();
      setShowCreateForm(false);
      setNewCodeConfig({ maxUsage: '', expiryDays: '30' });
    } catch (error) {
      console.error('Kod oluşturma hatası:', error);
    } finally {
      setIsCreatingCode(false);
    }
  };

  const activeCodes = useMemo(() => referralCodes.filter((c) => c.isActive), [referralCodes]);
  const totalUsage = useMemo(() => referralCodes.reduce((sum, c) => sum + c.usageCount, 0), [referralCodes]);

  // Tier'e göre bonus
  const tierBonusMap = {
    free: 0,
    gold: 10,
    platinum: 20,
    vip: 50,
  };
  const tierBonus = tierBonusMap[userTier];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-gold-400" />
            Referral Sistemi
          </h2>
          <p className="text-white/40 text-sm mt-1">Arkadaşlarını davet et ve ödüller kazan</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 rounded-lg bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase transition-all hover:bg-gold-500/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni Kod
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Toplam Referral</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.totalReferrals}</p>
          <p className="text-[10px] text-white/30 mt-1">Tüm zamanlar</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Bu Ay</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.thisMonthReferrals}</p>
          <p className="text-[10px] text-white/30 mt-1">Referral</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Toplam Ödül</span>
            <Gift className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.totalRewards}</p>
          <p className="text-[10px] text-white/30 mt-1">Puan + Kredi</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tier Bonus</span>
            <BarChart3 className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-black text-white">{tierBonus}%</p>
          <p className="text-[10px] text-white/30 mt-1">{userTier.toUpperCase()}</p>
        </motion.div>
      </div>

      {/* Yeni Kod Formu */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <h3 className="font-bold text-white">Yeni Referral Kodu Oluştur</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/40">
                  Maksimum Kullanım (Boş = Sınırsız)
                </label>
                <input
                  type="number"
                  value={newCodeConfig.maxUsage}
                  onChange={(e) => setNewCodeConfig((prev) => ({ ...prev, maxUsage: e.target.value }))}
                  placeholder="Örn: 100"
                  className="w-full bg-black/30 border border-white/10 focus:border-gold-500/50 rounded-lg px-3 py-2 text-white text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/40">
                  Geçerlilik Süresi (Gün)
                </label>
                <input
                  type="number"
                  value={newCodeConfig.expiryDays}
                  onChange={(e) => setNewCodeConfig((prev) => ({ ...prev, expiryDays: e.target.value }))}
                  placeholder="Örn: 30"
                  className="w-full bg-black/30 border border-white/10 focus:border-gold-500/50 rounded-lg px-3 py-2 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateCode}
                disabled={isCreatingCode}
                className="flex-1 px-4 py-2 rounded-lg bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase transition-all hover:bg-gold-500/30 disabled:opacity-50"
              >
                {isCreatingCode ? 'Oluşturuluyor...' : 'Kod Oluştur'}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase transition-all hover:bg-white/10"
              >
                İptal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Referral Kodları Listesi */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-400" />
          Aktif Kodlar ({activeCodes.length})
        </h3>

        {activeCodes.length === 0 ? (
          <div className="bg-black/20 border border-white/10 rounded-2xl p-8 text-center">
            <Link2 className="w-12 h-12 mx-auto mb-3 text-white/10" />
            <p className="text-white/30 font-bold uppercase italic">Henüz referral kodu yok</p>
          </div>
        ) : (
          <AnimatePresence>
            {activeCodes.map((code, idx) => (
              <motion.div
                key={code.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-black/20 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/30">
                      <span className="text-gold-400 font-black text-sm">{code.code}</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Oluşturuldu: {code.createdAt.toLocaleDateString('tr-TR')}</p>
                      {code.expiresAt && (
                        <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Bitiş: {code.expiresAt.toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(code.code)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        copiedCode === code.code
                          ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleShareCode(code.code)}
                      className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-bold hover:bg-white/10 transition-all"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteCode?.(code.id)}
                      className="px-2 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Kullanım İstatistikleri */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/40">Kullanım</p>
                    <p className="text-sm font-bold text-white">
                      {code.usageCount}
                      {code.maxUsageCount && `/${code.maxUsageCount}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40">Ödül</p>
                    <p className="text-sm font-bold text-yellow-400">{code.totalRewards}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40">Durum</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400 font-bold">Aktif</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Bilgi */}
      <div className="space-y-2">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-blue-300 text-xs">
            <p className="font-bold mb-1">💡 Referral Sistemi Nasıl Çalışır?</p>
            <ul className="space-y-0.5 text-blue-300/80">
              <li>• Referral kodu paylaş ve arkadaşlarını davet et</li>
              <li>• Arkadaşın kaydolduğunda sen ve arkadaşın ödül alırsın</li>
              <li>• Tier'ine göre ek bonus kazanabilirsin ({tierBonus}%)</li>
              <li>• Ödüller puan ve kredi olarak hesabına eklenir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferralManagementPanel;
