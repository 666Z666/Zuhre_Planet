import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Users, 
  Star, 
  TrendingUp,
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { Link } from 'wouter';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrustScoreIndicator } from '@/components/ui/TrustScoreIndicator';
import { toast } from 'sonner';

const escortTiers = [
  { name: 'BAŞLANGIÇ', minPoints: 0, maxPoints: 1000, color: 'text-gray-400', bg: 'bg-gray-400/10' },
  { name: 'PROFESYONEL', minPoints: 1001, maxPoints: 5000, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'ELİT GALAXY', minPoints: 5001, maxPoints: 15000, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { name: 'LEGENDARY', minPoints: 15001, maxPoints: Infinity, color: 'text-amber-400', bg: 'bg-amber-400/10' }
];

const loyaltyTasks = [
  { 
    id: 't_verify', 
    title: 'Profilini Doğrula', 
    points: 1000, 
    desc: 'Kimlik ve video doğrulaması ile tam puan al.',
    icon: ShieldCheck,
    completed: false
  },
  { 
    id: 't_media', 
    title: 'Yeni Galeri İçeriği', 
    points: 150, 
    desc: 'Haftalık en az 5 yeni fotoğraf veya 1 video yükle.',
    icon: ImageIcon,
    completed: true
  },
  { 
    id: 't_referral', 
    title: 'Arkadışını Davet Et', 
    points: 250, 
    desc: 'Arkadaşın ilk paketini aldığında puan kazan.',
    icon: Users,
    completed: false
  },
  { 
    id: 't_complete', 
    title: 'Profil %100 Tamamlansın', 
    points: 300, 
    desc: 'Tüm biyografi ve seçenekleri eksiksiz doldur.',
    icon: Star,
    completed: false
  }
];

export default function EscortLoyalty() {
  const [points, setPoints] = useState(1250);
  const currentTier = escortTiers.find(t => points >= t.minPoints && points <= t.maxPoints) || escortTiers[0];
  const nextTier = escortTiers[escortTiers.indexOf(currentTier) + 1];
  const progressPercent = nextTier ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://zuhreplanet.com/register/escort?ref=ELARA-PRO`);
    toast.success('Referans linki kopyalandı!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        
        {/* HERO / STATUS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Current Points & Tier */}
           <Card className="lg:col-span-2 relative overflow-hidden border-white/10 rounded-[3rem] bg-gradient-to-br from-gold-900/40 to-blue-900/40 p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="space-y-6">
                    <Badge className={`${currentTier.bg} ${currentTier.color} border-white/5 px-4 py-1 font-black underline tracking-widest`}>
                       {currentTier.name} ÜYE
                    </Badge>
                    <h1 className="text-5xl font-black font-orbitron text-white">
                       {points.toLocaleString('tr-TR')} <span className="text-xl text-gray-500 font-bold">PUAN</span>
                    </h1>
                    <div className="space-y-3 max-w-sm">
                       <div className="flex justify-between text-xs font-bold text-gray-400 italic">
                          <span>{currentTier.name}</span>
                          {nextTier && <span>HEDEF: {nextTier.name}</span>}
                       </div>
                       <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${progressPercent}%` }}
                             className="h-full bg-gradient-to-r from-gold-500 to-blue-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                          />
                       </div>
                       <p className="text-[10px] text-gold-400 font-black uppercase text-right">
                          %{progressPercent.toFixed(0)} TAMAMLANDI
                       </p>
                    </div>
                 </div>
                 <TrustScoreIndicator score={88} size="lg" />
              </div>
           </Card>

           {/* Stats Summary */}
           <Card className="rounded-[3rem] border-white/10 bg-[#0a0a0f] p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <TrendingUp className="w-5 h-5 text-green-400" />
                   <h3 className="text-sm font-black uppercase tracking-widest text-white">Aktivite Özeti</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-xs text-gray-400 font-bold uppercase">Toplam Randevu</span>
                      <span className="text-lg font-black text-white">128</span>
                   </div>
                   <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-xs text-gray-400 font-bold uppercase">Başarılı Referans</span>
                      <span className="text-lg font-black text-white">12</span>
                   </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6 py-6 rounded-2xl border-white/10 text-xs font-black uppercase tracking-widest">
                 GEÇMİŞİ GÖR
              </Button>
           </Card>
        </div>

        {/* REWARD OPTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* WAYS TO EARN */}
            <div className="space-y-8">
               <div className="flex flex-col">
                  <h2 className="text-2xl font-black text-white italic">NASIL PUAN KAZANILIR?</h2>
                  <p className="text-gray-500 text-sm">Platform etkileşimini artırarak rütbe atlayın.</p>
               </div>
               <div className="space-y-4">
                  {loyaltyTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                        task.completed ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10 hover:border-gold-500/30'
                      }`}
                    >
                       <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl ${task.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gold-400'}`}>
                             <task.icon className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className={`font-bold text-sm ${task.completed ? 'line-through text-gray-600' : 'text-white'}`}>{task.title}</h4>
                             <p className="text-xs text-gray-500 mt-0.5">{task.desc}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className={`text-lg font-black ${task.completed ? 'text-gray-600' : 'text-gold-400'}`}>
                            +{task.points}
                          </span>
                          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mt-1">PUAN</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* REFERRAL & SHOP */}
            <div className="space-y-8">
               
               {/* Referral Link Widget */}
               <Card className="rounded-[3rem] border-white/10 bg-gradient-to-br from-[#0a0a0f] to-[#12121f] p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Users className="w-48 h-48" />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <h3 className="text-xl font-bold text-white flex items-center gap-3 italic underline">
                        ARAKADAŞINI DAVET ET
                     </h3>
                     <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                        Referans linkinizle kaydolan ve ilk paketini alan her eskort arkadaşınız için <strong className="text-amber-500">250 Puan</strong> kazanın.
                     </p>
                     
                     <div className="flex gap-2 p-2 rounded-2xl bg-black/40 border border-white/10">
                        <code className="flex-1 px-4 py-3 text-xs font-mono text-gold-400 truncate">
                           https://zuhreplanet.com/ref/elara-pro
                        </code>
                        <button 
                          onClick={handleCopyLink}
                          className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-gray-200 transition-colors"
                        >
                           KOPYALA
                        </button>
                     </div>
                  </div>
               </Card>

               {/* Use Points (Shop Teaser) */}
               <Card className="rounded-[3rem] border-white/10 bg-[#0a0a0f] p-10 flex items-center justify-between group">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-white italic">Puanlarımı Nasıl Kullanırım?</h3>
                     </div>
                     <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                        Kazanılan puanları Pro Mağaza'daki tüm ürünlerde (Diamond Paket, Boost vb.) indirim olarak kullanabilirsiniz.
                     </p>
                     <div className="pt-4 flex items-center gap-4 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                        <span>100 PUAN = ₺10 İNDİRİM</span>
                        <Info className="w-3 h-3 text-gray-600" />
                     </div>
                  </div>
                  <Link href="/dashboard/store">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500 transition-all group-hover:rotate-12">
                       <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </Link>
               </Card>

            </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <ChevronRight className={className} />
);
