import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Share2, 
  Sparkles,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { SEOManager } from '@/components/SEOManager';

const MagazineCard = ({ post, delay }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-[3rem] bg-[#0a0a0f]/40 border border-white/5 backdrop-blur-3xl overflow-hidden cursor-pointer h-[500px]"
    >
       <div className="absolute inset-0 z-0">
          <img 
            src={post.image} 
            alt={post.title} 
            className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110 blur-sm brightness-50' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
       </div>

       <div className="absolute top-8 left-8 flex gap-2 z-20">
          <div className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 text-[9px] font-black text-primary uppercase tracking-[0.3em] italic">
             {post.category}
          </div>
       </div>

       <div className="absolute inset-x-0 bottom-0 p-10 z-20 transition-all duration-500">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-white/40 uppercase tracking-widest italic">
             <Calendar className="w-3 h-3" /> {post.date}
             <span className="text-primary">/</span>
             <User className="w-3 h-3" /> {post.author}
          </div>
          
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none group-hover:text-primary transition-colors">
             {post.title}
          </h3>

          <div className={`transition-all duration-700 overflow-hidden ${isHovered ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
             <p className="text-[11px] font-black italic uppercase tracking-[0.15em] text-white/60 mb-6 line-clamp-2">{post.excerpt}</p>
             <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:gap-4 transition-all">
                OKUMAYA BAŞLA <ArrowRight className="w-4 h-4" />
             </button>
          </div>
       </div>

       <div className={`absolute top-8 right-8 flex flex-col gap-3 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors">
             <Bookmark className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors">
             <Share2 className="w-4 h-4" />
          </button>
       </div>
    </motion.div>
  );
};

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "LÜKSÜN YENİ ADRESİ: ZÜHRE PLANET",
      excerpt: "Bize alışılmış escort sitelerini unutturan bir değişim başladı. Geleceğin lüks platformu hakkında her şey.",
      image: "/brand/placeholders/portrait-2.svg",
      category: "EDİTÖRÜN SEÇİMİ",
      date: "05 NİS 2026",
      author: "GALAXY TEAM"
    },
    {
       id: 2,
       title: "ELİT YAŞAM TARZI İPUÇLARI",
       excerpt: "Gece hayatının parlayan yıldızları için stil önerileri ve nezaket kuralları. Bir VIP gibi hissedin.",
       image: "/brand/placeholders/portrait-6.svg",
       category: "LIFESTYLE",
       date: "04 NİS 2026",
       author: "ADMIN"
    },
    {
       id: 3,
       title: "GÜVENLİK VE GİZLİLİK REHBERİ",
       excerpt: "Dijital dünyada kişisel mahremiyeti korumak hiç bu kadar önemli olmamıştı. Uzmanlarımızdan tavsiyeler.",
       image: "/brand/placeholders/portrait-1.svg",
       category: "GÜVENLİK",
       date: "03 NİS 2026",
       author: "SECURITY TEAM"
    }
  ];

  return (
    <div className="min-h-screen relative w-full pt-48 pb-32 px-6">
      <SEOManager title="Zühre Planet Magazine - Lüks, Yaşam & Trendler" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Galaxy Magazine V.3.1</span>
           </motion.div>

           <h1 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-12">
              TRENDS & <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">CULTURE</span>
           </h1>
        </div>

        {/* Featured Post (Hero) */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative w-full h-[600px] rounded-[4rem] bg-white/5 border border-white/5 overflow-hidden mb-8 group"
        >
           <img 
             src="/brand/placeholders/portrait-5.svg" 
             className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
             alt="Featured"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
           
           <div className="absolute inset-x-0 bottom-0 p-20 flex flex-col items-center text-center">
              <div className="flex gap-4 mb-8">
                 <div className="px-6 py-2 rounded-full bg-primary text-white text-[10px] font-black italic uppercase tracking-widest shadow-2xl shadow-primary/30">Haftalık Bülten</div>
                 <div className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-xl text-white text-[10px] font-black italic uppercase tracking-widest">Premium</div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-8 h-premium leading-none">
                 GALAXY'NİN <br /> EN PARLAK YILDIZLARI
              </h2>
              <button className="h-16 px-16 bg-white text-black font-black italic uppercase text-xs tracking-[0.3em] rounded-[1.5rem] hover:bg-primary hover:text-white transition-all shadow-2xl">
                 KEŞFETMEYE BAŞLA
              </button>
           </div>
        </motion.div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
           {posts.map((post, i) => (
             <MagazineCard key={post.id} post={post} delay={i * 0.1} />
           ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="p-20 rounded-[4rem] bg-white/5 border border-white/5 backdrop-blur-3xl text-center relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
           <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-8 animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-8">
                 YENİLİKLERİ <br /> <span className="text-primary italic">KAÇIRMAYIN</span>
              </h2>
              <div className="max-w-md mx-auto flex gap-4">
                 <input 
                   type="email" 
                   placeholder="MAGAZINE@GALAXY..." 
                   className="h-16 px-8 flex-1 rounded-2xl bg-white/5 border border-white/5 text-white font-black italic tracking-widest focus:ring-primary/20 placeholder:text-white/10 outline-none"
                 />
                 <button className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                    <ArrowRight className="w-6 h-6" />
                 </button>
              </div>
              <p className="mt-8 text-[9px] font-black italic uppercase tracking-[0.4em] text-white/20">© 2026 ZÜHRE PLANET MAGAZINE — TÜM HAKLARI SAKLIDIR</p>
           </div>
        </div>
      </div>
    </div>
  );
}
