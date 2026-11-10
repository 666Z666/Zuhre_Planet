import 'dotenv/config';
import { db } from '../src/drizzle/db';
import * as schema from '../src/drizzle/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'not set';
  console.warn('DATABASE_URL protocol:', dbUrl.split(':')[0]);
  
  const email = 'admin@zuhre.com';
  const password = 'Test123!';
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const existing = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (existing) {
      await db.update(schema.users)
        .set({ passwordHash: hashedPassword, role: 'admin' })
        .where(eq(schema.users.id, existing.id));
    } else {
      await db.insert(schema.users).values({
        email,
        passwordHash: hashedPassword,
        role: 'admin',
        fullName: 'System Admin',
        isVerified: true,
        isProfileComplete: true,
        provider: 'email'
      });
    }
    console.warn('Admin user ready.');
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

main().catch(console.error).finally(() => process.exit());
