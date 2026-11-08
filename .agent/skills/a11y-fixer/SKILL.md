---
name: a11y-fixer
description: Erişilebilirlik ve WCAG hatalarını otomatik düzeltmek için rehber ve araçlar.
---

# A11Y-Fixer Skill

Bu beceri, projedeki erişilebilirlik (WCAG) hatalarını (eksik alt, title, aria-label vb.) tespit etmek ve düzeltmek için tasarlanmıştır.

## Talimatlar

1. **Eksik Alt Etiketleri**: Tüm `<img>` etiketlerinin `alt` niteliğine sahip olduğundan emin olun. Eğer görsel dekoratif ise `alt=""` kullanın.
2. **Discernible Text (Butonlar)**: İkon içeren butonkarda (`<button>`, `<a>`) metin yoksa mutlaka `title` veya `aria-label` ekleyin.
3. **Form Etiketleri**: Tüm `<input>`, `<select>` ve `<textarea>` elemanlarının bir `<label>` ile bağlı olduğundan veya `title`/`placeholder`/`aria-label` niteliklerine sahip olduğundan emin olun.
4. **ARIA Nitelikleri**: `aria-checked`, `aria-expanded` gibi niteliklerin dinamik ve geçerli değerler aldığını kontrol edin.

## Örnek Düzeltmeler

```tsx
// Yanlış
<button onClick={handleClose}><X /></button>

// Doğru
<button onClick={handleClose} title="Kapat" aria-label="Kapat"><X /></button>
```

```tsx
// Yanlış
<img src={avatar} />

// Doğru
<img src={avatar} alt="Kullanıcı Profil Resmi" />
```

## Kullanım
Hata listesi (`current_problems`) tarandığında, ilgili satır numarasına giderek yukarıdaki kuralları uygulayın.
