import { sql } from '@vercel/postgres';

export async function fetchPreferences(myuserid: string) {
  try {
    

    const result = await sql`
      SELECT preferences.user_id, users.name, preferences.desk1, preferences.desk2, preferences.desk3
      FROM preferences, users where preferences.user_id = ${myuserid} and preferences.user_id = users.id
    `;

    const preferences = result.rows;
    console.log(preferences)
    return preferences;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all preferences.');
  }
}