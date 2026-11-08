import type { RateEntry } from '@/types/domain';

export const RATE_DURATIONS = [30, 60, 90, 120, 180, 360, 720, 1440] as const;
export const LOCATION_LABEL: Record<RateEntry['location'], string> = {
  own_place: 'Kendi yerinde',
  visit: 'Ziyaret',
};

export function durationLabel(min: number): string {
  if (min < 60) return `${min} dk`;
  if (min === 1440) return '1 gün';
  if (min % 60 === 0) return `${min / 60} saat`;
  return `${Math.floor(min / 60)} sa ${min % 60} dk`;
}

const tl = (n: number) => `₺${n.toLocaleString('tr-TR')}`;

/** Herkese açık fiyat tablosu: satır = süre, sütun = görüşme yeri. */
export function RateTable({ rates }: { rates?: RateEntry[] }) {
  if (!rates || rates.length === 0) return null;
  const durations = [...new Set(rates.map((r) => r.durationMinutes))].sort((a, b) => a - b);
  const locations = (['own_place', 'visit'] as const).filter((l) => rates.some((r) => r.location === l));
  const price = (d: number, l: RateEntry['location']) => rates.find((r) => r.durationMinutes === d && r.location === l)?.price;

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Fiyat tablosu</caption>
      <thead>
        <tr className="text-[10px] uppercase tracking-widest text-white/50">
          <th className="text-left font-black py-2">Süre</th>
          {locations.map((l) => <th key={l} className="text-right font-black py-2">{LOCATION_LABEL[l]}</th>)}
        </tr>
      </thead>
      <tbody>
        {durations.map((d) => (
          <tr key={d} className="border-t border-white/10">
            <td className="py-2 font-bold text-white/80">{durationLabel(d)}</td>
            {locations.map((l) => {
              const p = price(d, l);
              return <td key={l} className="py-2 text-right font-black text-white">{p !== undefined ? tl(p) : '—'}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
