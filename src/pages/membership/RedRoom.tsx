import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, Zap, KeyRound, Lock, Crown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { Footer } from '@/components/Footer';

// Mock VIP gallery items
const VIP_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Özel Çekim #${i + 1}`,
  model: ['Elara Moon', 'Luna', 'Milena', 'Sofia', 'Valentina', 'Anastasia', 'Isabella', 'Zara'][i],
  tier: i < 2 ? 'Diamond' : i < 5 ? 'Platinum' : 'VIP',
  img: `/brand/placeholders/portrait-1.svg'1517841905240-472988babdf9','1534528741775-53994a69daeb','1529626455594-4ff0802cfb7e','1524504388940-b1c1722653e1','1516575334481-f85287c2c81d','1544005313-94ddf0286df2','1531746020798-e6953c6e8e04','1488426862026-3ee34a7d66b3'][i]}?w=600&auto=format&fit=crop&q=80`,
}));

const tierConfig: Record<string, string> = {
  Diamond: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  Platinum: 'bg-gold-500/20 text-gold-300 border-gold-400/30',
  VIP: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
};

export default function RedRoom() {
  const { user } = useAuth();
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  // Check VIP access
  const hasAccess =
    user?.role === 'admin' ||
    user?.membership === 'vip' ||
    user?.membership === 'platinum';

  return (
    <div className="min-h-screen bg-[#070003] text-white relative overflow-hidden">
      <Helmet>
        <title>The Red Room | Sadece VIP — Zühre Planet</title>
        <meta name="description" content="Zühre Planet'in özel VIP salonuna giriş için Platinum veya VIP üyelik gereklidir." />
      </Helmet>

      {/* Ambient red glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] bg-red-900/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[70vw] h-[70vw] bg-red-950/30 rounded-full blur-[200px]" />
      </div>

      {/* Hero Header */}
      <div className="relative pt-32 pb-16 px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-red-800/50 bg-red-950/50 flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.2)]">
            <Eye className="w-10 h-10 text-red-400 animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider mb-6 text-transparent bg-clip-text bg-gradient-to-b from-red-300 via-red-500 to-red-900">
            The Red Room
          </h1>
          <p className="text-red-300/60 text-lg uppercase tracking-[0.3em] font-light italic">
            "Kapının Ardında Saklı Kalan Arzular"
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {!hasAccess ? (
            /* ACCESS DENIED STATE */
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto"
            >
              {/* Locked card */}
              <div className="bg-black/60 border border-red-900/40 rounded-3xl p-10 md:p-12 text-center backdrop-blur-xl shadow-[0_0_80px_rgba(220,38,38,0.08)]">
                <Lock className="w-16 h-16 text-red-800 mx-auto mb-6" />
                <h2 className="text-2xl font-black uppercase tracking-wide text-white mb-3">
                  Yetki Gerekli
                </h2>
                <p className="text-white/55 text-base leading-relaxed mb-8 max-w-sm mx-auto">
                  Bu salon yalnızca <span className="text-gold-400 font-bold">Platinum</span> ve{' '}
                  <span className="text-rose-400 font-bold">VIP</span> üyelerine özeldir.
                  Sınır tanımayan içerikler için üyeliğinizi yükseltin.
                </p>

                {/* Membership tiers preview */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { name: 'Platinum', color: 'border-gold-500/40 bg-gold-900/20', textColor: 'text-gold-300', perks: ['Red Room Erişim', 'Gizli Profiller', 'VIP Destek'] },
                    { name: 'VIP', color: 'border-rose-500/40 bg-rose-900/20', textColor: 'text-rose-300', perks: ['Full Red Room', 'Diamond Profiller', '7/24 Özel Asistan'] },
                  ].map(tier => (
                    <div key={tier.name} className={`p-4 rounded-2xl border ${tier.color} text-left`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className={`w-4 h-4 ${tier.textColor}`} />
                        <span className={`text-sm font-black uppercase ${tier.textColor}`}>{tier.name}</span>
                      </div>
                      {tier.perks.map(p => (
                        <div key={p} className="flex items-center gap-2 text-white/50 text-xs mb-1.5">
                          <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/membership" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-98">
                      <Zap className="w-4 h-4" />
                      VIP Üye Ol
                    </button>
                  </Link>
                  <Link href="/login" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 bg-white/5 border border-red-900/40 text-white/70 hover:text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:border-red-800/60 active:scale-98">
                      <KeyRound className="w-4 h-4" />
                      Giriş Yap
                    </button>
                  </Link>
                </div>
              </div>

              {/* Preview teaser */}
              <div className="mt-10">
                <p className="text-white/25 text-xs text-center uppercase tracking-widest mb-4">İçerik Önizlemesi</p>
                <div className="grid grid-cols-4 gap-3">
                  {VIP_ITEMS.slice(0, 4).map(item => (
                    <div key={item.id} className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-black">
                      <img src={item.img} alt="" className="w-full h-full object-cover opacity-20 blur-sm" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-700/60" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACCESS GRANTED STATE */
            <motion.div
              key="unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Welcome bar */}
              <div className="mb-8 flex items-center justify-between p-5 rounded-2xl bg-red-950/30 border border-red-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-600/30 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Red Room Erişimi Açık</p>
                    <p className="text-white/40 text-xs">Tüm özel içeriklere erişebilirsiniz.</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-widest">
                  VIP Doğrulandı
                </div>
              </div>

              {/* Gallery grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {VIP_ITEMS.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setPreviewIdx(idx)}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-red-900/20 hover:border-red-500/40 transition-all"
                  >
                    <img
                      src={item.img}
                      alt={item.model}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-[10px] font-bold ${tierConfig[item.tier]}`}>
                      {item.tier}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-bold text-sm truncate">{item.model}</p>
                      <p className="text-white/50 text-xs">{item.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
