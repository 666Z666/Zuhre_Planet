import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  History, 
  ShieldCheck,
  Gift,
  ArrowRight
} from 'lucide-react';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HolographicBadge } from '@/components/ui/HolographicBadge';

const transactions = [
  { id: 'tx_1', type: 'vault_unlock', name: 'Ayşe Y. — Arşiv Kilidi', date: '10 Nisan, 14:20', amount: -250, status: 'Tamamlandı' },
  { id: 'tx_2', type: 'top_up', name: 'NP Yükleme (Paket: Pulsar)', date: '08 Nisan, 09:15', amount: 5000, status: 'Tamamlandı' },
  { id: 'tx_3', type: 'tip', name: 'Zeynep K. — Galaktik Bahşiş', date: '05 Nisan, 22:45', amount: -100, status: 'Tamamlandı' },
  { id: 'tx_4', type: 'reward', name: 'Günlük Giriş Ödülü', date: '01 Nisan, 00:01', amount: 50, status: 'Tamamlandı' },
];

export default function Wallet() {
  const balance = 4850;

  return (
    <CustomerDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        
        {/* WALLET HEADER / BALANCE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[3.5rem] bg-[#0a0a0f] border border-white/5 p-12 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-400/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 animate-pulse" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 w-full lg:w-auto">
              <HolographicBadge label="SHADOW-X FINANCIAL" color="magenta" className="mb-6" />
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-2 text-shadow-premium">NEBULA <span className="text-primary italic">CÜZDAN</span></h1>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-8 italic text-shadow-premium">GALAKTİK VARLIK YÖNETİM MERKEZİ</p>
              
              <div className="flex items-baseline gap-4">
                <span className="text-6xl md:text-8xl font-black text-white italic tracking-tighter text-shadow-premium">{balance.toLocaleString()}</span>
                <span className="text-2xl font-black text-primary italic uppercase tracking-widest text-shadow-premium">NP</span>
              </div>
            </div>

            {/* NEBULA PULSE CHART */}
            <div className="flex-1 w-full h-40 relative group/chart">
               <div className="absolute inset-x-0 bottom-0 h-[100%] bg-gradient-to-t from-primary/10 to-transparent rounded-2xl border-x border-b border-primary/20" />
               <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                  <defs>
                     <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                     </linearGradient>
                  </defs>
                  <motion.path
                    d="M0,100 L0,60 Q50,20 100,50 T200,40 T300,70 T400,30 L400,100 Z"
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                  />
                  <motion.path
                    d="M0,60 Q50,20 100,50 T200,40 T300,70 T400,30"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(var(--primary-rgb),0.8))' }}
                  />
                  {[100, 200, 300].map((x, i) => (
                    <motion.circle
                      key={i}
                      cx={x} cy={x === 100 ? 50 : x === 200 ? 40 : 70}
                      r="4"
                      fill="white"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    />
                  ))}
               </svg>
               <div className="absolute top-2 right-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-white/60 uppercase tracking-widest italic text-shadow-premium">NEBULA FLOW: STABLE</span>
               </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-64">
               <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-xs transition-all shadow-[0_15px_30_rgba(var(--primary-rgb),0.3)] gap-3 group">
                  <Zap className="w-4 h-4 group-hover:animate-bounce" /> NP YÜKLE
               </Button>
               <Button variant="outline" className="w-full h-16 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs gap-3">
                  <Gift className="w-4 h-4 text-emerald-400" /> KOD KULLAN
               </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-black text-white italic tracking-tight uppercase text-shadow-premium">İŞLEM GEÇMİŞİ</h2>
               </div>
               <Button variant="link" className="text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary">TÜMÜNÜ GÖR</Button>
            </div>
            
            <div className="space-y-3">
               {transactions.map((tx, i) => (
                 <motion.div
                   key={tx.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                 >
                   <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        tx.amount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'
                      }`}>
                         {tx.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm uppercase tracking-tight text-shadow-premium italic">{tx.name}</h4>
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mt-1 italic text-shadow-premium">{tx.date}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className={`text-lg font-black italic tracking-tighter ${tx.amount > 0 ? 'text-green-400' : 'text-white text-shadow-premium'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} NP
                      </div>
                      <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-1 italic">{tx.status}</div>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-3 px-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-black text-white italic tracking-tight uppercase text-shadow-premium">GÜVENLİK</h2>
             </div>
             
             <Card className="rounded-[2.5rem] bg-black/40 border-white/5 overflow-hidden group">
                <CardContent className="p-8 space-y-8">
                   <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest text-shadow-premium">SHADOW ENCRYPTION</h4>
                      <p className="text-[10px] text-white/70 leading-relaxed font-black uppercase tracking-wider italic text-shadow-premium">
                        Tüm finansal işlemleriniz military-grade Shadow-X protokolü ile şifrelenir. Ekstrenizde "Z.AI SERVICES" olarak görünür.
                      </p>
                   </div>
                   
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Banka Hesabı</span>
                         <span className="text-[9px] font-black text-green-400 uppercase tracking-widest italic">BAĞLI</span>
                      </div>
                      <div className="text-sm font-black text-white tracking-widest">**** **** **** 4492</div>
                   </div>

                   <Button variant="outline" className="w-full py-8 rounded-2xl border-white/10 hover:border-primary/50 text-[10px] font-black uppercase tracking-[0.2em] group italic">
                      ÖDEME YÖNTEMİ EKLE
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all" />
                   </Button>
                </CardContent>
             </Card>
          </div>

        </div>

      </div>
    </CustomerDashboardLayout>
  );
}
