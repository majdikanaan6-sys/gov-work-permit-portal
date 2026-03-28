const https = require("https");

const axios = require("axios");


const agent = new https.Agent({
  family: 4, // ✅ FORCE IPv4
});

// 📩 send OTP to user (Brevo API)
exports.sendVerificationEmail = async (email, code) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        email: "admin@ihc-bh.com", // ⚠️ MUST be verified in Brevo
        name: "Gov Portal",
      },
      to: [{ email }],
      subject: "Your Verification Code",
      htmlContent: `<h2>Your verification code is ${code}</h2>`,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};

// 📩 send request to admin (Brevo API)
exports.sendAdminEmail = async (email, permitId) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "noreply@lmra.gov.bh-wvs.app",
          name: "LMRA Gov Portal",
        },
        to: [{ email: "admin@ihc-bh.com" }],
        subject: "Invoice Request",
        htmlContent: `
          <h3>Invoice Request</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Permit ID:</strong> ${permitId}</p>
        `,
      },
      {
        httpsAgent: agent,
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("✅ Admin email sent:", res.data);

    await axios.post(
  "https://api.brevo.com/v3/smtp/email",
  {
    sender: {
      email: "noreply@lmra.gov.bh-wvs.app",
      name: "LMRA Gov Portal",
    },
    to: [{ email }],
    subject: "Invoice Request Received",
    htmlContent: `
      <h3>Request Received</h3>
      <p>Your invoice request has been submitted.</p>
      <p><strong>Permit ID:</strong> ${permitId}</p>
    `,
  },
  {
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
  }
);

  } catch (err) {
    console.error("❌ Admin Email Error:", err.response?.data || err.message);
    throw err;
  }
};