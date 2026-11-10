import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  AlertTriangle,
  User,
  Phone,
  Filter,
  Lock,
  EyeOff
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const mockReports = [
  { 
    id: 'r1', 
    customerName: 'Kaptan Yusuf', 
    customerPhone: '053x xxx xx 10',
    safetyRating: 5, 
    punctualityRating: 5, 
    communicationRating: 4, 
    isBlacklisted: false,
    privateNote: 'Çok saygılı ve dürüst bir beyefendi. Randevu tam zamanında gerçekleşti.',
    createdAt: '02 Nis 2026'
  },
  { 
    id: 'r2', 
    customerName: 'Ahmet Y.', 
    customerPhone: '054x xxx xx 22',
    safetyRating: 1, 
    punctualityRating: 2, 
    communicationRating: 1, 
    isBlacklisted: true,
    privateNote: 'Kaba konuşuyor ve randevuya gelmedi. Karalisteye alınmalı.',
    createdAt: '28 Mar 2026'
  }
];

export default function CustomerIntel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(mockReports);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const filtered = mockReports.filter(r => 
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.customerPhone.includes(searchQuery)
      );
      setResults(filtered);
      if (filtered.length === 0) toast.error('Kayıt bulunamadı!');
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                 </div>
                 <Badge variant="outline" className="text-red-500 border-red-500/30 uppercase text-[10px] font-black tracking-widest italic">GİZLİ İSTİHBARAT AĞI</Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-orbitron text-white uppercase tracking-tighter italic">
                MÜŞTERİ <span className="text-red-500 italic">İTİBAR</span> MERKEZİ
              </h1>
              <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
                 Bu panel sadece eskortlar içindir. Randevu öncesi müşterinin itibarını ve güvenlik raporlarını sorgulayın. <strong className="text-white">Müşteriler bu alanı göremez.</strong>
              </p>
           </div>
           
           <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 italic">
              <Lock className="w-5 h-5 text-gray-400" />
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">GÜVENLİ & ANONİM</div>
           </div>
        </div>

        {/* SEARCH SECTION */}
        <Card className="rounded-[3rem] border-white/10 bg-[#0a0a0f] p-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Search className="w-32 h-32" />
           </div>
           <form onSubmit={handleSearch} className="relative z-10 space-y-8 flex flex-col items-center max-w-2xl mx-auto">
              <div className="w-full relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600" />
                 <Input 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Müşteri adı veya telefon numarası sorgula..." 
                   className="h-20 pl-16 pr-6 rounded-[2rem] bg-black/60 border-white/10 text-white font-bold text-lg focus:border-red-500/40 transition-all placeholder:text-gray-700"
                 />
              </div>
              <Button 
                type="submit" 
                className="h-16 px-16 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] italic shadow-2xl shadow-red-600/20"
                disabled={isSearching}
              >
                {isSearching ? 'SORGULANIYOR...' : 'İTİBAR SORGULA'}
              </Button>
           </form>
        </Card>

        {/* RESULTS SECTION */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/30 italic">SORGULAMA SONUÇLARI</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                 <Filter className="w-4 h-4" /> FİLTRELE
              </div>
           </div>

           <AnimatePresence mode="popLayout">
              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {results.map((report) => (
                    <motion.div 
                      key={report.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-10 rounded-[3rem] border-2 transition-all relative overflow-hidden backdrop-blur-xl ${
                        report.isBlacklisted 
                        ? 'bg-red-600/10 border-red-500/30' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                       {report.isBlacklisted && (
                         <div className="absolute top-0 right-0 p-6">
                            <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                         </div>
                       )}

                       <div className="flex flex-col gap-8 relative z-10">
                          
                          <div className="flex items-center gap-6">
                             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${report.isBlacklisted ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-emerald-400'}`}>
                                <User className="w-8 h-8" />
                             </div>
                             <div>
                                <h4 className="text-xl font-black text-white italic">{report.customerName}</h4>
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase mt-1">
                                   <Phone className="w-3 h-3" /> {report.customerPhone}
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 italic uppercase text-[9px] font-black tracking-widest">
                             <IntelMetric label="GÜVENLİK" score={report.safetyRating} color="text-red-500" />
                             <IntelMetric label="DAKİKLİK" score={report.punctualityRating} color="text-amber-500" />
                             <IntelMetric label="İLETİŞİM" score={report.communicationRating} color="text-emerald-400" />
                          </div>

                          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                             <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase italic underline decoration-red-500/50">PLATFORM NOTLARI:</div>
                             <p className="text-gray-400 text-xs italic leading-relaxed">"{report.privateNote}"</p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{report.createdAt}</span>
                             <div className="flex items-center gap-2 text-[9px] font-black text-yellow-500/70 italic uppercase tracking-widest underline decoration-yellow-500/30">
                                RAPORU ŞİKAYET ET
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 p-12 glass-panel border-white/10 rounded-[4rem]">
                   <EyeOff className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                   <h4 className="text-xl font-black text-white italic underline mb-4">GÖRÜNÜR KAYIT YOK</h4>
                   <p className="text-gray-600 text-xs uppercase tracking-widest leading-relaxed">
                      Lütfen sorgulama kriterlerini kontrol edin veya bu müşteri için henüz bir rapor girilmemiş olabilir.
                   </p>
                </div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </DashboardLayout>
  );
}

function IntelMetric({ label, score, color }: { label: string, score: number, color: string }) {
   return (
    <div className="space-y-2">
       <span className="text-gray-500 block text-center">{label}</span>
       <div className="flex justify-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-1.5 rounded-full ${i < score ? color : 'bg-white/5 shadow-inner'}`} 
            />
          ))}
       </div>
    </div>
   );
}
