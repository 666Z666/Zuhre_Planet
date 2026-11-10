import 'dotenv/config';
import { db } from '../src/drizzle/db';

async function main() {
  const users = await db.query.users.findMany();
  console.warn('Users in database:', users.map(({ id, role }) => ({ id, role })));
}

main().catch(console.error).finally(() => process.exit());
