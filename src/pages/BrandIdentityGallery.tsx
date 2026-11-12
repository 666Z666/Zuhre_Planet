import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShadowDiamondIcon, 
  DarkLotusIcon, 
  SacredPortalIcon, 
  SpiderWebIcon,
  YonicBurningFeather,
  GoldenYoniDiamondIcon
} from '@/components/ui/SensualIcons';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/config/brand';

export default function BrandIdentityGallery() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const _item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-24">
      
      {/* HERO SECTION - MANIFESTO START */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-8"
      >
        <Badge variant="outline" className="px-6 py-2 border-secondary/40 text-secondary tracking-[0.4em] uppercase font-semibold">
          Marka Kimliği · Zümrüt &amp; Altın
        </Badge>
        <h1 className="flex flex-col items-center gap-6">
          <Logo size={120} showWordmark={false} />
          <span className="text-6xl md:text-8xl text-3d-premium">Zühre <span className="text-3d-gold">Planet</span></span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Zümrüt gezegen, altın halka, krem zemin. Aşağıdaki konseptler değerlendirme içindir; seçilen logo
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">src/config/brand.ts</code> üzerinden tüm siteye uygulanır.
        </p>
      </motion.section>

      {/* LOGO KONSEPTLERİ */}
      <section className="space-y-8">
        <h2 className="text-center text-3xl text-3d-premium">Logo Konseptleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <figure key={n} className="card-cosmic overflow-hidden">
              <img
                src={`/brand/concepts/logo-concept-${n}.webp`}
                alt={`Zühre Planet logo konsepti ${n}`}
                loading="lazy"
                className="aspect-square w-full object-contain bg-[#fbf7ee]"
              />
              <figcaption className="p-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Konsept {n}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {Object.entries(BRAND.colors).map(([name, hex]) => (
            <div key={name} className="glass-card-sm text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-border" style={{ background: hex }} />
              <div className="text-[11px] font-semibold">{name}</div>
              <div className="text-[10px] text-muted-foreground">{hex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* METAPHORIC SYMBOLS - NEW ICONS */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <h2 className="text-sm font-black tracking-[0.5em] uppercase text-white/30 italic">Yeni Semboller & Geometri</h2>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="md:col-span-2 lg:col-span-4 flex flex-col md:flex-row justify-center gap-8 mb-8">
            <div className="max-w-md w-full">
              <IconShowcase 
                title="THE GOLDEN CLEFT" 
                meta="Nihai Amblem"
                desc="Zenginlik ve mahremiyetın kusursuz birleşimi. Altın elmasın kalbindeki kristalize yoni."
                Icon={GoldenYoniDiamondIcon} 
              />
            </div>
            <div className="max-w-md w-full">
              <IconShowcase 
                title="YONIC BURNING FEATHER" 
                meta="Ekstrem Metafor"
                desc="Tüyün hafifliği, içten dışa yanan bir yoni formuyla buluşuyor. Mahremiyetin ateşli anatomisi ve kural tanımazlık."
                Icon={YonicBurningFeather} 
              />
            </div>
          </div>
          <IconShowcase 
            title="SHADOW DIAMOND" 
            meta="Yonic Metafor"
            desc="Kusursuz kesim, gizli dikey yarık. Parlak dış katman, sonsuz derinlikteki iç dünyayı perdeler."
            Icon={ShadowDiamondIcon} 
          />
          <IconShowcase 
            title="DARK LOTUS" 
            meta="Kutsal Dişil (Shakti)"
            desc="Kirden doğan mükemmellik. Her yaprağında açılma ve teslimiyet ritmi."
            Icon={DarkLotusIcon} 
          />
          <IconShowcase 
            title="SACRED PORTAL" 
            meta="Giriş / Geçit"
            desc="Ogive kemer geometrisi. Bilinmeyene adım atma ve iradenin ötesine geçiş."
            Icon={SacredPortalIcon} 
          />
          <IconShowcase 
            title="SPIDER WEB" 
            meta="Huntress (Avcı)"
            desc="Zeki, sabırlı ve elit bir tuzak. İsteyerek teslim olan ruhların altın örgüsü."
            Icon={SpiderWebIcon} 
          />
        </motion.div>
      </section>

      {/* COLOR ALCHEMY & PSYCHOLOGY */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <h2 className="text-sm font-black tracking-[0.5em] uppercase text-white/30 italic">Renk Alşimisi</h2>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <ColorBlock hex="#d4af37" name="Kadife Magenta" meaning="Ham cinsel enerji & Kudret" />
          <ColorBlock hex="#6B0F2A" name="Bordo Gece" meaning="Şarap, Yasak & Derinlik" />
          <ColorBlock hex="#D4AF37" name="Amber Altın" meaning="Ödül, Lüks & Isı" />
          <ColorBlock hex="#1A0033" name="Gece Moru" meaning="Ritüel & Gizem" />
          <ColorBlock hex="#0A0A0A" name="Siyah İpek" meaning="Bilinmez & Koşulsuz" />
          <ColorBlock hex="#FFB6C1" name="Buz Pembesi" meaning="Tatlı Arzu & Masum Güç" />
          <ColorBlock hex="#FF4500" name="Köz Turuncu" meaning="Yanma & Yakınlık" />
        </div>
      </section>

      {/* PSYCHOLOGICAL ARCHETYPES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20">
        <ArchetypeCard 
          title="THE SIREN" 
          quote="Karşı konulamaz çağrı, mantığın sulara gömülmesi."
          desc="Platformdaki akışkanlık (silk-flow) bu ruhun yansımasıdır. Kullanıcı sadece bakar ama içinde boğulmak ister."
        />
        <ArchetypeCard 
          title="THE ALCHEMIST" 
          quote="Cinsellik, bir ruhanî arınma ve dönüşüm ritüelidir."
          desc="Body is a temple. Sacred sexuality metaforlarıyla platformu sıradan bir siteden bir tapınağa dönüştürür."
        />
        <ArchetypeCard 
          title="SHADOW-X (LILITH)" 
          quote="Boyun eğmeyen, gece yarısı kokusunu salan güç."
          desc="Gölge modun kalbi. Özgür irade sahibi, kural koyan ve gecenin efendisi olan arketip."
        />
      </section>

      {/* COPYWRITING SYSTEM */}
      <section className="bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center space-y-12">
        <h3 className="text-4xl font-black font-orbitron uppercase italic text-white">Lüks Erotik Sözlük</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <WordTag label="Transandantal" />
          <WordTag label="Hipnotik" />
          <WordTag label="Sıvı İpek" />
          <WordTag label="Ritüel" />
          <WordTag label="Ten-Yakan" />
          <WordTag label="Yasak Geçit" />
          <WordTag label="Dokunulmaz" />
        </div>
        <p className="text-white/20 italic text-sm">
          "Biz nefesi kesmeyiz; biz tamamen yeni bir nefes ritmi yaratırız."
        </p>
      </section>

      {/* FOOTER CTA */}
      <div className="pt-20 text-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-[10px] font-black uppercase tracking-[0.5em] text-primary hover:text-white transition-all italic border-b border-primary/20 pb-2"
        >
          GÖLGEYE GERİ DÖN
        </button>
      </div>

    </div>
  );
}

interface IconShowcaseProps {
  title: string;
  meta: string;
  desc: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

function IconShowcase({ title, meta, desc, Icon }: IconShowcaseProps) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/20 transition-all duration-700 text-center space-y-6"
    >
      <div className="flex justify-center py-8">
        <div className="p-10 rounded-full bg-black/60 border border-white/5 group-hover:border-primary/40 transition-all duration-1000">
          <Icon size={120} className="text-white/20 group-hover:text-white transition-all duration-1000" />
        </div>
      </div>
      <div>
        <div className="text-[10px] font-black tracking-[0.4em] text-primary mb-2 italic uppercase">{meta}</div>
        <h4 className="text-2xl font-black font-orbitron text-white group-hover:text-primary transition-colors">{title}</h4>
        <p className="mt-4 text-xs text-white/30 leading-relaxed font-light italic">{desc}</p>
      </div>
    </motion.div>
  );
}

