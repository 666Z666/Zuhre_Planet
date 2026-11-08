import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, Search, Star, Plane, Clock, Users } from 'lucide-react';
import { Footer } from '@/components/Footer';

const MOCK_TOURS = [
  {
    id: 1,
    city: 'Dubai',
    country: 'BAE',
    escort: 'Elara Moon',
    tier: 'Diamond',
    dates: '15–20 Mayıs 2026',
    nights: 5,
    spots: 2,
    price: '₺18.000 / gece',
    status: 'Rezervasyon Açık',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    img: '/brand/placeholders/portrait-3.svg',
  },
  {
    id: 2,
    city: 'Paris',
    country: 'Fransa',
    escort: 'Luna',
    tier: 'Platinum',
    dates: '22–25 Mayıs 2026',
    nights: 3,
    spots: 1,
    price: '₺22.000 / gece',
    status: 'Son 1 Yer',
    statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    img: '/brand/placeholders/portrait-6.svg',
  },
  {
    id: 3,
    city: 'Londra',
    country: 'İngiltere',
    escort: 'Milena',
    tier: 'VIP',
    dates: '01–06 Haziran 2026',
    nights: 5,
    spots: 3,
    price: '₺15.500 / gece',
    status: 'Erken Kuş Fırsatı',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    img: '/brand/placeholders/portrait-6.svg',
  },
  {
    id: 4,
    city: 'Milano',
    country: 'İtalya',
    escort: 'Valentina',
    tier: 'Platinum',
    dates: '10–14 Haziran 2026',
    nights: 4,
    spots: 2,
    price: '₺19.500 / gece',
    status: 'Rezervasyon Açık',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    img: '/brand/placeholders/portrait-2.svg',
  },
  {
    id: 5,
    city: 'Barselona',
    country: 'İspanya',
    escort: 'Sofia',
    tier: 'Gold',
    dates: '20–23 Haziran 2026',
    nights: 3,
    spots: 4,
    price: '₺12.000 / gece',
    status: 'Rezervasyon Açık',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    img: '/brand/placeholders/portrait-2.svg',
  },
  {
    id: 6,
    city: 'Moskova',
    country: 'Rusya',
    escort: 'Anastasia',
    tier: 'Diamond',
    dates: '28 Haziran – 4 Temmuz 2026',
    nights: 6,
    spots: 1,
    price: '₺25.000 / gece',
    status: 'Son 1 Yer',
    statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    img: '/brand/placeholders/portrait-5.svg',
  },
];

const tierColors: Record<string, string> = {
  Diamond: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
  Platinum: 'bg-gold-500/20 text-gold-200 border-gold-400/30',
  VIP: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
  Gold: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
};

export default function Tours() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_TOURS.filter(
    t =>
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.escort.toLowerCase().includes(search.toLowerCase()) ||
      t.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <Helmet>
        <title>Uluslararası Turneler | Zühre Planet VIP</title>
        <meta name="description" content="Dünyanın elit şehirlerindeki özel buluşmalar için escort turne takvimi." />
      </Helmet>

      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Plane className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Elite Travel Circuit</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 text-white leading-none">
            Sınır Tanımayan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
              İhtişam
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Dünyanın elit şehirlerindeki özel buluşmalar için escort turne takvimini inceleyin ve rezervasyon oluşturun.
          </p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Şehir, ülke veya escort ara..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      {/* Tour Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((tour, idx) => (
            <motion.article
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={tour.img}
                  alt={`${tour.escort} - ${tour.city}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Strong gradient so text is always readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Status badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest ${tour.statusColor}`}>
                  {tour.status}
                </div>

                {/* Tier badge */}
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest ${tierColors[tour.tier]}`}>
                  {tour.tier}
                </div>

                {/* City label */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">{tour.city}, {tour.country}</span>
                  </div>
                  <h2 className="text-xl font-black text-white">{tour.escort}</h2>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Calendar className="w-4 h-4 text-primary/70 flex-shrink-0" />
                    <span>{tour.dates}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Clock className="w-4 h-4 text-primary/70 flex-shrink-0" />
                    <span>{tour.nights} Gece</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4 text-white/40" />
                    <span>{tour.spots} yer mevcut</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-white/40 uppercase tracking-widest">Başlangıç</p>
                    <p className="text-primary font-black text-sm">{tour.price}</p>
                  </div>
                </div>

                <button className="w-full py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-98">
                  Rezervasyon Yap
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Plane className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">Aramanıza uygun turne bulunamadı.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
