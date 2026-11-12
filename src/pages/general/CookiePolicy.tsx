import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Shield, Settings, Info, CheckCircle } from 'lucide-react';
import { SEOManager } from '@/components/SEOManager';
import { Footer } from '@/components/Footer';

interface CookieSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string[];
  delay: number;
}

const CookieSection = ({ icon: Icon, title, content, delay }: CookieSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all mb-6 sm:mb-8"
  >
    <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 underline-offset-8 decoration-primary/30">
       <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
       </div>
       <h3 className="text-lg sm:text-2xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
    </div>
    <div className="space-y-4 text-xs font-black italic uppercase tracking-widest text-white/40 leading-loose group-hover:text-white/70 transition-colors">
       {content.map((p: string, i: number) => (
         <p key={i} className="flex gap-3 sm:gap-4">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
            {p}
         </p>
       ))}
    </div>
  </motion.div>
);

export default function CookiePolicy() {
  return (
    <div className="min-h-screen relative w-full pt-28 md:pt-48 pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden">
      <SEOManager title="Zühre Planet - Çerez Politikası & Kullanım Tercihleri" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-6 md:mb-8 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Cookie className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/50 italic">Çerez Denetimi & Deneyim</span>
           </motion.div>

           <h1 className="text-4xl sm:text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-8 md:mb-12">
              ÇEREZ <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">POLİTİKASI</span>
           </h1>
           
           <p className="max-w-2xl mx-auto text-xs sm:text-sm font-black italic uppercase tracking-widest text-white/50 leading-relaxed">
              Zühre Planet'in 3D ortamlarını ve kişiselleştirilmiş <br className="hidden sm:inline" /> 
              luxury deneyimlerini nasıl optimize ettiğimize dair şeffaf kılavuz.
           </p>
        </div>

        {/* Content Modules */}
        <div className="space-y-8">
           <CookieSection 
             icon={Info} 
             title="ÇEREZ NEDİR?" 
             content={[
                "Çerezler (Cookie), web sitemizi ziyaretiniz sırasında galaktik cihazınıza kaydedilen küçük metin dosyalarıdır.",
                "Tercihlerinizi hatırlamak, 3D sahneleri optimize etmek ve size özel VIP öneriler sunmak için kullanılırlar."
             ]}
             delay={0.1}
           />
           <CookieSection 
             icon={Settings} 
             title="KULLANIM AMAÇLARI" 
             content={[
                "Zorunlu Çerezler: Platformun stabil çalışması (Login, Güvenlik) için elzemdir.",
                "Analitik Çerezler: Trafiği ölçmek ve en popüler 3D temalarımızı tespit etmek için kullanılır.",
                "Kişiselleştirme: Favori ilanlarınızı ve dil tercihlerinizi hatırlamamızı sağlar."
             ]}
             delay={0.2}
           />
           <CookieSection 
             icon={Shield} 
             title="KONTROL SİZDE" 
             content={[
                "Tarayıcı ayarlarınız üzerinden çerez kullanımını dilediğiniz zaman sınırlandırabilirsiniz.",
                "Çerezleri tamamen devre dışı bırakmanız, 3D sahnelerin akıcılığını ve bazı lüks özellikleri kısıtlayabilir.",
                "Sistemimiz 'Do Not Track' (Beni İzleme) taleplerine saygı duyar."
             ]}
             delay={0.3}
           />
        </div>

        {/* Closing Footer */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-2xl text-center">
           <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">DENEYİM TERCİHLERİ</h4>
           <p className="text-[9px] font-black italic uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/30 mb-8">DAHA İYİ BİR GALAXY İÇİN ÇEREZLERİ ONURLANDIRIYORUZ.</p>
           <button className="w-full sm:w-auto h-14 px-8 sm:px-12 bg-primary text-white font-black italic uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
              ÇEREZ AYARLARINI AÇ
           </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
