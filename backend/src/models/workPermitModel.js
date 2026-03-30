const pool = require("../config/database");

// ✅ Proper reference generator
const generateReference = () => {
    const date = new Date().toISOString().slice(0,10).replace(/-/g,"");
    const unique = Date.now();
    return `WP-${date}-${unique}`;
};

const createApplication = async (application) => {
    try {
        // ✅ Validate required fields
        if (!application.employer_id || !application.worker_id) {
            throw new Error("Missing employer_id or worker_id");
        }

        const reference = generateReference();

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
                parseInt(application.contract_duration),
                "SUBMITTED",
                reference
            ]
        );

        return result.rows[0];

    } catch (err) {
        console.error("CREATE APPLICATION ERROR:", err);
        throw err;
    }
};

module.exports = {
    createApplication
};