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

// 🔹 Seed users into the database
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

    {
      Id: '312532b2-4001-4271-9855-fec4b6a6442a',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },

    {
      Id: '8d7a9e41-0c3b-4d29-9a10-d28cbb1790e1',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },

    {
      Id: 'c5a4ef82-9b22-49f0-b4ab-450de64e5cd3',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
    {
      Id: 'b3d268ab-45cd-49a8-92c0-3cdaec2e86e5',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
    {
      Id: 'ab9947a5-1cf0-4177-8e4c-e1de6be26812',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
    {
      Id: 'f68c16f9-77f2-4ea1-a3ec-57b8b77a56c7',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
    {
      Id: '5e1e3b8a-1b33-44ab-8974-1bb28f497f16',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
    {
      Id: 'fcf9a243-b88e-4be9-8c5f-5b1e654a9ce8',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },

    {
      Id: '67be3bcb-514f-4f33-ae96-e2f4a3f4d9c6',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },

    {
      Id: '1fc167ac-3310-49cc-bd6b-947167f21283',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 5,
    },
    {
      Id: 'd2a7eafa-8749-41f4-9f4b-b324dbe90e57',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 7,
    },
    {
      Id: '2ab891be-7c7b-41cb-91b0-c5587fbb91e2',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 8,
    },
    {
      Id: '89c8742d-d92f-44b3-8e82-7c2b71a18489',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 6,
    },
    {
      Id: 'a8b20142-89b7-46d2-b72f-3dc2dd29d4e3',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 9,
    },
    {
      Id: '38c53b0c-cb91-4d45-958c-b474e2eb5740',
      DeskPref_A: '',
      DeskPref_B: '',
      DeskPref_C: '',
      Presence: false,
      Rec_System_Rating: 0,
    },
    {
      Id: '9a824943-3f2a-407c-8805-f6d85ff40978',
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

// 🔹 Seed preferences into the database
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

async function seedBuildingDesks() {
  const conn = await connectionPool.getConnection();

  await conn.query(`
    CREATE TABLE IF NOT EXISTS BUILDING_DESKS (
      id VARCHAR(45) NOT NULL PRIMARY KEY,
      is_available BOOLEAN NOT NULL
    );
  `);
  
  // Sample desk data
  const building_desks = [
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
  const insertedBuildingDesks = await Promise.all(
    building_desks.map((desk) =>
      conn.query(`
        INSERT INTO BUILDING_DESKS (id, is_available)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          is_available = VALUES(is_available)
      `, [desk.Id, desk.Is_Available])
    )
  );
  conn.release();
  return insertedBuildingDesks;
}

// 🔹 Seed desks into the database
async function seedDesks() {
  const conn = await connectionPool.getConnection();

  // Drop old table if exists
  await conn.query(`DROP TABLE IF EXISTS desks;`);

  // Create new desks table with user field
  await conn.query(`
    CREATE TABLE desks (
      id VARCHAR(45) NOT NULL PRIMARY KEY,
      is_available BOOLEAN NOT NULL,
      user VARCHAR(255) NULL
    );
  `);

  // Sample desk data with user empty
  const desks = [
    { id: 'R105_01', is_available: true, user: null },
    { id: 'R105_02', is_available: true, user: null },
    { id: 'R106_01', is_available: true, user: null },
    { id: 'R106_02', is_available: true, user: null },
    { id: 'R208_01', is_available: true, user: null },
    { id: 'R208_02', is_available: true, user: null },
    { id: 'R208_03', is_available: true, user: null },
    { id: 'R208_04', is_available: true, user: null },
    { id: 'R209_01', is_available: true, user: null },
  ];

  // Insert data, no duplicates expected since we dropped table
  const insertedDesks = await Promise.all(
    desks.map((desk) =>
      conn.query(`
        INSERT INTO desks (id, is_available, user)
        VALUES (?, ?, ?)
      `, [desk.id, desk.is_available, desk.user])
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
    await seedBuildingDesks();

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
