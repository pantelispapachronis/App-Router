import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
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
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
  }

  const conn = await connectionPool.getConnection();
  try {
    await conn.query(
      'UPDATE EMPLOYEES_PREFERENCES SET Presence = false WHERE Id = ?',
      [userId]
    );
    conn.release();
    return NextResponse.json({ message: 'Presence updated to false' });
  } catch (error) {
    conn.release();
    console.error('Error updating presence:', error);
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 });
  }
}
