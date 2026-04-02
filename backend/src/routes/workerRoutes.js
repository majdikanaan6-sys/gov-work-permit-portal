const express = require("express");
const router = express.Router();
const pool = require("../config/database")


const { getApplicationByEmail } = require("../controllers/workerController");

router.get("/application/reference/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    console.log("✅ HIT:", reference);
    console.log("DB RESULT:", result.rows);

    const result = await pool.query(`
      SELECT 
        wpa.id,
        wpa.status,
        wpa.reference_number,
        w.full_name AS worker_name,
        w.passport_number,
        w.nationality,
        e.company_name,
        i.fee,
        i.payment_status,
        i.medical_status
      FROM work_permit_applications wpa
      LEFT JOIN workers w ON w.id = wpa.worker_id
      LEFT JOIN employers e ON e.id = wpa.employer_id
      LEFT JOIN ihc_payments i ON i.application_id = wpa.id
      WHERE wpa.reference_number = $1
    `, [reference]);

    // ✅ THEN: check result
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    // ✅ THEN: check result
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const row = result.rows[0];

    if (!row) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!row.fee) {
      await pool.query(`
        INSERT INTO ihc_payments (application_id, fee, payment_status, medical_status)
        VALUES ($1, 250.00, 'PENDING', 'NOT_STARTED')
      `, [row.id]);
    }

    res.json({
      application: {
        id: row.id,
        reference: row.reference_number,
        status: row.status
      },
      worker: {
        name: row.worker_name,
        passport: row.passport_number,
        nationality: row.nationality
      },
      employer: {
        company_name: row.company_name
      },
      ihc: {
        fee: row.fee,
        payment_status: row.payment_status,
        medical_status: row.medical_status
      }
    });

  } catch (err) {
    console.error("❌ ROUTE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


const workerController = require("../controllers/workerController");

router.post("/register", workerController.registerWorker);

module.exports = router;