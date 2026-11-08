import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Twitter, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Zap,
  Mail,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLuxuryTheme } from '@/contexts/LuxuryThemeContext';
import { ThemeIcon } from './ui/ThemeIcon';
import { Logo } from '@/components/brand/Logo';

export function Footer() {
  const { theme } = useLuxuryTheme();

  const footerLinks = [
    {
      title: 'KEŞFET',
      links: [
        { name: 'Elite Katalog', path: ROUTES.CATALOG },
        { name: 'VIP Üyelik', path: ROUTES.VIP },
        { name: 'Galaxy Magazine', path: ROUTES.BLOG },
        { name: 'Trendler', path: ROUTES.CATALOG },
      ],
    },
    {
      title: 'KURUMSAL',
      links: [
        { name: 'Hakkımızda', path: '/about' },
        { name: 'Nasıl Çalışır?', path: '/how-it-works' },
        { name: 'Üyelik Paketleri', path: ROUTES.PRICING },
        { name: 'İş Ortaklığı', path: ROUTES.CONTACT },
      ],
    },
    {
      title: 'GÜVENLİK',
      links: [
        { name: 'Güvenlik Rehberi', path: '/safety' },
        { name: 'KVKK', path: '/kvkk' },
        { name: 'Gizlilik Politikası', path: '/privacy' },
        { name: 'Çerez Ayarları', path: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="relative mt-32 pb-20 px-6 overflow-hidden">
      {/* Cinematic Backdrop Accent */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] blur-[150px] opacity-20 pointer-events-none rounded-full bg-gradient-to-t from-primary via-secondary/20 to-transparent transition-colors duration-1000`} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-3xl mb-24">
           <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <Logo size={64} showTagline />
              </div>
              <p className="max-w-md text-sm font-black italic uppercase tracking-widest text-white/30 leading-loose">
                 Galaksinin en seçkin escort platformu. Lüks, gizlilik ve 3D teknolojisinin birleştiği tek nokta.
              </p>
              <div className="flex gap-4">
                 {[
                   { Icon: Instagram, label: "Instagram" },
                   { Icon: Twitter, label: "Twitter" },
                   { Icon: Send, label: "Telegram" },
                   { Icon: Globe, label: "Website" }
                 ].map((item, i) => (
                   <button 
                     key={i} 
                     aria-label={item.label}
                     className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/50 transition-all"
                   >
                      <item.Icon className="w-5 h-5" />
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex flex-col justify-center">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-6">GALAXY BÜLTEN</h3>
              <div className="relative group">
                 <input 
                   type="email" 
                   placeholder="VIP@ZUHRE.PLANET" 
                   aria-label="E-posta Adresi"
                   className="w-full h-20 pl-8 pr-32 rounded-[2rem] bg-black/40 border border-white/10 text-white font-black italic tracking-[0.2em] outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                 />
                 <button 
                   aria-label="Bültene Katıl"
                   className="absolute right-3 top-3 bottom-3 px-8 bg-primary rounded-2xl text-white font-black italic uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                 >
                    KATIL
                 </button>
              </div>
              <p className="mt-4 text-[9px] font-black italic uppercase tracking-[0.3em] text-white/10">Abone olarak gizlilik sözleşmesini kabul edersiniz.</p>
           </div>
        </div>

        {/* Middle Section: Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24 px-10">
           {footerLinks.map((section, idx) => (
             <div key={idx} className="space-y-6">
                <h4 className="text-[10px] font-black italic uppercase tracking-[0.5em] text-primary">{section.title}</h4>
                <ul className="space-y-4">
                   {section.links.map((link, lIdx) => (
                     <li key={lIdx}>
                        <Link href={link.path}>
                          <span className="text-xs font-black italic uppercase tracking-widest text-white/40 hover:text-white hover:translate-x-2 transition-all cursor-pointer inline-block">
                             {link.name}
                          </span>
                        </Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}

           <div className="space-y-6">
              <h4 className="text-[10px] font-black italic uppercase tracking-[0.5em] text-primary">KONTAK</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-white/40">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black tracking-widest italic uppercase">Support@zuhre.planet</span>
                 </div>
                 <div className="flex items-center gap-3 text-white/40">
                    <PhoneCall className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black tracking-widest italic uppercase">+90 212 ... .. ..</span>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck className="w-4 h-4 text-primary" />
                       <span className="text-[9px] font-black text-white italic uppercase tracking-tighter">Verified Secure</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: '100%' }}
                         transition={{ duration: 2 }}
                         className="h-full bg-primary"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Section: Legal & Credits */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 px-10">
           <div className="flex items-center gap-10">
              <span className="text-[9px] font-black italic uppercase tracking-[0.4em] text-white/20">© {new Date().getFullYear()} ZÜHRE PLANET</span>
              <div className="hidden lg:flex items-center gap-2">
                 <ThemeIcon type="star" size={12} className="text-primary/40" />
                 <span className="text-[9px] font-black italic uppercase tracking-[0.4em] text-white/10">CRAFTED FOR THE ELITE</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[9px] font-black text-white/50 italic uppercase tracking-widest leading-none">SYSTEM STATUS: OPTIMAL</span>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}