interface ColorBlockProps {
  hex: string;
  name: string;
  meaning: string;
}

function ColorBlock({ hex, name, meaning }: ColorBlockProps) {
  return (
    <div className="group cursor-pointer">
      <div 
        className="w-full aspect-square rounded-3xl border border-white/10 shadow-2xl transition-transform group-hover:scale-105"
        style={{ backgroundColor: hex }}
      />
      <div className="mt-4 text-center">
        <div className="text-[9px] font-black text-white/60 tracking-widest uppercase">{name}</div>
        <div className="text-[8px] text-white/30 italic mt-1">{meaning}</div>
      </div>
    </div>
  );
}

interface ArchetypeCardProps {
  title: string;
  quote: string;
  desc: string;
}

function ArchetypeCard({ title, quote, desc }: ArchetypeCardProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-black font-orbitron text-white border-b border-primary/20 pb-4 italic underline decoration-primary/30 underline-offset-8">
        {title}
      </h3>
      <p className="text-primary italic text-lg leading-snug">"{quote}"</p>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function WordTag({ label }: { label: string }) {
  return (
    <span className="px-8 py-3 rounded-full border border-white/10 text-white/60 text-sm font-bold italic tracking-wider hover:border-primary/40 hover:text-primary transition-all cursor-default bg-black/40 backdrop-blur-md">
      {label}
    </span>
  );
}
