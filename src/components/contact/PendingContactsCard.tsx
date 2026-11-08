import { CheckCircle2, XCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

/** Admin: onay bekleyen iletişim numarası değişiklikleri. Her karar denetim kaydına yazılır. */
export function PendingContactsCard() {
  const utils = trpc.useUtils();
  const q = trpc.contact.listPending.useQuery(undefined, { retry: false });
  const review = trpc.contact.review.useMutation({
    onSuccess: () => {
      toast.success('Karar kaydedildi.');
      void utils.contact.listPending.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const rows = q.data ?? [];
  if (rows.length === 0) return null;
  return (
    <section className="glass-panel rounded-3xl p-6 space-y-4">
      <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
        <Phone className="w-5 h-5 text-primary" /> İletişim numarası onayları ({rows.length})
      </h3>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.profileId} className="rounded-2xl bg-white/5 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-white/80">
              <div className="font-bold text-white">
                {r.stageName} <span className="text-white/40">· {r.city} · #{r.profileId}</span>
              </div>
              <div>Telefon: {r.currentPhone ?? '—'} → <b>{r.pendingPhone ?? '(değişmiyor)'}</b></div>
              <div>WhatsApp: {r.currentWhatsapp ?? '—'} → <b>{r.pendingWhatsapp ?? '(değişmiyor)'}</b></div>
              {r.sharedWithProfiles.length > 0 && (
                <div className="mt-1 text-xs font-bold text-red-400">
                  Uyarı: bu numara şu profillerde de kayıtlı: {r.sharedWithProfiles.map((id) => `#${id}`).join(', ')}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" disabled={review.isPending} onClick={() => review.mutate({ profileId: r.profileId, approve: true })}>
                <CheckCircle2 className="w-4 h-4 mr-1" /> Onayla
              </Button>
              <Button size="sm" variant="outline" disabled={review.isPending} onClick={() => review.mutate({ profileId: r.profileId, approve: false })}>
                <XCircle className="w-4 h-4 mr-1" /> Reddet
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
