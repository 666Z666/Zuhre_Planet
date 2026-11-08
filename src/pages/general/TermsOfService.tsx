import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Gavel, ShieldCheck, AlertCircle, Sparkles, Scale, Info, CheckCircle } from 'lucide-react';
import { SEOManager } from '@/components/SEOManager';

const TermSection = ({ icon: Icon, title, content, delay }: any) => (
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

export default function TermsOfService() {
  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6">
      <SEOManager title="Zühre Planet - Kullanım Koşulları & Sözleşme" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Gavel className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Hukuki Sözleşme & Şartlar</span>
           </motion.div>

           <h1 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-12">
              KULLANIM <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">ŞARTLARI</span>
           </h1>
           
           <p className="max-w-2xl mx-auto text-sm font-black italic uppercase tracking-widest text-white/40 leading-relaxed">
              Zühre Planet platformunu kullanarak kabul ettiğiniz <br /> 
              galaktik hizmet şartları ve üyelik yükümlülükleri.
           </p>
        </div>

        {/* Content Modules */}
        <div className="space-y-8">
           <TermSection 
             icon={Info} 
             title="GENEL HÜKÜMLER" 
             content={[
                "Bu sözleşme, Zühre Planet platformuna üye olan tüm kullanıcılar (Eskort ve Müşteri) için geçerlidir.",
                "Platforma erişim sağlayarak 18 yaşından büyük olduğunuzu ve hukuki işlem yapma yetkisine sahip olduğunuzu beyan edersiniz.",
                "Zühre Planet, hizmet kalitesini artırmak adına dilediği zaman kullanım şartlarını güncelleme hakkını saklı tutar."
             ]}
             delay={0.1}
           />
           <TermSection 
             icon={ShieldCheck} 
             title="ÜYELİK VE GÜVENLİK" 
             content={[
                "Kullanıcılar, hesap bilgilerinin gizliliğinden bizzat sorumludur. Hesabınız üzerinden yapılan tüm işlemler sizin sorumluluğunuzdadır.",
                "Yanıltıcı bilgi veren veya başkasının kimliğini kullanan profiller, AI moderasyon sistemimiz tarafından kalıcı olarak engellenir.",
                "Bir kullanıcı sadece tek bir hesap açabilir; duplicate (kopya) hesaplar anında tespit edilir."
             ]}
             delay={0.2}
           />
           <TermSection 
             icon={Scale} 
             title="YÜKÜMLÜLÜKLER" 
             content={[
                "Üyeler, platform içindeki diğer kullanıcılara saygılı davranmakla yükümlüdür. Taciz, tehdit ve nefret söylemi platformdan ihraç sebebidir.",
                "Tüm ticari ve randevu anlaşmaları kullanıcıların kendi sorumluluğundadır; Zühre Planet taraflar arasındaki anlaşmazlıklardan sorumlu tutulamaz.",
                "Sadece platform içindeki güvenli ödeme ve iletişim kanalları tavsiye edilmektedir."
             ]}
             delay={0.3}
           />
        </div>

        {/* Alert Module */}
        <div className="mt-20 p-12 rounded-[3.5rem] bg-primary/10 border border-primary/20 backdrop-blur-3xl flex items-center gap-8 mb-32">
           <AlertCircle className="w-12 h-12 text-primary shrink-0" />
           <p className="text-xs font-black italic text-primary/60 uppercase tracking-widest leading-relaxed">
              İHLAL DURUMUNDA HESABINIZ DONDURULABİLİR VEYA VARSAYILAN TÜM SADAKAT PUANLARINIZ SİLİNEBİLİR. <br />
              LÜTFEN ELİT STANDARTLARIMIZA UYUM SAĞLAYIN.
           </p>
        </div>

        {/* Closing Footer */}
        <div className="p-16 rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-2xl text-center">
           <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">ONAY VE KABUL</h4>
           <p className="text-[9px] font-black italic uppercase tracking-[0.4em] text-white/20 mb-8">ÜYELİK OLUŞTURARAK TÜM ŞARTLARI KABUL ETMİŞ SAYILIRSINIZ.</p>
           <button className="h-14 px-12 bg-primary text-white font-black italic uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
              SÖZLEŞMEYİ ONAYLA
           </button>
        </div>
      </div>
    </div>
  );
}
