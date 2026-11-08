import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Shield, 
  Star, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  EyeOff,
  Percent,
  Sparkles,
  Zap
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { StarryBackground } from '@/components/StarryBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const membershipTiers = [
  {
    id: 'tier_bronze',
    name: 'BRONZE CLUB',
    price: 199,
    period: 'Ay',
    description: 'Ayrıcalığa ilk adımınızı atın.',
    features: [
      'Reklamsız Deneyim',
      'VIP Profillere 12 Saat Erken Erişim',
      'Profil Ziyaretçilerini Gör',
      'Standart Destek Hattı'
    ],
    color: 'from-amber-700 to-orange-800',
    icon: Star,
    badge: 'BAŞLANGIÇ'
  },
  {
    id: 'tier_gold',
    name: 'GOLD ELITE',
    price: 499,
    period: 'Ay',
    description: 'En popüler seçim, tam deneyim.',
    features: [
      'Bronze Tüm Özellikleri',
      'Gizli (Underground) Profillere Erişim',
      '%0 Hizmet Bedeli (Rezervasyonlarda)',
      'Profilde Altın Çerçeve & Rozet',
      'Öncelikli WhatsApp Destek',
      'Günde 3 Ücretsiz "Hızlandır" (Mesajlaşma)'
    ],
    color: 'from-yellow-400 via-amber-500 to-yellow-600',
    icon: Crown,
    badge: 'EN ÇOK TERCİH EDİLEN',
    popular: true
  },
  {
    id: 'tier_diamond',
    name: 'DIAMOND PRIVÉ',
    price: 999,
    period: 'Ay',
    description: 'Sınırları zorlayanlar için.',
    features: [
      'Gold Tüm Özellikleri',
      'Özel Concierge Hizmeti',
      'Tam Gizli Mod (Görünmez Gezinme)',
      'Sınırsız Mesajlaşma & Görüntülü Arama',
      'Özel Davetli Etkinliklere Erişim',
      'Kişisel İlişki Danışmanı'
    ],
    color: 'from-emerald-300 via-blue-500 to-emerald-600',
    icon: Sparkles,
    badge: 'SINIRSIZ'
  }
];

const perksOverview = [
  {
    title: 'Gizli Profiller',
    desc: 'Sadece Elite üyelere özel açılan, halka açık olmayan prestijli profiller.',
    icon: EyeOff,
    color: 'text-amber-500'
  },
  {
    title: 'Sıfır Komisyon',
    desc: 'Rezervasyon ve ödemelerde platform komisyonu ödemezsiniz.',
    icon: Percent,
    color: 'text-green-500'
  },
  {
    title: 'Tam Güvenlik',
    desc: 'Uçtan uca şifreli iletişim ve anonim gezinme garantisi.',
    icon: Shield,
    color: 'text-blue-500'
  }
];

