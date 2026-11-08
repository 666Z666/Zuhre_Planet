import 'dotenv/config';
import { db } from '../src/drizzle/db';
import * as schema from '../src/drizzle/schema';

async function main() {
  const users = await db.query.users.findMany();
  console.log('Users in database:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));
}

main().catch(console.error).finally(() => process.exit());
