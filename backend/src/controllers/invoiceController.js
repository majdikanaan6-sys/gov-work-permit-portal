// src/controllers/invoiceController.js

const { sendVerificationEmail, sendAdminEmail } = require("../services/emailService");
const pool = require("../config/database"); // ✅ FIX THIS PATH if needed

const codes = {}; // temporary storage

// 🔹 SEND CODE
exports.sendCode = async (req, res) => {
  const { email, permitId } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000);

  console.log("📧 Email:", email);
  console.log("🔑 Generated Code:", code);

  codes[email] = {
    code,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    await sendVerificationEmail(email, code);


    // 3. ✅ UPDATE STATUS IN DATABASE
    await pool.query(
      "UPDATE work_permit_applications SET status = $1 WHERE reference_number = $2",
      ["PAYMENT_PENDING", permitId]
    );

    
    res.json({ success: true, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send code" });
  }
};



// 🔹 VERIFY CODE + REQUEST INVOICE
exports.verifyCodeAndRequest = async (req, res) => {
  try {
    const { email, code, permitId } = req.body;

    // ✅ CHECK PERMIT ID
    if (!permitId) {
      return res.status(400).json({ error: "Missing permit ID" });
    }

    // ✅ CHECK DATABASE
    const result = await pool.query(
      "SELECT * FROM work_permit_applications WHERE reference_number = $1",
      [permitId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid permit ID" });
    }

    // ✅ CHECK CODE
    const record = codes[email];

    if (!record) {
      return res.status(400).json({ error: "No code found" });
    }

    if (record.code != code || Date.now() > record.expires) {
      return res.status(400).json({ error: "Invalid or expired code" });

      
    }
    console.log("Updating permit:", permitId);

    // ✅ SEND ADMIN EMAIL
    await sendAdminEmail(email, permitId);

    // ✅ UPDATE STATUS HERE (CORRECT PLACE)
await pool.query(
  "UPDATE work_permit_applications SET status = $1 WHERE reference_number = $2",
  ["PAYMENT_PENDING", permitId]
);

console.log("✅ Status updated to PAYMENT_PENDING");

    delete codes[email];

    // ✅ FINAL RESPONSE (ONLY ONE!)
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
};