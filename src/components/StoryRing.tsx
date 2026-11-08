import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CosmicStories, UserStoryGroup } from './CosmicStories';

interface StoryRingProps {
  storyGroups: UserStoryGroup[];
}

export function StoryRingGallery({ storyGroups }: StoryRingProps) {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);

  if (!storyGroups || storyGroups.length === 0) return null;

  return (
    <>
      {/* Story Bubbles Container */}
      <div className="w-full overflow-x-auto no-scrollbar py-6">
        <div className="flex gap-6 px-6 md:px-12 w-max mx-auto md:mx-0">
          {storyGroups.map((group, idx) => (
            <motion.div
              key={group.userId}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveStoryIdx(idx)}
              className="flex flex-col items-center gap-2 cursor-pointer group w-20 md:w-24"
            >
              {/* Outer Ring */}
              <div 
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] transition-all duration-500
                  ${group.isLive
                    ? 'bg-gradient-to-tr from-primary to-emerald-400 shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]'
                    : group.isVip 
                      ? 'bg-gradient-to-tr from-yellow-500 via-orange-400 to-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.4)] group-hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]' 
                      : 'bg-gradient-to-tr from-gold-600 via-gold-500 to-pink-500 shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]'
                  }`}
              >
                {/* Live Pulse Animation Overlay */}
                {group.isLive && (
                  <motion.div 
                    animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-4 border-primary/50 pointer-events-none"
                  />
                )}
                {/* Inner White/Dark border gap */}
                <div className="w-full h-full rounded-full bg-slate-950 p-[2px]">
                  {/* Image */}
                  <img 
                    src={group.avatar} 
                    alt={group.userName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {/* Live Badge Popup */}
                {group.isLive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary rounded-md border border-white/20 shadow-lg z-10">
                    <span className="text-[7px] font-black text-white italic tracking-tighter uppercase whitespace-nowrap">LIVE</span>
                  </div>
                )}
              </div>
              
              {/* Username */}
              <span className="text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] truncate w-full text-center group-hover:text-primary transition-colors">
                {group.userName}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {activeStoryIdx !== null && (
        <CosmicStories
          storyGroups={storyGroups}
          initialGroupIndex={activeStoryIdx}
          onClose={() => setActiveStoryIdx(null)}
        />
      )}
    </>
  );
}
