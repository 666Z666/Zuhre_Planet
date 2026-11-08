import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Coins, 
  Settings2, 
  Users, 
  ArrowUpRight, 
  History, 
  ShieldCheck, 
  Plus,
  Minus,
  Save,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

export const EconomyTab = () => {
  const [conversionRate, setConversionRate] = useState([10]); // 100 pts = 10 TL
  const [referralBonus, setReferralBonus] = useState(500);
  const [bookingBonus, setBookingBonus] = useState(200);

  const handleSave = () => {
    toast.success('Ekonomi ayarları güncellendi.');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="space-y-2">
            <h2 className="text-3xl font-black font-orbitron text-white flex items-center gap-3">
               <Trophy className="w-8 h-8 text-amber-500" />
               SADAKAT & EKONOMİ SİSTEMİ
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-black italic">Platform Puan ve Referans Dinamikleri</p>
         </div>
         <Button onClick={handleSave} className="h-14 px-10 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-widest italic shadow-xl shadow-amber-600/20">
            DEĞİŞİKLİKLERİ KAYDET <Save className="w-4 h-4 ml-2" />
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* CONVERSION CONTROL */}
         <Card className="lg:col-span-2 border-white/5 bg-black/40 backdrop-blur-xl rounded-[3rem] p-10 space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                     <Coins className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-white italic">DÖNÜŞÜM ORANI</h3>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">100 PUANIN TL KARŞILIĞI</p>
                  </div>
               </div>
               <div className="text-4xl font-black text-amber-500 italic">₺{conversionRate[0]}</div>
            </div>

            <div className="space-y-6">
               <Slider 
                 value={conversionRate} 
                 onValueChange={setConversionRate} 
                 max={100} 
                 step={1} 
                 className="[&_[role=slider]]:bg-amber-500 [&_[role=slider]]:border-amber-500"
               />
               <div className="flex justify-between text-[10px] font-black text-gray-700 uppercase tracking-widest">
                  <span>₺1</span>
                  <span>₺50</span>
                  <span>₺100</span>
               </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 italic shrink-0">
               <Info className="w-5 h-5 text-amber-500/50" />
               <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold tracking-widest">
                 Dönüşüm oranını değiştirmek, tüm kullanıcıların cüzdanlarındaki puanların alım gücünü anlık olarak etkiler. Dikkatli güncelleyin.
               </p>
            </div>
         </Card>

         {/* QUICK STATS */}
         <div className="space-y-6">
            <StatSmall label="DOLAŞIMDAKİ TOPLAM PUAN" value="1.2M" icon={ArrowUpRight} />
            <StatSmall label="BU AY KAZANILAN" value="450K" icon={Plus} />
            <StatSmall label="KULLANILAN (HARCANAN)" value="120K" icon={Minus} />
         </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         {/* POINT REWARDS CONFIG */}
         <Card className="border-white/5 bg-black/40 backdrop-blur-xl rounded-[3rem] p-10 space-y-8">
            <h3 className="text-lg font-black text-white italic flex items-center gap-3">
               <Settings2 className="w-5 h-5 text-gray-400" /> ÖDÜL AYARLARI
            </h3>
            
            <div className="space-y-6">
               <RewardItem 
                 label="REFERANS BONUSU" 
                 description="Yeni üye getirene verilecek puan" 
                 value={referralBonus} 
                 setValue={setReferralBonus} 
               />
               <RewardItem 
                 label="RANDEVU PUANI" 
                 description="Gerçekleşen her başarılı görüşme" 
                 value={bookingBonus} 
                 setValue={setBookingBonus} 
               />
            </div>
         </Card>

         {/* USER POINT MANAGEMENT */}
         <Card className="border-white/5 bg-black/40 backdrop-blur-xl rounded-[3rem] p-10 space-y-8">
            <h3 className="text-lg font-black text-white italic flex items-center gap-3">
               <Users className="w-5 h-5 text-gray-400" /> MANUEL PUAN MÜDAHALESİ
            </h3>
            
            <div className="space-y-4">
               <Input placeholder="Kullanıcı E-posta veya ID..." className="h-14 rounded-2xl bg-black border-white/10" />
               <div className="flex gap-4">
                  <Input type="number" placeholder="Miktar" className="h-14 rounded-2xl bg-black border-white/10 flex-1" />
                  <Button variant="default" className="h-14 px-8 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black italic">EKLE</Button>
               </div>
            </div>

            <div className="pt-4 flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-widest italic underline decoration-white/10">
               <History className="w-3 h-3" /> SON İŞLEMLERİ GÖRÜNTÜLE
            </div>
         </Card>

      </div>

    </div>
  );
};

const RewardItem = ({ label, description, value, setValue }: any) => (
  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group transition-all hover:bg-white/10">
     <div>
        <p className="text-xs font-black text-white italic uppercase tracking-tighter">{label}</p>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{description}</p>
     </div>
     <div className="flex items-center gap-4">
        <Input 
          type="number" 
          value={value} 
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="w-24 h-10 bg-black border-white/10 text-right font-black text-amber-500 italic" 
        />
        <span className="text-[10px] font-black text-gray-700 italic">PTS</span>
     </div>
  </div>
);

const StatSmall = ({ label, value, icon: Icon }: any) => (
  <Card className="bg-white/5 border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
     <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">{label}</p>
        <h4 className="text-3xl font-black text-white italic">{value}</h4>
     </div>
     <Icon className="absolute top-1/2 -translate-y-1/2 right-6 w-12 h-12 text-white/5 group-hover:scale-110 transition-transform duration-500" />
  </Card>
);
