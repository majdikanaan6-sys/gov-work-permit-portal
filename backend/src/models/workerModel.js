const pool = require("../config/database");

const createWorker = async (worker) => {

    const result = await pool.query(
        `INSERT INTO workers
        (full_name, passport_number, nationality, date_of_birth, email, phone)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [
            worker.full_name,
            worker.passport_number,
            worker.nationality,
            worker.date_of_birth,
            worker.email,
            worker.phone
        ]
    );

    return result.rows[0];
};

module.exports = {
    createWorker
};