import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { 
  Eye, 
  Heart, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Home,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  ExternalLink,
  Sparkles,
  Camera,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LuxuryText } from '@/components/ui/LuxuryText';
import { SEO } from '@/pages/SEO';

// Mock Data (Real App would fetch from API)
const mockStats = {
  views: 1240,
  favorites: 85,
  averageRating: 4.9,
  totalBookings: 24,
  completionRate: '98%'
};

const mockEarnings = {
  thisMonth: 45200,
  lastMonth: 38500,
  pending: 1200
};

const mockEscortBookings = [
  { id: '1', customerName: 'Yusuf K.', date: 'Today, 18:30', status: 'upcoming', service: 'VIP Dinner escorting', rate: 2500 },
  { id: '2', customerName: 'Can T.', date: 'Tomorrow, 20:00', status: 'upcoming', service: 'Sensual Massage', rate: 1800 },
  { id: '3', customerName: 'Murat B.', date: 'Yesterday', status: 'completed', service: 'Travel Companion', rate: 12000 },
];

export default function EscortPrivateDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [_activeQuickTab, _setActiveQuickTab] = useState('bookings');

  // If user is not escort, handle or guard (Real app uses AuthGuard)
  const userWithProfile = user as { profile?: { id: string; displayName: string; membershipTier: string } } | null;
  const profile = userWithProfile?.profile || {
    id: '1',
    displayName: user?.name || "Yıldız Partner",
    membershipTier: 'platinum'
  };

  const stats = mockStats;
  const earnings = mockEarnings;

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'platinum': return <Sparkles className="w-5 h-5 text-slate-300" />;
      default: return <Star className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <SEO
        title={`Panel | ${profile.displayName} - Zühre Planet`}
        description="Escort portalınızı yönetin, istatistiklerinizi ve randevularınızı takip edin."
      />

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden lg:flex flex-col w-80 bg-black/40 border-r border-white/5 backdrop-blur-3xl sticky top-0 h-screen p-8">
           <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <LuxuryText className="text-xl font-black italic tracking-tighter uppercase text-shadow-premium">PANEL <span className="text-primary italic">Z</span></LuxuryText>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest italic">V5.0 Elite System</p>
              </div>
           </div>

           <nav className="space-y-2 flex-1">
              {[
                { label: 'GENEL BAKIŞ', icon: Home, active: true },
                { label: 'MESAJLAR', icon: MessageSquare, count: 5 },
                { label: 'RANDEVULAR', icon: Calendar },
                { label: 'GALERİ', icon: Camera },
                { label: 'ÜYELİK PLANI', icon: Zap },
                { label: 'AYARLAR', icon: Settings },
              ].map((item, idx) => (
                <button 
                  key={idx} 
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest italic">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{item.count}</span>
                  )}
                </button>
              ))}
           </nav>

           <div className="mt-auto pt-8 border-t border-white/5">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start gap-4 text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest italic">
                   <ExternalLink className="w-4 h-4" /> PLATFORMA DÖN
                </Button>
              </Link>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          
          {/* Header Bar */}
          <header className="px-6 md:px-12 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 bg-black/20 backdrop-blur-xl">
             <div>
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      {getTierIcon(profile.membershipTier)}
                   </div>
                   <Badge className="bg-blue-500/10 text-blue-400 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                      {profile.membershipTier.toUpperCase()} ÜYE
                   </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-shadow-premium">
                   HOŞ GELDİN, <span className="text-primary italic">{profile.displayName}</span> 💎
                </h1>
                <p className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-4 italic text-shadow-premium">Zühre Planet Kozmik Yönetim Paneli</p>
             </div>

             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                   <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic mb-1">CÜZDAN BAKİYESİ</div>
                   <div className="text-2xl font-black text-primary italic tracking-tighter">₺{earnings.thisMonth.toLocaleString()}</div>
                </div>
                <Button className="h-16 px-10 rounded-[2rem] bg-primary text-white font-black uppercase tracking-widest italic text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                   CÜZDAN PLANI
                </Button>
             </div>
          </header>

          <div className="p-6 md:p-12 space-y-12">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: 'GÖRÜNTÜLEME', value: stats.views, icon: Eye, trend: '+12%', color: 'from-blue-500/20 to-emerald-500/20' },
                 { label: 'FAVORİ', value: stats.favorites, icon: Heart, trend: '+5%', color: 'from-pink-500/20 to-rose-500/20' },
                 { label: 'RANDEVU', value: mockEscortBookings.length, icon: Calendar, trend: 'Stabil', color: 'from-emerald-500/20 to-teal-500/20' },
                 { label: 'PUAN', value: stats.averageRating, icon: Star, trend: 'Mükemmel', color: 'from-amber-500/20 to-orange-500/20' },
               ].map((kpi, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                   className={`glass-panel p-8 rounded-[2.5rem] border-none bg-gradient-to-br ${kpi.color} relative overflow-hidden group shadow-xl`}
                 >
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 group-hover:scale-110 transition-transform">
                             <kpi.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-[9px] font-black text-white/50 bg-white/10 px-3 py-1 rounded-full">{kpi.trend}</span>
                       </div>
                       <div className="text-4xl font-black text-white mb-2 tracking-tighter text-shadow-premium font-orbitron">{kpi.value}</div>
                       <div className="text-[10px] font-black text-white/60 uppercase tracking-widest italic text-shadow-premium">{kpi.label}</div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                 </motion.div>
               ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
               
               {/* Activity Feed / Bookings */}
               <div className="xl:col-span-2 space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black uppercase tracking-tighter italic text-shadow-premium">SON <span className="text-primary italic">ETKİNLİKLER</span></h2>
                     <Button variant="link" className="text-[10px] font-black text-primary uppercase tracking-widest">TÜMÜNÜ GÖR</Button>
                  </div>

                  <div className="space-y-4">
                     {mockEscortBookings.map((booking, idx) => (
                       <motion.div 
                         key={booking.id}
                         initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                         className="glass-panel p-6 rounded-[2rem] border-none flex items-center justify-between group hover:bg-white/5 transition-all"
                       >
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary text-xl shadow-inner shadow-primary/5 group-hover:bg-primary group-hover:text-white transition-colors">
                                {booking.customerName[0]}
                             </div>
                             <div>
                                <div className="text-lg font-black text-white text-shadow-sm uppercase italic">{booking.customerName}</div>
                                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2 mt-1 italic">
                                   <Clock className="w-3 h-3" /> {booking.date} • {booking.service}
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-xl font-black text-white text-shadow-premium font-orbitron">₺{booking.rate.toLocaleString()}</div>
                             <Badge className={`${booking.status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'} border-none text-[8px] font-black uppercase px-3 py-1 mt-2 tracking-widest italic shadow-sm`}>
                                {booking.status === 'upcoming' ? 'BEKLEYEN' : 'TAMAMLANDI'}
                             </Badge>
                          </div>
                       </motion.div>
                     ))}
                  </div>
               </div>

               {/* Right Column: Profile Status & Tips */}
               <div className="space-y-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter italic text-shadow-premium">SİSTEM <span className="text-primary italic">DURUMU</span></h2>
                  
                  <div className="glass-panel p-8 rounded-[3rem] border-none relative overflow-hidden space-y-8 shadow-2xl">
                     <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full border-8 border-primary/20 border-t-primary flex items-center justify-center mb-6 relative">
                           <span className="text-3xl font-black text-white text-shadow-premium font-orbitron">98%</span>
                           <div className="absolute -inset-4 rounded-full border border-white/5 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">PROFİL GÜCÜ</h3>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-4 italic">Profiliniz galakside parlıyor!</p>
                     </div>

                     <div className="space-y-3">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                           <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 italic">STRATEJİ</div>
                           <p className="text-[11px] font-bold text-white/80 leading-relaxed uppercase italic text-shadow-sm">Fiyatlarınızı akşam saatlerinde %10 artırmayı deneyin.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                           <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1 italic">ÖNERİ</div>
                           <p className="text-[11px] font-bold text-white/80 leading-relaxed uppercase italic text-shadow-sm">Yeni bir galeri albümü eklemek keşfedilebilirliği %25 artırır.</p>
                        </div>
                     </div>

                     <Button className="w-full h-16 rounded-[2rem] bg-emerald-600 text-white font-black uppercase tracking-widest italic text-[10px] shadow-lg shadow-emerald-500/20 group">
                        <Zap className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" /> VIP'E GEÇİN
                     </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                     <Button variant="outline" className="h-20 rounded-[2rem] border-white/10 bg-white/5 flex flex-col gap-1 items-center justify-center hover:bg-white/10 group">
                        <TrendingUp className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest italic">ANALİZ</span>
                     </Button>
                     <Button variant="outline" className="h-20 rounded-[2rem] border-white/10 bg-white/5 flex flex-col gap-1 items-center justify-center hover:bg-white/10 group">
                        <History className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest italic">GEÇMİŞ</span>
                     </Button>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Nav Overlay (simplified for dashboard) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 z-50">
        <div className="glass-panel border-white/10 rounded-[2.5rem] p-4 flex items-center justify-around shadow-2xl">
           <Home className="w-6 h-6 text-primary" onClick={() => setLocation('/escort/dashboard')} />
           <MessageSquare className="w-6 h-6 text-white/40" />
           <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center -translate-y-8 shadow-xl shadow-primary/40 border-4 border-[#0A0A0F]">
              <Zap className="w-6 h-6 text-white" />
           </div>
           <Calendar className="w-6 h-6 text-white/40" />
           <Settings className="w-6 h-6 text-white/40" />
        </div>
      </div>
    </div>
  );
}
