import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface TrustScoreIndicatorProps {
  score: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustScoreIndicator: React.FC<TrustScoreIndicatorProps> = ({ 
  score, 
  showLabel = true,
  size = 'md' 
}) => {
  const getTier = (s: number) => {
    if (s >= 90) return { label: 'GÜVENİLİR ELİT', color: 'text-green-400', icon: ShieldCheck, stroke: '#4ade80' };
    if (s >= 70) return { label: 'DOĞRULANMIŞ', color: 'text-emerald-400', icon: Shield, stroke: '#22d3ee' };
    if (s >= 40) return { label: 'STANDART', color: 'text-amber-400', icon: Shield, stroke: '#fbbf24' };
    return { label: 'BEKLEMEDE', color: 'text-red-400', icon: ShieldAlert, stroke: '#f87171' };
  };

  const tier = getTier(score);
  const Icon = tier.icon;
  
  const sizeMap = {
    sm: { circle: 40, stroke: 3, icon: 16, font: 'text-[8px]' },
    md: { circle: 80, stroke: 5, icon: 24, font: 'text-[10px]' },
    lg: { circle: 120, stroke: 8, icon: 40, font: 'text-xs' }
  };

  const config = sizeMap[size];
  const radius = (config.circle - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: config.circle, height: config.circle }}>
        {/* Background Circle */}
        <svg className="rotate-[-90deg] w-full h-full">
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress Circle */}
          <motion.circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            stroke={tier.stroke}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            style={{ filter: `drop-shadow(0 0 5px ${tier.stroke}66)` }}
          />
        </svg>
        
        {/* Center Icon/Score */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
               <Icon className={`w-1/3 h-1/3 ${tier.color}`} style={{ width: config.icon, height: config.icon }} />
               {size === 'lg' && (
                 <span className="text-xl font-black font-orbitron mt-1 text-white">{score}</span>
               )}
            </div>
        </div>
      </div>

      {showLabel && (
        <div className="text-center">
          <div className={`font-black tracking-widest uppercase ${config.font} ${tier.color}`}>
            {tier.label}
          </div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">
             GÜVEN SKORU: {score}/100
          </div>
        </div>
      )}
    </div>
  );
};
