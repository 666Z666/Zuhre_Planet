import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, CheckCircle, Fingerprint, Scale } from 'lucide-react';
import { SEOManager } from '@/components/SEOManager';

interface DocSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  content: string[];
  delay: number;
}

const DocSection = ({ icon: Icon, title, content, delay }: DocSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="p-10 rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all mb-8"
  >
    <div className="flex items-center gap-6 mb-8 underline-offset-8 decoration-primary/30">
       <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
       </div>
       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
    </div>
    <div className="space-y-4 text-xs font-black italic uppercase tracking-widest text-white/30 leading-loose group-hover:text-white/60 transition-colors">
       {content.map((p: string, i: number) => (
         <p key={i} className="flex gap-4">
            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            {p}
         </p>
       ))}
    </div>
  </motion.div>
);

export default function KVKK() {
  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6">
      <SEOManager title="Zühre Planet - KVKK & Veri Politikası" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Scale className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Hukuki Uyumluluk & KVKK</span>
           </motion.div>

           <h1 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-12">
              VERİ <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">GİZLİLİĞİ</span>
           </h1>
           
           <p className="max-w-2xl mx-auto text-sm font-black italic uppercase tracking-widest text-white/40 leading-relaxed">
              6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında <br /> 
              bilgilendirme ve galaktik veri güvenliği protokollerimiz.
           </p>
        </div>

        {/* Content Modules */}
        <div className="space-y-8">
           <DocSection 
             icon={Fingerprint} 
             title="VERİ SORUMLUSU" 
             desc="Sistemin kalbinde verileriniz güvende." 
             content={[
                "Zühre Planet Galactic Net (bundan sonra 'Şirket' olarak anılacaktır), kişisel verilerinizin işlenmesinde ve güvenliğinde en yüksek standartları taahhüt eder.",
                "Veri sorumlusu olarak kimliğimiz ve iletişim bilgilerimiz şeffaf bir şekilde admin panelimizde yer almaktadır."
             ]}
             delay={0.1}
           />
           <DocSection 
             icon={Eye} 
             title="İŞLEME AMAÇLARI" 
             content={[
                "Üyelik işlemlerinin yapılması ve platform hizmetlerinin sunulması.",
                "Kullanıcı deneyiminin analizi (3D etkileşimler ve tercih algoritmaları).",
                "Dolandırıcılık tespiti ve AI destekli görsel doğrulama süreçleri.",
                "VIP paketlerin yönetimi ve faturalandırma operasyonları."
             ]}
             delay={0.2}
           />
           <DocSection 
             icon={Lock} 
             title="AKTİF KORUMA" 
             content={[
                "Tüm kişisel verileriniz 256-bit AES şifreleme ile soğuk depolarda korunmaktadır.",
                "Kullanıcı mesajları uçtan uca şifreli olup, server tarafında metin olarak saklanmaz.",
                "Verilerinize sadece yetkilendirilmiş Galaktik Güvenlik birimi sınırlı erişim sağlar."
             ]}
             delay={0.3}
           />
        </div>

        {/* Closing Footer */}
        <div className="mt-32 p-16 rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-2xl text-center">
           <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">GÜNCELLEME NOTU</h4>
           <p className="text-[9px] font-black italic uppercase tracking-[0.4em] text-white/20 mb-8">BU BELGE EN SON 05 NİSAN 2026 TARİHİNDE GÜNCELLENMİŞTİR.</p>
           <button className="h-14 px-12 bg-white/5 border border-white/10 text-white font-black italic uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all">
              TAM METNİ İNDİR (PDF)
           </button>
        </div>
      </div>
    </div>
  );
}
