import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import type { RateEntry } from '@/types/domain';
import { RATE_DURATIONS, LOCATION_LABEL, durationLabel } from './RateTable';

type Grid = Record<string, string>; // "60:own_place" → "1500"
const key = (d: number, l: RateEntry['location']) => `${d}:${l}`;
const LOCATIONS = ['own_place', 'visit'] as const;

/** Formdaki ızgarayı API satırlarına çevirir; boş hücreler atlanır, geçersiz değer hata verir. */
export function gridToRates(grid: Grid): { rates: RateEntry[] } | { error: string } {
  const rates: RateEntry[] = [];
  for (const d of RATE_DURATIONS) {
    for (const l of LOCATIONS) {
      const raw = (grid[key(d, l)] ?? '').replace(/[^\d]/g, '');
      if (!raw) continue;
      const price = Number(raw);
      if (!Number.isInteger(price) || price < 1 || price > 1_000_000) {
        return { error: `${durationLabel(d)} / ${LOCATION_LABEL[l]}: geçersiz fiyat.` };
      }
      rates.push({ durationMinutes: d, location: l, price });
    }
  }
  return { rates };
}

export function RatesEditorCard() {
  const utils = trpc.useUtils();
  const mine = trpc.escort.getMyRates.useQuery(undefined, { retry: false });
  const [grid, setGrid] = useState<Grid>({});

  useEffect(() => {
    if (!mine.data) return;
    const g: Grid = {};
    for (const r of mine.data) g[key(r.durationMinutes, r.location)] = String(r.price);
    setGrid(g);
  }, [mine.data]);

  const save = trpc.escort.setMyRates.useMutation({
    onSuccess: () => {
      toast.success('Fiyat tablonuz güncellendi.');
      void utils.escort.getMyRates.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-white font-black uppercase tracking-widest text-sm">Fiyat Tablosu</h3>
          <p className="text-white/50 text-xs">Uyguladığınız süreleri doldurun, diğerlerini boş bırakın. Fiyatlar TL, tam sayı.</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const r = gridToRates(grid);
          if ('error' in r) return void toast.error(r.error);
          save.mutate(r);
        }}
        className="space-y-4"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[360px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/50">
                <th className="text-left py-2">Süre</th>
                {LOCATIONS.map((l) => <th key={l} className="text-left py-2">{LOCATION_LABEL[l]}</th>)}
              </tr>
            </thead>
            <tbody>
              {RATE_DURATIONS.map((d) => (
                <tr key={d} className="border-t border-white/10">
                  <td className="py-2 pr-4 font-bold text-white/80 whitespace-nowrap">{durationLabel(d)}</td>
                  {LOCATIONS.map((l) => (
                    <td key={l} className="py-2 pr-2">
                      <input
                        inputMode="numeric"
                        aria-label={`${durationLabel(d)} ${LOCATION_LABEL[l]} fiyatı`}
                        value={grid[key(d, l)] ?? ''}
                        onChange={(e) => setGrid((g) => ({ ...g, [key(d, l)]: e.target.value }))}
                        placeholder="—"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-primary/50"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="submit" disabled={save.isPending} className="w-full">
          {save.isPending ? 'Kaydediliyor…' : 'Fiyat tablosunu kaydet'}
        </Button>
      </form>
    </section>
  );
}
