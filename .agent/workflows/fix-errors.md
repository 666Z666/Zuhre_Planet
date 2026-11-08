---
description: Sistematik Hata Temizleme ve Standart Uygulama
---

# Sistematik Hata Temizleme Workflowu

Bu workflow, projedeki lint ve TS hatalarını temizlemek için izlenecek standart adımları tanımlar.

## Adımlar

1. **Hata Tespiti**:
   - `npm run lint` komutunu çalıştırarak tüm hataları listele.
   - `current_problems` listesini kontrol et.

2. **Otomatik Düzeltme**:
   - `npm run lint -- --fix` komutu ile otomatik düzelebilen basit sorunları çöz.

3. **Manuel Müdahale**:
   - `a11y-fixer` skill'ini kullanarak erişilebilirlik hatalarını gider.
   - `any` tiplemelerini anlamlı tiplerle değiştir.
   - Lexical declaration hatalarını `{}` blokları ile çöz.

4. **Doğrulama**:
   - Değişiklik yapılan dosyayı `view_file` ile oku.
   - Tekrar lint çalıştırarak hatanın gittiğini teyit et.

5. **Kalıcılık**:
   - Eğer yeni bir hata tipi keşfedilirse `coding_standards.md` belgesini güncelle.
