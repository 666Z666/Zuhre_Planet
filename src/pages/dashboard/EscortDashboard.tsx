/**
 * Escort Main Dashboard
 * 
 * Kullanıcının ana kontrol paneli.
 * Özet istatistikler, bildirimler ve hızlı erişim menüleri.
 */

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Eye, Heart, MousePointerClick, TrendingUp,
  AlertCircle, ChevronRight, Zap, Lock, Unlock, DollarSign
} from 'lucide-react';
import { Link } from 'wouter';

import { ProfileHealthWidget } from '@/components/dashboard/ProfileHealthWidget';
import { NebulaProgress } from '@/components/ui/NebulaProgress';
import { HolographicBadge } from '@/components/ui/HolographicBadge';

export default function EscortDashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- HOŞ GELDİNİZ MESAJI --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">KOMUTA <span className="text-primary italic">MERKEZİ</span></h1>
               <HolographicBadge label="PULSAR ELITE" color="gold" icon={<Zap size={12} className="text-amber-400" />} />
            </div>
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">ELARA — GALAKTİK SİCİL: ZP-99-X</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {/* NEW: COSMIC LIVE TOGGLE (Phase 5) */}
            <div className="group relative flex items-center gap-4 bg-black/40 border border-white/10 px-6 py-3 rounded-2xl hover:border-primary/50 transition-all cursor-pointer overflow-hidden backdrop-blur-xl">
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute inset-0 opacity-40" />
                    <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_#d4af37] relative z-10" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-white uppercase tracking-widest italic leading-none">COSMIC LIVE</div>
                    <div className="text-[7px] font-black text-gray-500 uppercase tracking-widest mt-1">OFFLINE</div>
                  </div>
               </div>
               <div className="w-10 h-5 bg-white/5 rounded-full border border-white/10 relative transition-colors group-hover:bg-primary/20">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-gray-600 rounded-full transition-all group-hover:bg-white group-hover:translate-x-5" />
               </div>
            </div>

            <Link href="/dashboard/store">
              <button className="px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                <Zap className="w-4 h-4" /> Pro Mağaza
              </button>
            </Link>
            <Link href="/dashboard/profile">
              <button className="px-6 py-3 rounded-xl bg-gold-600/20 hover:bg-gold-600/30 text-gold-300 border border-gold-500/30 transition-all font-medium">
                Profili Düzenle
              </button>
            </Link>
          </div>
        </div>

        {/* --- NEBULA RANK & PROGRESS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="lg:col-span-8">
              <NebulaProgress 
                value={88} 
                label="BİR ÜST YÖRÜNGE: QUASAR LEGEND" 
                nextRank="QUASAR" 
                pointsToNext={1500} 
              />
           </div>
           <div className="lg:col-span-4 flex flex-col items-center justify-center border-l border-white/5 pl-8">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">MEVCUT BAKİYE</div>
              <div className="text-4xl font-black text-white italic">4,850 <span className="text-primary text-xl">NP</span></div>
           </div>
        </div>

        {/* --- GAMIFICATION WIDGET --- */}
        <ProfileHealthWidget
          score={65}
          missingItems={[
            { label: 'Tanıtım Videosu Ekle (+20 Puan)', href: '/dashboard/gallery' },
            { label: 'Biyografini Genişlet (+15 Puan)', href: '/dashboard/profile' }
          ]}
        />

        {/* --- İSTATİSTİK KARTLARI --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'PROFIL GÖRÜNTÜLENME', value: '12.4K', icon: Eye, color: 'text-primary', glow: 'shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]', trend: '+12%' },
            { label: 'FAVORIYE EKLEME', value: '843', icon: Heart, color: 'text-gold-400', glow: 'shadow-[0_0_20px_rgba(217,70,239,0.2)]', trend: '+5%' },
            { label: 'MESAJ TRAFİĞİ', value: '128', icon: MousePointerClick, color: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]', trend: '+8%' },
            { label: 'ARZU DÖNÜŞÜMÜ', value: '%4.2', icon: TrendingUp, color: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]', trend: '+1.2%' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-[#0a0a0f]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-white/20 transition-all ${stat.glow}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-green-400 italic tracking-widest">
                  {stat.trend} ↑
                </span>
              </div>
              <div className="text-4xl font-black text-white mb-2 tracking-tighter italic">{stat.value}</div>
              <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
              
              {/* Scanline Effect */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-[-200%] transition-transform duration-1000" />
            </div>
          ))}
        </div>

        {/* --- BİLDİRİMLER & DURUM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sol: Bekleyen Onaylar ve Randevular */}
          <div className="lg:col-span-2 space-y-6">

            {/* YENİ: Gelen Randevu Talepleri */}

            {/* YENİ: The Vault - Özel Arşiv Yönetimi */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Lock className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">THE <span className="text-primary italic">VAULT</span> YÖNETİMİ</h3>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">ÖZEL İÇERİK EKONOMİSİ</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">VAULT KAZANCI</div>
                     <div className="text-2xl font-black text-white italic">12,500 <span className="text-primary">NP</span></div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group/item hover:border-primary/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden border border-white/5 opacity-40">
                           <img src="/brand/placeholders/portrait-5.svg" alt="Vault item" className="w-full h-full object-cover blur-sm" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-white">Özel Çekim #1</div>
                           <div className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">1,200 NP • 42 SATIŞ</div>
                        </div>
                     </div>
                     <Unlock className="w-4 h-4 text-gray-600 group-hover/item:text-primary transition-colors" />
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group/item hover:border-primary/30 transition-all border-dashed">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                           <Lock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-gray-500 italic">YENİ İÇERİK KİLİTLE</div>
                           <div className="text-[9px] text-gray-700 font-black uppercase tracking-widest mt-1">NP FİYATI BELİRLE</div>
                        </div>
                     </div>
                     <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:scale-110 transition-transform">EKLE</button>
                  </div>
               </div>
            </div>

            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Sistem Durumu
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Biyografi Güncellemesi</h4>
                    <p className="text-sm text-gray-400">Admin onayı bekleniyor. Tahmini süre: 2 saat.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                    Bekliyor
                  </span>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20 opacity-60">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Yeni Fotoğraf Yüklemesi</h4>
                    <p className="text-sm text-gray-400">3 adet fotoğraf onaylandı ve yayına alındı.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                    Onaylandı
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: İpuçları */}
          <div className="bg-gradient-to-br from-gold-900/20 to-blue-900/20 border border-white/10 rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Profil İpuçları 🚀</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Profil doluluk oranınız %85. Daha fazla görüntülenme almak için bir tanıtım videosu eklemeyi düşünün.
            </p>
            <Link href="/dashboard/gallery">
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center justify-center gap-2 group">
                Video Ekle
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
