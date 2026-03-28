// ihcController.js

const ihcModel = require("../models/ihcModel");
const pool = require("../config/database");

exports.payIHC = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // 1️⃣ Check current payment status first
    const existing = await pool.query(
      `SELECT payment_status FROM ihc_records WHERE application_id = $1`,
      [applicationId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "IHC record not found"
      });
    }

    if (existing.rows[0].payment_status === "PAID") {
      return res.status(400).json({
        message: "Payment already completed"
      });
    }

    // 2️⃣ Pay IHC
    const ihc = await ihcModel.payIHC(applicationId);

    // 3️⃣ Update application status
    const appResult = await pool.query(
      `UPDATE work_permit_applications
       SET status = 'IHC_REQUIRED'
       WHERE id = $1
       RETURNING *`,
      [applicationId]
    );

    res.json({
      message: "Payment successful",
      receipt: ihc.receipt_number,
      ihc,
      application: appResult.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};