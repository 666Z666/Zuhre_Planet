import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { LockKeyhole, CheckCircle2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { SEOManager } from '@/components/SEOManager';

export function validateNewPassword(pw: string, confirm: string): string | null {
  if (pw.length < 8) return 'Şifre en az 8 karakter olmalıdır.';
  if (pw !== confirm) return 'Şifreler eşleşmiyor.';
  return null;
}

/** E-postadaki bağlantıdan gelinir: /reset-password?token=... */
export default function ResetPassword() {
  const token = useMemo(() => new URLSearchParams(window.location.search).get('token') ?? '', []);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const reset = trpc.auth.resetPassword.useMutation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <SEOManager title="Yeni şifre belirle" noindex />
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <LockKeyhole className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-black text-white">Yeni şifre belirle</h1>
        </div>

        {!token ? (
          <div className="space-y-4 text-sm text-white/70">
            <p>Bu sayfaya e-postanızdaki sıfırlama bağlantısıyla gelmelisiniz. Bağlantı eksik veya bozuk.</p>
            <Link href="/forgot-password" className="text-primary hover:underline">Yeni bağlantı iste</Link>
          </div>
        ) : reset.isSuccess ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{reset.data.message}</p>
            </div>
            <Link href="/login" className="block text-center text-sm text-primary hover:underline">Giriş yap</Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const err = validateNewPassword(password, confirm);
              setLocalError(err);
              if (!err) reset.mutate({ token, password });
            }}
          >
            {(['Yeni şifre', 'Yeni şifre (tekrar)'] as const).map((label, i) => (
              <label key={label} className="block space-y-2">
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{label}</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={i === 0 ? password : confirm}
                  onChange={(e) => (i === 0 ? setPassword : setConfirm)(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-primary/50"
                />
              </label>
            ))}
            {(localError || reset.error) && (
              <p className="text-red-400 text-sm" role="alert">{localError ?? reset.error?.message}</p>
            )}
            {reset.error && (
              <Link href="/forgot-password" className="block text-sm text-primary hover:underline">Yeni bağlantı iste</Link>
            )}
            <Button type="submit" className="w-full" disabled={reset.isPending}>
              {reset.isPending ? 'Kaydediliyor…' : 'Şifreyi güncelle'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
