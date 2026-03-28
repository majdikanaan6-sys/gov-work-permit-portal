const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB error:", err));
  console.log("DATABASE_URL:", process.env.DATABASE_URL);