/**
 * PostBookingReview Component
 * 
 * Post-appointment review form for customers to rate their experience.
 * V3 Update: Added 'Similarity' metric for photo verification trust.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Star, Smile, Meh, Frown, Sparkles,
  CheckCircle2, Send, Heart,
  Camera, MapPin, UserCheck, Zap
} from 'lucide-react';
import { toast } from 'sonner';

export interface ReviewFormData {
  overallRating: number;
  similarity: number; // New V3 Metric
  cleanliness: number;
  serviceQuality: number;
  attitude: number;
  location: number;
  wouldReturn: boolean;
  comment: string;
  tags?: string[];
}

interface PostBookingReviewProps {
  bookingId: string;
  escortId: string;
  escortName: string;
  escortAvatar?: string;
  bookingDate: Date;
  onSubmit: (review: ReviewFormData) => void;
  currentRating?: number;
}

export function PostBookingReview({
  escortName,
  bookingDate,
  onSubmit,
}: PostBookingReviewProps) {
  const [step, setStep] = useState<'start' | 'rating' | 'comment' | 'confirm'>('start');
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    similarity: 0,
    cleanliness: 0,
    serviceQuality: 0,
    attitude: 0,
    location: 0,
    wouldReturn: false,
    comment: ''
  });

  const criteriaConfig = [
    {
      key: 'similarity' as const,
      icon: <Camera className="w-5 h-5 text-blue-400" />,
      title: 'Fotoğraf Benzerliği',
      description: 'Görsellerle fiziki görünümün eşleşmesi',
    },
    {
      key: 'cleanliness' as const,
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      title: 'Temizlik ve Hijyen',
      description: 'Mekânın ve kişisel bakımın kalitesi',
    },
    {
      key: 'serviceQuality' as const,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: 'Hizmet Kalitesi',
      description: 'Hizmetin beklentileri karşılaması',
    },
    {
      key: 'attitude' as const,
      icon: <UserCheck className="w-5 h-5 text-pink-400" />,
      title: 'Tutum ve Davranış',
      description: 'Naziklik ve profesyonellik düzeyi',
    },
    {
      key: 'location' as const,
      icon: <MapPin className="w-5 h-5 text-gold-400" />,
      title: 'Mekân Konforu',
      description: 'Mekânın rahatlığı ve güvenliği',
    }
  ];

  const handleStarClick = (criteria: keyof ReviewFormData, rating: number) => {
    setFormData(prev => ({ ...prev, [criteria]: rating }));
  };

  const getStarIcon = (rating: number, index: number) => {
     return (
       <Star className={`w-5 h-5 transition-all ${index < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
     );
  };

  if (step === 'start') {
    return (
      <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <CardContent className="p-12 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black font-orbitron uppercase tracking-tighter">Randevu Tamamlandı!</h3>
            <p className="text-gray-500 max-w-sm mx-auto font-light">
              Deneyiminizi paylaşarak **{escortName}**'ın topluluktaki güvenilirliğini artırın.
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 inline-flex gap-8">
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tarih</p>
              <p className="font-bold text-sm">{new Date(bookingDate).toLocaleDateString('tr-TR')}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Partner</p>
              <p className="font-bold text-sm text-emerald-400">{escortName}</p>
            </div>
          </div>
          <Button 
            size="lg" 
            onClick={() => setStep('rating')} 
            className="w-full h-16 bg-white text-black hover:bg-gray-200 font-black uppercase text-sm tracking-widest rounded-2xl mt-4"
          >
            Puanlamaya Başla
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'rating') {
    return (
      <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl max-w-2xl mx-auto">
        <CardHeader className="p-10 border-b border-white/5">
          <CardTitle className="text-2xl font-black font-orbitron uppercase tracking-tighter flex items-center gap-3 text-white">
            <Star className="w-6 h-6 text-yellow-500" /> Puanlama Radarı
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <div className="grid gap-6">
            {criteriaConfig.map((criteria) => {
              const rating = formData[criteria.key] as number;
              return (
                <div key={criteria.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {criteria.icon}
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">{criteria.title}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">{criteria.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <button
                          key={i}
                          onClick={() => handleStarClick(criteria.key, i + 1)}
                          className="hover:scale-125 transition-transform"
                        >
                          {getStarIcon(rating, i)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(rating / 5) * 100}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_#3fae86]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-black uppercase tracking-widest text-white/70">Tekrar randevu alır mısınız?</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`rounded-xl px-6 h-10 font-bold border-white/10 ${formData.wouldReturn ? 'bg-white text-black' : 'text-white'}`}
                onClick={() => setFormData({ ...formData, wouldReturn: true })}
              >
                EVET
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-xl px-6 h-10 font-bold border-white/10 ${!formData.wouldReturn ? 'bg-red-500 text-white' : 'text-white'}`}
                onClick={() => setFormData({ ...formData, wouldReturn: false })}
              >
                HAYIR
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
             <Button 
               variant="ghost" 
               className="flex-1 h-16 text-gray-500 font-black uppercase tracking-widest rounded-2xl"
               onClick={() => setStep('start')}
             >
               Geri
             </Button>
             <Button 
                className="flex-1 h-16 bg-emerald-600 text-white hover:bg-emerald-500 font-black uppercase text-sm tracking-widest rounded-2xl"
                onClick={() => setStep('comment')}
             >
                Yoruma Geç <Send className="w-4 h-4 ml-2" />
             </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl max-w-2xl mx-auto">
      <CardHeader className="p-10 border-b border-white/5">
        <CardTitle className="text-2xl font-black font-orbitron uppercase tracking-tighter flex items-center gap-3 text-white">
          <MessageSquare className="w-6 h-6 text-emerald-400" /> Tecrübenizi Yazın
        </CardTitle>
      </CardHeader>
      <CardContent className="p-10 space-y-8">
        <div className="space-y-4">
           <Textarea 
             placeholder="Randevunuz nasıl geçti? Detaylar güven toplumu için önemlidir..."
             className="min-h-[200px] bg-white/5 border-white/10 text-white rounded-3xl p-6 focus:ring-emerald-500/50"
             value={formData.comment}
             onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
           />
           <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">
             <span>Minimum 20 karakter önerilir</span>
             <span>{formData.comment.length} / 500</span>
           </div>
        </div>

        <Button 
           className="w-full h-16 bg-white text-black hover:bg-gray-200 font-black uppercase text-sm tracking-widest rounded-2xl"
           onClick={() => {
             onSubmit(formData);
             toast.success('Değerlendirmeniz galaksiye gönderildi!');
           }}
        >
          Değerlendirmeyi Yayınla
        </Button>
      </CardContent>
    </Card>
  );
}

// Missing imports fix
import { MessageSquare } from 'lucide-react';
