import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Zap,
  Award
} from 'lucide-react';
import { useLocation } from 'wouter';
import { SEOManager } from '@/components/SEOManager';
import { Footer } from '@/components/Footer';

interface StepCardProps {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  delay: number;
}

const StepCard = ({ number, icon: Icon, title, desc, delay }: StepCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: Number(number) % 2 === 0 ? 50 : -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 1, ease: "circOut" }}
    className="relative p-12 rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all mb-12 last:mb-0"
  >
    <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-black italic shadow-2xl shadow-primary/30 z-20">
       {number}
    </div>
    
    <div className="flex flex-col md:flex-row items-center gap-12">
       <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
          <Icon className="w-12 h-12 text-primary" />
       </div>
       <div className="text-center md:text-left flex-1">
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">{title}</h3>
          <p className="text-sm font-black italic text-white/30 uppercase tracking-[0.2em] leading-loose">{desc}</p>
       </div>
    </div>
  </motion.div>
);

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6">
      <SEOManager title="Zühre Planet - Nasıl Çalışır? | Kullanım Kılavuzu" />

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Hızlı Başlangıç Rehberi</span>
           </motion.div>

           <h1 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-12">
              NASIL <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">ÇALIŞIR?</span>
           </h1>

           <p className="max-w-2xl mx-auto text-sm font-black italic uppercase tracking-[0.3em] text-white/40 leading-relaxed">
              Zühre Planet'in elit dünyasına katılmak ve deneyiminizi <br /> 
              maksimuma çıkarmak için 4 basit adım.
           </p>
        </div>

        {/* Steps List */}
        <div className="space-y-24 relative">
           {/* Connecting Line */}
           <div className="absolute left-1/2 top-40 bottom-40 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden md:block" />

           <StepCard 
             number="01" 
             icon={UserPlus} 
             title="HESABINIZI OLUŞTURUN" 
             desc="Dakikalar içinde ücretsiz kayıt olun. İlan sahipleri için görsel doğrulama sürecini tamamlayarak 'Onaylı' rozetini kazanın." 
             delay={0.1}
           />
           <StepCard 
             number="02" 
             icon={Search} 
             title="KATALOĞU KEŞFEDİN" 
             desc="Gelişmiş filtreleme sistemimiz ile şehir, ilçe, yaş, doğrulama durumu ve aktiflik bazlı arama yapın." 
             delay={0.2}
           />
           <StepCard 
             number="03" 
             icon={MessageCircle} 
             title="DOĞRUDAN İLETİŞİM" 
             desc="İlan sayfasındaki Telefon veya WhatsApp bağlantılarıyla aracı olmadan doğrudan ilan sahibiyle iletişime geçin." 
             delay={0.3}
           />
           <StepCard 
             number="04" 
             icon={Award} 
             title="GERİ BİLDİRİM & FAVORİLER" 
             desc="Beğendiğiniz ilanları favorilerinize kaydedin ve moderasyon onaylı yorumlarla topluluk deneyimine katkıda bulunun." 
             delay={0.4}
           />
        </div>

        {/* Action CTA */}
        <div className="mt-48 p-20 rounded-[5rem] bg-white/5 border border-white/5 backdrop-blur-3xl text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-8">
              ŞİMDİ <span className="text-primary">HAZIRSINIZ</span>
           </h2>
           <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => setLocation('/register/client')}
                className="h-20 px-20 bg-primary text-white font-black italic uppercase text-xs tracking-[0.4em] rounded-[2rem] hover:scale-105 transition-all shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]"
              >
                 ÜYE OL
              </button>
              <button
                onClick={() => setLocation('/catalog')}
                className="h-20 px-20 bg-white/5 border border-white/10 text-white font-black italic uppercase text-xs tracking-[0.4em] rounded-[2rem] hover:bg-white hover:text-black transition-all"
              >
                 KATALOG
              </button>
           </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
           {[
             { title: 'MANUEL DOĞRULAMA', icon: ShieldCheck },
             { title: 'MODERASYON DESTEĞİ', icon: Sparkles },
             { title: 'SADAKAT PUANLARI', icon: TrendingUp }
           ].map((b, i) => (
             <div key={i} className="p-10 rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-xl text-center group hover:bg-white/10 transition-colors">
                <b.icon className="w-10 h-10 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-black italic uppercase tracking-widest text-white/60">{b.title}</h4>
             </div>
           ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
