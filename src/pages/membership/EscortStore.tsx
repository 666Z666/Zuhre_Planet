import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Package, Video, MessageSquare, Rocket, Crown } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { HolographicBadge } from '@/components/ui/HolographicBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notifyPaymentsUnavailable } from '@/lib/payments';

const visibilityPackages = [
  {
    id: 'pkg_elite',
    name: 'NEBULA ELITE',
    description: 'Galaksinin en parlak yıldızı olun. Maksimum erişim ve prestij.',
    price: 3499,
    npPrice: 35000,
    duration: '30 GÜN',
    features: [
      'Vitrinde Her Zaman En Üst Sırada',
      'Elit Profil Teması & Efektleri',
      'Sınırsız Medya Yükleme Kapasitesi',
      'Haftalık 10 Ücretsiz Boost',
      'Yapay Zeka Destekli Fotoğraf Analizi',
      'VİP Özel Destek Hattı'
    ],
    color: 'from-primary via-gold-600 to-emerald-400',
    icon: Crown,
    badge: 'GALAKTİK LİDER',
    popular: true
  },
  {
    id: 'pkg_pulsar',
    name: 'PULSAR BOOST',
    description: 'Hızla yükselmek isteyen profiller için ideal denge.',
    price: 1999,
    npPrice: 20000,
    duration: '30 GÜN',
    features: [
      'Kategori Sayfalarında Üst Sıra',
      'Pulsar Profil Rozeti (Parlayan)',
      '30 Fotoğraf & 10 Video Limiti',
      'Haftalık 3 Ücretsiz Boost',
      'Gelişmiş İstatistik Paneli'
    ],
    color: 'from-amber-400 to-orange-600',
    icon: Zap,
    badge: 'EN POPÜLER'
  },
  {
    id: 'pkg_nova',
    name: 'NOVA LITE',
    description: 'Ekonomik ve etkili bir başlangıç.',
    price: 999,
    npPrice: 10000,
    duration: '15 GÜN',
    features: [
      'Sıralamada Öncelikli Listeleme',
      'Nova Profil Rozeti',
      '15 Fotoğraf Limiti',
      'Müşteri Bildirimleri'
    ],
    color: 'from-emerald-400 to-teal-600',
    icon: Rocket,
    badge: 'BAŞLANGIÇ'
  }
];

const creditPacks = [
  { credits: 100, price: 150, bonus: 0 },
  { credits: 500, price: 650, bonus: 50, popular: true },
  { credits: 1000, price: 1200, bonus: 150 },
  { credits: 5000, price: 5000, bonus: 1000 }
];

const addonServices = [
  {
    title: 'Onaylı Video Rozeti',
    desc: 'Profiline güven katan video doğrulaması.',
    price: 250,
    icon: Video,
    color: 'text-emerald-400'
  },
  {
    title: 'WhatsApp VIP Yönlendirme',
    desc: 'Müşteriler doğrudan size ulaşsın.',
    price: 400,
    icon: MessageSquare,
    color: 'text-green-400'
  }
];

