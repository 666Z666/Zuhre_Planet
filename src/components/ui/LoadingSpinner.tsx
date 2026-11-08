import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', text = 'Sistem Yükleniyor...', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const containerBaseClass = "flex flex-col items-center justify-center gap-6";
  const layoutClass = fullScreen 
    ? `fixed inset-0 z-50 bg-black/90 backdrop-blur-sm ${containerBaseClass}`
    : `w-full h-full min-h-[300px] ${containerBaseClass}`;

  return (
    <div className={layoutClass}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Dış Halka (Galaxy Ring 1) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary/80 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        />
        
        {/* İç Halka (Astroid Belt 2) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
        />

        {/* Merkez Çekirdek (Core Pulsar) */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[30%] bg-white rounded-full shadow-[0_0_20px_#fff]"
        />
      </div>

      {text && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/80 font-orbitron tracking-[0.3em] text-sm uppercase font-bold animate-pulse">
            {text}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
