import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Gift, 
  ChevronRight,
  Trophy,
  Star,
  ShieldCheck,
  Loader2,
  Calendar,
  CreditCard,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemberCard } from '@/components/MemberCard';
import { toast } from 'sonner';
import { useLoyaltyStatus, useGenerateReferralCode } from '@/hooks/useLoyalty';
import { Footer } from '@/components/Footer';
import { StarryBackground } from '@/components/StarryBackground';
import { TrustScoreIndicator } from '@/components/ui/TrustScoreIndicator';

export default function LoyaltyDashboard() {
  const { data: loyaltyData, isLoading, error: _error } = useLoyaltyStatus();
  const _generateCode = useGenerateReferralCode();

  const referralCode = loyaltyData?.referralCode ?? 'GALAXY-VIP-777';
  const points = loyaltyData?.points ?? 4850;
  const rank = 'PULSAR ELITE';
  const progressPercent = 88;
  const nextRank = 'QUASAR LEGEND';
  const pointsToNextRank = 1500;
  const _rankColor = '#f59e0b'; // Gold for Pulsar

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://zuhreplanet.com/register?ref=${referralCode}`);
    toast.success('Referans linki kopyalandı!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <StarryBackground />

      <div className="relative z-10 pt-32 pb-32 container mx-auto px-6">
        
        {/* HERO STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
           
           {/* Tier & Card */}
           <div className="lg:col-span-4 space-y-8">
              <div className="flex flex-col">
                <h1 className="text-4xl font-black font-orbitron text-white italic">NEBULA <span className="text-primary">CORE</span></h1>
                <p className="text-gray-500 text-[10px] mt-2 font-black uppercase tracking-[0.4em]">GALAKTİK SADAKAT EKOSİSTEMİ</p>
              </div>
              
              <MemberCard 
                userName="Müşteri"
                memberId="ZP-ELITE-C"
                tier="gold"
                points={points}
                validUntil="12/26"
              />

              <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">MEVCUT RÜTBE</p>
                       <p className="text-2xl font-black text-white italic">{rank}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-amber-500/50" />
                 </div>
                 <div className="space-y-3">
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${progressPercent}%` }}
                         className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                       />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase tracking-widest">
                       <span>%{progressPercent} TAMAMLANDI</span>
                       <span className="text-amber-500">{pointsToNextRank} PUAN SONRA → {nextRank}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Stats Grid */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <LoyaltyStatCard label="TOPLAM PUAN" value={points} icon={Zap} color="text-yellow-400" bg="bg-yellow-500/10" />
                 <LoyaltyStatCard label="BAŞARILI RANDEVU" value="45" icon={Target} color="text-emerald-400" bg="bg-emerald-500/10" />
                 <div className="p-8 rounded-[3rem] bg-[#0a0a0f] border border-white/10 flex flex-col items-center justify-center gap-4">
                    <TrustScoreIndicator score={94} size="md" />
                 </div>
              </div>

              {/* Referral Widget */}
              <div className="relative p-12 rounded-[4rem] bg-gradient-to-r from-amber-900/40 via-yellow-900/20 to-amber-900/40 border border-amber-500/30 overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -mr-48 -mt-48" />
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                   <div className="space-y-4 text-center md:text-left">
                     <h2 className="text-4xl font-black font-orbitron uppercase tracking-tighter text-white">ARKADAŞINI GETİR</h2>
                     <p className="text-amber-100/60 font-medium leading-relaxed max-w-md">
                       Arkadaşlarını Galaxy'e davet et, <strong className="text-amber-400">100 Puan</strong> kazan. Onlar da ilk üyeliklerinde %20 indirim kazansın.
                     </p>
                   </div>
                   <div className="flex flex-col gap-4 w-full md:w-auto min-w-[300px]">
                      <div className="flex bg-black/60 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
                        <code className="flex-1 px-4 py-3 font-orbitron font-bold text-amber-500 tracking-widest text-sm">
                          {referralCode}
                        </code>
                        <button 
                          onClick={handleCopyReferral}
                          className="p-3 bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all font-black text-xs"
                        >
                          KOPYALA
                        </button>
                      </div>
                      <Button variant="outline" className="h-14 glass border-white/10 text-white font-bold rounded-2xl group hover:border-amber-500/50">
                        Detayları Gör <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* EARNING OPTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           
           {/* TASK LIST */}
           <div className="space-y-8">
              <h3 className="text-2xl font-black text-white italic underline underline-offset-8 decoration-amber-500/50">PUAN KAZANMA YOLLARI</h3>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { title: 'Başarılı Randevu', points: 50, icon: Calendar, desc: 'Görüşme gerçekleştikten sonra otomatik eklenir.' },
                   { title: 'TC & Telefon Doğrulama', points: 500, icon: ShieldCheck, desc: 'Güvenlik adımlarını tamamlayın.' },
                   { title: 'Profilini %100 Doldur', points: 200, icon: User, desc: 'Kendinizi tanıtın ve ilgi odağı olun.' },
                   { title: 'Üyelik Paketini Yenile', points: 300, icon: CreditCard, desc: 'Sadakatiniz ödüllendirilir.' }
                 ].map((task, i) => (
                   <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="p-5 rounded-2xl bg-white/5 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                            <task.icon className="w-7 h-7" />
                         </div>
                         <div>
                            <h4 className="font-bold text-lg text-white">{task.title}</h4>
                            <p className="text-xs text-gray-500">{task.desc}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-amber-500">+{task.points}</p>
                         <p className="text-[10px] font-black text-gray-700 uppercase">PUAN</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* REWARDS PREVIEW */}
           <div className="space-y-8">
              <h3 className="text-2xl font-black text-white italic underline underline-offset-8 decoration-emerald-500/50">ÖDÜL KATALOĞU</h3>
              <div className="p-12 rounded-[4rem] bg-[#0a0a0f] border border-white/10 relative overflow-hidden group h-full max-h-[500px]">
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
                 <div className="relative z-10 flex flex-col items-center justify-center text-center h-full space-y-8">
                    <Gift className="w-24 h-24 text-emerald-500 mb-4 animate-bounce" />
                    <div className="space-y-3">
                       <h4 className="text-2xl font-black text-white">PUANLARINIZI HARCAYIN</h4>
                       <p className="text-gray-500 text-sm max-w-sm">
                          Kazanılan puanları üyelik ödemelerinde indirim olarak kullanın veya özel etkinlik davetleri satın alın.
                       </p>
                    </div>
                    <div className="flex gap-4">
                       <span className="px-6 py-2 rounded-full bg-emerald-500 text-black font-black text-[10px] tracking-widest italic">100 PUAN = ₺10 İNDİRİM</span>
                    </div>
                    <Button className="w-full h-16 rounded-[2rem] bg-white/10 text-white font-black hover:bg-emerald-600 transition-all border border-white/10">
                       KATALOĞU AÇ
                    </Button>
                 </div>
              </div>
           </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}

interface LoyaltyStatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

function LoyaltyStatCard({ label, value, icon: Icon, color, bg }: LoyaltyStatCardProps) {
  return (
    <div className="p-10 rounded-[3rem] bg-[#0a0a0f] border border-white/10 group hover:border-white/20 transition-all">
       <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7" />
       </div>
       <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{label}</p>
       <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  );
}

const User = ({ className }: { className?: string }) => (
  <Star className={className} />
);
