/**
 * DevCredentialsPanel — Geliştirme Ortamı Hızlı Giriş Paneli
 * Sadece DEV modunda görünür, production'da gizlenir.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, Heart, ChevronDown, Zap, Copy, Check } from 'lucide-react';

export type DevRole = 'customer' | 'escort' | 'admin';

interface DevCredential {
  role: DevRole;
  label: string;
  email: string;
  password: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CREDENTIALS: DevCredential[] = [
  {
    role: 'admin',
    label: 'Admin',
    email: 'admin@zuhre.com',
    password: 'Test123!',
    icon: ShieldAlert,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
  },
  {
    role: 'escort',
    label: 'Escort',
    email: 'escort@zuhre.com',
    password: 'Test123!',
    icon: Heart,
    color: 'text-gold-400',
    bgColor: 'bg-gold-500/10',
    borderColor: 'border-gold-500/30',
  },
  {
    role: 'customer',
    label: 'Müşteri',
    email: 'ozan@gmail.com',
    password: 'Test123!',
    icon: User,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
];

interface DevCredentialsPanelProps {
  onQuickLogin?: (email: string, password: string) => void;
  activeRole?: DevRole;
}

export function DevCredentialsPanel({ onQuickLogin, activeRole }: DevCredentialsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (!import.meta.env.DEV) return null;

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const filteredCreds = activeRole
    ? CREDENTIALS.filter(c => c.role === activeRole)
    : CREDENTIALS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full mt-4"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 transition-all"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Geliştirici Hızlı Giriş
          </span>
          <span className="text-[9px] bg-amber-500/20 px-2 py-0.5 rounded-full">DEV ONLY</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {filteredCreds.map((cred) => {
                const Icon = cred.icon;
                return (
                  <div
                    key={cred.role}
                    className={`p-4 rounded-2xl border ${cred.bgColor} ${cred.borderColor} space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${cred.color}`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${cred.color}`}>
                          {cred.label} Hesabı
                        </span>
                      </div>
                      {onQuickLogin && (
                        <button
                          onClick={() => onQuickLogin(cred.email, cred.password)}
                          className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${cred.bgColor} ${cred.color} border ${cred.borderColor} hover:brightness-125 transition-all active:scale-95 flex items-center gap-1.5`}
                        >
                          <Zap className="w-3 h-3" />
                          Hızlı Giriş
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">E-posta</p>
                        <button
                          onClick={() => handleCopy(cred.email, `${cred.role}-email`)}
                          className="flex items-center gap-1.5 text-xs text-white/80 font-mono hover:text-white transition-colors"
                        >
                          {copied === `${cred.role}-email` ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/30" />
                          )}
                          {cred.email}
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Şifre</p>
                        <button
                          onClick={() => handleCopy(cred.password, `${cred.role}-pass`)}
                          className="flex items-center gap-1.5 text-xs text-white/80 font-mono hover:text-white transition-colors"
                        >
                          {copied === `${cred.role}-pass` ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/30" />
                          )}
                          {cred.password}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
