import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, AlertTriangle, Fingerprint } from 'lucide-react';
import { SEOManager } from '@/components/SEOManager';

const SafetyModule = ({ icon: Icon, title, desc, points, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="p-12 rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all duration-700"
  >
    <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform">
      <Icon className="w-10 h-10 text-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]" />
    </div>
    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-6">{title}</h3>
    <p className="text-sm font-black italic text-white/30 uppercase tracking-[0.2em] leading-relaxed mb-8">{desc}</p>
    
    <div className="space-y-4">
       {points.map((p: string, i: number) => (
         <div key={i} className="flex items-center gap-3 text-xs font-black italic uppercase tracking-widest text-white/60">
            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            {p}
         </div>
       ))}
    </div>
  </motion.div>
);

export default function Safety() {
  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6">
      <SEOManager title="Zühre Planet - Güvenlik Protokolleri & Gizlilik" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-40">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Galaktik Güvenlik Ağı</span>
           </motion.div>

           <h1 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-12">
              KUSURSUZ <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">KORUMA</span>
           </h1>
           
           <p className="max-w-3xl mx-auto text-lg font-black italic uppercase tracking-widest text-white/40 leading-relaxed">
              Zühre Planet'te gizlilik bir seçenek değil, <br /> 
              temel bir haktır. En ileri protokollerle yanınızdayız.
           </p>
        </div>

        {/* Core Security Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-48">
           <SafetyModule 
             icon={Fingerprint} 
             title="YAPAY ZEKA DOĞRULAMA" 
             desc="Gelişmiş AI algoritmalarımız her profil fotoğrafını ve biyografiyi saniyeler içinde tarar." 
             points={['3D Yüz Karşılaştırma', 'Görsel Meta Veri Analizi', 'Sahte Profil Eliminasyonu']}
             delay={0.1}
           />
           <SafetyModule 
             icon={Lock} 
             title="KRİPTOLU İLETİŞİM" 
             desc="Mesajlaşmalarınız uçtan uca şifrelenir ve asla üçüncü taraflarla paylaşılmaz." 
             points={['256-bit AES Şifreleme', 'Kendi Kendini Silen Mesajlar', 'Ekran Görüntüsü Koruması']}
             delay={0.2}
           />
        </div>

        {/* Visual Reminder (Caution) */}
        <div className="p-16 rounded-[5rem] bg-amber-500/10 border border-amber-500/20 backdrop-blur-3xl flex flex-col md:flex-row items-center gap-12 mb-48">
           <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="w-12 h-12 text-black" />
           </div>
           <div>
              <h4 className="text-2xl font-black text-amber-500 italic uppercase tracking-tighter mb-2">DİKKAT EDİLMESİ GEREKENLER</h4>
              <p className="text-sm font-black italic text-amber-500/40 uppercase tracking-widest leading-relaxed">
                 Platform dışı ödemelerden kaçının. Sadece uygulama içindeki güvenli kanalları kullanın. <br />
                 Herhangi bir şüpheli durumda "Anında Raporlama" sistemimizi aktif edin.
              </p>
           </div>
        </div>

        {/* Support CTA */}
        <div className="text-center">
           <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-10">GÜVENDE HİSSEDİN</h2>
           <button className="h-20 px-16 bg-white text-black font-black italic uppercase text-xs tracking-[0.4em] rounded-[2rem] hover:bg-primary hover:text-white transition-all shadow-2xl">
              DESTEK MERKEZİNE BAĞLAN
           </button>
           <p className="mt-8 text-[9px] font-black italic uppercase tracking-widest text-white/20">© 2026 ZÜHRE PLANET — GÜVENLİK DEPARMANI</p>
        </div>
      </div>
    </div>
  );
}
