const pool = require("../config/database");

const saveDocument = async ({ application_id, document_type, file_path }) => {

    const result = await pool.query(
        `INSERT INTO application_documents
        (application_id, document_type, file_path)
        VALUES ($1,$2,$3)
        RETURNING *`,
        [application_id, document_type, file_path]
    );

    return result.rows[0];
};

module.exports = { saveDocument };