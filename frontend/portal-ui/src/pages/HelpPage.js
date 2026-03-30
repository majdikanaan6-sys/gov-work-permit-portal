import { useState, useEffect } from "react";
import "./help.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";




export default function HelpPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
 
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();


  useEffect(() => {
  if (cooldown > 0) {
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [cooldown]);


  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const location = useLocation();
  const permitId =
  localStorage.getItem("permitId");
  useEffect(() => {
  if (permitId) {
    localStorage.setItem("permitId", permitId);
  }
}, [permitId]);

useEffect(() => {
  const locked = localStorage.getItem("paymentLocked");

  if (locked !== "true") {
    navigate("/worker/dashboard");
  }
}, []);

 const handleSendCode = async () => {
  if (!isEmailValid) {
    setError("Enter a valid email first");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await fetch("http://localhost:5000/api/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed");

    setCodeSent(true);
    setCooldown(30);

  } catch (err) {
    setError("Failed to send verification code");
  } finally {
    setLoading(false);
  }
};

const handleVerifyAndRequest = async (e) => {
  e.preventDefault();

  if (!code) {
    setError("Enter verification code");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await fetch("http://localhost:5000/api/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        permitId, // ✅ FIXED
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Invalid code");
    }

  
    setSubmitted(true);

localStorage.removeItem("paymentLocked");
localStorage.removeItem("paymentAttempts");

  } catch (err) {
    setError(err.message || "Invalid or expired code");
  } finally {
    setLoading(false);
  }
};



  

  return (
    <div className="help-container">

      <Helmet>
        <title>LMRA-IHC Payment Support</title>
      </Helmet>
      
      <div className="help-card">
        
        <h2>Payment Assistance</h2>

        {!submitted ? (
          <>
            <p className="help-text">
              You have reached the maximum number of payment attempts.
              <br />
              Please request a manual invoice to complete your payment.
            </p>

          <form onSubmit={handleVerifyAndRequest}>

  {/* EMAIL */}
  <div className="input-group">
    <input
      type="email"
      value={email}
      disabled={codeSent}
      onChange={(e) => {
        setEmail(e.target.value);
        setError("");
      }}
      placeholder="Enter your email"
    />
    <label>Email Address</label>
  </div>

  {/* SEND CODE BUTTON */}
  {!codeSent && (
    <button
      type="button"
      className="submit-btn"
      onClick={handleSendCode}
      disabled={loading}
    >
      {loading ? "Sending..." : "Send Verification Code"}
    </button>

    
  )}

  {/* CODE INPUT */}
  {codeSent && (
    <>
      <div className="input-group">
        <input
          type="text"
          value={code}
          maxLength={6}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // only digits
            setCode(value);
            setError("");
          }}
          placeholder="Enter verification code"

          
        />

        <label>Verification Code</label>
      </div>

      <button
  type="button"
  className="resend-btn"
  onClick={handleSendCode}
  disabled={loading || cooldown > 0}
>
  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
</button>

      <button type="submit" className="submit-btn" disabled={loading || code.length !== 6}>
  {loading ? "Verifying..." : "Verify & Request Invoice"}
</button>
    </>
  )}

</form>
          </>
        ) : (
          <div className="success-box">
  <h3>✅ Request Sent Successfully</h3>

  <p>
    Your invoice request has been received.
    <br /><br />
    📧 Confirmation sent to <strong>{email}</strong>
  </p>

  <button
    className="submit-btn"
    onClick={() => navigate("/worker/dashboard")}
  >
    Back to Dashboard
  </button>
</div>
        )}

      </div>
    </div>
  );
}