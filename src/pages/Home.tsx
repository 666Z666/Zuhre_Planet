import { useRef, useEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Camera,
  Flag,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { SEOManager } from '@/components/SEOManager';
import { ROUTES } from '@/constants/routes';
// three.js'i Home chunk'ından ayırır; hata/gecikme olsa da sayfa içeriği hemen görünür
const CosmicCanvas = lazy(() => import('@/components/home/CosmicCanvas').then((m) => ({ default: m.CosmicCanvas })));

gsap.registerPlugin(ScrollTrigger);

const featureCards = [
  {
    title: '18+ yaş kapısı',
    desc: 'Ziyaretçi, yetişkin içerik alanına geçmeden önce 18 yaşını doldurduğunu onaylar.',
    icon: ShieldCheck,
    color: 'text-primary'
  },
  {
    title: 'Yayından önce inceleme',
    desc: 'Profil bilgileri ve medya, herkese açılmadan önce yönetim incelemesinden geçer.',
    icon: Camera,
    color: 'text-amber-400'
  },
  {
    title: 'Gizlilik odaklı iletişim',
    desc: 'İletişim numarası sayfada düz metin olarak gösterilmez; ziyaretçi mevcut iletişim eylemini seçer.',
    icon: Lock,
    color: 'text-emerald-400'
  },
  {
    title: 'İlanı bildir',
    desc: 'Uygunsuz içerik veya güvenlik endişelerini bildirme aracı, konunun incelemeye iletilmesini sağlar.',
    icon: Flag,
    color: 'text-rose-400'
  }
];

const escortFeatures = [
  {
    title: 'Profilini yönet',
    desc: 'İlan sahibi profil bilgilerini, açıklamasını ve hesabında kullanılabilen alanları yönetebilir.',
    icon: Star,
    color: 'text-amber-400'
  },
  {
    title: 'Medya incelemesi',
    desc: 'Yeni profil görselleri yayınlanmadan önce yönetim onayına gönderilir.',
    icon: Camera,
    color: 'text-rose-400'
  },
  {
    title: 'Kontrollü iletişim',
    desc: 'İletişim bilgileri sayfada doğrudan yazdırılmaz; iletişim bağlantıları kullanıcı eylemiyle açılır.',
    icon: Lock,
    color: 'text-primary'
  },
  {
    title: 'İlan platformu',
    desc: 'Zühre Planet ilan ve iletişim alanı sunar; randevu ayarlamaz ve ödeme işlemez.',
    icon: ArrowRight,
    color: 'text-emerald-400'
  }
];

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl">
        <Sparkles className="w-3 h-3 text-primary motion-safe:animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 italic">{label}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-black font-orbitron text-white uppercase tracking-tighter">
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const escortRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion !== false) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.feature-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 75%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (escortRef.current) {
        const cards = escortRef.current.querySelectorAll('.escort-feature-card');
        gsap.fromTo(cards,
          { opacity: 0, x: -50, rotateY: 10 },
          {
            opacity: 1, x: 0, rotateY: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: escortRef.current,
              start: 'top 75%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (trustRef.current) {
        gsap.fromTo(trustRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: trustRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 100, scale: 0.8 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <SEOManager
        title="Zühre Planet | 18+ İlan Platformu"
        description="Zühre Planet, 18 yaş ve üzerindeki yetişkinlere yönelik bir ilan platformudur. İlanlar yayın öncesi incelenir; platform randevu veya ödeme aracılığı yapmaz."
      />

      {prefersReducedMotion === false && (
        <Suspense fallback={null}>
          <CosmicCanvas />
        </Suspense>
      )}

      <section ref={heroRef} className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto text-center z-20 perspective-1000">
          <div className="preserve-3d">
          <div className="inline-flex items-center gap-2 mb-8 px-6 py-2.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Sparkles className="w-3.5 h-3.5 text-primary motion-safe:animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">18+ İlan Platformu</span>
          </div>

          <div className="min-h-[28vh] md:min-h-[36vh] flex items-center justify-center relative">
            <h1 className="max-w-5xl text-4xl sm:text-5xl md:text-7xl font-black font-orbitron text-white uppercase tracking-tight leading-tight drop-shadow-[0_0_30px_rgba(63,174,134,0.35)]">
              Gecenin Parlak Yıldızları
            </h1>
          </div>

          <p className="max-w-3xl mx-auto text-gray-200 text-base md:text-lg mb-12 leading-relaxed">
            Yalnızca 18 yaş ve üzerindeki yetişkinlere yönelik ilanları inceleyin. Profiller ve medya yayın öncesi incelenir; platform randevu veya ödeme aracılığı yapmaz.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href={ROUTES.CATALOG}>
              <Button size="lg" className="h-20 px-14 bg-white text-black hover:bg-primary hover:text-white font-black uppercase text-xs tracking-[0.3em] italic rounded-[2rem] group transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                İLANLARI GÖRÜNTÜLE
                <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
            <Link href={ROUTES.REGISTER_ESCORT}>
              <Button size="lg" variant="ghost" className="h-20 px-10 text-white/40 hover:text-white font-black uppercase text-xs tracking-[0.3em] italic rounded-[2rem] transition-colors border border-white/5 hover:border-white/20">
                İLAN SAHİBİ OLARAK KATIL
              </Button>
            </Link>
          </div>

          <div ref={trustRef} className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16 transition-all duration-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="font-orbitron font-bold text-white/80 uppercase tracking-widest text-[10px]">Yayın öncesi inceleme</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <span className="font-orbitron font-bold text-white/80 uppercase tracking-widest text-[10px]">Kontrollü iletişim</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-orbitron font-bold text-white/80 uppercase tracking-widest text-[10px]">18+ yaş kapısı</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              <span className="font-orbitron font-bold text-white/80 uppercase tracking-widest text-[10px]">Randevu / ödeme aracılığı yok</span>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="relative py-12 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
        <SectionHeading label="İlan güvenliği" title="Açık kurallar, kontrollü yayın" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featureCards.map((feature, i) => (
            <div key={i} className="feature-card group p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all relative overflow-hidden">
              <div className={`p-4 rounded-full bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-orbitron text-white">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={escortRef} className="relative py-12 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
        <SectionHeading label="İlan sahibi" title="Profilini açıkça yönet" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {escortFeatures.map((feature, i) => (
            <div key={i} className="escort-feature-card group p-8 rounded-3xl border border-rose-500/10 bg-gradient-to-br from-rose-500/5 to-gold-500/5 hover:from-rose-500/10 hover:to-gold-500/10 transition-all relative overflow-hidden">
              <div className={`p-4 rounded-full bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-orbitron text-white">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={ctaRef} className="relative py-20 px-6 z-20">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-r from-gold-700 via-rose-700 to-gold-700 overflow-hidden relative group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] bg-[length:18px_18px] opacity-20 mix-blend-overlay" />
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-rose-300/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />

          <div className="relative z-10 text-center md:text-left md:flex items-center justify-between gap-12">
            <div className="mb-8 md:mb-0 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black font-orbitron mb-6 text-white uppercase tracking-tighter leading-none">
                İLANINI <br /> GÜNCEL TUT
              </h2>
              <p className="text-white/80 text-lg font-light leading-relaxed">
                İlan sahibi olarak başvurunuzu oluşturun. Profil bilgileri ve medya herkese açılmadan önce incelenir; platform randevu veya ödeme işlemez.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link href={ROUTES.REGISTER_ESCORT}>
                <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-gray-100 font-black uppercase text-sm tracking-widest rounded-2xl">
                  İlan Sahibi Olarak Kaydol
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-2 text-white/60">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="text-xs font-bold uppercase tracking-widest">18+ · Yayın öncesi inceleme</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
