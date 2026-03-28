const pool = require("../config/database");

const generateReference = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `WP-${year}-${random}`;
};

const createApplication = async (application) => {

    const reference = "WP-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + Date.now();

    const result = await pool.query(
        `INSERT INTO work_permit_applications
        (employer_id, worker_id, position, salary, contract_duration, status, reference_number)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [
            application.employer_id,
            application.worker_id,
            application.position,
            application.salary,
            parseInt(application.contract_duration), // ✅ FIX
            "SUBMITTED",
            reference      // ✅ FIXED
        ]
    );

    return result.rows[0];
};

module.exports = {
    createApplication
};  