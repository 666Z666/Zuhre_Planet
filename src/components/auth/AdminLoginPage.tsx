import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, ShieldCheck, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/brand/Logo';

interface AdminLoginPageProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Admin Giriş Sayfası (Kompakt Bileşen)
 * 
 * Kozmik tema, glassmorphism ve Premium 3D animasyonlar. (Rose/Admin Paleti)
 */
export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLogin,
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
      setError(err instanceof Error ? err.message : 'Giriş başarısız oldu. Lütfen yetkilerinizi kontrol edin.');
    }
  };

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Kozmik Dekoratif Arka Plan Parçacıkları */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-gold-500/10 to-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Ana Kart */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Üst Parlama Efekti */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent" />

        <div className="glass-panel p-8 border-emerald-600/20 bg-emerald-950/10 relative overflow-hidden backdrop-blur-xl rounded-[2.5rem] shadow-2xl">
          
          {/* İç Aydınlatma */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          {/* Logo & Başlık */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-gold-500/20 border border-emerald-600/30 mb-4 shadow-lg shadow-emerald-600/10"
            >
              <Logo size={52} showWordmark={false} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 border border-emerald-600/20 mb-3 backdrop-blur-sm">
                <Key className="w-3 h-3 text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Yönetim Konsolu</span>
              </div>
              <h1 className="text-3d-premium mb-1 text-4xl">
                Yönetim Girişi
              </h1>
              <p className="text-muted-foreground text-xs font-medium tracking-wider">
                Yetkili erişimi doğrulayın
              </p>
            </motion.div>
          </div>

          {/* Hata Mesajı */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 relative z-10"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-xs font-black">!</span>
              </div>
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Yönetici E-posta
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-secondary transition-colors duration-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zuhreplanet.com"
                  className="w-full bg-background/60 border-2 border-border focus:border-secondary/50 rounded-2xl py-4 pl-12 pr-5 text-foreground font-medium outline-none transition-all duration-300 placeholder:text-muted-foreground/50 text-sm"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Yönetici Şifresi
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-secondary transition-colors duration-300" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full bg-background/60 border-2 border-border focus:border-secondary/50 rounded-2xl py-4 pl-12 pr-12 text-foreground font-medium outline-none transition-all duration-300 placeholder:text-muted-foreground/50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Giriş Butonu */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 py-4 rounded-2xl btn-cosmic text-[hsl(var(--brand-cream))] font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-secondary/30 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Sisteme Giriş
                </>
              )}
            </motion.button>
          </form>

          {/* Ayırıcı */}
          <div className="my-8 flex items-center gap-3 relative z-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-600/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600/40" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-600/20" />
          </div>

          {/* Alt Bilgi */}
          <p className="text-center text-[10px] text-white/30 relative z-10 mt-4 leading-relaxed max-w-[250px] mx-auto">
            Giriş yetkisi olmayan giriş teşebbüsleri sistem tarafından <strong className="text-secondary">loglanmaktadır.</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
