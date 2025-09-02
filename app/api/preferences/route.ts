import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const connectionPool = mysql.createPool({
  host: '172.16.0.96',
  user: 'db_user',
  password: 'userPass!',
  database: 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🔹 GET: Fetches user preferences directly from the database
export async function GET() {
  const conn = await connectionPool.getConnection();
  try {
    const [rows] = await conn.query<any[]>(`
      SELECT preferences.user_id, users.name, preferences.desk1, preferences.desk2, preferences.desk3
      FROM preferences
      JOIN users ON preferences.user_id = users.id
    `);
    conn.release();
    const userPreferences = Array.isArray(rows) ? rows.map((preference: any) => ({
      user_id: preference.user_id,
      name: preference.name,
      preferences: {
        desk1: preference.desk1,
        desk2: preference.desk2,
        desk3: preference.desk3,
      },
    })) : [];
    return NextResponse.json(userPreferences);
  } catch (error) {
    conn.release();
    console.error('Error in GET /api/preferences:', error);
    return NextResponse.json({ message: 'Error fetching preferences' }, { status: 500 });
  }
}

// 🔸 POST: Update user preferences in both tables
export async function POST(request: Request) {
  const conn = await connectionPool.getConnection();
  try {
    const { user_id, desk1, desk2, desk3 } = await request.json();

    if (!user_id || !desk1 || !desk2 || !desk3) {
      conn.release();
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    // Update legacy preferences table
    const [result]: any = await conn.query(
      `UPDATE preferences SET desk1 = ?, desk2 = ?, desk3 = ? WHERE user_id = ?`,
      [desk1, desk2, desk3, user_id]
    );

    // Update EMPLOYEES_PREFERENCES
    const [result2]: any = await conn.query(
      `UPDATE EMPLOYEES_PREFERENCES SET DeskPref_A = ?, DeskPref_B = ?, DeskPref_C = ? WHERE Id = ?`,
      [desk1, desk2, desk3, user_id]
    );

    conn.release();

    if ((result.affectedRows ?? 0) === 0 && (result2.affectedRows ?? 0) === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const getTimestamp = () =>
      `[${new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "")}]`;
    
    console.log(
      `${getTimestamp()} Set preferences: User ID: ${user_id} Desk1:${desk1} Desk2:${desk2} Desk3:${desk3}`
    );

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: { desk1, desk2, desk3 },
    });
  } catch (error) {
    conn.release();
    console.error('Error in POST /api/preferences:', error);
    return NextResponse.json({ message: 'Error updating preferences' }, { status: 500 });
  }
}
