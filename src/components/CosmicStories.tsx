import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface StoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number; // in seconds, default 5s for image
}

export interface UserStoryGroup {
  userId: string;
  userName: string;
  avatar: string;
  tier?: 'free' | 'gold' | 'platinum' | 'vip';
  isVip?: boolean; // Yüzük parıltısı için
  isLive?: boolean; // Canlı pulsing efekti için
  items: StoryItem[];
}

interface CosmicStoriesProps {
  storyGroups: UserStoryGroup[];
  initialGroupIndex?: number;
  onClose: () => void;
}

export function CosmicStories({ storyGroups, initialGroupIndex = 0, onClose }: CosmicStoriesProps) {
  const [currentGroupIdx, setCurrentGroupIdx] = useState(initialGroupIndex);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [reactions, setReactions] = useState<{ id: number, emoji: string }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useTheme();

  const currentGroup = storyGroups[currentGroupIdx];
  const currentItem = currentGroup?.items[currentItemIdx];

  // Story Navigation
  const nextGroup = useCallback(() => {
    if (currentGroupIdx < storyGroups.length - 1) {
      setCurrentGroupIdx((prev) => prev + 1);
      setCurrentItemIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentGroupIdx, onClose, storyGroups.length]);

  const prevGroup = useCallback(() => {
    if (currentGroupIdx > 0) {
      setCurrentGroupIdx((prev) => prev - 1);
      setCurrentItemIdx(storyGroups[currentGroupIdx - 1].items.length - 1);
      setProgress(0);
    }
  }, [currentGroupIdx, storyGroups]);

  const nextItem = useCallback(() => {
    if (currentItemIdx < currentGroup.items.length - 1) {
      setCurrentItemIdx((prev) => prev + 1);
      setProgress(0);
    } else {
      nextGroup();
    }
  }, [currentGroup, currentItemIdx, nextGroup]);

  const prevItem = useCallback(() => {
    if (currentItemIdx > 0) {
      setCurrentItemIdx((prev) => prev - 1);
      setProgress(0);
    } else {
      prevGroup();
    }
  }, [currentItemIdx, prevGroup]);

  const addReaction = (emoji: string) => {
    const id = Date.now();
    setReactions(prev => [...prev.slice(-15), { id, emoji }]);
    // Simulate interaction toast/haptic
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  // Progress Tracker
  useEffect(() => {
    if (isPaused || !currentItem) return;

    let interval: NodeJS.Timeout;

    if (currentItem.type === 'image') {
      const duration = (currentItem.duration || 5) * 1000;
      const updateRate = 50; // 50ms update
      const step = (100 / duration) * updateRate;

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(nextItem, 0); // avoid immediate state transition issue
            return 100;
          }
          return prev + step;
        });
      }, updateRate);
    } else if (currentItem.type === 'video' && videoRef.current) {
      const video = videoRef.current;
      const handleTimeUpdate = () => {
        if (video.duration) {
          const percentage = (video.currentTime / video.duration) * 100;
          setProgress(percentage);
        }
      };
      
      const handleEnded = () => {
        setProgress(100);
        nextItem();
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      // Otomatik oynatmayı garantilemek
      video.play().catch(() => setIsPaused(true)); 

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      };
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentItem, currentGroupIdx, currentItemIdx, isPaused, nextItem]);

  if (!currentGroup || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-2 md:p-6"
      >
        <div className="w-full h-full max-w-sm md:max-w-md lg:max-w-lg aspect-[9/16] bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-2xl shadow-primary/20 ring-1 ring-white/10 group">
          
          {/* Progress Bars */}
          <div className="absolute top-0 inset-x-0 p-4 pt-6 z-20 flex gap-1 bg-gradient-to-b from-black/80 to-transparent">
            {currentGroup.items.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-white transition-all duration-75 w-story-progress"
                  style={{ '--story-progress': idx < currentItemIdx ? '100%' : idx === currentItemIdx ? `${progress}%` : '0%' } as React.CSSProperties}
                />
              </div>
            ))}
          </div>

          {/* User Header */}
          <div className="absolute top-10 inset-x-0 p-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full p-[2px] ${currentGroup.isVip ? 'bg-gradient-to-tr from-yellow-400 via-yellow-200 to-yellow-600' : 'bg-gradient-to-tr from-gold-500 to-gold-500'}`}>
                <img src={currentGroup.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-black" />
              </div>
              <div>
                <span className="text-white font-black uppercase tracking-widest text-[11px] drop-shadow-md">
                  {currentGroup.userName}
                </span>
                {currentGroup.tier && (
                  <span className="block text-white/60 font-black text-[9px] uppercase tracking-widest mt-0.5">
                    {currentGroup.tier} Yıldız
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label={isMuted ? "Sesi Aç" : "Sesi Kapat"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button 
                onClick={onClose} 
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Hikayeyi Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Touch Zones */}
          <div className="absolute inset-0 z-10 flex">
            <div className="w-1/3 h-full cursor-pointer" onClick={prevItem} />
            <div 
              className="w-1/3 h-full" 
              onMouseDown={() => setIsPaused(true)} 
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            />
            <div className="w-1/3 h-full cursor-pointer" onClick={nextItem} />
          </div>

          {/* Media Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full bg-black flex items-center justify-center"
            >
              {currentItem.type === 'image' ? (
                <img src={currentItem.url} alt="Story" className="w-full h-full object-cover" />
              ) : (
                <video 
                  ref={videoRef}
                  src={currentItem.url} 
                  autoPlay 
                  playsInline 
                  muted={isMuted} // Güvenlik için initte ses kapalı olmalı, yoksa browser engeller
                  className="w-full h-full object-cover" 
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Reactions Overlay (Floating) */}
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
             <AnimatePresence>
               {reactions.map((r) => (
                 <motion.div
                   key={r.id}
                   initial={{ opacity: 0, scale: 0.5, y: '80vh', x: `${40 + Math.random() * 20}%` }}
                   animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.5, 1.2], y: '10vh', x: `${30 + Math.random() * 40}%` }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 2, ease: "easeOut" }}
                   className="absolute text-4xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                 >
                   {r.emoji}
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>

          {/* Interaction Bar */}
          <div className="absolute bottom-0 inset-x-0 p-6 z-50 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
             <div className="flex flex-col gap-6">
                {/* Emoji Bar */}
                <div className="flex justify-center gap-4">
                   {['🔥', '✨', '💎', '💖', '👑'].map((emoji) => (
                     <motion.button
                       key={emoji}
                       whileHover={{ scale: 1.2, y: -5 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => addReaction(emoji)}
                       className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-xl hover:bg-white/20 transition-all shadow-lg"
                     >
                       {emoji}
                     </motion.button>
                   ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-4">
                   <div className="flex-1 relative">
                      <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Arzunu gönder..." 
                        className="w-full h-14 bg-white/10 backdrop-blur-xl rounded-2xl px-6 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-primary/50 transition-all"
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                         <button className="text-primary font-black text-xs tracking-widest uppercase hover:scale-110 transition-transform">GÖNDER</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Pause Indicator overlay */}
          {isPaused && (
             <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none opacity-50 bg-black/20">
             </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
