import 'dotenv/config';
/**
 * Zühre Planet - Blueprint V (Aşama 6) Seed Verisi
 * 
 * Veritabanına Test Senaryoları İçin Detaylı Kullanıcı, Escort ve Müşteri Aşılar.
 * Admin Paneli Testleri için Pending Escortlar, Tier Testleri için VIP müşteriler ekler.
 */

import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgres://zuhre_user:your_strong_db_password@localhost:5432/zuhre_db';
const client = postgres(connectionString);

async function seed() {
  console.warn("🌱 Zühre Planet Aşama 6 Seed Başlatıldı...\n");

  try {
    // 1. Password Hash (Ortak Şifre: Test123!)
    const passwordHash = await bcrypt.hash("Test123!", 12);

    // 2. Admin Hesabı
    console.warn("🛡️ Admin hesabı kuruluyor...");
    await client`
      INSERT INTO users (email, password_hash, role, full_name, created_at, is_profile_complete, loyalty_points)
      VALUES ('admin@zuhre.com', ${passwordHash}, 'admin', 'System Admin', NOW(), true, 99999)
      ON CONFLICT (email) DO UPDATE SET role = 'admin'
    `;

    // 3. Müşteri Hesapları (Farklı Tier'lerde)
    console.warn("👥 Müşteri Test hesapları ekleniyor...");
    const customerData = [
      { email: 'vip@zuhre.com', name: 'Alp (VIP)', tier: 'vip', points: 5000 },
      { email: 'platinum@zuhre.com', name: 'Burak (Platinum)', tier: 'platinum', points: 2500 },
      { email: 'gold@zuhre.com', name: 'Can (Gold)', tier: 'gold', points: 1000 },
      { email: 'free@zuhre.com', name: 'Deniz (Free)', tier: 'free', points: 100 },
    ];

    for (const c of customerData) {
      const users = await client`
        INSERT INTO users (email, password_hash, role, full_name, created_at, is_profile_complete, loyalty_points)
        VALUES (${c.email}, ${passwordHash}, 'customer', ${c.name}, NOW(), true, ${c.points})
        ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email, loyalty_points = EXCLUDED.loyalty_points
        RETURNING id
      `;
      const userId = users[0].id;

      const existing = await client`SELECT id FROM customer_profiles WHERE user_id = ${userId}`;
      if (existing.length === 0) {
        await client`
          INSERT INTO customer_profiles (user_id, balance, tier)
          VALUES (${userId}, ${c.points}, ${c.tier})
        `;
      } else {
        await client`
          UPDATE customer_profiles SET tier = ${c.tier} WHERE user_id = ${userId}
        `;
      }
    }

    // 4. Escort Hesapları (Admin Paneli Dashboard ve Tier Testleri İçin)
    console.warn("🎭 Escort Test hesapları ekleniyor (Pending, Approved ve Tierli)...");
    const escortData = [
      // VIP ve Tam Onaylı
      { email: 'vip_escort@zuhre.com', name: 'Alev Yıldız', city: 'İstanbul', tier: 'vip', verified: true, vStatus: 'approved', vis: 'public' },
      { email: 'platinum_escort@zuhre.com', name: 'Aylin Su', city: 'Ankara', tier: 'platinum', verified: true, vStatus: 'approved', vis: 'public' },
      { email: 'gold_escort@zuhre.com', name: 'Zeynep Ay', city: 'İzmir', tier: 'gold', verified: true, vStatus: 'approved', vis: 'public' },
      { email: 'free_escort@zuhre.com', name: 'Selin Işık', city: 'Antalya', tier: 'free', verified: true, vStatus: 'approved', vis: 'public' },

      // Admin Paneli İçin Onay Bekleyen (Pending) Profiller
      { email: 'pending_1@zuhre.com', name: 'Derya Deniz', city: 'Muğla', tier: 'free', verified: false, vStatus: 'pending_admin', vis: 'hidden' },
      { email: 'pending_2@zuhre.com', name: 'Ece Güneş', city: 'Bursa', tier: 'free', verified: false, vStatus: 'pending_admin', vis: 'hidden' },

      // Eski mock hesapların bir kısmı public olarak
      { email: 'esc1@zuhre.com', name: 'Ceren', city: 'Bodrum', tier: 'gold', verified: true, vStatus: 'approved', vis: 'public' },
      { email: 'esc2@zuhre.com', name: 'Melis', city: 'İstanbul', tier: 'gold', verified: true, vStatus: 'approved', vis: 'public' },
      { email: 'esc3@zuhre.com', name: 'Nazlı', city: 'Ankara', tier: 'free', verified: true, vStatus: 'approved', vis: 'public' },
    ];

    for (const e of escortData) {
      const users = await client`
        INSERT INTO users (email, password_hash, role, full_name, created_at, is_profile_complete)
        VALUES (${e.email}, ${passwordHash}, 'escort', ${e.name}, NOW(), true)
        ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
        RETURNING id
      `;
      const userId = users[0].id;

      const existing = await client`SELECT id FROM escort_profiles WHERE user_id = ${userId}`;
      if (existing.length === 0) {
        await client`
          INSERT INTO escort_profiles (user_id, stage_name, city, visibility_status, tier, verification_status, is_verified_by_admin)
          VALUES (${userId}, ${e.name}, ${e.city}, ${e.vis}, ${e.tier}, ${e.vStatus}, ${e.verified})
        `;
      } else {
         await client`
          UPDATE escort_profiles 
          SET tier = ${e.tier}, visibility_status = ${e.vis}, verification_status = ${e.vStatus}, is_verified_by_admin = ${e.verified}
          WHERE user_id = ${userId}
        `;
      }
    }

    console.warn("\n✅ Gelişmiş Aşama 6 Seed İşlemi Başarıyla Tamamlandı!");
    console.warn("🔐 Ortak Parola: Test123!");
    console.warn("👨‍💻 Admin: admin@zuhre.com");
    console.warn("👑 VIP Müşteri: vip@zuhre.com");
    console.warn("💎 Escort: vip_escort@zuhre.com");
    console.warn("🕒 Admin Panelinden Onaylanacak Escort: pending_1@zuhre.com");

  } catch (error) {
    console.error("\n❌ Seed failed:", error);
  } finally {
    await client.end();
  }
}

seed();
