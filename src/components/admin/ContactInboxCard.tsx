import { useState } from 'react';
import { Inbox, Mail, CheckCheck, Archive } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

type Status = 'new' | 'read' | 'closed';
const TABS: { key: Status; label: string }[] = [
  { key: 'new', label: 'Yeni' },
  { key: 'read', label: 'Okundu' },
  { key: 'closed', label: 'Kapandı' },
];

/** Admin: iletişim formu gelen kutusu. Yanıt e-posta ile verilir (mailto). */
export function ContactInboxCard() {
  const [status, setStatus] = useState<Status>('new');
  const utils = trpc.useUtils();
  const q = trpc.support.inbox.useQuery({ status, limit: 50 }, { retry: false });
  const setMsgStatus = trpc.support.setStatus.useMutation({
    onSuccess: () => void utils.support.inbox.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  if (!q.data) return null;
  const { messages, counts } = q.data;

  return (
    <section className="glass-panel rounded-3xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
          <Inbox className="w-5 h-5 text-primary" /> İletişim mesajları
        </h3>
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatus(t.key)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border ${status === t.key ? 'bg-primary/20 border-primary text-white' : 'border-white/10 text-white/50'}`}
            >
              {t.label} ({counts[t.key] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {messages.length === 0 ? (
        <p className="text-white/40 text-xs">Bu klasörde mesaj yok.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="rounded-2xl bg-white/5 p-4 space-y-2">
              <div className="flex flex-wrap justify-between gap-2 text-xs text-white/50">
                <span className="font-bold text-white">{m.subject}</span>
                <span>{m.createdAt ? new Date(m.createdAt).toLocaleString('tr-TR') : ''}</span>
              </div>
              <div className="text-xs text-white/60">{m.name} · {m.email}</div>
              <p className="text-sm text-white/80 whitespace-pre-wrap break-words">{m.message}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild size="sm" variant="outline">
                  <a href={`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Re: ' + m.subject)}`}>
                    <Mail className="w-4 h-4 mr-1" /> Yanıtla
                  </a>
                </Button>
                {m.status !== 'read' && (
                  <Button size="sm" variant="ghost" onClick={() => setMsgStatus.mutate({ id: m.id, status: 'read' })}>
                    <CheckCheck className="w-4 h-4 mr-1" /> Okundu
                  </Button>
                )}
                {m.status !== 'closed' && (
                  <Button size="sm" variant="ghost" onClick={() => setMsgStatus.mutate({ id: m.id, status: 'closed' })}>
                    <Archive className="w-4 h-4 mr-1" /> Kapat
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
