import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerLoginPageProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  onSignUpClick?: () => void;
  isLoading?: boolean;
}

/**
 * Müşteri (Kullanıcı) Giriş Sayfası
 * 
 * Kozmik tema, glassmorphism ve 3D premium animasyonlar
 */
export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({
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
      {/* Kozmik Dekoratif Arka Plan Parçacıkları */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-gold-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Ana Kart */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Üst Parlama Efekti */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        <div className="glass-panel p-8 border-emerald-500/20 bg-emerald-500/5">
          {/* Logo & Başlık */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-600/20 border border-emerald-500/30 mb-4 shadow-lg shadow-emerald-500/10"
            >
              <Star className="w-8 h-8 text-emerald-400" fill="currentColor" fillOpacity={0.3} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Müşteri Portalı</span>
              </div>
              <h1 className="text-3xl text-3d-premium text-white mb-1">
                ZÜHRE <span className="text-emerald-400">PLANET</span>
              </h1>
              <p className="text-white/70 text-xs font-semibold tracking-wider">
                Hesabınıza giriş yapın
              </p>
            </motion.div>
          </div>

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
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors duration-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full bg-black/30 border-2 border-white/5 focus:border-emerald-500/50 rounded-2xl py-4 pl-12 pr-5 text-white font-medium outline-none transition-all duration-300 placeholder:text-white/15 text-sm"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">
                Şifre
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors duration-300" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/30 border-2 border-white/5 focus:border-emerald-500/50 rounded-2xl py-4 pl-12 pr-12 text-white font-medium outline-none transition-all duration-300 placeholder:text-white/15 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Şifremi Unuttum */}
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-xs text-emerald-400/70 hover:text-emerald-400 font-medium transition-colors"
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
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  <Star size={16} />
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

          {/* Sosyal Girişler */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium transition-all flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium transition-all flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Kayıt Linki */}
          <div className="text-center">
            <p className="text-white/60 text-xs font-semibold">
              Hesabınız yok mu?{' '}
              <button
                onClick={onSignUpClick}
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                Ücretsiz Kayıt Olun
              </button>
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

export default CustomerLoginPage;
