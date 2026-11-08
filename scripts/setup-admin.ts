import 'dotenv/config';
import { db } from '../src/drizzle/db';
import { users } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const setupAdmin = async () => {
  const email = 'admin@zuhre.com';
  const password = 'admin123';
  const role = 'admin';
  const fullName = 'Sistem Yöneticisi';

  console.warn(`Setting up admin user: ${email}`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    console.warn('User already exists, updating password and role...');
    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        role: role as "admin" | "customer" | "escort",
        fullName: fullName
      })
      .where(eq(users.email, email));
  } else {
    console.warn('User does not exist, creating new admin...');
    await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      role: role as "admin" | "customer" | "escort",
      fullName: fullName,
      isVerified: true,
      isProfileComplete: true
    });
  }

  console.warn('Admin user setup complete!');
  process.exit(0);
};

setupAdmin().catch(() => {
  console.error('Error setting up admin:');
  process.exit(1);
});