export default function CustomerMembership() {
  const [loading, setLoading] = useState<string | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const userPoints = 3450; // Mock current points
  const pointsValue = (userPoints / 10).toFixed(2); // 100 pts = 10 TL

  const handleUpgrade = (id: string) => {
    setLoading(id);
    setTimeout(() => {
      setLoading(null);
      alert('Güvenli ödeme sayfasına yönlendiriliyorsunuz...');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-transparent relative w-full overflow-hidden">
      <StarryBackground />

      <div className="relative z-10 py-32 container mx-auto px-6">
        
        {/* POINT REDEMPTION BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between p-8 rounded-[3rem] bg-amber-500/10 border border-amber-500/20 mb-20 overflow-hidden relative group"
        >
           <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
              <Sparkles className="w-48 h-48" />
           </div>
           <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-900/40">
                 <Zap className="w-8 h-8 text-black" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-amber-500 uppercase tracking-widest italic">SADAKAT PUANLARINIZI KULLANIN</h3>
                 <p className="text-sm text-gray-400 mt-1">
                   Mevcut Elite Puanınız: <strong className="text-white">{userPoints.toLocaleString()}</strong> • 
                   Değeri: <strong className="text-green-400">₺{pointsValue}</strong>
                 </p>
              </div>
           </div>
           <Button 
             variant="outline" 
             onClick={() => setUsePoints(!usePoints)}
             className={`rounded-2xl px-10 py-4 text-xs font-black uppercase tracking-widest transition-all ${
               usePoints ? 'bg-amber-500 text-black border-transparent' : 'bg-white/5 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
             }`}
           >
              {usePoints ? 'İNDİRİM UYGULANDI' : 'İNDİRİMİ ETKİNLEŞTİR'}
           </Button>
        </motion.div>
        
        {/* HERO */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-6 py-2 mb-8"
          >
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-amber-500 italic">ELITE CLUB MEMBERSHIP</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-none mb-8 text-white">
            SIRADANIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 animate-shimmer">ÖTESİNE</span> GEÇİN
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Galaxy Elite Club, sadece en seçkin üyelerimize özel ayrıcalıklar sunar. 
            Gizli profillerden sıfır komisyona kadar her şey sizin için tasarlandı.
          </p>
        </div>

        {/* PERKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {perksOverview.map((perk, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${perk.color}`}>
                <perk.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{perk.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* PRICING TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {membershipTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className={tier.popular ? 'md:-mt-10' : ''}
              >
                <Card className={`relative h-full overflow-hidden border-white/10 rounded-[4rem] bg-black/60 backdrop-blur-3xl transition-all duration-700 hover:border-amber-500/30 group ${
                  tier.popular ? 'ring-2 ring-amber-500/50 shadow-2xl shadow-amber-900/30' : ''
                }`}>
                  <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${tier.color}`} />
                  
                  {tier.popular && (
                    <div className="absolute top-10 right-10">
                       <Badge className="bg-amber-500 text-black font-black uppercase text-[9px] tracking-widest px-4 py-1 animate-pulse">
                         {tier.badge}
                       </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pt-20 pb-10">
                     <div className={`w-20 h-20 mx-auto rounded-[2rem] bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-700`}>
                        <Icon className="w-10 h-10 text-white" />
                     </div>
                     <CardTitle className="text-3xl font-black font-orbitron mt-10 text-white tracking-widest italic">{tier.name}</CardTitle>
                     <CardDescription className="text-gray-400 mt-4 px-6">{tier.description}</CardDescription>
                     <div className="mt-10 flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-black text-white italic">
                           ₺{usePoints ? Math.max(0, tier.price - Number(pointsValue)) : tier.price}
                        </span>
                        <span className="text-gray-500 font-bold">/ {tier.period}</span>
                     </div>
                     {usePoints && (
                        <div className="mt-2 text-center text-[10px] font-black text-green-400 uppercase tracking-widest">
                           -₺{pointsValue} İNDİRİM UYGULANDI
                        </div>
                     )}
                  </CardHeader>

                  <CardContent className="px-12 pb-20 space-y-8">
                     <div className="space-y-4">
                       {tier.features.map((feature, i) => (
                         <div key={i} className="flex items-center gap-4 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                           <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                           <span className="font-medium tracking-tight">{feature}</span>
                         </div>
                       ))}
                     </div>
                     <Button 
                       onClick={() => handleUpgrade(tier.id)}
                       disabled={loading === tier.id}
                       className={`w-full py-10 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] italic group-hover:scale-[1.02] transition-all ${
                         tier.popular ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_20px_50px_rgba(245,158,11,0.2)]' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                       }`}
                     >
                       {loading === tier.id ? 'İşleniyor...' : 'KULÜBE KATIL'}
                     </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* TRUST / FOOOTER */}
        <div className="mt-32 text-center">
           <div className="flex flex-col items-center gap-6 p-12 glass shadow-inner rounded-[3rem]">
              <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
              <h2 className="text-3xl font-black text-white italic">MEMNUNİYET VE GİZLİLİK GARANTİSİ</h2>
              <p className="max-w-2xl text-gray-500">
                Tüm üyeliklerimiz 24 saat içinde koşulsuz iade garantisi kapsamındadır. 
                Görünürlüğünüz, verileriniz ve iletişiminiz bizimleyken güvendedir.
              </p>
              <div className="flex gap-8 mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> SSL SECURE</span>
                 <span className="flex items-center gap-2"><Star className="w-4 h-4" /> 5 STAR SERVICE</span>
              </div>
           </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
