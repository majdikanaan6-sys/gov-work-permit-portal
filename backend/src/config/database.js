const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "work_permit_portal",
    password: "Ammsterdam7",
    port: 5432,
});

module.exports = pool;