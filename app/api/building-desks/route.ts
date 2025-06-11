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

export async function GET() {
  const conn = await connectionPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM `DESKS`;');
    conn.release();
    return NextResponse.json(rows);
  } catch (error) {
    conn.release();
    console.error('Error fetching DESKS table:', error);
    return NextResponse.json({ error: 'Failed to fetch DESKS table' }, { status: 500 });
  }
}
