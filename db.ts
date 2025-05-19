const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionPool = mysql.createPool({
  host: process.env.MYSQL_HOST || '172.16.0.96',
  user: process.env.MYSQL_USER || 'db_user',
  password: process.env.MYSQL_PASSWORD || 'userPass!',
  database: process.env.MYSQL_DATABASE || 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connectionPool;