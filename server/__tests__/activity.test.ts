import { describe, it, expect } from 'vitest';
import { activityBucket, withActivity, activeSince, shouldTouch } from '../lib/activity';

const now = Date.parse('2026-11-08T12:00:00Z');
const ago = (ms: number) => new Date(now - ms);
const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;

describe('activityBucket', () => {
  it.each([
    [ago(5 * MIN), 'online'],
    [ago(2 * HOUR), 'today'],
    [ago(3 * DAY), 'week'],
    [ago(20 * DAY), 'month'],
    [ago(60 * DAY), 'inactive'],
    [null, 'inactive'],
    ['bozuk', 'inactive'],
  ])('%s → %s', (v, out) => expect(activityBucket(v as Date | null, now)).toBe(out));
});

describe('withActivity', () => {
  it('tam zaman damgasını public çıktıdan çıkarır', () => {
    const r = withActivity({ id: 1, lastActive: ago(MIN) }, now);
    expect(r).toEqual({ id: 1, activity: 'online' });
    expect('lastActive' in r).toBe(false);
  });
});

describe('activeSince / shouldTouch', () => {
  it('gün filtresi 24 saat öncesini verir', () => {
    expect(activeSince('day', now).getTime()).toBe(now - DAY);
  });
  it('aynı kullanıcı için 5 dk içinde ikinci güncellemeyi atlar', () => {
    expect(shouldTouch(42, now)).toBe(true);
    expect(shouldTouch(42, now + 2 * MIN)).toBe(false);
    expect(shouldTouch(42, now + 6 * MIN)).toBe(true);
  });
});
