import type { RateEntry } from '@/types/domain';
import { translate, useT } from '@/contexts/LanguageContext';

type T = (key: string, vars?: Record<string, string | number>) => string;
const trT: T = (k, v) => translate('tr', k, v);

export const RATE_DURATIONS = [30, 60, 90, 120, 180, 360, 720, 1440] as const;
export const LOCATION_LABEL: Record<RateEntry['location'], string> = {
  own_place: 'Kendi yerinde',
  visit: 'Ziyaret',
};

export function durationLabel(min: number, t: T = trT): string {
  if (min < 60) return t('rates.minutes', { n: min });
  if (min === 1440) return t('rates.day');
  if (min % 60 === 0) return t('rates.hours', { n: min / 60 });
  return t('rates.hoursMinutes', { h: Math.floor(min / 60), m: min % 60 });
}

const tl = (n: number) => `₺${n.toLocaleString('tr-TR')}`;

/** Herkese açık fiyat tablosu: satır = süre, sütun = görüşme yeri. */
export function RateTable({ rates }: { rates?: RateEntry[] }) {
  const t = useT();
  if (!rates || rates.length === 0) return null;
  const durations = [...new Set(rates.map((r) => r.durationMinutes))].sort((a, b) => a - b);
  const locations = (['own_place', 'visit'] as const).filter((l) => rates.some((r) => r.location === l));
  const price = (d: number, l: RateEntry['location']) => rates.find((r) => r.durationMinutes === d && r.location === l)?.price;

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">{t('rates.title')}</caption>
      <thead>
        <tr className="text-[10px] uppercase tracking-widest text-white/50">
          <th className="text-left font-black py-2">{t('rates.duration')}</th>
          {locations.map((l) => <th key={l} className="text-right font-black py-2">{t(`rates.${l}`)}</th>)}
        </tr>
      </thead>
      <tbody>
        {durations.map((d) => (
          <tr key={d} className="border-t border-white/10">
            <td className="py-2 font-bold text-white/80">{durationLabel(d, t)}</td>
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
