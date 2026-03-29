import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ||
  "https://gov-work-permit-portal-production.up.railway.app";

if (!API_URL) {
  console.error("❌ API URL is not defined");
}

console.log("API URL:", API_URL);

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