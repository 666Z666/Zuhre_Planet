import 'dotenv/config';
import { db } from '../src/drizzle/db';
import { sql } from 'drizzle-orm';

const fixDb = async () => {
    console.warn('Veritabanı sütunları kapsamlı bir şekilde kontrol ediliyor...');
    
    try {
        // --- USERS TABLOSU ---
        const userColumns = [
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT \'email\';',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id TEXT;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS has_accepted_terms BOOLEAN DEFAULT false;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS has_accepted_chat_rules BOOLEAN DEFAULT false;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS chat_rules_accepted_at TIMESTAMP;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by_id INTEGER;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 0;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS user_rank TEXT DEFAULT \'Bronz\';',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_expires_at TIMESTAMP;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_shadow_banned BOOLEAN DEFAULT false;',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved_customer BOOLEAN DEFAULT false;'
        ];

        for (const query of userColumns) {
            await db.execute(sql.raw(query));
        }
        console.warn('✓ users tablosu güncellendi.');

        // --- ESCORT_PROFILES TABLOSU ---
        const escortColumns = [
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT \'none\';',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS visibility_status TEXT DEFAULT \'hidden\';',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS has_verified_badge BOOLEAN DEFAULT false;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS pending_data TEXT;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS has_pending_update BOOLEAN DEFAULT false;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT now();',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS verification_photo_url TEXT;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS is_verified_by_admin BOOLEAN DEFAULT false;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS free_trial_ends_at TIMESTAMP;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS hourly_rate REAL;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS rating REAL DEFAULT 0;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00;',
            'ALTER TABLE escort_profiles ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;'
        ];

        for (const query of escortColumns) {
            await db.execute(sql.raw(query));
        }
        console.warn('✓ escort_profiles tablosu güncellendi.');

        console.warn('Veritabanı başarıyla güncellendi (Eksik sütunlar tamamlandı).');
        process.exit(0);
    } catch (err) {
        console.error('Hata:', err);
        process.exit(1);
    }
};

fixDb();
