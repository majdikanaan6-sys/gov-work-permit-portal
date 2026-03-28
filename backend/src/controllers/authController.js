const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employerModel = require("../models/employerModel");

exports.registerEmployer = async (req, res) => {
    try {

        const {
            company_name,
            registration_number,
            industry,
            contact_person,
            email,
            phone,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const employer = await employerModel.createEmployer({
            company_name,
            registration_number,
            industry,
            contact_person,
            email,
            phone,
            password_hash: hashedPassword
        });

        res.status(201).json({
            message: "Employer registered successfully",
            employer
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginEmployer = async (req, res) => {

    const { email, password } = req.body;

    try {

        const employer = await employerModel.findEmployerByEmail(email);

        if (!employer) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(
            password,
            employer.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: employer.id, role: employer.role },
            "SECRET_KEY",
            { expiresIn: "24h" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
    console.error(error);   // important for debugging
    res.status(500).json({ error: error.message });
}
};