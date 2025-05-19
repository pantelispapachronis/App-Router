// app/lib/data.ts
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

export async function fetchPreferences(userId: string) {
  try {
    const conn = await connectionPool.getConnection();
    const [rows] = await conn.query(
      'SELECT Id, DeskPref_A, DeskPref_B, DeskPref_C, Presence, Rec_System_Rating FROM EMPLOYEES_PREFERENCES WHERE Id = ?',
      [userId]
    );
    conn.release();
    return rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch EMPLOYEES_PREFERENCES.');
  }
}
