# ⚙️ ZUHRE PLANET - BACKEND VE TRPC API (04_backend_api.md)
**Sürüm:** 1.0.0
**Konsept:** tRPC-based Backend, Type-Safe Procedures, JWT-Protected API

## 🛡️ 1. API Güvenlik Mimarisi (`server/router.core.ts`)
Proje, her API isteğini 2 ana katmandan geçirerek süzgeçten geçirir:

### A. Public Procedure (Herkes Açık)
*   **Yetki:** Hiçbir giriş gerektirmez.
*   **Örnekler:** `auth.login`, `escort.getPublicList`, `general.getFaq`.
*   **Kullanım:** `@/server/router.core.ts` içindeki `publicProcedure` kullanılır.

### B. Protected Procedure (Giriş Yapmış Kullanıcı)
*   **Yetki:** Geçerli bir JWT (JSON Web Token) içeren HTTP Cookie'si gerektirir.
*   **Middleware:** İsteği durdurup kullanıcının kimliğini (`ctx.user`) ve rolünü doğrular.
*   **Örnekler:** `customer.getWallet`, `escort.updateProfile`, `admin.approveListing`.

---

## 🛣️ 2. API Router'ları (`server/routers/`)
Backend, 13 farklı bağımsız router'dan oluşur ve her biri belirli bir işe odaklanır.

*   **`admin.router.ts`**: Platformun istatistikleri, finansal raporları ve yönetici kontrolleri.
*   **`auth.router.ts`**: Kayıt olma, giriş yapma, şifre sıfırlama ve oturum yönetimi.
*   **`escort.router.ts`**: Profil oluşturma, fiyatlandırma ve ilan yayınlama mantığı.
*   **`media.router.ts`**: Fotoğraf ve videoların yüklenmesi, silinmesi ve gizlilik (Blur) ayarları.
*   **`subscription.router.ts`**: Üyelik (Gold, Platinum, VIP) satın alma ve ödeme (Payment) süreçleri.
*   **`chat.router.ts`**: WebSocket destekli canlı mesajlaşma ve konuşma geçmişi yönetimi.
*   **`loyalty.router.ts`**: Puan kazanma, rütbe atlama ve sadakat programı (Gamification) ödülleri.

---

## 🚦 3. İstek Akış Şeması (Request Cycle)
1.  **Frontend**: tRPC query veya mutation isteği atar.
2.  **Context**: Cookie'deki JWT okunur ve veritabanı (Drizzle) bağlantısı (`ctx.db`) hazır hale gelir.
3.  **Router**: İş mantığı (Business Logic) çalışır ve Drizzle üzerinden veriyi çeker.
4.  **Response**: Veri tip güvenli olarak Frontend'e döner.

---
[Sonraki Döküman: 05_database_schema.md]
