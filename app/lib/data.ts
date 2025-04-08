// app/lib/data.ts
import { sql } from '@vercel/postgres';

export async function fetchPreferences(userId: string) {
  try {
    const result = await sql`
      SELECT "Id", "DeskPref_A", "DeskPref_B", "DeskPref_C", "Presence", "Rec_System_Rating"
      FROM EMPLOYEES_PREFERENCES
      WHERE "Id" = ${userId};
    `;
    return result.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch EMPLOYEES_PREFERENCES.');
  }
}
