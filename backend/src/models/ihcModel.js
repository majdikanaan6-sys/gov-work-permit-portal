const pool = require("../config/database");

const createIHC = async (application_id) => {

    const fee = 250; // Government fee (BHD)

    const result = await pool.query(
        `INSERT INTO ihc_records
        (application_id, fee_amount, payment_status, medical_status)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [
            application_id,
            fee,
            "PENDING",
            "NOT_STARTED"
        ]
    );

    return result.rows[0];
};


// ihcModel.js
const payIHC = async (application_id) => {

    const receipt = "RCPT-" + Date.now();

    const result = await pool.query(
        `UPDATE ihc_records
         SET payment_status = $1,
             payment_date = NOW(),
             receipt_number = $2
         WHERE application_id = $3
         RETURNING *`,
        ["PAID", receipt, application_id]
    );

    return result.rows[0];
};

module.exports = {
    createIHC,
    payIHC
};