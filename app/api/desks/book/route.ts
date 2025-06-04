import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
  host: '172.16.0.96',
  user: 'db_user',
  password: 'userPass!',
  database: 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST(req: Request) {
  try {
    const { desk_id } = await req.json();

    if (!desk_id) {
      return NextResponse.json({ error: 'Desk ID is required' }, { status: 400 });
    }

    const conn = await connectionPool.getConnection();
    const [result] = await conn.query(
      `UPDATE BUILDING_DESKS SET Is_Available = false WHERE Id = ?`,
      [desk_id]
    );
    conn.release();

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Desk not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Desk ${desk_id} booked successfully` });
  } catch (error) {
    console.error('DB Error booking desk:', error);
    return NextResponse.json({ error: 'Failed to book desk' }, { status: 500 });
  }
}
