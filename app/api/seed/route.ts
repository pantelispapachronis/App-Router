import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { preferences, users } from 'app/lib/placeholder-data';

// MySQL connection pool
const connectionPool = mysql.createPool({
  host: '172.16.0.96', // update as needed
  user: 'db_user', // update as needed
  password: 'userPass!', // update as needed
  database: 'app_db', // update as needed
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Seed users into the database
async function seedUsers() {
  const conn = await connectionPool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return conn.query(`
        INSERT IGNORE INTO users (id, name, email, password)
        VALUES (?, ?, ?, ?)
      `, [user.id, user.name, user.email, hashedPassword]);
    })
  );

  conn.release();
  return insertedUsers;
}

async function seedEmployeesPreferences() {
  const conn = await connectionPool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS employees_preferences (
      Id CHAR(36) NOT NULL PRIMARY KEY,
      DeskPref_A VARCHAR(45) NULL,
      DeskPref_B VARCHAR(45) NULL,
      DeskPref_C VARCHAR(45) NULL,
      Presence BOOLEAN NOT NULL,
      Rec_System_Rating SMALLINT CHECK(Rec_System_Rating BETWEEN 0 AND 10)
    );
  `);

  const employeePrefs = [
    {
      Id: '410544b2-4001-4271-9855-fec4b6a6442a',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
    {
      Id: '412532b2-4001-4271-9855-fec4b6a6442a',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
  ];

  const insertedEmployeePrefs = await Promise.all(
    employeePrefs.map((pref) =>
      conn.query(`
        INSERT INTO EMPLOYEES_PREFERENCES 
        (Id, DeskPref_A, DeskPref_B, DeskPref_C, Presence, Rec_System_Rating)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          DeskPref_A = VALUES(DeskPref_A),
          DeskPref_B = VALUES(DeskPref_B),
          DeskPref_C = VALUES(DeskPref_C),
          Presence = VALUES(Presence),
          Rec_System_Rating = VALUES(Rec_System_Rating)
      `, [
        pref.Id,
        pref.DeskPref_A,
        pref.DeskPref_B,
        pref.DeskPref_C,
        pref.Presence,
        pref.Rec_System_Rating,
      ])
    )
  );

  conn.release();
  return insertedEmployeePrefs;
}

<<<<<<< HEAD
// 🔹 Seed preferences into the database
=======



// Seed preferences into the database
>>>>>>> f6745dac669552097811e21b87498043329f9eff
async function seedPreferences() {
  const conn = await connectionPool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS preferences (
      user_id CHAR(36) PRIMARY KEY,
      desk1 VARCHAR(255),
      desk2 VARCHAR(255),
      desk3 VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  const insertedPreferences = await Promise.all(
    preferences.map(
      (preference) => conn.query(`
        INSERT INTO preferences (user_id, desk1, desk2, desk3)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          desk1 = VALUES(desk1),
          desk2 = VALUES(desk2),
          desk3 = VALUES(desk3)
      `, [
        preference.user_id,
        preference.desk1,
        preference.desk2,
        preference.desk3,
      ])
    )
  );

  conn.release();
  return insertedPreferences;
}

// Seed desks into the database
async function seedDesks() {
  const conn = await connectionPool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS desks (
      id VARCHAR(45) NOT NULL PRIMARY KEY,
      is_available BOOLEAN NOT NULL
    );
  `);

  // Sample desk data
  const desks = [
    { Id: 'R105_01', Is_Available: true },
    { Id: 'R105_02', Is_Available: true },
    { Id: 'R106_01', Is_Available: true },
    { Id: 'R106_02', Is_Available: true },
    { Id: 'R208_01', Is_Available: true },
    { Id: 'R208_02', Is_Available: true },
    { Id: 'R208_03', Is_Available: true },
    { Id: 'R208_04', Is_Available: true },
    { Id: 'R209_01', Is_Available: true },
  ];

  const insertedDesks = await Promise.all(
    desks.map((desk) =>
<<<<<<< HEAD
      conn.query(`
        INSERT INTO desks (id, is_available)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          is_available = VALUES(is_available)
      `, [desk.id, desk.is_available])
=======
      client.sql`
        INSERT INTO desks (Id, Is_Available)
        VALUES (${desk.Id}, ${desk.Is_Available})
        ON CONFLICT (Id) DO UPDATE
        SET Is_Available = EXCLUDED.Is_Available;
      `
>>>>>>> f6745dac669552097811e21b87498043329f9eff
    )
  );

  conn.release();
  return insertedDesks;
}

// 🔹 GET: Clear all tables before seeding new data
export async function GET() {
  try {
    await seedUsers();
    await seedPreferences();
    await seedDesks();
    await seedEmployeesPreferences();

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
