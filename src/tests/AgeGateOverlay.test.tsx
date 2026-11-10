import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AgeGateOverlay } from '@/components/AgeGateOverlay';

describe('AgeGateOverlay', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('önceki oturumda saklanmış onayı kullanır', async () => {
    window.localStorage.setItem('zuhre_age_consent_v1', 'true');
    render(<AgeGateOverlay />);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('storage okuma/yazma hata verse bile açık kalır, onayla devam eder', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('storage disabled'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('storage disabled'); });
    render(<AgeGateOverlay />);

    const dialog = await screen.findByRole('dialog', { name: /zühre planet/i });
    const accept = screen.getByRole('button', { name: /evet, 18 yaşında veya daha büyüğüm/i });
    const leave = screen.getByRole('button', { name: /hayır, ayrılmak istiyorum/i });
    expect(dialog).toHaveAttribute('aria-describedby', 'age-gate-description');
    expect(accept).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(leave).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(accept);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
