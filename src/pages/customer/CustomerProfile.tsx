import React from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Star, 
  Calendar, 
  MapPin, 
  Award,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SEO } from '@/pages/SEO';

export default function CustomerProfile() {
  const { id } = useParams<{ id: string }>();

  // Mock data for the demonstration
  const customer = {
    id: id || '1',
    name: 'Yusuf K.',
    level: 'Elite Member',
    memberSince: 'Ocak 2024',
    location: 'İstanbul, Türkiye',
    totalBookings: 24,
    rating: 4.9,
    reliabilityScore: 98,
    badges: ['Eski Üye', 'Güvenilir', 'Cömert'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf'
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <SEO 
        title={`${customer.name} | Üye Profili - Zühre Planet`}
        description="Zühre Planet platformu üye profil detayları."
      />

      <div className="container mx-auto px-6 pt-32">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8 text-white/50 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Panellere Dön
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8 rounded-[2.5rem] border-none shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-emerald-600" />
              
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white/10 p-1 shadow-2xl relative">
                  <img 
                    src={customer.avatar} 
                    alt={customer.name} 
                    className="w-full h-full rounded-full object-cover bg-white/5" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white mb-1">
                {customer.name}
              </h2>
              <p className="text-sm text-blue-400 font-bold tracking-widest uppercase mb-4">
                {customer.level}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {customer.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="bg-white/5 text-[10px] uppercase font-black tracking-tighter px-3 py-1">
                    {badge}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{customer.totalBookings}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Randevu</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{customer.rating}</p>
                  <div className="flex justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Puan</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reliability Badge */}
            <Card className="glass-panel border-none rounded-[2rem] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black uppercase tracking-tighter text-white">Güven Skoru</span>
                </div>
                <span className="text-xl font-black text-amber-500">%{customer.reliabilityScore}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${customer.reliabilityScore}%` }} 
                />
              </div>
            </Card>
          </div>

          {/* Right Side: Account Details & History */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-10 rounded-[2.5rem] border-none shadow-2xl relative"
            >
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-500" /> HESAP BİLGİLERİ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Üyelik Tarihi</label>
                  <div className="flex items-center gap-4 text-white font-bold italic">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {customer.memberSince}'dan beri
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Konum</label>
                  <div className="flex items-center gap-4 text-white font-bold italic">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    {customer.location}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Doğrulama Durumu</label>
                  <div className="flex items-center gap-4 text-green-500 font-black italic">
                    <CheckCircle2 className="w-5 h-5" />
                    E-POSTA VE TELEFON DOĞRULANMIŞ
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Son Aktivite</label>
                  <div className="flex items-center gap-4 text-white/70 font-bold italic">
                    <Clock className="w-5 h-5 text-blue-500" />
                    2 saat önce aktif
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievement Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Sadık Müşteri', desc: '10+ başarılı randevu', color: 'bg-blue-500' },
                { title: 'Dakik', desc: 'Randevulara zamanında katılım', color: 'bg-green-500' },
                { title: 'Yorumcu', desc: '5+ detaylı değerlendirme', color: 'bg-gold-500' }
              ].map(badge => (
                <Card key={badge.title} className="glass-panel border-none p-6 rounded-[2rem] hover:bg-white/5 transition-all cursor-default">
                  <div className={`w-10 h-10 rounded-xl ${badge.color}/20 flex items-center justify-center mb-4 text-white`}>
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tighter mb-1">{badge.title}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                    {badge.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
