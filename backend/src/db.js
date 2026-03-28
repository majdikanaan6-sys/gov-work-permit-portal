const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "work_permit_portal", // from pgAdmin
  password: "Ammsterdam7", // your password
  port: 5432,
});

module.exports = pool;

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB error:", err));