import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, AlertTriangle, Fingerprint } from 'lucide-react';
import { useLocation } from 'wouter';
import { SEOManager } from '@/components/SEOManager';
import { Footer } from '@/components/Footer';

interface SafetyModuleProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  points: string[];
  delay: number;
}

const SafetyModule = ({ icon: Icon, title, desc, points, delay }: SafetyModuleProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="p-6 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all duration-700"
  >
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6 sm:mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform">
      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]" />
    </div>
    <h3 className="text-xl sm:text-3xl font-black text-white italic uppercase tracking-tighter mb-4 sm:mb-6">{title}</h3>
    <p className="text-xs sm:text-sm font-black italic text-white/40 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed mb-6 sm:mb-8">{desc}</p>
    
    <div className="space-y-3 sm:space-y-4">
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
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative w-full pt-28 md:pt-48 pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden">
      <SEOManager title="Zühre Planet - Güvenlik Protokolleri & Gizlilik" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-40">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-6 md:mb-8 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/50 italic">Galaktik Güvenlik Ağı</span>
           </motion.div>

           <h1 className="text-4xl sm:text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-8 md:mb-12">
              KUSURSUZ <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">KORUMA</span>
           </h1>
           
           <p className="max-w-3xl mx-auto text-xs sm:text-base md:text-lg font-black italic uppercase tracking-widest text-white/50 leading-relaxed">
              Zühre Planet'te gizlilik bir seçenek değil, <br className="hidden sm:inline" /> 
              temel bir haktır. En ileri protokollerle yanınızdayız.
           </p>
        </div>

        {/* Core Security Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20 md:mb-48">
           <SafetyModule 
             icon={Fingerprint} 
             title="GÖRSEL & PROFİL DENETİMİ" 
             desc="Yüklenen her profil fotoğrafı ve açıklama moderasyon ekibimiz tarafından incelenir." 
             points={['Manuel Moderasyon Onayı', 'Görsel Bütünlük ve Rıza Kontrolü', 'Sahte ve Kopya İlan Engelleme']}
             delay={0.1}
           />
           <SafetyModule 
             icon={Lock} 
             title="VERİ & İLETİŞİM GÜVENLİĞİ" 
             desc="İletişim numaraları ham sayfada açık tutulmaz; yalnızca kullanıcı aksiyonuyla güvenli biçimde açılır." 
             points={['HTTPS / TLS Bağlantı Güvenliği', 'Kötüye Kullanım ve Hız Sınırı (Rate Limit)', 'Üçüncü Taraflarla Paylaşılmayan Kayıtlar']}
             delay={0.2}
           />
        </div>

        {/* Visual Reminder (Caution) */}
        <div className="p-6 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[5rem] bg-amber-500/10 border border-amber-500/20 backdrop-blur-3xl flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-20 md:mb-48 text-center md:text-left">
           <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-black" />
           </div>
           <div>
              <h4 className="text-xl sm:text-2xl font-black text-amber-500 italic uppercase tracking-tighter mb-2">DİKKAT EDİLMESİ GEREKENLER</h4>
              <p className="text-xs sm:text-sm font-black italic text-amber-500/60 uppercase tracking-widest leading-relaxed">
                 Görüşme öncesi kapora veya ön ödeme talep eden kişilere itibar etmeyiniz. Zühre Planet randevu ücreti tahsil etmez. <br className="hidden sm:inline" />
                 Şüpheli bir durumla karşılaştığınızda Destek ve İletişim merkezimiz üzerinden bildirimde bulunun.
              </p>
           </div>
        </div>

        {/* Support CTA */}
        <div className="text-center">
           <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-white mb-6 sm:mb-10">GÜVENDE HİSSEDİN</h2>
           <button
             onClick={() => setLocation('/support')}
             className="w-full sm:w-auto h-14 sm:h-20 px-8 sm:px-16 bg-white text-black font-black italic uppercase text-xs tracking-[0.25em] sm:tracking-[0.4em] rounded-2xl sm:rounded-[2rem] hover:bg-primary hover:text-white transition-all shadow-2xl"
           >
              DESTEK MERKEZİNE BAĞLAN
           </button>
           <p className="mt-8 text-[9px] font-black italic uppercase tracking-widest text-white/20">© 2026 ZÜHRE PLANET — GÜVENLİK DEPARTMANI</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
