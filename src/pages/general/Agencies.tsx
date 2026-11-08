import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Building2, Search, Star, Users, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';

const MOCK_AGENCIES = [
  {
    id: 1,
    name: 'The Velvet Society',
    city: 'İstanbul',
    district: 'Nişantaşı',
    profiles: 18,
    rating: 4.9,
    reviews: 312,
    tier: 'Diamond',
    verified: true,
    speciality: 'Ultra Lüks & Seyahat',
    img: '/brand/placeholders/portrait-2.svg',
    description: 'Türkiye\'nin en prestijli escort ajansı. Seçkin misafirler için sınırsız lüks deneyim.',
  },
  {
    id: 2,
    name: 'Lumière Elite',
    city: 'Antalya',
    district: 'Lara',
    profiles: 12,
    rating: 4.8,
    reviews: 189,
    tier: 'Platinum',
    verified: true,
    speciality: 'Tatil & Resort Eşliği',
    img: '/brand/placeholders/portrait-6.svg',
    description: 'Akdeniz\'in incisi Antalya\'da resort tatilleriniz için eşsiz eşlikçiler.',
  },
  {
    id: 3,
    name: 'Sapphire Club',
    city: 'İzmir',
    district: 'Alsancak',
    profiles: 22,
    rating: 4.7,
    reviews: 247,
    tier: 'Platinum',
    verified: true,
    speciality: 'Business & Etkinlik',
    img: '/brand/placeholders/portrait-1.svg',
    description: 'İş dünyasının seçkinleri için özel sosyal etkinlik ve iş yemeği eşlikçileri.',
  },
  {
    id: 4,
    name: 'Golden Aura',
    city: 'Ankara',
    district: 'Çankaya',
    profiles: 9,
    rating: 4.6,
    reviews: 134,
    tier: 'Gold',
    verified: true,
    speciality: 'Diplomatik & Özel',
    img: '/brand/placeholders/portrait-1.svg',
    description: 'Başkentin köklü misafirleri için diplomatik düzeyde gizlilik ve kalite.',
  },
];

const tierConfig: Record<string, { label: string; className: string }> = {
  Diamond: { label: '💎 Diamond', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  Platinum: { label: '⚡ Platinum', className: 'bg-gold-500/15 text-gold-300 border-gold-400/30' },
  Gold: { label: '✦ Gold', className: 'bg-amber-500/15 text-amber-300 border-amber-400/30' },
};

export default function Agencies() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_AGENCIES.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.speciality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <Helmet>
        <title>Onaylı Lüks Ajanslar | Zühre Planet</title>
        <meta name="description" content="Zühre Planet güvencesiyle denetlenmiş premium escort ajansları." />
      </Helmet>

      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-gold-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-1/3 w-[400px] h-[350px] bg-primary/8 rounded-full blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Building2 className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Verified Elite Agencies</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 text-white leading-none">
            Onaylı{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-primary">
              Lüks Ajanslar
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Zühre Planet güvencesiyle denetlenmiş, en yüksek standartlara sahip premium escort ajansları ve özel kulüpler.
          </p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ajans adı, şehir veya uzmanlık ara..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Agency Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((agency, idx) => (
            <motion.article
              key={agency.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-gold-400/30 transition-all duration-500 hover:-translate-y-1 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[16/8] overflow-hidden">
                <img
                  src={agency.img}
                  alt={agency.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                {/* Tier */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full border text-[11px] font-bold tracking-widest ${tierConfig[agency.tier]?.className}`}>
                  {tierConfig[agency.tier]?.label}
                </div>

                {/* Verified */}
                {agency.verified && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest">Onaylı</span>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-white">{agency.rating}</span>
                  <span className="text-xs text-white/50">({agency.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1 group-hover:text-primary transition-colors">
                    {agency.name}
                  </h2>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-white/40" />
                      {agency.district}, {agency.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-white/40" />
                      {agency.profiles} profil
                    </span>
                  </div>
                </div>

                <p className="text-white/65 text-sm leading-relaxed flex-1">{agency.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/8">
                  <span className="text-xs text-white/40 font-medium uppercase tracking-widest">
                    {agency.speciality}
                  </span>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors group/btn">
                    İncele
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">Aramanıza uygun ajans bulunamadı.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
