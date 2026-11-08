import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Wine, MapPin, ShieldCheck, Diamond, Star, Clock, ArrowRight, Phone } from 'lucide-react';
import { Footer } from '@/components/Footer';

const VENUES = [
  {
    id: 1,
    title: 'The Platinum Suite Hotel',
    type: 'Lüks Otel',
    location: 'Nişantaşı, İstanbul',
    rating: 4.9,
    reviews: 412,
    price: '₺8.500+/gece',
    escort_friendly: true,
    hours: '24 saat',
    tags: ['Suite', 'Bar', 'SPA'],
    img: '/brand/placeholders/portrait-4.svg',
    desc: 'Nişantaşı\'nın kalbinde muhteşem manzaralı suite odaları ve kesintisiz gizlilik.',
  },
  {
    id: 2,
    title: 'Velvet Lounge Club',
    type: 'VIP Gece Kulübü',
    location: 'Beşiktaş, İstanbul',
    rating: 4.8,
    reviews: 289,
    price: 'Kapı: ₺500+',
    escort_friendly: true,
    hours: '22:00 – 05:00',
    tags: ['VIP Booth', 'DJ', 'Şarap'],
    img: '/brand/placeholders/portrait-1.svg',
    desc: 'İstanbul\'un en özel VIP gece kulübü. Gizli kapı rezervasyonu ile booth kiralama.',
  },
  {
    id: 3,
    title: 'Lumière Fine Dining',
    type: 'Fine Dining Restaurant',
    location: 'Kadıköy, İstanbul',
    rating: 4.7,
    reviews: 178,
    price: 'Kişi başı ₺2.500+',
    escort_friendly: true,
    hours: '18:00 – 01:00',
    tags: ['Michelin', 'Özel Salon', 'Şef Masa'],
    img: '/brand/placeholders/portrait-1.svg',
    desc: 'Michelin yıldızlı şeflerin elinden çıkan akşam yemekleri ve özel kapalı salon rezervasyonu.',
  },
  {
    id: 4,
    title: 'Azure Yacht Club',
    type: 'Özel Yat',
    location: 'Bebek, İstanbul',
    rating: 5.0,
    reviews: 97,
    price: '₺25.000+/gece',
    escort_friendly: true,
    hours: 'İstek üzerine',
    tags: ['Yat', 'Bosphorus', 'Özel'],
    img: '/brand/placeholders/portrait-1.svg',
    desc: 'Boğazda muhteşem gün batımı turu. Şef, hostess ve tam ekiple özel yat deneyimi.',
  },
  {
    id: 5,
    title: 'Sky Lounge Ankara',
    type: 'Sky Bar',
    location: 'Çankaya, Ankara',
    rating: 4.6,
    reviews: 203,
    price: 'Minimum sipariş ₺1.500+',
    escort_friendly: true,
    hours: '20:00 – 03:00',
    tags: ['Teras', 'Şehir Manzarası', 'Kokteyl'],
    img: '/brand/placeholders/portrait-2.svg',
    desc: 'Ankara\'nın tepesinden şehir manzarası eşliğinde özel kokteyl ve romantik akşamlar.',
  },
  {
    id: 6,
    title: 'Sapphire Resort & Spa',
    type: 'Resort & SPA',
    location: 'Lara, Antalya',
    rating: 4.9,
    reviews: 334,
    price: '₺6.500+/gece',
    escort_friendly: true,
    hours: '24 saat',
    tags: ['SPA', 'Havuz', 'Suite'],
    img: '/brand/placeholders/portrait-4.svg',
    desc: 'Antalya\'nın efsanevi resort\'u. Özel villa, infinity pool ve tüm gün SPA keyfi.',
  },
];

export default function Nightlife() {
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <Helmet>
        <title>Lifestyle & Gece Hayatı Rehberi | Zühre Planet VIP</title>
        <meta name="description" content="Escort-friendly lüks oteller, gece kulüpleri ve premium buluşma mekanları." />
      </Helmet>

      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-amber-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-1/4 w-[400px] h-[350px] bg-rose-600/8 rounded-full blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Wine className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">VIP Lifestyle Guide</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 text-white leading-none">
            Gece Hayatı &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
              Lifestyle
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Özenle seçilmiş "Escort-Friendly" lüks oteller, gece kulüpleri ve premium buluşma mekanları.
          </p>
        </motion.div>
      </div>

      {/* Venues */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {VENUES.map((venue, idx) => (
            <motion.article
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-400/25 transition-all duration-500 hover:-translate-y-1 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={venue.img}
                  alt={venue.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                {/* Type tag */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Diamond className="w-3 h-3" />
                  {venue.type}
                </div>

                {/* Friendly tag */}
                {venue.escort_friendly && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-300">Escort-Friendly</span>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-white">{venue.rating}</span>
                  <span className="text-xs text-white/50">({venue.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 gap-3">
                <div>
                  <h2 className="text-xl font-black text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {venue.title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-white/40" />
                      {venue.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                      {venue.hours}
                    </span>
                  </div>
                </div>

                <p className="text-white/65 text-sm leading-relaxed flex-1">{venue.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {venue.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/8">
                  <span className="text-primary font-black text-sm">{venue.price}</span>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors group/btn">
                    Rezervasyon
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
