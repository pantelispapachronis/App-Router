import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '172.16.0.96',
  user: 'db_user',
  password: 'userPass!',
  database: 'app_db',
});

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const conn = await pool.getConnection();
  const [rows] = await conn.query(
    `SELECT id FROM desks WHERE user = ? LIMIT 1`,
    [userId]
  );
  conn.release();

  if ((rows as any[]).length === 0) {
        return NextResponse.json({ desk_id: null });
  }

  const deskId = (rows as any[])[0].id;
  return NextResponse.json({ desk_id: deskId });
}
