# Ana Sayfadaki “İlanı bildir” Kartını Kaldırma

**Kullanıcı kararı:** İlan bildirme özelliği eklenmeyecek. Ana sayfada henüz mevcut olmayan bu özelliği varmış gibi anlatan kart kaldırılacak.

**Kapsam:** `src/pages/Home.tsx` içindeki “İlanı bildir” kartı ve artık kullanılmayan `Flag` simgesi kaldırılır. Güvenlik alanındaki kalan üç kartın yerleşimi 1/2/3 sütunlu duyarlı düzene alınır. Mevcut yönetici rapor kuyruğu ve başka rapor türleri değiştirilmez.

**Doğrulama:** `Home.tsx` içeriğinde kartın ve importun bulunmadığını, üç kart düzeninin kaldığını dosyadan doğrula; ardından mümkünse `npm run typecheck`, ilgili testler, `npm run lint:strict` ve `npm run build` çalıştır.

**Durum:** Kaynak değişikliği uygulandı; terminal erişimi önceki denemelerde `terminal:applying writable root ACL: Erişim engellendi` hatası verdiğinden komut tabanlı doğrulama ayrıca denenmelidir.

**Önceki plan notu:** Bu dosyanın önceki sürümünde raporlama UI/API geliştirmesi planlanmıştı. Kullanıcının açık kararıyla bu kapsam iptal edilmiştir; yeni raporlama API'si veya profil bildirim düğmesi eklenmeyecektir.
