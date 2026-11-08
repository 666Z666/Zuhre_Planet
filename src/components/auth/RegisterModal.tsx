/**
 * Custom Registration Modal
 * 
 * Basit ve hızlı kayıt süreci için kullanılan bileşen.
 * Rol seçimini (Müşteri/Escort) destekler.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  X, Mail, Lock, User, 
  ShieldCheck, ArrowRight, Github 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register } = useAuth();
  const [activeRole, setActiveRole] = useState<'customer' | 'escort'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = () => {
    let score = 0;
    if (formData.password.length > 8) score += 25;
    if (/[A-Z]/.test(formData.password)) score += 25;
    if (/[0-9]/.test(formData.password)) score += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 25;
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('Kullanım şartlarını kabul etmelisiniz.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: activeRole,
      });
      onClose();
    } catch (err: unknown) {
      let errorMsg = 'Kayıt sırasında bir hata oluştu.';
      if (err && typeof err === 'object' && 'response' in err) {
        const anyErr = err as { response?: { data?: { message?: string } } };
        errorMsg = anyErr.response?.data?.message || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl" />

        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-white/50 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="relative text-center mb-10">
          <h2 className="text-3xl font-black font-orbitron text-white mb-2 uppercase tracking-tighter">Bize Katılın</h2>
          <p className="text-gray-400 text-sm">Zühre Planet galaksisinde yerinizi alın.</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-8 p-1 bg-white/5 border border-white/10 rounded-2xl">
          {(['customer', 'escort'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-all uppercase ${
                activeRole === role 
                ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg shadow-emerald-600/20' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {role === 'customer' ? 'Müşteri' : 'Yıldız (Escort)'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
            <Input
              placeholder="Ad Soyad"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-emerald-500/50"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
            <Input
              type="email"
              placeholder="E-posta Adresi"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                type="password"
                placeholder="Şifre"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-emerald-500/50"
              />
            </div>
            <div className="px-1 space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-white/30">
                <span>Güvenlik</span>
                <span className={getPasswordStrength() > 75 ? 'text-green-400' : 'text-emerald-400'}>
                  {getPasswordStrength() > 75 ? 'ÇELİK GİBİ' : 'ZAYIF'}
                </span>
              </div>
              <Progress value={getPasswordStrength()} className="h-1 bg-white/5" />
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
            <input 
              type="checkbox" 
              id="terms" 
              checked={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.checked})}
              className="w-4 h-4 rounded border-white/10 bg-white/5 accent-emerald-500" 
            />
            <label htmlFor="terms" className="text-xs text-gray-500">
              <span className="text-emerald-500 underline cursor-pointer">Kullanım Şartlarını</span> okudum ve kabul ediyorum.
            </label>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-500 text-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-white text-black hover:bg-gray-200 font-black uppercase text-sm tracking-widest rounded-2xl group shadow-lg shadow-white/10"
          >
            {isLoading ? (
               <div className="w-5 h-5 rounded-full border-4 border-black/20 border-t-black animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Şimdi Kayıt Ol
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">veya devam et</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="glass border-white/10 px-8 py-6 rounded-2xl hover:bg-white/5">
              <Github className="w-5 h-5 mr-3" /> Github
            </Button>
            <Button variant="outline" className="glass border-white/10 px-8 py-6 rounded-2xl hover:bg-white/5">
              <Badge variant="outline" className="bg-blue-600 text-[10px] font-black mr-2">G</Badge> Google
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Zaten hesabın var mı? 
            <button onClick={onSwitchToLogin} className="ml-2 text-white font-bold hover:underline transition-all">
              Giriş Yap
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
