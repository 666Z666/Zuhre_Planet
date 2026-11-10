import { describe, expect, it } from 'vitest';
import { scoutService } from '@/services/scoutService';
import { checkSpam, MESSAGE_RULES } from '@/types/notifications';

describe('scoutService action routing', () => {
  it('routes navigation commands to the requested page', () => {
    expect(scoutService.analyze('giriş yap')).toMatchObject({
      type: 'NAVIGATE',
      payload: '/login',
    });
  });

  it('preserves the search query as a string payload', () => {
    expect(scoutService.analyze('ara İstanbul')).toMatchObject({
      type: 'SEARCH',
      payload: 'istanbul',
    });
  });

  it('returns stealth and trail commands as ACTION instead of MESSAGE', () => {
    expect(scoutService.analyze('ghost mode')).toMatchObject({
      type: 'ACTION',
      payload: 'TOGGLE_STEALTH',
    });
    expect(scoutService.analyze('logları temizle')).toMatchObject({
      type: 'ACTION',
      payload: 'CLEAR_TRAIL',
    });
  });

  it('returns unmatched conversational commands as messages', () => {
    expect(scoutService.analyze('merhaba')).toMatchObject({
      type: 'MESSAGE',
      payload: null,
    });
  });
});

describe('checkSpam', () => {
  const recentMessage = (content: string) => ({ content, timestamp: Date.now() - 1_000 });

  it('blocks repeated identical messages at the configured threshold', () => {
    const message = 'Merhaba';
    const messages = Array.from(
      { length: MESSAGE_RULES.spamDetection.repeatedMessageThreshold },
      () => recentMessage(message),
    );
    expect(checkSpam(messages)).toBe(true);
  });

  it('does not flag a small set of distinct ordinary messages', () => {
    expect(checkSpam([recentMessage('Merhaba'), recentMessage('Nasılsınız?')])).toBe(false);
  });

  it('detects messages over the configured uppercase ratio', () => {
    expect(checkSpam([recentMessage('TAMAMI BÜYÜK HARF')])).toBe(true);
  });

  it('ignores messages outside the configured time window', () => {
    const timestamp = Date.now() - MESSAGE_RULES.spamDetection.timeWindow - 1;
    expect(checkSpam(Array.from(
      { length: MESSAGE_RULES.spamDetection.maxMessagesPerMinute },
      () => ({ content: 'Aynı mesaj', timestamp }),
    ))).toBe(false);
  });
});
