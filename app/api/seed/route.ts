import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { preferences, users } from 'app/lib/placeholder-data';

const client = await db.connect();

// Delete all existing data before seeding
// async function clearDatabase() {
//   await client.sql` 
//   DROP TABLE IF EXISTS preferences CASCADE;
//   DROP TABLE IF EXISTS customers CASCADE;
//   DROP TABLE IF EXISTS invoices CASCADE;
//   DROP TABLE IF EXISTS revenue CASCADE;
//   `;

// }


// 🔹 Seed users into the database
async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

// 🔹 Seed preferences into the database
async function seedPreferences() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS preferences (
      user_id UUID PRIMARY KEY REFERENCES users(id),
      desk1 VARCHAR(255),
      desk2 VARCHAR(255),
      desk3 VARCHAR(255)
    );
  `;

  const insertedPreferences = await Promise.all(
    preferences.map(
      (preference) => client.sql`
        INSERT INTO preferences (user_id, desk1, desk2, desk3)
        VALUES (${preference.user_id}, ${preference.desk1}, ${preference.desk2}, ${preference.desk3})
        ON CONFLICT (user_id) DO UPDATE
        SET desk1 = EXCLUDED.desk1, desk2 = EXCLUDED.desk2, desk3 = EXCLUDED.desk3;
      `
    )
  );

  return insertedPreferences;
}

// 🔹 Seed desks into the database
async function seedDesks() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS desks (
      id VARCHAR(45) NOT NULL PRIMARY KEY,
      is_available BOOLEAN NOT NULL
    );
  `;

  // Sample desk data
  const desks = [
    { id: 'R105_01', is_available: true },
    { id: 'R105_02', is_available: true },
    { id: 'R106_01', is_available: true },
    { id: 'R106_02', is_available: true },
    { id: 'R208_01', is_available: true },
    { id: 'R208_02', is_available: true },
    { id: 'R208_03', is_available: true },
    { id: 'R208_04', is_available: true },
    { id: 'R209_01', is_available: true },
  ];

  const insertedDesks = await Promise.all(
    desks.map((desk) =>
      client.sql`
        INSERT INTO desks (id, is_available)
        VALUES (${desk.id}, ${desk.is_available})
        ON CONFLICT (id) DO UPDATE
        SET is_available = EXCLUDED.is_available;
      `
    )
  );

  return insertedDesks;
}

// 🔹 GET: Clear all tables before seeding new data
export async function GET() {
  try {
    await client.sql`BEGIN`;
    // await clearDatabase(); // Clear existing data before seeding
    await seedUsers();
    await seedPreferences();
    await seedDesks();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
