const workerModel = require("../models/workerModel");
const permitModel = require("../models/workPermitModel");
const pool = require("../config/database");
const ihcModel = require("../models/ihcModel"); // ✅ add this at top

// =======================
// SUBMIT APPLICATION
// =======================

exports.submitApplication = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const employerId = req.user.id;

        const {
            full_name,
            passport_number,
            nationality,
            date_of_birth,
            position,
            salary,
            contract_duration
        } = req.body;

        // 🔍 Check if worker exists
        let workerResult = await pool.query(
            "SELECT * FROM workers WHERE passport_number = $1",
            [passport_number]
        );

        let worker;

        if (workerResult.rows.length > 0) {
            worker = workerResult.rows[0];
        } else {
            worker = await workerModel.createWorker({
                full_name,
                passport_number,
                nationality,
                date_of_birth,
                email: null,
                phone: null
            });
        }
        const reference = "WP-" + Date.now();

        const application = await permitModel.createApplication({
            employer_id: employerId,
            worker_id: worker.id,
            position,
            salary,
            contract_duration,
            reference_number: reference
        });

        res.status(201).json({
            message: "Work permit application submitted",
            application
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// =======================
// GET EMPLOYER APPLICATIONS
// =======================
exports.getEmployerApplications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const employerId = req.user.id;

        const result = await pool.query(
    `
    SELECT 
        a.id,
        a.reference_number,
        a.status,
        a.position,
        a.salary,
        a.contract_duration,
        a.created_at,

        w.full_name,
        w.passport_number,
        w.nationality

    FROM work_permit_applications a

    JOIN workers w ON a.worker_id = w.id

    WHERE a.employer_id = $1

    ORDER BY a.created_at DESC
    `,
    [employerId]
);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// =======================
// UPDATE STATUS
// =======================
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

          if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }
         // 1️⃣ Update application status
        const result = await pool.query(
            `UPDATE work_permit_applications
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        const application = result.rows[0];

        // 2️⃣ If PRE_AUTHORIZED → create IHC record
        let ihc = null;

        if (status === "PRE_AUTHORIZED") {

            ihc = await ihcModel.createIHC(id);

        }

        res.json({
            message: "Status updated",
            application,
            ihc   // will be null unless PRE_AUTHORIZED
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};