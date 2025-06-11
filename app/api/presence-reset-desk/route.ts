import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { auth } from '@/auth';

const connectionPool = mysql.createPool({
  host: '172.16.0.96',
  user: 'db_user',
  password: 'userPass!',
  database: 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const conn = await connectionPool.getConnection();

    // 1. Βρες desk που έχει user = userId
    const [deskRows] = await conn.query(
      `SELECT id FROM desks WHERE user = ? LIMIT 1`,
      [userId]
    );
    const desksArray = deskRows as any[];

    if (desksArray.length > 0) {
      const deskId = desksArray[0].id;

      // 2. Ενημέρωσε τον πίνακα desks
      await conn.query(
        `UPDATE desks SET is_available = true, user = NULL WHERE id = ?`,
        [deskId]
      );

      // 3. Ενημέρωσε τον πίνακα building_desks
      await conn.query(
        `UPDATE DESKS SET is_available = true WHERE id = ?`,
        [deskId]
      );
    }
    // Αν δεν βρεθεί desk απλά προχωράμε

    // 4. Ενημέρωσε presence
    await conn.query(
      `UPDATE EMPLOYEES_PREFERENCES SET Presence = false WHERE Id = ?`,
      [userId]
    );

    conn.release();

    return NextResponse.json({ success: true, message: 'Presence and desk reset successfully' });
  } catch (error) {
    console.error('Error resetting presence and desk:', error);
    return NextResponse.json({ error: 'Failed to reset presence and desk' }, { status: 500 });
  }
}
