import { z } from 'zod';

/** İzin verilen süreler (dakika). Serbest süre yerine sabit liste: karşılaştırılabilir tablo. */
export const RATE_DURATIONS = [30, 60, 90, 120, 180, 360, 720, 1440] as const;
export const RATE_LOCATIONS = ['own_place', 'visit'] as const;
export const MAX_RATE_ROWS = RATE_DURATIONS.length * RATE_LOCATIONS.length;
export const MAX_PRICE = 1_000_000;

export const rateRowSchema = z.object({
  durationMinutes: z.number().int().refine((d) => (RATE_DURATIONS as readonly number[]).includes(d), {
    message: 'Geçersiz süre.',
  }),
  location: z.enum(RATE_LOCATIONS),
  price: z.number().int().min(1).max(MAX_PRICE),
});
export type RateRow = z.infer<typeof rateRowSchema>;

export const setRatesInputSchema = z.object({
  rates: z
    .array(rateRowSchema)
    .max(MAX_RATE_ROWS)
    .refine((rows) => new Set(rows.map((r) => `${r.durationMinutes}:${r.location}`)).size === rows.length, {
      message: 'Aynı süre ve görüşme yeri iki kez girilemez.',
    }),
});

/**
 * Filtre/sıralama için tek bir "saatlik" değer türetir (escort_profiles.hourly_rate):
 * önce 60 dk satırı (kendi yeri, yoksa ziyaret), yoksa en kısa süreli satırın saatlik karşılığı.
 */
export function deriveHourlyRate(rows: RateRow[]): number | null {
  if (rows.length === 0) return null;
  const hour = rows.filter((r) => r.durationMinutes === 60);
  const pick = hour.find((r) => r.location === 'own_place') ?? hour[0];
  if (pick) return pick.price;
  const shortest = [...rows].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
  return Math.round((shortest.price * 60) / shortest.durationMinutes);
}

/** Görüntüleme sırası: süre artan, aynı sürede önce kendi yeri. */
export function sortRates<T extends RateRow>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.durationMinutes - b.durationMinutes || (a.location === 'own_place' ? -1 : 1));
}
