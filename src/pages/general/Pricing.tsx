import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Crown, Shield, 
  ArrowRight, Sparkles, 
  TrendingUp, Users, Eye, Clock,
  Gem, Check
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { SEOManager } from '@/components/SEOManager';
import { Footer } from '@/components/Footer';

interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  features: string[];
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  popular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  delay: number;
  activeTab: 'weekly' | 'monthly';
  onSelect: (planId: string) => void;
}

const PricingCard = ({ plan, delay, activeTab, onSelect }: PricingCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-8 rounded-[3rem] bg-[#0a0a0f]/40 border border-white/5 backdrop-blur-3xl transition-all duration-500 perspective-1000 ${
        plan.popular ? 'ring-2 ring-primary shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)]' : ''
      }`}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 z-10 rounded-[3rem] border border-white/10 pointer-events-none group-hover:border-primary/20 transition-colors" />

      {/* Badge */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.color} text-white text-[9px] font-black px-4 py-1.5 rounded-b-xl uppercase tracking-[0.3em] z-20 shadow-lg`}>
        {plan.badge}
      </div>

      <div className="relative z-20 text-center pt-8 pb-4" style={{ transform: "translateZ(40px)" }}>
        <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{plan.name}</h3>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 italic">{plan.duration} SÜRE</p>
        
        <div className="flex items-baseline justify-center gap-1 mb-8">
           <span className="text-[10px] text-white/40 font-black italic">₺</span>
           <span className="text-5xl font-black text-white tracking-tighter">
              {plan.price}
           </span>
           <span className="text-[10px] text-white/40 font-black italic">/{activeTab === 'weekly' ? 'HAFTA' : 'AY'}</span>
        </div>

        <div className="space-y-4 mb-10 text-left px-2">
           {plan.features.map((f: string, i: number) => (
             <div key={i} className="flex items-center gap-3 text-xs font-black italic text-white/60 group-hover:text-white/80 transition-colors">
                <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                   <Check className="w-3 h-3 text-primary" />
                </div>
                {f}
             </div>
           ))}
        </div>

        <Button 
          onClick={() => onSelect(plan.id)}
          className={`w-full h-16 rounded-2xl font-black italic uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl ${
            plan.popular 
            ? 'bg-primary text-white shadow-primary/20 hover:scale-105' 
            : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'
          }`}
        >
          PAKETİ SEÇ
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [, setLocation] = useLocation();
  
  const weeklyPlans: PricingPlan[] = [
    {
      id: 'w_basic',
      name: 'Starter',
      duration: '7 Gün',
      price: 149,
      features: ['Vitrinde Öncelik', 'Özel Rozet', 'Sınırsız Mesaj', 'X5 Fotoğraf'],
      color: 'from-blue-500 to-emerald-500',
      icon: Clock,
      badge: 'GİRİŞ'
    },
    {
      id: 'w_pro',
      name: 'Professional',
      duration: '7 Gün',
      price: 249,
      features: ['Öncelikli Listeleme', '15 Fotoğraf / 3 Video', 'Haftalık 1 Boost', 'VIP Desteği'],
      color: 'from-primary to-secondary',
      icon: Crown,
      badge: 'EN POPÜLER',
      popular: true
    },
    {
      id: 'w_elite',
      name: 'Elite',
      duration: '7 Gün',
      price: 399,
      features: ['Ultra Listeleme', 'Sınırsız Galeri', 'Haftalık 3 Boost', 'Öncelikli İnceleme'],
      color: 'from-amber-400 to-orange-600',
      icon: Gem,
      badge: 'PREMIUM'
    }
  ];

  const monthlyPlans: PricingPlan[] = [
    {
      id: 'm_basic',
      name: 'Starter',
      duration: '30 Gün',
      price: 499,
      features: ['Vitrinde Öncelik', 'Özel Rozet', 'Sınırsız Mesaj', 'X5 Fotoğraf', '%16 Tasarruf'],
      color: 'from-blue-500 to-emerald-500',
      icon: Clock,
      badge: 'GİRİŞ'
    },
    {
      id: 'm_pro',
      name: 'Professional',
      duration: '30 Gün',
      price: 799,
      features: ['Öncelikli Listeleme', '15 Fotoğraf / 3 Video', 'Aylık 5 Boost', 'VIP Desteği', '%20 Tasarruf'],
      color: 'from-primary to-secondary',
      icon: Crown,
      badge: 'EN POPÜLER',
      popular: true
    },
    {
      id: 'm_elite',
      name: 'Elite',
      duration: '30 Gün',
      price: 1299,
      features: ['Ultra Listeleme', 'Sınırsız Galeri', 'Aylık 15 Boost', 'Öncelikli İnceleme', '%18 Tasarruf'],
      color: 'from-amber-400 to-orange-600',
      icon: Gem,
      badge: 'PREMIUM'
    }
  ];

  const currentPlans = activeTab === 'weekly' ? weeklyPlans : monthlyPlans;

  const handleSelectPlan = () => {
    setLocation('/register/escort');
  };

  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6">
      <SEOManager title="Zühre Planet - Üyelik Paketleri & VIP Ayrıcalıkları" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-24">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Üyelik & Ayrıcalıklar</span>
           </motion.div>

           <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none h-premium mb-8">
              GÖRÜNÜRLÜĞÜNÜZÜ <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">ARTIRIN</span>
           </h1>

           <div className="flex justify-center mt-12">
              <div className="inline-flex items-center p-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem]">
                 <button 
                   onClick={() => setActiveTab('weekly')}
                   className={`px-10 h-14 rounded-[1.5rem] text-[10px] font-black italic uppercase tracking-[0.25em] transition-all ${activeTab === 'weekly' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-white/40 hover:text-white'}`}
                 >
                   HAFTALIK
                 </button>
                 <button 
                   onClick={() => setActiveTab('monthly')}
                   className={`px-10 h-14 rounded-[1.5rem] text-[10px] font-black italic uppercase tracking-[0.25em] transition-all ${activeTab === 'monthly' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-white/40 hover:text-white'}`}
                 >
                   AYLIK
                 </button>
              </div>
           </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           {currentPlans.map((plan, i) => (
             <PricingCard key={plan.id} plan={plan} delay={i * 0.1} activeTab={activeTab} onSelect={handleSelectPlan} />
           ))}
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
           {[
             { label: 'GÖRÜNTÜLENME', value: '10X', icon: TrendingUp },
             { label: 'TIKLANMA ORANI', value: '%70+', icon: Eye },
             { label: 'GÜVEN PUANI', value: 'FULL', icon: Shield },
             { label: 'MÜŞTERİ DESTEĞİ', value: '24/7', icon: Users }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="p-8 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-xl text-center group hover:bg-white/10 transition-colors"
             >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-black text-white italic tracking-tighter mb-1">{stat.value}</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</div>
             </motion.div>
           ))}
        </div>

        {/* CTA Footer */}
        <div className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-r from-primary to-secondary relative overflow-hidden group">
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="text-center md:text-left">
                 <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none mb-4">
                    PROFESYONEL <br /> ADIM ATIN
                 </h2>
                 <p className="text-white/60 text-sm font-black uppercase tracking-widest italic">İlk 100 kullanıcıya özel %50 indirim fırsatı.</p>
              </div>
              <Button
                onClick={handleSelectPlan}
                className="h-20 px-16 bg-white text-black hover:bg-black hover:text-white font-black italic uppercase text-xs tracking-[0.3em] rounded-[2rem] transition-all shadow-2xl"
              >
                 ŞİMDİ KATIL
              </Button>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
