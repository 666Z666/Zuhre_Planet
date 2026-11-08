import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function main() {
  const command = process.argv[2] || 'migrate';
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL tanımlı değil. Migrasyon çalıştırılamadı.');
  }

  const client = postgres(databaseUrl, {
    max: 1,
  });

  try {
    const db = drizzle(client);

    if (command === 'reset') {
      console.warn('Veritabanı şeması sıfırlanıyor...');
      await client.unsafe('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
      console.warn('Şema sıfırlandı, migrasyonlar uygulanıyor...');
    }

    console.warn('Drizzle migrasyonları uygulanıyor...');
    await migrate(db, {
      migrationsFolder: 'drizzle/migrations',
    });
    console.warn('Migrasyonlar tamamlandı.');

    if (command === 'seed') {
      console.warn('Seed scripti çalıştırılıyor...');
      await import('./seed');
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Migrasyon komutu başarısız oldu:', error);
  process.exitCode = 1;
});
