import React from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { MessageCircle, User, Calendar, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { ROUTES } from '@/constants/routes';

export default function ForumCategory() {
  const [, params] = useRoute("/forum/:slug");
  const [, setLocation] = useLocation();
  const slug = (params as Record<string, string>)?.slug || "";

  const { data, isLoading } = trpc.forum.getTopics.useQuery({ categorySlug: slug });

  if (isLoading) return <div className="p-10 text-white animate-pulse">Konular yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button 
        onClick={() => setLocation(ROUTES.FORUM)}
        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-xs font-bold tracking-widest uppercase"
      >
        <ArrowLeft className="w-4 h-4" />
        FORUM ANA SAYFA
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">{data?.category.name}</h1>
        <p className="text-white/40 text-sm uppercase tracking-widest">{data?.category.description}</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 p-6 bg-white/5 border-b border-white/10 text-[10px] font-black tracking-widest text-white/30 uppercase">
          <div className="col-span-7">KONU BAŞLIĞI / YAZAR</div>
          <div className="col-span-2 text-center">İSTATİSTİK</div>
          <div className="col-span-3 text-right">SON MESAJ</div>
        </div>

        <div className="divide-y divide-white/5">
          {data?.topics.map((topic) => (
            <motion.div 
              key={topic.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              onClick={() => setLocation(ROUTES.FORUM + "/topic/" + topic.slug)}
              className="grid grid-cols-12 p-6 items-center cursor-pointer group"
            >
              <div className="col-span-7 flex gap-4 items-start">
                <div className="p-2 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1 group-hover:text-primary transition-colors">{topic.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-white/30 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {topic.author?.fullName || 'Anonim'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(topic.createdAt || '').toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex justify-center gap-6 text-[11px] font-bold text-white/40">
                <div className="flex flex-col items-center">
                   <span className="text-white/60">{topic.replyCount || 0}</span>
                   <span className="text-[8px] uppercase tracking-tighter">CEVAP</span>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-white/60">{topic.viewCount || 0}</span>
                   <span className="text-[8px] uppercase tracking-tighter">GÖRÜNTÜLENME</span>
                </div>
              </div>

              <div className="col-span-3 text-right">
                <div className="text-white/60 font-bold text-xs mb-1">{topic.lastPostAuthor?.fullName || topic.author?.fullName || 'Anonim'}</div>
                <div className="text-[9px] text-white/20 uppercase tracking-widest font-black">
                  {new Date(topic.lastPostAt || topic.createdAt || '').toLocaleString('tr-TR')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
