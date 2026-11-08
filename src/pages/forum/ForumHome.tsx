import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Users, PlusCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { ROUTES } from '@/constants/routes';

export default function ForumHome() {
  const [, setLocation] = useLocation();
  const { data: categories, isLoading } = trpc.forum.getCategories.useQuery();
  const totalTopics = categories?.reduce((sum, category) => sum + (category.topicCount || 0), 0) || 0;
  const totalPosts = categories?.reduce((sum, category) => sum + (category.postCount || 0), 0) || 0;

  if (isLoading) return <div className="p-10 text-white animate-pulse">Kategoriler yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">KOZMİK <span className="text-primary">FORUM</span></h1>
          <p className="text-white/40 text-sm tracking-widest uppercase">Fikirlerin galaksiler arası buluşma noktası</p>
        </div>
        <button 
           onClick={() => setLocation(ROUTES.FORUM_NEW_TOPIC)}
           className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform"
        >
          <PlusCircle className="w-5 h-5" />
          YENİ KONU AÇ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         <StatsCard icon={<Users className="text-blue-400" />} label="TOPLAM KATEGORİ" value={String(categories?.length || 0)} />
         <StatsCard icon={<MessageSquare className="text-primary" />} label="TOPLAM KONU" value={totalTopics.toLocaleString('tr-TR')} />
         <StatsCard icon={<TrendingUp className="text-green-400" />} label="TOPLAM MESAJ" value={totalPosts.toLocaleString('tr-TR')} />
      </div>

      <div className="space-y-6">
        {categories?.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ x: 10 }}
            onClick={() => setLocation(ROUTES.FORUM + "/" + cat.slug)}
            className="group relative p-8 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-white/40 text-sm max-w-xl">{cat.description}</p>
              </div>
              <div className="flex items-center gap-8 text-white/20">
                 <div className="text-center">
                   <div className="text-lg font-bold text-white/60">{cat.topicCount.toLocaleString('tr-TR')}</div>
                   <div className="text-[10px] tracking-widest uppercase">KONU</div>
                 </div>
                 <div className="text-center">
                   <div className="text-lg font-bold text-white/60">{cat.postCount.toLocaleString('tr-TR')}</div>
                   <div className="text-[10px] tracking-widest uppercase">MESAJ</div>
                 </div>
                 <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    );
}

function StatsCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] text-white/30 tracking-widest uppercase font-bold">{label}</div>
      </div>
    </div>
  );
}
