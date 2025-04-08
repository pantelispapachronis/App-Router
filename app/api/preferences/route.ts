import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

// 🔹 GET: Fetches user preferences directly from the database
export async function GET() {
  const client = await db.connect();
  try {
    const result = await client.sql`
      SELECT preferences.user_id, users.name, preferences.desk1, preferences.desk2, preferences.desk3
      FROM preferences
      JOIN users ON preferences.user_id = users.id
    `;

    const userPreferences = result.rows.map((preference) => ({
      user_id: preference.user_id,
      name: preference.name,
      preferences: {
        desk1: preference.desk1,
        desk2: preference.desk2,
        desk3: preference.desk3,
      },
    }));

    return NextResponse.json(userPreferences);
  } catch (error) {
    console.error('Error in GET /api/preferences:', error);
    return NextResponse.json({ message: 'Error fetching preferences' }, { status: 500 });
  }
}

// 🔸 POST: Update user preferences in both tables
export async function POST(request: Request) {
  const client = await db.connect();
  try {
    const { user_id, desk1, desk2, desk3 } = await request.json();

    if (!user_id || !desk1 || !desk2 || !desk3) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    // Update legacy preferences table
    const result = await client.sql`
      UPDATE preferences
      SET desk1 = ${desk1}, 
          desk2 = ${desk2}, 
          desk3 = ${desk3}
      WHERE user_id = ${user_id}
      RETURNING *;
    `;

    // Update EMPLOYEES_PREFERENCES
    const result2 = await client.sql`
      UPDATE EMPLOYEES_PREFERENCES
      SET "DeskPref_A" = ${desk1},
          "DeskPref_B" = ${desk2},
          "DeskPref_C" = ${desk3}
      WHERE "Id" = ${user_id}
      RETURNING *;
    `;

    if (result.rows.length === 0 && result2.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: {
        desk1,
        desk2,
        desk3,
      },
    });
  } catch (error) {
    console.error('Error in POST /api/preferences:', error);
    return NextResponse.json({ message: 'Error updating preferences' }, { status: 500 });
  }
}
