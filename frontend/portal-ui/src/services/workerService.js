import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ||
  "https://lucky-adaptation-production-1a1b.up.railway.app/";

if (!API_URL) {
  console.error("❌ API URL is not defined");
}

console.log("API URL:", API_URL);


// ✅ SEND OTP CODE
export const sendCode = async (email) => {
  console.log("🚀 Sending request to:", `${API_URL}/api/verification/send-code`);

  try {
    const response = await axios.post(`${API_URL}/api/verification/send-code`, {
      email,
    });

    console.log("✅ Response:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Send code error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ VERIFY WORKER
export const verifyWorker = async (permitId, passport) => {
  try {
    const response = await axios.get(`${API_URL}/api/verification/check`, {
      params: {
        reference_number: permitId,
        passport_number: passport,
      },
    });

    return response.data;

  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};

// ✅ PAY IHC
export const payIHC = async (applicationId) => {
  const res = await fetch(`${API_URL}/api/ihc/pay/${applicationId}`, {
  method: "POST",
});

  if (!res.ok) {
    throw new Error("Payment failed");
  }

  return res.json();
};