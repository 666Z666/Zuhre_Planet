# 🏗️ ZUHRE PLANET - SİSTEM MİMARİSİ (01_architecture.md)
**Sürüm:** 1.0.0
**Konsept:** Agent-Native, tRPC-Powered, Luxury Cosmic Platform

## 📐 1. Katmanlı Mimari (Layered Architecture)
Zuhre Planet, birbirinden bağımsız çalışan ama tRPC ile mükemmel konuşan 4 ana katmandan oluşur:

### A. Sunum Katmanı (Presentation Layer - Frontend)
*   **Teknoloji:** React 18 + Vite + TypeScript.
*   **Stil:** Tailwind CSS + Framer Motion (Lüks Animasyonlar).
*   **3D:** Three.js (React Three Fiber) tabanlı dinamik arkaplanlar.
*   **State Management:** React Query (tRPC entegre) + Context API.

### B. İletişim Katmanı (API & Communication)
*   **Protokol:** tRPC (TypeScript Remote Procedure Call).
*   **Avantajı:** Backend'deki bir tip değiştiğinde, Frontend anında hata verir. Uçtan uca tip güvenliği sağlanır.
*   **Canlı İletişim:** WebSocket (ws) üzerinden anlık mesajlaşma ve bildirimler.

### C. İş Mantığı Katmanı (Business Logic - Backend)
*   **Teknoloji:** Express.js + Node.js.
*   **Yetkilendirme:** JWT (JSON Web Token) + Cookie-based Session.
*   **Servisler:** Ödeme (Iyzico), E-posta (Nodemailer), Medya İşleme (Sharp/AI).

### D. Veri Katmanı (Data Layer)
*   **Veritabanı:** PostgreSQL.
*   **ORM:** Drizzle ORM.
*   **AI Bağlantısı:** Model Context Protocol (MCP) üzerinden harici AI ajanları ve görüntü işleme modelleri.

---

## 🚀 2. İstek Akışı (Request Flow)
1.  **Frontend**: Kullanıcı butona tıklar (Örn: `trpc.escort.getProfile.useQuery({ id: 1 })`).
2.  **tRPC Client**: İsteği tip kontrolünden geçirip Backend'e gönderir.
3.  **Backend Context**: Gelen isteğin JWT'sini doğrular, kullanıcıyı (`ctx.user`) belirler.
4.  **Backend Router**: İş mantığını çalıştırır (Veritabanı sorgusu, AI analizi vb.).
5.  **Drizzle ORM**: PostgreSQL'den veriyi çeker ve tip güvenli olarak Router'a döner.
6.  **Frontend**: Gelen veri anında UI'da render edilir (Sıfır manuel API tanımı).

---
[Sonraki Döküman: 02_pages.md]
