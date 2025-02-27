import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

const client = await db.connect();

// 🔹 GET: Fetches user preferences directly from the database
export async function GET() {
  try {
    // Retrieve data from the database
    const result = await client.sql`
      SELECT preferences.user_id, users.name, preferences.desk1, preferences.desk2, preferences.desk3
      FROM preferences
      JOIN users ON preferences.user_id = users.id
    `;

    // Format the data into JSON response
    const userPreferences = result.rows.map(preference => ({
      user_id: preference.user_id,
      name: preference.name,
      preferences: {
        desk1: preference.desk1,
        desk2: preference.desk2,
        desk3: preference.desk3,
      }
    }));

    return NextResponse.json(userPreferences);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching preferences', error }, { status: 500 });
  }
}

// 🔹 POST: Updates user preferences directly in the database
export async function POST(request: Request) {
  try {
    const { user_id, desk1, desk2, desk3 } = await request.json();

    // Update user preferences in the database
    const result = await client.sql`
      UPDATE preferences
      SET desk1 = ${desk1}, 
          desk2 = ${desk2}, 
          desk3 = ${desk3}
      WHERE user_id = ${user_id}
      RETURNING *;
    `;

    // Check if the user exists
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Preferences updated', data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating preferences', error }, { status: 500 });
  }
}
