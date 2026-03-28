import axios from "axios";

const API_URL = "http://localhost:5000/api/verification";

// ✅ VERIFY WORKER
export const verifyWorker = async (permitId, passport) => {
  try {
    const response = await axios.get(`${API_URL}/check`, {
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
  const res = await fetch(
    `http://localhost:5000/api/ihc/pay/${applicationId}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Payment failed");
  }

  return res.json();
};