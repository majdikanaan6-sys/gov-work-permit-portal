const pool = require("../config/database");
const crypto = require("crypto");
const { sendVerificationEmail, sendAdminEmail } = require("../services/emailService");

// TEMP storage (use DB or Redis in production)
const otpStore = new Map();

exports.sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store with expiry (5 mins)
    otpStore.set(email, {
      code,
      expires: Date.now() + 5 * 60 * 1000,
    });

    console.log("📩 OTP for", email, ":", code);

    await sendVerificationEmail(email, code);

    res.json({ message: "Verification code sent" });

  } catch (err) {
    console.error("SEND CODE ERROR:", err);
    res.status(500).json({ error: "Failed to send code" });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code, permitId } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ error: "No code found" });
    }

    if (Date.now() > record.expires) {
      otpStore.delete(email);
      return res.status(400).json({ error: "Code expired" });
    }

    if (record.code !== code) {
      return res.status(400).json({ error: "Invalid code" });
    }

    // ✅ SUCCESS → remove OTP
    otpStore.delete(email);


// ✅ Update status
await pool.query(
  `
  UPDATE work_permit_applications
  SET status = 'PAYMENT_PENDING'
  WHERE reference_number = $1
  `,
  [permitId]
);

console.log("🔍 Updating status for permitId:", permitId);

const result = await pool.query(
  `
  UPDATE work_permit_applications
  SET status = 'PAYMENT_PENDING'
  WHERE reference_number = $1
  RETURNING *
  `,
  [permitId]
);

console.log("✅ UPDATE RESULT:", result.rows);
    // ✅ Send admin email
    await sendAdminEmail(email, permitId);

    res.json({ message: "Verified successfully" });

  } catch (err) {
    console.error("VERIFY CODE ERROR:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

exports.verifyApplication = async (req, res) => {
  try {
    console.log("Incoming request:", req.query);

    const { reference_number, passport_number } = req.query;

    // 1️⃣ Validate input
    if (!reference_number || !passport_number) {
      return res.status(400).json({
        message: "Reference number and passport number are required",
      });
    }

    // 2️⃣ Fetch application data (SAFE JOINS)
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

      LEFT JOIN workers w ON a.worker_id = w.id
      LEFT JOIN employers e ON a.employer_id = e.id
      LEFT JOIN ihc_records i ON i.application_id = a.id

      WHERE a.reference_number = $1
      AND w.passport_number = $2
      `,
      [reference_number, passport_number]
    );

    // 3️⃣ Handle no result
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No application found. Please check your details.",
      });
    }

    let data = result.rows[0];

    // 4️⃣ SAFE AUTO-SYNC STATUS
    if (data.payment_status === "PAID" && data.status !== "IMC_REQUIRED") {
      try {
        await pool.query(
          `
          UPDATE work_permit_applications
          SET status = 'IMC_REQUIRED'
          WHERE id = $1
          `,
          [data.application_id]
        );

        data.status = "IMC_REQUIRED";
      } catch (updateError) {
        console.error("STATUS UPDATE ERROR:", updateError);
      }
    }

    // 5️⃣ Return structured response (NULL SAFE)
    res.json({
      application: {
        id: data.application_id,
        reference: data.reference_number,
        status: data.status,
      },
      worker: data.full_name
        ? {
            name: data.full_name,
            passport: data.passport_number,
            nationality: data.nationality,
          }
        : null,
      employer: data.company_name
        ? {
            company_name: data.company_name,
          }
        : null,
      ihc: data.fee_amount
        ? {
            fee: data.fee_amount,
            payment_status: data.payment_status,
            medical_status: data.medical_status,
          }
        : null,
    });
  } catch (error) {
    console.error("VERIFY APPLICATION ERROR:", error);

    res.status(500).json({
      error: "Internal server error",
      details: error.message, // helpful for debugging (remove later in prod if needed)
    });
  }
};