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

export async function POST(req: Request) {
  try {
    // Πάρε το session και userId
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Διάβασε το desk_id από το σώμα του POST
    const { desk_id } = await req.json();
    if (!desk_id) {
      return NextResponse.json({ error: 'Desk ID is required' }, { status: 400 });
    }

    const conn = await connectionPool.getConnection();

    // Ενημέρωση BUILDING_DESKS
    const [buildingResult] = await conn.query(
      `UPDATE BUILDING_DESKS SET is_available = false WHERE id = ?`,
      [desk_id]
    );

    // Ενημέρωση desks (is_available=false και user=userId)
    const [desksResult] = await conn.query(
      `UPDATE desks SET is_available = false, user = ? WHERE id = ?`,
      [userId, desk_id]
    );

    conn.release();

    if ((buildingResult as any).affectedRows === 0 || (desksResult as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Desk not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Desk ${desk_id} booked successfully` });
  } catch (error) {
    console.error('DB Error booking desk:', error);
    return NextResponse.json({ error: 'Failed to book desk' }, { status: 500 });
  }
}
