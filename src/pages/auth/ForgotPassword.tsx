import { useState } from 'react';
import { Link } from 'wouter';
import { KeyRound, MailCheck } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { SEOManager } from '@/components/SEOManager';

/** Şifremi unuttum — e-posta ile tek kullanımlık sıfırlama bağlantısı ister. */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const req = trpc.auth.requestPasswordReset.useMutation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <SEOManager title="Şifremi unuttum" noindex />
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <KeyRound className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-black text-white">Şifremi unuttum</h1>
        </div>

        {req.isSuccess ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-200 text-sm">
              <MailCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{req.data.message}</p>
            </div>
            <Link href="/login" className="block text-center text-sm text-primary hover:underline">Giriş sayfasına dön</Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              req.mutate({ email: email.trim() });
            }}
          >
            <p className="text-white/60 text-sm">Hesabınızın e-posta adresini girin; size yeni şifre belirleme bağlantısı gönderelim.</p>
            <label className="block space-y-2">
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest">E-posta</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-primary/50"
              />
            </label>
            {req.error && <p className="text-red-400 text-sm" role="alert">{req.error.message}</p>}
            <Button type="submit" className="w-full" disabled={req.isPending || !email}>
              {req.isPending ? 'Gönderiliyor…' : 'Sıfırlama bağlantısı gönder'}
            </Button>
            <Link href="/login" className="block text-center text-sm text-white/50 hover:text-white">Giriş sayfasına dön</Link>
          </form>
        )}
      </div>
    </div>
  );
}
