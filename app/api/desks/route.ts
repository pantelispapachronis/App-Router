import mysql from 'mysql2/promise';

// Use the shared MySQL connection pool from auth.ts
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
    const [rows] = await conn.query('SELECT * FROM desks;');
    conn.release();
    return Response.json(rows);
  } catch (error) {
    conn.release();
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
