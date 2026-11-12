import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Sparkles, Globe, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { SEOManager } from '@/components/SEOManager';
import { Footer } from '@/components/Footer';

interface ValueCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  delay: number;
}

const ValueCard = ({ icon: Icon, title, desc, delay }: ValueCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="p-10 rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all duration-500"
  >
    <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
      <Icon className="w-8 h-8 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" />
    </div>
    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-sm font-black italic text-white/30 uppercase tracking-widest leading-relaxed">{desc}</p>
  </motion.div>
);

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6 overflow-hidden">
      <SEOManager title="Zühre Planet - Hakkımızda & Vizyonumuz" />

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Hakkımızda & Hikayemiz</span>
           </motion.div>

           <h1 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-12">
              BİZ KİMİZ? <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">GALAXY</span> <br />
              YARATICILARI
           </h1>
           
           <p className="max-w-3xl mx-auto text-lg font-black italic uppercase tracking-widest text-white/40 leading-relaxed">
              Zühre Planet, 2026 yılında geleceğin lüks gece hayatını inşa etmek <br /> 
              ve üyelik deneyimini galaktik bir boyuta taşımak amacıyla kuruldu.
           </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-48">
           <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
           >
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">MİSYONUMUZ</h2>
              <p className="text-sm font-black italic uppercase tracking-[0.2em] text-white/40 leading-loose">
                 Klasik ilan dizinlerini geride bırakarak; modern vitrin tasarımı, içerik moderasyonu ve şeffaf doğrulama ilkeleriyle bağımsız ilan sahipleri ve ziyaretçiler için düzenli bir keşif alanı sunuyoruz. Zühre Planet yalnızca ilan ve doğrudan iletişim alanı sağlar; randevu veya ödeme aracılığı yapmaz.
              </p>
              <div className="flex gap-8">
                 <div>
                    <div className="text-4xl font-black text-primary italic tracking-tighter">81 İL</div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">ŞEHİR & İLÇE DİZİNİ</div>
                 </div>
                 <div>
                    <div className="text-4xl font-black text-secondary italic tracking-tighter">18+</div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">MODERASYONLU VİTRİN</div>
                 </div>
              </div>
           </motion.div>
           
           <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[4rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative aspect-square rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-3xl transform rotate-3 flex items-center justify-center group-hover:rotate-0 transition-transform duration-1000">
                 <Globe className="w-32 h-32 text-primary/40 animate-pulse-slow" />
              </div>
           </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-48">
           <ValueCard 
             icon={Shield} 
             title="GİZLİLİK & SINIRLAR" 
             desc="Kişisel verilerin korunması, açık rıza kuralları ve moderasyon denetimi ile güvenli bir ilan ortamı." 
             delay={0.1}
           />
           <ValueCard 
             icon={Zap} 
             title="DOĞRUDAN ERİŞİM" 
             desc="Aracı olmadan, ilan sahibinin paylaştığı iletişim kanalları üzerinden doğrudan bağlantı imkânı." 
             delay={0.2}
           />
           <ValueCard 
             icon={Award} 
             title="ŞEFFAF DOĞRULAMA" 
             desc="Doğrulama rozetleri satın alınamaz; yalnızca moderasyon incelemesini geçen profillere verilir." 
             delay={0.3}
           />
        </div>

        {/* Vision Footer */}
        <div className="p-20 rounded-[5rem] bg-white/5 border border-white/5 backdrop-blur-3xl text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
           <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-8">
              GELECEĞİN <span className="text-primary">PARÇASI</span> OLUN
           </h2>
           <p className="max-w-2xl mx-auto text-sm font-black italic uppercase tracking-widest text-white/30 mb-12">
              Zühre Planet sadece bir isim değil, bir yaşam tarzı ve lüksün yeni tanımıdır. <br />
              Sınırların ötesindeki galaksimize davetlisiniz.
           </p>
           <button
             onClick={() => setLocation('/catalog')}
             className="h-20 px-16 bg-primary text-white font-black italic uppercase text-xs tracking-[0.4em] rounded-[2rem] hover:scale-105 transition-all shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]"
           >
              ŞİMDİ KEŞFET
           </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
