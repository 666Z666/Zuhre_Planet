/**
 * Review Analysis Component
 * 
 * Escort profillerinde oylama detaylarını (V3 Metrikleri) görselleştiren bileşen.
 * Puan dökümü; fotoğraf benzerliği, temizlik, hizmet kalitesi vb. gibi kategorik bar grafiklerle gösterilir.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  Zap, 
  UserCheck, 
  MapPin, 
  Star 
} from 'lucide-react';

interface MetricRating {
  label: string;
  value: number; // 0-5
  icon: React.ReactNode;
  color: string;
}

interface ReviewAnalysisProps {
  overallRating: number;
  totalReviews: number;
  metrics: {
    similarity: number;
    cleanliness: number;
    serviceQuality: number;
    attitude: number;
    location: number;
  };
}

export function ReviewAnalysis({
  overallRating,
  totalReviews,
  metrics
}: ReviewAnalysisProps) {
  const analysisMetrics: MetricRating[] = [
    { 
      label: 'Fotoğraf Benzerliği', 
      value: metrics.similarity, 
      icon: <Camera className="w-4 h-4 text-blue-400" />,
      color: 'bg-blue-500' 
    },
    { 
      label: 'Temizlik & Hijyen', 
      value: metrics.cleanliness, 
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Hizmet Kalitesi', 
      value: metrics.serviceQuality, 
      icon: <Zap className="w-4 h-4 text-yellow-400" />,
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Tutum & Davranış', 
      value: metrics.attitude, 
      icon: <UserCheck className="w-4 h-4 text-pink-400" />,
      color: 'bg-pink-500' 
    },
    { 
      label: 'Mekân Konforu', 
      value: metrics.location, 
      icon: <MapPin className="w-4 h-4 text-gold-400" />,
      color: 'bg-gold-500' 
    },
  ];

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center gap-12">
        
        {/* Overall Score Circle */}
        <div className="flex-shrink-0 text-center space-y-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="transparent"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                fill="transparent"
                stroke="url(#neonGradient)"
                strokeWidth="10"
                strokeDasharray="364.4"
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 * (1 - overallRating / 5) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3fae86" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black font-orbitron">{overallRating.toFixed(1)}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-2 h-2 ${i <= Math.round(overallRating) ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{totalReviews} Toplam Yorum</p>
        </div>

        {/* Categories Progress Bars */}
        <div className="flex-grow space-y-5 w-full">
          {analysisMetrics.map((metric, i) => (
            <div key={i} className="space-y-1.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   {metric.icon}
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                     {metric.label}
                   </span>
                </div>
                <span className="text-[10px] font-black text-white">{metric.value.toFixed(1)}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(metric.value / 5) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-full ${metric.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Trust Badge Integration Point */}
      <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
         <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <UserCheck className="w-5 h-5 text-emerald-400" />
         </div>
         <p className="text-[11px] text-gray-500 font-light leading-relaxed">
            Puanlar sadece onaylı randevusu olan kullanıcılar tarafından verilmiştir. 
            <strong className="text-white ml-1">Zühre Planet Doğrulama Garantisi.</strong>
         </p>
      </div>
    </div>
  );
}
