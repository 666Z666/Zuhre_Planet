import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Heart, Eye } from 'lucide-react';

interface DiscoveryStory {
  id: string;
  userName: string;
  avatar: string;
  imageUrl: string;
  isLive?: boolean;
  type: 'image' | 'video';
  views: string;
}

const MOCK_DISCOVERY: DiscoveryStory[] = [
  { id: '1', userName: 'Elara Moon', avatar: '/brand/placeholders/portrait-5.svg', imageUrl: '/brand/placeholders/portrait-4.svg', isLive: true, type: 'image', views: '2.4K' },
  { id: '2', userName: 'Selena Star', avatar: '/brand/placeholders/portrait-6.svg', imageUrl: '/brand/placeholders/portrait-1.svg', isLive: false, type: 'video', views: '1.8K' },
  { id: '3', userName: 'Nova Sky', avatar: '/brand/placeholders/portrait-3.svg', imageUrl: '/brand/placeholders/portrait-1.svg', isLive: true, type: 'image', views: '3.1K' },
  { id: '4', userName: 'Luna Ray', avatar: '/brand/placeholders/portrait-4.svg', imageUrl: '/brand/placeholders/portrait-4.svg', isLive: false, type: 'image', views: '950' },
];

/**
 * Zühre Planet V5.0 - DiscoveryFeed component
 * Masonry-style grid for social exploration.
 */
export function DiscoveryFeed() {
  return (
    <section className="py-12 space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">GALAKTİK <span className="text-primary italic">KEŞFET</span></h2>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">TÜMÜNÜ GÖR</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {MOCK_DISCOVERY.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-xl ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}
          >
            {/* Image */}
            <img 
              src={story.imageUrl} 
              alt={story.userName} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            {/* Status Tags */}
            <div className="absolute top-4 left-4 flex gap-2">
              {story.isLive && (
                <div className="bg-primary px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_#d4af37]">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">LIVE</span>
                </div>
              )}
              {story.type === 'video' && (
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                  <Play size={8} className="text-white fill-white" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest italic">V-PULSE</span>
                </div>
              )}
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
               <Eye size={10} className="text-gray-400" />
               <span className="text-[8px] font-black text-white">{story.views}</span>
            </div>

            {/* User Info */}
            <div className="absolute bottom-6 inset-x-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary overflow-hidden">
                  <img src={story.avatar} alt={story.userName} className="w-full h-full object-cover" />
                </div>
                <div>
                   <span className="text-xs font-black text-white uppercase tracking-widest truncate max-w-[80px] block">{story.userName}</span>
                   <span className="text-[7px] text-primary font-black uppercase tracking-widest">NOVA RANK</span>
                </div>
              </div>
              <motion.button 
                whileTap={{ scale: 0.8 }}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-primary transition-all group/btn"
              >
                <Heart size={14} className="text-white group-hover/btn:fill-white" />
              </motion.button>
            </div>

            {/* Shine Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
