/**
 * "Son aktiflik" — "şu an müsait" yerine.
 * Gizlilik: public uçlar tam zaman damgası DÖNMEZ, yalnız kaba bir dilim döner
 * (kişinin gün içi düzenini izlemeyi zorlaştırır).
 */

export type ActivityBucket = 'online' | 'today' | 'week' | 'month' | 'inactive';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const ONLINE_WINDOW_MS = 15 * MIN;

export function activityBucket(lastActive: Date | string | null | undefined, now = Date.now()): ActivityBucket {
  if (!lastActive) return 'inactive';
  const t = new Date(lastActive).getTime();
  if (!Number.isFinite(t)) return 'inactive';
  const diff = Math.max(0, now - t);
  if (diff < ONLINE_WINDOW_MS) return 'online';
  if (diff < DAY) return 'today';
  if (diff < 7 * DAY) return 'week';
  if (diff < 30 * DAY) return 'month';
  return 'inactive';
}

/** Filtre: "son X içinde aktif" için alt sınır tarihi. */
export const ACTIVE_WITHIN = { online: ONLINE_WINDOW_MS, day: DAY, week: 7 * DAY } as const;
export type ActiveWithin = keyof typeof ACTIVE_WITHIN;
export function activeSince(within: ActiveWithin, now = Date.now()): Date {
  return new Date(now - ACTIVE_WITHIN[within]);
}

/** Public satırdan lastActive'i çıkarıp yerine `activity` koyar. */
export function withActivity<T extends { lastActive?: Date | string | null }>(row: T, now = Date.now()) {
  const { lastActive, ...rest } = row;
  return { ...rest, activity: activityBucket(lastActive, now) };
}

/**
 * Yazma yükünü sınırlamak için kullanıcı başına en fazla 5 dakikada bir güncelle.
 * Bellek içi; çoklu sunucuda her düğüm kendi sayacını tutar (zararsız).
 */
const TOUCH_INTERVAL_MS = 5 * MIN;
const lastTouch = new Map<number, number>();
export function shouldTouch(userId: number, now = Date.now()): boolean {
  const prev = lastTouch.get(userId);
  if (prev !== undefined && now - prev < TOUCH_INTERVAL_MS) return false;
  lastTouch.set(userId, now);
  if (lastTouch.size > 50_000) lastTouch.clear();
  return true;
}
