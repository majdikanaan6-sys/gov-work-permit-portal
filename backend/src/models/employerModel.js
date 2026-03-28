const pool = require("../config/database");

const createEmployer = async (data) => {
    const query = `
        INSERT INTO employers 
        (company_name, registration_number, industry, contact_person, email, phone, password_hash)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id, company_name, email
    `;

    const values = [
        data.company_name,
        data.registration_number,
        data.industry,
        data.contact_person,
        data.email,
        data.phone,
        data.password_hash
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

const findEmployerByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM employers WHERE email=$1",
        [email]
    );
    return result.rows[0];
};

module.exports = {
    createEmployer,
    findEmployerByEmail
};