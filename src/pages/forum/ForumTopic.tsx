import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, UserCircle, ShieldCheck } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { ROUTES } from '@/constants/routes';

export default function ForumTopic() {
  const [, params] = useRoute("/forum/topic/:slug");
  const [, setLocation] = useLocation();
  const [replyContent, setReplyContent] = useState("");
  const slug = (params as Record<string, string>)?.slug || "";

  const { data, isLoading, refetch } = trpc.forum.getTopicDetails.useQuery({ slug });
  const addPost = trpc.forum.addPost.useMutation({
    onSuccess: () => {
      setReplyContent("");
      refetch();
    }
  });

  const handleReply = () => {
    if (!replyContent.trim() || !data?.topic.id) return;
    addPost.mutate({ topicId: Number(data.topic.id), content: replyContent });
  };

  if (isLoading) return <div className="p-10 text-white animate-pulse">Konu yükleniyor...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button 
        onClick={() => setLocation(ROUTES.FORUM + "/" + data?.topic.category.slug)}
        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-xs font-bold tracking-widest uppercase"
      >
        <ArrowLeft className="w-4 h-4" />
        KATEGORİYE DÖN
      </button>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black tracking-widest uppercase rounded-full border border-primary/30">
              {data?.topic.category.name}
           </span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight leading-tight">{data?.topic.title}</h1>
      </div>

      <div className="space-y-8 mb-16">
        {data?.posts.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col md:flex-row gap-6 p-1 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden"
          >
            {/* Author Sidebar */}
            <div className="md:w-48 bg-white/5 p-6 flex flex-col items-center text-center rounded-[1.8rem]">
               <div className="relative mb-4">
                 <div className="absolute -inset-2 bg-primary/20 blur-lg rounded-full opacity-50" />
                 <UserCircle className="w-16 h-16 text-white/80 relative z-10" />
                 <div className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full border-2 border-black z-20">
                    <ShieldCheck className="w-3 h-3 text-white" />
                 </div>
               </div>
               <div className="text-sm font-black text-white uppercase tracking-tighter mb-1">{post.author?.fullName || 'Anonim'}</div>
               <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-4">PLATINUM ÜYE</div>
               
               <div className="w-full h-px bg-white/10 mb-4" />
               
               <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                     <div className="text-white/60 text-[10px] font-bold">128</div>
                     <div className="text-[7px] text-white/20 font-black tracking-widest uppercase">KONU</div>
                  </div>
                  <div className="text-center">
                     <div className="text-white/60 text-[10px] font-bold">4.5K</div>
                     <div className="text-[7px] text-white/20 font-black tracking-widest uppercase">MESAJ</div>
                  </div>
               </div>
            </div>

            {/* Post Content */}
            <div className="flex-grow p-8 flex flex-col justify-between">
              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-white/80 leading-relaxed tracking-wide text-sm whitespace-pre-wrap">{post.content}</p>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <div className="text-[9px] text-white/20 font-black tracking-[0.3em] uppercase">
                   {new Date(post.createdAt || '').toLocaleString('tr-TR')}
                </div>
                <div className="flex gap-4">
                   <button className="text-white/20 hover:text-primary transition-colors text-[10px] font-black tracking-widest uppercase">ALINTILA</button>
                   <button className="text-white/20 hover:text-red-400 transition-colors text-[10px] font-black tracking-widest uppercase">ŞİKAYET ET</button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reply Area */}
      <div className="relative">
         <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-orange-400/30 rounded-[2.5rem] blur-xl opacity-50" />
         <div className="relative bg-black border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6">CEVAP VER</h3>
            <textarea 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Fikirlerinizi buraya yazın..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none mb-6"
            />
            <div className="flex justify-end">
              <button 
                onClick={handleReply}
                disabled={addPost.isPending}
                className="group flex items-center gap-3 px-10 py-4 bg-primary text-white font-black rounded-full hover:scale-105 transition-all shadow-glow-primary active:scale-95 disabled:opacity-50"
              >
                <div className="text-xs tracking-[0.2em] uppercase">MESAJI GÖNDER</div>
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
