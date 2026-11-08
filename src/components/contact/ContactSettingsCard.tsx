import { useState } from 'react';
import { Phone, MessageCircle, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

/**
 * İlan sahibinin iletişim numarası. Numara ilanda düz görünmez; ziyaretçi
 * "Ara/WhatsApp"a bastığında sunucudan açılır ve tıklama burada sayılır.
 */
export function ContactSettingsCard() {
  const utils = trpc.useUtils();
  const mine = trpc.contact.getMine.useQuery(undefined, { retry: false });
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const save = trpc.contact.setMine.useMutation({
    onSuccess: (r) => {
      toast.success(r.message);
      setPhone('');
      setWhatsapp('');
      void utils.contact.getMine.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const d = mine.data;
  return (
    <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-white font-black uppercase tracking-widest text-sm">İletişim Numarası</h3>
          <p className="text-white/50 text-xs">
            Numaranız ilanınızda yazı olarak görünmez; yalnız “Ara / WhatsApp” düğmesine basıldığında açılır. Değişiklikler admin onaylıdır.
          </p>
        </div>
      </div>

      {d && (
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest"><Phone className="w-4 h-4" /> Telefon</div>
            <div className="text-white font-bold mt-1">{d.phone ?? '—'}</div>
            <div className="text-white/50 text-xs mt-1">Son 30 gün: {d.clicksLast30Days.phone} tıklama</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest"><MessageCircle className="w-4 h-4" /> WhatsApp</div>
            <div className="text-white font-bold mt-1">{d.whatsapp ?? '—'}</div>
            <div className="text-white/50 text-xs mt-1">Son 30 gün: {d.clicksLast30Days.whatsapp} tıklama</div>
          </div>
          {d.hasPendingChange && (
            <div className="sm:col-span-2 flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-amber-300 text-xs">
              <Clock className="w-4 h-4" /> Onay bekliyor: {[d.pendingPhone, d.pendingWhatsapp].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      )}

      <form
        className="grid sm:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate({ phone: phone || undefined, whatsapp: whatsapp || undefined });
        }}
      >
        <label className="space-y-2">
          <span className="text-white/60 text-xs uppercase tracking-widest">Yeni telefon</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel"
            placeholder="0532 123 45 67" maxLength={32}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-primary/50" />
        </label>
        <label className="space-y-2">
          <span className="text-white/60 text-xs uppercase tracking-widest">Yeni WhatsApp</span>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="tel"
            placeholder="0532 123 45 67" maxLength={32}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-primary/50" />
        </label>
        <Button type="submit" disabled={save.isPending || (!phone && !whatsapp)} className="sm:col-span-2">
          {save.isPending ? 'Gönderiliyor…' : 'Onaya gönder'}
        </Button>
      </form>
    </section>
  );
}
