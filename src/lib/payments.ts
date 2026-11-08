import { toast } from 'sonner';

/**
 * Online ödeme henüz açık değil (kart altyapısı bu dikeyde kapalı; havale/kripto kararı
 * hukuki onay bekliyor). Kullanıcıyı sahte "ödeme sayfasına yönlendiriliyorsunuz" yerine
 * dürüstçe bilgilendirir ve iletişim sayfasına yönlendirir.
 */
export const PAYMENTS_ENABLED = import.meta.env.VITE_PAYMENTS_ENABLED === 'true';

export function notifyPaymentsUnavailable(itemName?: string): void {
  toast.info('Online ödeme yakında açılacak', {
    description: `${itemName ? `${itemName} için ` : ''}şimdilik iletişim sayfasından bize yazın; ödeme onaylanınca üyeliğiniz yönetici tarafından açılır.`,
    action: { label: 'İletişim', onClick: () => window.location.assign('/contact') },
    duration: 8000,
  });
}
