import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, Sparkles, AlertCircle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface EscortLoginPageProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  onSignUpClick?: () => void;
  isLoading?: boolean;
}

/**
 * Escort Üyelik Girişi Sayfası
 * 
 * Kozmik tema, glassmorphism ve premium animasyonlar (Escort özel - Mor/Pembe palet)
 */
export const EscortLoginPage: React.FC<EscortLoginPageProps> = ({
  onLogin,
  onSignUpClick,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await onLogin?.(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız oldu');
    }
  };

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Kozmik Dekoratif Arka Plan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-gold-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-gold-500/10 to-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      {/* Ana Kart */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Üst Parlama Efekti */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

        <div className="glass-panel p-8 border-gold-500/20 bg-gold-500/5">
          {/* Logo & Başlık */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/20 to-pink-600/20 border border-gold-500/30 mb-4 shadow-lg shadow-gold-500/10"
            >
              <Crown className="w-8 h-8 text-gold-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 mb-3">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gold-400">Escort Portalı</span>
              </div>
              <h1 className="text-3xl text-3d-premium text-white mb-1">
                ZÜHRE <span className="text-gold-400">PLANET</span>
              </h1>
              <p className="text-white/70 text-xs font-semibold tracking-wider">
                Profesyonel profilinize erişin
              </p>
            </motion.div>
          </div>

          {/* Bilgi Mesajı */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3"
          >
            <AlertCircle className="text-blue-400 shrink-0" size={16} />
            <span className="text-blue-300 text-xs font-medium">
              Sadece doğrulanmış Escort üyeleri giriş yapabilir
            </span>
          </motion.div>

          {/* Hata Mesajı */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-xs font-black">!</span>
              </div>
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">
                E-posta Adresi
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-400 transition-colors duration-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full bg-black/30 border-2 border-white/5 focus:border-gold-500/50 rounded-2xl py-4 pl-12 pr-5 text-white font-medium outline-none transition-all duration-300 placeholder:text-white/15 text-sm"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">
                Şifre
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-400 transition-colors duration-300" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/30 border-2 border-white/5 focus:border-gold-500/50 rounded-2xl py-4 pl-12 pr-12 text-white font-medium outline-none transition-all duration-300 placeholder:text-white/15 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Şifremi Unuttum */}
            <div className="flex justify-end">
              <a
                href="/escort/forgot-password"
                className="text-xs text-gold-400/70 hover:text-gold-400 font-medium transition-colors"
              >
                Şifremi Unuttum
              </a>
            </div>

            {/* Giriş Butonu */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-600 to-pink-600 hover:from-gold-500 hover:to-pink-500 text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-gold-900/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  <Crown size={16} />
                  Giriş Yap
                </>
              )}
            </motion.button>
          </form>

          {/* Ayırıcı */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-xs text-white/20 font-medium">veya</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* Kayıt Linki */}
          <div className="text-center mb-4">
            <p className="text-white/60 text-xs mb-3 font-semibold">Henüz kayıtlı değil misiniz?</p>
            <button
              onClick={onSignUpClick}
              className="w-full py-3 rounded-2xl border-2 border-gold-500/30 text-gold-400 hover:bg-gold-500/10 font-bold text-sm uppercase tracking-wider transition-all"
            >
              Escort Olarak Kayıt Olun
            </button>
          </div>

          {/* Müşteri Girişi Linki */}
          <div className="text-center">
            <p className="text-white/60 text-xs font-semibold">
              Müşteri misiniz?{' '}
              <a
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                Müşteri Girişi
              </a>
            </p>
          </div>
        </div>

        {/* Alt Bilgi */}
        <p className="text-center text-[10px] text-white/20 mt-4">
          Giriş yaparak{' '}
          <a href="/terms" className="hover:text-white/40 transition-colors">
            Hizmet Şartları
          </a>{' '}
          ve{' '}
          <a href="/privacy" className="hover:text-white/40 transition-colors">
            Gizlilik Politikası
          </a>
          'nı kabul etmiş olursunuz.
        </p>
      </motion.div>
    </div>
  );
};

export default EscortLoginPage;
