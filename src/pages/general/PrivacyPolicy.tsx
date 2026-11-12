import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Lock, UserCheck, Database, Globe } from 'lucide-react';
import { SEOManager } from '@/components/SEOManager';

interface PrivacySectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string[];
  delay: number;
}

const PrivacySection = ({ icon: Icon, title, content, delay }: PrivacySectionProps) => (
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
            <UserCheck className="w-4 h-4 text-primary shrink-0" />
            {p}
         </p>
       ))}
    </div>
  </motion.div>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6">
      <SEOManager title="Zühre Planet - Gizlilik Politikası & Veri Güvenliği" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Gizlilik Denetimi & Protokolleri</span>
           </motion.div>

           <h1 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-12">
              VERİ <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">EMNİYETİ</span>
           </h1>
           
           <p className="max-w-2xl mx-auto text-sm font-black italic uppercase tracking-widest text-white/40 leading-relaxed">
              Kişisel mahremiyetiniz bizim için kutsaldır. <br /> 
              Verilerinizin nasıl saklandığı ve korunduğu hakkında şeffaf bilgilendirme.
           </p>
        </div>

        {/* Content Modules */}
        <div className="space-y-8">
           <PrivacySection 
             icon={Database} 
             title="VERİ TOPLAMA" 
             content={[
                "Üyelik esnasında sadece gerekli olan bilgileri topluyoruz. (İsim, e-posta, şehir, yaş).",
                "IP adresleriniz ve tarayıcı verileriniz sadece güvenlik denetimi ve saldırı tespiti için geçici olarak işlenir.",
                "Eskort profilleri için eklenen görseller, AI moderasyonumuz tarafından taranarak galaktik havuzda saklanır."
             ]}
             delay={0.1}
           />
           <PrivacySection 
             icon={Lock} 
             title="ŞİFRELEME TEKNOLOJİSİ" 
             content={[
                "Tüm kullanıcı verileri 256-bit uçtan uca şifreleme altındadır. Verileriniz transfer edilirken kimse tarafından okunamaz.",
                "Ödeme bilgileri PCI-DSS uyumlu lisanslı kuruluşlar tarafından işlenir; platformumuzda kredi kartı verisi saklanmaz.",
                "Hassas verileriniz sadece 'Cold Storage' (Soğuk Depo) ortamında tutulur."
             ]}
             delay={0.2}
           />
           <PrivacySection 
             icon={Globe} 
             title="ÜÇÜNCÜ TARAFLAR" 
             content={[
                "Verileriniz asla reklam veya pazarlama amacıyla başka şirketlere satılmaz.",
                "Sadece yasal zorunluluk hallerinde, yetkili mercilere KVKK kuralları çerçevesinde bilgi paylaşımı yapılabilir.",
                "Analiz araçlarımız (Google Analytics vb.) sadece anonimleşmiş verileri kullanır."
             ]}
             delay={0.3}
           />
        </div>

        {/* Closing Footer */}
        <div className="mt-20 p-16 rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-2xl text-center">
           <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">GİZLİLİK TAAHHÜDÜ</h4>
           <p className="text-[9px] font-black italic uppercase tracking-[0.4em] text-white/20 mb-8">VERİLERİNİZ BİZİMLE GÜVENDE. GALAXY'DE GİZLİLİK ESASTIR.</p>
           <button className="h-14 px-12 bg-primary/20 border border-primary/30 text-primary font-black italic uppercase text-[10px] tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg">
              AYARLARI YÖNET
           </button>
        </div>
      </div>
    </div>
  );
}