export default function EscortStore() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = (id: string) => {
    setLoading(id);
    notifyPaymentsUnavailable();
    setLoading(null);
  };

  const [usePoints, setUsePoints] = useState(false);
  const userPoints = 1250; // Mock current points
  const pointsValue = (userPoints / 10).toFixed(2); // 100 pts = 10 TL

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        
        {/* POINT REDEMPTION BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-8 overflow-hidden relative group"
        >
           <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
              <Gift className="w-32 h-32" />
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-900/40">
                 <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                 <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest italic">SADAKAT PUANLARINIZI KULLANIN</h3>
                 <p className="text-xs text-gray-400 mt-1">
                   Mevcut Puanınız: <strong className="text-white">{userPoints.toLocaleString()}</strong> • 
                   Değeri: <strong className="text-green-400">₺{pointsValue}</strong>
                 </p>
              </div>
           </div>
           <Button 
             variant="outline" 
             onClick={() => setUsePoints(!usePoints)}
             className={`rounded-xl px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${
               usePoints ? 'bg-amber-500 text-black border-transparent' : 'bg-white/5 text-amber-500 border-amber-500/30'
             }`}
           >
              {usePoints ? 'İNDİRİM UYGULANDI' : 'İNDİRİMİ ETKİNLEŞTİR'}
           </Button>
        </motion.div>
        
        {/* HERO SECTION - THE OUTPOST */}
        <div className="relative overflow-hidden rounded-[3.5rem] bg-[#0a0a0f] border border-white/5 p-12 lg:p-16 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-400/5" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] -mr-64 -mt-64 group-hover:opacity-100 transition-opacity duration-1000 opacity-50" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <HolographicBadge label="NEBULA OUTPOST" color="gold" className="mb-6 mx-auto lg:mx-0" />
              <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none">
                Z-MAĞAZA <br />
                <span className="text-primary">EKOSİSTEM</span>
              </h1>
              <p className="text-gray-500 text-sm font-black uppercase tracking-[0.3em] mb-10 leading-relaxed italic">
                RÜTBENİZİ YÜKSELTİN, <br />
                IŞIĞINIZI GALAKSİYE SAÇIN.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white italic">
                  <ShieldCheck className="w-4 h-4 text-primary" /> %100 GÜVENLİ
                </div>
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white italic">
                  <Package className="w-4 h-4 text-emerald-400" /> ANINDA AKTİF
                </div>
              </div>
            </div>
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
               <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
               <Crown className="w-full h-full text-white/5 group-hover:text-primary/20 transition-all duration-1000 rotate-12 scale-110" />
            </div>
          </div>
        </div>

        {/* VISIBILITY PACKAGES */}
        <div className="space-y-8">
          <div className="text-center">
             <h2 className="text-3xl font-bold text-white mb-2">Görünürlük Paketleri</h2>
             <p className="text-gray-500">Profilinizin platformdaki konumunu ve prestijini belirleyin.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibilityPackages.map((pkg, idx) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`relative h-full overflow-hidden border-white/10 rounded-[2.5rem] bg-black/40 backdrop-blur-xl transition-all duration-500 hover:border-gold-500/30 group ${
                    pkg.popular ? 'ring-2 ring-gold-500/50 scale-105 shadow-2xl shadow-gold-900/20' : ''
                  }`}>
                    <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${pkg.color}`} />
                    
                    <CardHeader className="text-center pt-10 pb-6">
                       {pkg.badge && (
                         <div className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                           pkg.popular ? 'bg-gold-600 text-white' : 'bg-white/5 text-gray-400'
                         }`}>
                           {pkg.badge}
                         </div>
                       )}
                       <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-8 h-8 text-white" />
                       </div>
                       <CardTitle className="text-2xl font-black font-orbitron mt-6 text-white group-hover:text-gold-400 transition-colors">{pkg.name}</CardTitle>
                       <CardDescription className="text-gray-500 px-4">{pkg.description}</CardDescription>
                        <div className="mt-6 space-y-2">
                           <div className="flex items-baseline justify-center gap-2 text-white">
                              <span className="text-4xl font-black italic tracking-tighter">₺{usePoints ? Math.max(0, pkg.price - Number(pointsValue)) : pkg.price}</span>
                              <span className="text-[10px] font-black opacity-30 uppercase">/ {pkg.duration}</span>
                           </div>
                           <div className="flex items-center justify-center gap-2 text-primary font-black text-sm italic">
                              <Zap className="w-3 h-3" /> {pkg.npPrice.toLocaleString()} NP
                           </div>
                           {usePoints && (
                             <div className="text-[10px] text-green-400 font-bold mt-1">
                                -₺{pointsValue} İNDİRİM UYGULANDI
                             </div>
                          )}
                       </div>
                    </CardHeader>

                    <CardContent className="space-y-4 px-8 pb-10">
                       <div className="space-y-3 mb-8">
                         {pkg.features.map((feature, i) => (
                           <div key={i} className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                             <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                             <span>{feature}</span>
                           </div>
                         ))}
                       </div>
                       <Button 
                         onClick={() => handlePurchase(pkg.id)}
                         disabled={loading === pkg.id}
                         className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all ${
                           pkg.popular ? 'bg-gold-600 hover:bg-gold-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                         }`}
                       >
                         {loading === pkg.id ? 'İşleniyor...' : 'Paketi Al'}
                       </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CREDIT PACKS & ADDONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
           
           {/* Credit Packs */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                 <Zap className="w-6 h-6 text-amber-500" />
                 <h3 className="text-xl font-bold text-white">Ekstra Boost Kredileri</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {creditPacks.map((pkg, i) => (
                   <div 
                     key={i} 
                     className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer group relative overflow-hidden"
                     onClick={() => handlePurchase(`credit_${i}`)}
                   >
                      {pkg.popular && (
                         <div className="absolute top-0 left-0 bg-amber-500 text-[8px] font-black px-2 py-1 uppercase">Süper Değer</div>
                      )}
                      <div className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">{pkg.credits} <span className="text-sm font-bold opacity-50">Kredi</span></div>
                      <div className="text-lg font-bold text-gray-400 mt-1">₺{pkg.price}</div>
                      {pkg.bonus > 0 && (
                        <div className="mt-2 text-[10px] font-black text-green-500 uppercase">+{pkg.bonus} Bonus Kredi</div>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           {/* Addon Services */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                 <Sparkles className="w-6 h-6 text-gold-500" />
                 <h3 className="text-xl font-bold text-white">Eklenti Hizmetler</h3>
              </div>
              <div className="space-y-4">
                 {addonServices.map((addon, i) => (
                   <div 
                     key={i} 
                     className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-gold-500/30 transition-all cursor-pointer group"
                     onClick={() => handlePurchase(`addon_${i}`)}
                   >
                      <div className="flex items-center gap-5">
                         <div className={`p-4 rounded-2xl bg-white/5 ${addon.color}`}>
                            <addon.icon className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white mb-1">{addon.title}</h4>
                            <p className="text-xs text-gray-500">{addon.desc} <span className="text-gold-400 font-bold ml-2">₺{addon.price}</span></p>
                         </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
