const pool = require("../config/database");

exports.verifyApplication = async (req, res) => {
  try {
    const { reference_number, passport_number } = req.query;

    // 1️⃣ Validate input
    if (!reference_number || !passport_number) {
      return res.status(400).json({
        message: "Reference number and passport number are required",
      });
    }

    // 2️⃣ Fetch application data
    const result = await pool.query(
      `
      SELECT 
        a.id AS application_id,
        a.reference_number,
        a.status,

        w.full_name,
        w.passport_number,
        w.nationality,

        e.company_name,

        i.fee_amount,
        i.payment_status,
        i.medical_status

      FROM work_permit_applications a

      JOIN workers w ON a.worker_id = w.id
      JOIN employers e ON a.employer_id = e.id

      LEFT JOIN ihc_records i ON i.application_id = a.id

      WHERE a.reference_number = $1
      AND w.passport_number = $2
      `,
      [reference_number, passport_number]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No application found. Please check your details.",
      });
    }

    let data = result.rows[0];

    // 3️⃣ ✅ AUTO-SYNC STATUS (IMPORTANT FIX)
    if (data.payment_status === "PAID" && data.status !== "IHC_REQUIRED") {
      await pool.query(
        `
        UPDATE work_permit_applications
        SET status = 'IHC_REQUIRED'
        WHERE id = $1
        `,
        [data.application_id]
      );

      // Update local variable so frontend gets latest status immediately
      data.status = "IHC_REQUIRED";
    }

    // 4️⃣ Return structured response
    res.json({
      application: {
        id: data.application_id,
        reference: data.reference_number,
        status: data.status,
      },
      worker: {
        name: data.full_name,
        passport: data.passport_number,
        nationality: data.nationality,
      },
      employer: {
        company_name: data.company_name,
      },
      ihc: data.fee_amount
        ? {
            fee: data.fee_amount,
            payment_status: data.payment_status,
            medical_status: data.medical_status,
          }
        : null,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};