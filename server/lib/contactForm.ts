import { z } from 'zod';

/** İletişim formu doğrulaması (sunucu). */
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Adınızı girin.').max(80),
  email: z.string().trim().email('Geçerli bir e-posta girin.').max(254),
  subject: z.string().trim().min(3, 'Konu en az 3 karakter olmalı.').max(120),
  message: z.string().trim().min(10, 'Mesaj en az 10 karakter olmalı.').max(5000),
  /** Bot tuzağı: gerçek kullanıcı bu alanı görmez ve boş bırakır. */
  website: z.string().max(0).optional(),
});
