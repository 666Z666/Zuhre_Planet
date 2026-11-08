/**
 * Escort Profile Page (Galaxy Edition)
 * 
 * Premium Cosmic UI - Glassmorphism & Responsive Design.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Sparkles, 
  Play, 
  X,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Shield,
  Eye,
  Ruler,
  Weight,
  Palette,
  Languages,
  Calendar,
  Layers,
  Lock,
  Zap
} from 'lucide-react';

import { 
  MetricHeightIcon, 
  MetricWeightIcon, 
  MetricChestIcon, 
  MetricWaistIcon, 
  MetricHipsIcon 
} from '@/components/ui/SensualIcons';

import { ReviewCard } from '@/components/ui/ReviewCard';
import { ActivityBadge } from '@/components/ui/ActivityBadge';
import { ListingProfile } from '@/types/domain';
import { listingService } from '@/services/listingService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BookingForm } from '@/components/BookingForm';
import { LockedContentCard } from '@/components/ui/LockedContentCard';
import { AchievementBadge } from '@/components/ui/AchievementBadge';
import { useTheme } from '@/contexts/ThemeContext';
import { SEO } from '@/pages/SEO';
import { Footer } from '@/components/Footer';

export default function EscortProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ListingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 3D Tilt Logic for Hero Photo
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Numara sayfada tutulmaz; tıklamada sunucudan alınır ve tıklama sayılır.
  const openContact = async (channel: 'phone' | 'whatsapp') => {
    if (!profile) return;
    const res = await listingService.revealContact(profile.id, channel);
    if ('error' in res) {
      alert(res.error);
      return;
    }
    if (channel === 'phone') window.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  };
  const handleCall = () => { void openContact('phone'); };
  const handleWhatsApp = () => { void openContact('whatsapp'); };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await listingService.getListingById(Number(id));
        setProfile(data);
      } catch (error) {
        console.warn("Profil çekilirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="YILDIZ VERİLERİ ÇÖZÜMLENİYOR..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <h2 className={`text-6xl font-black mb-6 uppercase italic tracking-tighter ${isDark ? 'text-white text-shadow-premium' : 'text-orange-950'}`}>YÖRÜNGE DIŞI</h2>
        <p className={`mb-12 uppercase text-xs font-black tracking-[0.4em] ${isDark ? 'text-white/80' : 'text-orange-900/60'}`}>Bu profil galakside bulunamadı.</p>
        <Link href="/escorts">
          <Button className="bg-primary text-white font-black px-16 py-8 rounded-[2rem] shadow-2xl uppercase text-xs tracking-widest italic group overflow-hidden relative">
            <span className="relative z-10">KATALOĞA GERİ DÖN</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  // Dinamik SEO Schema (Person & Offer)
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.displayName,
    "description": profile.biography || `${profile.city} ${profile.district} VIP Escort`,
    "image": profile.coverImage,
    "gender": "Female",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.district,
      "addressRegion": profile.city,
      "addressCountry": "TR"
    },
    "offers": {
      "@type": "Offer",
      "price": profile.rates?.hourly || 0,
      "priceCurrency": "TRY",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": profile.rating || 5,
      "reviewCount": profile.reviewCount || 1,
      "bestRating": 5,
      "worstRating": 1
    }
  };

  const seoTitle = `${profile.displayName} - ${profile.city} ${profile.hairColor || 'VIP'} Escort | Doğrulanmış Profil - Zühre Planet`;
  const seoDesc = `Zühre Planet güvencesiyle ${profile.city} ${profile.district} konumunda hizmet veren ${profile.age} yaşındaki ${profile.displayName} (${profile.hairColor || 'Sarışın'}) için hemen randevu detaylarını inceleyin.`;

  return (
    <div className="min-h-screen bg-transparent pb-32">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${profile.city} escort, ${profile.district} escort, ${profile.displayName} escort, vip escort bayan, ${profile.hairColor || 'sarışın'} escort`}
        ogImage={profile.coverImage}
        schemaData={profileSchema}
      />
      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden content-layer">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 transition-colors duration-1000 ${isDark ? 'bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950' : 'bg-gradient-to-b from-transparent via-white/40 to-white'}`} />
        </div>

        <div className="container mx-auto px-6 h-full relative z-10 flex flex-col justify-end pb-16">
          <Link href="/escorts">
            <motion.button whileHover={{ x: -10 }} className={`absolute top-28 left-6 flex items-center gap-3 transition-all uppercase text-[11px] font-black tracking-[0.5em] italic border-b-2 py-2 text-shadow-premium ${isDark ? 'text-white border-primary/30 hover:border-primary' : 'text-orange-950 border-orange-500/30 hover:border-orange-500'}`}>
              <ArrowLeft className="w-4 h-4" /> KATALOĞA DÖN
            </motion.button>
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end text-center md:text-left">
            {/* Main Profile Photo with Glass Frame */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative group cursor-pointer" 
              onClick={() => profile.thumbnailVideo && setShowVideo(true)}
            >
              <div className={`w-56 h-72 md:w-72 md:h-96 rounded-[3rem] overflow-hidden border-none shadow-2xl relative glass-panel`}>
                <img src={profile.coverImage} className="w-full h-full object-cover" alt={profile.displayName} />
                {profile.thumbnailVideo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-2xl flex items-center justify-center border border-white/30">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>
                )}
              </div>
              {profile.verificationStatus === 'verified' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute -bottom-3 -right-3 bg-gradient-to-br from-blue-500 to-emerald-500 text-white p-4 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.5)] border-4 border-black/50 z-20 group-hover:scale-110 transition-transform cursor-help"
                  title="Kimlik ve Fotoğraflar Doğrulanmıştır"
                >
                  <Shield className="w-8 h-8" />
                  <div className="absolute -inset-1 rounded-3xl bg-blue-400/20 animate-ping" />
                </motion.div>
              )}
            </motion.div>

            {/* Profile Brief Info */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic text-3d-premium leading-none text-shadow-premium">
                  {profile.displayName}
                </h1>
                <Badge className="bg-primary text-white border-none px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] italic shadow-lg shadow-primary/20">
                  {profile.age} YAŞ
                </Badge>
              </div>

              <div className={`flex flex-wrap items-center justify-center md:justify-start gap-8 text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-white/80' : 'text-orange-950/80'}`}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-shadow-premium">{profile.city} • {profile.district}</span>
                </div>
                <ActivityBadge activity={profile.activity} />
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-shadow-premium font-orbitron">{profile.rating}</span>
                  <span className="opacity-60">({profile.reviewCount} Yorum)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-shadow-premium">{profile.viewCount} Keşif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="container mx-auto px-6 mt-16 content-layer">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">

          {/* Left Column: Media & Info */}
          <div className="lg:col-span-8 space-y-16">

            {/* Gallery Section */}
            <section className="glass-panel border-none rounded-[3rem] p-8 md:p-12 shadow-2xl">
              <h2 className={`text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter italic text-shadow-premium ${isDark ? 'text-white' : 'text-orange-950'}`}>
                <Sparkles className="w-7 h-7 text-primary" /> GALAKSİ ARŞİVİ
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {[
                  { url: profile.coverImage || '', id: 'cover' },
                  ...(Array.isArray(profile.gallery) ? profile.gallery : []).map((img: any) => 
                    typeof img === 'string' ? { url: img, id: img } : img
                  )
                ].map((item: { url: string; id: string }, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      rotateX: 5,
                      rotateY: -5,
                      boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.5)"
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="aspect-[3/4.5] rounded-[2rem] overflow-hidden border border-white/10 cursor-pointer glass-panel group relative shadow-xl"
                    onClick={() => setSelectedImageUrl(item.url)}
                  >
                    <img src={item.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={`Gallery ${idx}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-8">
                       <div className="bg-white/10 backdrop-blur-xl p-3 rounded-full border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-5 h-5 text-white" />
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* THE VAULT - LOCKED CONTENT */}
            <section className="glass-panel border-none rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32" />
               
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter italic text-white text-shadow-premium">
                    <Lock className="w-7 h-7 text-primary" /> THE VAULT <span className="text-primary italic">ÖZEL ARŞİV</span>
                  </h2>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                     <Zap className="w-4 h-4 text-amber-400" />
                     <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-amber-500/20 uppercase tracking-widest text-shadow-premium">NEBULA PUANI GEREKLİ</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                  <LockedContentCard 
                    id="v1" 
                    previewUrl="/brand/placeholders/portrait-4.svg" 
                    price={1200} 
                    type="image" 
                  />
                  <LockedContentCard 
                    id="v2" 
                    previewUrl="/brand/placeholders/portrait-4.svg" 
                    price={2500} 
                    type="video" 
                  />
               </div>

               <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] text-gray-200 font-black uppercase tracking-[0.3em] text-shadow-premium italic">Özel içerikler, yıldız partnerimiz tarafından limitli süreyle ve Nebula rütbesine özel olarak yayınlanmıştır.</p>
               </div>
            </section>

            {/* Details Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-white/5 border-none p-2 rounded-3xl w-full flex overflow-x-auto no-scrollbar gap-2">
                <TabsTrigger value="about" className="flex-1 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">HİKAYE</TabsTrigger>
                <TabsTrigger value="services" className="flex-1 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">DENEYİMLER</TabsTrigger>
                <TabsTrigger value="details" className="flex-1 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">PARAMETRELER</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">YORUMLAR</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="glass-panel border-none rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <h3 className={`text-3xl font-black mb-8 uppercase italic tracking-tighter text-shadow-premium ${isDark ? 'text-white' : 'text-orange-950'}`}>BİYOGRAFİ</h3>
                  <p className={`leading-relaxed text-xl md:text-2xl font-medium text-shadow-premium ${isDark ? 'text-white/80' : 'text-orange-900/80'}`}>
                    {profile.biography || "Bu yıldız henüz hikayesini paylaşmadı. Galaksinin derinliklerinde keşfedilmeyi bekliyor."}
                  </p>
                </motion.div>
              </TabsContent>

              <TabsContent value="services" className="mt-10">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.services.map((service: string) => (
                    <div key={service} className="flex items-center gap-5 p-6 glass-panel border-none rounded-[2rem] hover:bg-primary/5 transition-all group">
                      <div className="w-4 h-4 rounded-full bg-primary group-hover:scale-125 transition-transform shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                      <span className={`font-black uppercase text-xs tracking-[0.2em] italic ${isDark ? 'text-white/90 text-shadow-premium' : 'text-orange-950 text-shadow-sm'}`}>{service}</span>
                    </div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="details" className="mt-10">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                  {[
                    { icon: MetricHeightIcon, label: 'BOY', value: profile.physicalTraits?.height ? `${profile.physicalTraits.height} CM` : '175 CM', color: 'from-blue-500/20 to-emerald-500/20' },
                    { icon: MetricWeightIcon, label: 'KİLO', value: profile.physicalTraits?.weight ? `${profile.physicalTraits.weight} KG` : '55 KG', color: 'from-emerald-500/20 to-teal-500/20' },
                    { icon: MetricChestIcon, label: 'GÖĞÜS', value: profile.physicalTraits?.chest || '90', color: 'from-pink-500/20 to-rose-500/20' },
                    { icon: MetricWaistIcon, label: 'BEL', value: profile.physicalTraits?.waist || '60', color: 'from-gold-500/20 to-emerald-500/20' },
                    { icon: MetricHipsIcon, label: 'KALÇA', value: profile.physicalTraits?.hips || '92', color: 'from-amber-500/20 to-orange-500/20' },
                  ].map((feat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5, rotateY: 10 }}
                      className={`glass-panel p-6 sm:p-8 rounded-[2.5rem] border-none flex flex-col items-center text-center group relative overflow-hidden bg-gradient-to-br ${feat.color} backdrop-blur-3xl shadow-xl`}
                    >
                      <div className="relative z-10">
                        <feat.icon size={40} className="text-primary mb-6 group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                        <div className={`text-[9px] mb-3 font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/80 text-shadow-premium' : 'text-orange-900/60'}`}>{feat.label}</div>
                        <div className={`font-black text-2xl sm:text-3xl uppercase tracking-tighter italic text-glow drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${isDark ? 'text-white' : 'text-orange-950'}`}>{feat.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Traits Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                   {[
                     { icon: Palette, label: 'SAÇ', value: profile.physicalTraits?.hairColor || profile.hairColor || 'Sarışın' },
                     { icon: Eye, label: 'GÖZ', value: profile.physicalTraits?.eyeColor || profile.eyeColor || 'Mavi' },
                     { icon: Languages, label: 'DİLLER', value: profile.languages?.join(', ') || 'Türkçe, İngilizce' },
                     { icon: Layers, label: 'VÜCUT', value: profile.physicalTraits?.bodyType === 'slim' ? 'İnce' : profile.physicalTraits?.bodyType === 'athletic' ? 'Atletik' : 'Kıvrımlı' },
                   ].map((item, idx) => (
                     <div key={idx} className="glass-panel p-5 rounded-[2rem] border-none flex items-center gap-4 hover:bg-white/5 transition-all">
                        <item.icon className="w-5 h-5 text-primary/60" />
                        <div>
                           <div className="text-[8px] font-black opacity-60 tracking-widest uppercase text-white/50">{item.label}</div>
                           <div className="text-[11px] font-bold uppercase italic text-white/90 text-shadow-sm">{item.value}</div>
                        </div>
                     </div>
                   ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-10">
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                      <div>
                        <h3 className={`text-3xl font-black uppercase italic tracking-tighter text-shadow-premium ${isDark ? 'text-white' : 'text-orange-950'}`}>YORUMLAR</h3>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-shadow-premium">{profile.reviewCount} DOĞRULANMIŞ DENEYİM</p>
                      </div>
                    </div>
                  </div>
                  
                  {profile.publicReviews && profile.publicReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {profile.publicReviews.map((rv) => (
                        <ReviewCard
                          key={rv.id}
                          review={{
                            id: rv.id,
                            escortId: String(profile.id),
                            customerId: '',
                            // Yorum yapanın kimliği public uçta paylaşılmaz
                            customerName: 'Doğrulanmış üye',
                            rating: rv.rating,
                            comment: rv.comment,
                            isVerified: true,
                            createdAt: rv.createdAt ? new Date(rv.createdAt).toLocaleDateString('tr-TR') : '',
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                      Bu profil için henüz yayımlanmış yorum yok.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Contact Sticky Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <div className="glass-panel border-none rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tighter text-white text-shadow-premium">
                  İLETİŞİM VE ÜCRET
                </h3>

                <div className="space-y-8 mb-10">
                  <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <span className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-white/80' : 'text-orange-950/80'}`}>Saatlik Ücret</span>
                    <span className={`text-5xl font-black italic text-glow text-shadow-premium ${isDark ? 'text-white' : 'text-orange-950'}`}>₺{profile.rates?.hourly}</span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full h-14 md:h-16 bg-gradient-to-t from-pink-600 to-rose-500 text-white rounded-2xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] italic shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_15px_30px_rgba(244,63,94,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" /> HEMEN RANDEVU AL
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border-white/10 p-0 rounded-3xl">
                        <div className="p-6 lg:p-10 pt-16">
                          <BookingForm
                            escortId={profile.id.toString()}
                            escortName={profile.displayName}
                            escortAvatar={profile.coverImage || ''}
                            hourlyRate={profile.rates?.hourly || 0}
                            location={`${profile.city} ${profile.district}`}
                            onSubmit={(data) => console.warn('Randevu Talebi:', data)}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      onClick={handleCall}
                      className="w-full h-14 md:h-16 bg-gradient-to-t from-primary/90 to-primary text-white rounded-2xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] italic shadow-[0_8px_20px_rgba(18,122,89,0.3)] hover:shadow-[0_15px_30px_rgba(18,122,89,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-ping" /> ŞİMDİ ARA
                    </Button>
                  </div>
                </div>

                <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-colors ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <Shield className="w-6 h-6 text-red-500" />
                    <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white text-shadow-premium' : 'text-orange-950'}`}>GÜVENLİK UYARISI</span>
                  </div>
                  <p className={`text-[11px] font-black leading-loose uppercase tracking-tighter text-shadow-premium ${isDark ? 'text-white/90' : 'text-orange-950/80'}`}>
                    Randevu öncesi ön ödeme talep eden profillere itibar etmeyiniz. Güvenliğiniz için her zaman halka açık alanlarda buluşmayı tercih edin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
          >
            <button 
              onClick={() => setShowVideo(false)} 
              className="absolute top-10 right-10 text-white/60 hover:text-white"
              aria-label="Videoyu Kapat"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="w-full max-w-4xl aspect-video glass-panel border-none rounded-[3rem] overflow-hidden shadow-2xl">
              <video src={profile.thumbnailVideo} controls autoPlay className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
