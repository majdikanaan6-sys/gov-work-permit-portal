const WorkerApplication = require("../models/workPermitModel");
const pool = require("../config/database");

exports.uploadInvoice = async (req, res) => {
  try {
    const { permitId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: "No invoice uploaded",
      });
    }

    const invoiceUrl =
      `/uploads/invoices/${req.file.filename}`;

    // UPDATE DATABASE
    const result = await pool.query(
      `
      UPDATE work_permit_applications
      SET
        invoice_uploaded = $1,
        invoice_url = $2
      WHERE reference_number = $3
      RETURNING *
      `,
      [
        true,
        invoiceUrl,
        permitId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json({
      success: true,
      invoice_url: invoiceUrl,
      application: result.rows[0],
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};