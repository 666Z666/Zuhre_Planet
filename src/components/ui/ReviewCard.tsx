import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, User } from 'lucide-react';
import { Review } from '@/types/domain';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5">
         <Star className="w-16 h-16 text-amber-500" />
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        
        {/* Header: User Info & Rating */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-blue-500 p-0.5">
                 <div className="w-full h-full rounded-[0.9rem] bg-black flex items-center justify-center overflow-hidden">
                    {review.customerAvatar ? (
                      <img src={review.customerAvatar} alt={review.customerName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white/40" />
                    )}
                 </div>
              </div>
              <div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">{review.customerName}</h4>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">{review.createdAt}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-white/10'}`} 
                />
              ))}
           </div>
        </div>

        {/* Content */}
        <p className="text-gray-400 text-sm leading-relaxed italic">
          "{review.comment}"
        </p>

        {/* Footer: Verified Badge */}
        {review.isVerified && (
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">DOĞRULANMIŞ RANDEVU</span>
             </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};
