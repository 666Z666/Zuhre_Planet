import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  MessageSquare,
  Clock,
  AlertTriangle,
  User,
  Send,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'customer-to-escort' | 'escort-to-customer';
  targetName: string;
}

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  targetName 
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Additional ratings for escort-to-customer mode
  const [punctuality, setPunctuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Lütfen bir yıldız puanı seçin!');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(mode === 'customer-to-escort' ? 'Yorumunuz başarıyla yayınlandı!' : 'Müşteri raporu istihbarat ağına eklendi.');
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-[#0a0a0f] border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className={`p-3 rounded-xl ${mode === 'customer-to-escort' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                  {mode === 'customer-to-escort' ? <Star className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
               </div>
               <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                    {mode === 'customer-to-escort' ? 'DENEYİMİNİ PUANLA' : 'MÜŞTERİ RAPORU OLUŞTUR'}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">HEDEF: {targetName}</p>
               </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* RATING SECTION */}
            <div className="space-y-6">
               <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-center italic">
                 {mode === 'customer-to-escort' ? 'GENEL DENEYİM YILDIZI' : 'GÜVENLİK PUANI'}
               </label>
               <div className="flex justify-center gap-3">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <button
                     key={star}
                     type="button"
                     onMouseEnter={() => setHoveredRating(star)}
                     onMouseLeave={() => setHoveredRating(0)}
                     onClick={() => setRating(star)}
                     className="transition-transform active:scale-90"
                   >
                     <Star 
                       className={`w-10 h-10 ${
                         (hoveredRating || rating) >= star ? 'text-amber-500 fill-amber-500' : 'text-white/5'
                       } transition-all duration-300`} 
                     />
                   </button>
                 ))}
               </div>
            </div>

            {/* ADDITIONAL RATINGS FOR ESCORT */}
            {mode === 'escort-to-customer' && (
              <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/5">
                 <div className="space-y-3">
                    <span className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-2"><Clock className="w-3 h-3" /> DAKİKLİK</span>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(s => (
                         <div 
                           key={s} 
                           onClick={() => setPunctuality(s)}
                           className={`h-2 flex-1 rounded-full cursor-pointer transition-all ${punctuality >= s ? 'bg-amber-500' : 'bg-white/5'}`} 
                         />
                       ))}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <span className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-2"><MessageSquare className="w-3 h-3" /> İLETİŞİM</span>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(s => (
                         <div 
                           key={s} 
                           onClick={() => setCommunication(s)}
                           className={`h-2 flex-1 rounded-full cursor-pointer transition-all ${communication >= s ? 'bg-emerald-400' : 'bg-white/5'}`} 
                         />
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {/* COMMENT SECTION */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between italic text-center w-full">
                  <span>{mode === 'customer-to-escort' ? 'YORUMUNUZ (HERKESE AÇIK)' : 'ÖZEL NOT (SADECE ESKORTLAR GÖREBİLİR)'}</span>
                  {mode === 'escort-to-customer' && <Lock className="w-3 h-3 text-red-500" />}
               </label>
               <Textarea 
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                 placeholder={mode === 'customer-to-escort' ? "Deneyiminizi paylaşın..." : "Bu müşteri hakkında diğer eskortlar için not bırakın..."}
                 className="min-h-[120px] rounded-[1.5rem] bg-black/60 border-white/10 text-white font-medium resize-none focus:border-primary/40 focus:ring-0 p-6"
               />
            </div>

            {/* EXCLUSIVE BLACKLIST TOGGLE FOR ESCORT */}
            {mode === 'escort-to-customer' && (
              <div 
                onClick={() => setIsBlacklisted(!isBlacklisted)}
                className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isBlacklisted ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5'
                }`}
              >
                 <div className="flex items-center gap-4">
                    <AlertTriangle className={`w-5 h-5 ${isBlacklisted ? 'text-red-500' : 'text-gray-600'}`} />
                    <div>
                       <p className={`text-xs font-black uppercase ${isBlacklisted ? 'text-red-500' : 'text-gray-500'}`}>KARALİSTEYE EKLE</p>
                       <p className="text-[9px] text-gray-700 font-bold uppercase mt-0.5">CİDDİ GÜVENLİK SORUNLARI İÇİNDİR</p>
                    </div>
                 </div>
                 <div className={`w-10 h-5 rounded-full relative transition-all ${isBlacklisted ? 'bg-red-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isBlacklisted ? 'left-5.5' : 'left-0.5'}`} />
                 </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">
               <Button 
                 type="button" 
                 onClick={onClose} 
                 variant="outline" 
                 className="flex-1 h-14 rounded-2xl border-white/5 text-xs font-black uppercase tracking-widest text-gray-500"
               >
                 İPTAL
               </Button>
               <Button 
                 type="submit" 
                 className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-xl flex items-center justify-center gap-3 ${
                   mode === 'customer-to-escort' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                 }`}
                 disabled={isSubmitting}
               >
                 {isSubmitting ? 'GÖNDERİLİYOR...' : mode === 'customer-to-escort' ? 'YORUMU YAYINLA' : 'RAPORLARI KAYDET'}
                 {!isSubmitting && <Send className="w-4 h-4" />}
               </Button>
            </div>

          </form>

          {/* BACKGROUND GLOW */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] -mb-32 ${mode === 'customer-to-escort' ? 'bg-amber-500/10' : 'bg-red-500/10'}`} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
