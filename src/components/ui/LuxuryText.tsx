import React from 'react';
import { motion } from 'framer-motion';

interface LuxuryTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * LuxuryText - Phase 17 Elite Typography
 * 
 * Replicates the 'Variable Font' weight-shifting effect from top-tier luxury sites.
 * Uses framer-motion to transition font-weight on hover/viewport entry.
 */
export const LuxuryText: React.FC<LuxuryTextProps> = ({ 
  children, 
  className = "", 
  as: Component = "span" 
}) => {
  return (
    <motion.div
      initial={{ fontWeight: 400, opacity: 0, y: 10 }}
      whileInView={{ fontWeight: 900, opacity: 1, y: 0 }}
      whileHover={{ fontWeight: 200, letterSpacing: '0.2em' }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
        fontWeight: { duration: 0.8, ease: "easeInOut" }
      }}
      viewport={{ once: true }}
      className={`inline-block cursor-default select-none ${className}`}
    >
      <Component className="m-0 p-0 leading-tight">
        {children}
      </Component>
    </motion.div>
  );
};
