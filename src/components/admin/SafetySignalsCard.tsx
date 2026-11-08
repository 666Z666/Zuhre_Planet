import { ShieldAlert, Phone, Image as ImageIcon, Users } from 'lucide-react';
import { trpc } from '@/lib/trpc';

type P = { id: number; stageName: string; city: string; visibilityStatus: string | null };

function ProfileChips({ profiles }: { profiles: P[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {profiles.map((p) => (
        <a
          key={p.id}
          href={`/escort/${p.id}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/80 hover:border-red-400/60"
        >
          #{p.id} {p.stageName} <span className="text-white/40">· {p.city}{p.visibilityStatus !== 'public' ? ' · gizli' : ''}</span>
        </a>
      ))}
    </div>
  );
}

/**
 * Admin: sömürü / insan ticareti inceleme sinyalleri. Sinyal kanıt değildir;
 * ilgili profilleri incelemek, gerekirse kimlik doğrulamasını yeniden istemek içindir.
 */
export function SafetySignalsCard() {
  const q = trpc.safety.signals.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const d = q.data;
  if (!d) return null;
  const total = d.sharedNumbers.length + d.sharedPhotos.length + d.signupBursts.length;

  return (
    <section className="glass-panel rounded-3xl p-6 space-y-5 border border-red-500/20">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
        <div>
          <h3 className="text-white font-black uppercase tracking-widest text-sm">Güvenlik sinyalleri ({total})</h3>
          <p className="text-white/50 text-xs">
            Bunlar kanıt değil, inceleme işaretidir. Aynı numara/fotoğrafı paylaşan veya aynı yerden toplu açılan hesaplar
            üçüncü kişi kontrolüne işaret edebilir. Şüphede kimlik doğrulamasını yeniden isteyin; ciddi şüphede yetkililere bildirin.
          </p>
        </div>
      </div>

      {total === 0 && <p className="text-emerald-400 text-xs font-bold">Şu an işaretli durum yok.</p>}

      {d.sharedNumbers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white/70 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Phone className="w-4 h-4" /> Aynı numarayı paylaşan profiller</h4>
          {d.sharedNumbers.map((g, i) => <ProfileChips key={i} profiles={g.profiles} />)}
        </div>
      )}

      {d.sharedPhotos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white/70 text-xs font-black uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Aynı fotoğraf farklı profillerde</h4>
          {d.sharedPhotos.map((g, i) => <ProfileChips key={i} profiles={g.profiles} />)}
        </div>
      )}

      {d.signupBursts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white/70 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4" /> Aynı yerden kısa sürede açılan ilan hesapları</h4>
          {d.signupBursts.map((b, i) => (
            <div key={i} className="space-y-1">
              <div className="text-white/50 text-xs">{b.accounts} hesap (son 7 gün)</div>
              <ProfileChips profiles={b.profiles} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
