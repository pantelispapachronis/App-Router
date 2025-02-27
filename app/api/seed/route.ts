import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { preferences, users } from 'app/lib/placeholder-data';

const client = await db.connect();

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
    }),
  );

  return insertedUsers;
}

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
      `,
    ),
  );

  return insertedPreferences;
}

// async function updateUserPreferences(userId: string, newPreferences: { desk1?: string; desk2?: string; desk3?: string }) {
//   try {
//     const updatedPreference = await client.sql`
//       UPDATE preferences
//       SET desk1 = ${newPreferences.desk1}, 
//           desk2 = ${newPreferences.desk2}, 
//           desk3 = ${newPreferences.desk3}
//       WHERE user_id = ${userId}
//       RETURNING *;
//     `;
    
//     return updatedPreference;
//   } catch (error) {
//     console.error('Error updating preferences:', error);
//     throw error;
//   }
// }

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedPreferences();
    await client.sql`COMMIT`;
    // console.log('Database seeded successfully');

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
