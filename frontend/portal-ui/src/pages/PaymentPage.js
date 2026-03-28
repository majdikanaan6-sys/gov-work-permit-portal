import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { payIHC, verifyWorker } from "../services/workerService";
import "./PaymentPage.css";
import { logout } from "../utils/auth";
import { Helmet } from "react-helmet-async";





// 💳 Format card number
const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, "")
    .substring(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

// 💳 Detect card type
const detectCardType = (number) => {
  if (number.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(number)) return "MasterCard";
  return "";
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    const stored = localStorage.getItem("workerData");
    data = stored ? JSON.parse(stored) : null;
  }

  const application = data || {}

  // 💳 Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const [error, setError] = useState("");

  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 4;

const [touched, setTouched] = useState({
  cardNumber: false,
  name: false,
  expiry: false,
  cvv: false,
});

useEffect(() => {

   if (data?.application?.reference) {
    localStorage.setItem("permitId", data.application.reference);
  }

  if (application?.application?.status !== "PRE_AUTHORIZED") {
  navigate("/dashboard");
}
  const savedAttempts = localStorage.getItem("paymentAttempts");

  if (savedAttempts) {
    setAttempts(Number(savedAttempts));
  }

  const locked = localStorage.getItem("paymentLocked");
  if (locked === "true") {
    navigate("/help");
  }
}, []);

useEffect(() => {
  localStorage.setItem("paymentAttempts", attempts);
}, [attempts]);

 if (data?.application?.reference) {
    localStorage.setItem("permitId", data.application.reference);
  }


const isCardValid = cardNumber.replace(/\s/g, "").length === 16;
const isNameValid = name.trim().length > 3;
const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiry);
const isCvvValid =
  cardType === "amex"
    ? cvv.length === 4
    : cvv.length === 3;
  // 🏠 Address states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // ✅ Validation
  const isValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    name.length > 3 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvv.length >= 3 &&
    address.length > 5 &&
    city &&
    state &&
    zip &&
    country;

  

  const messages = [
  "Your card was declined.",
  "Incorrect card details.",
  "Transaction not permitted."
];


  // 💳 Handle Payment
  const handlePayment = () => {
  if (!isValid) {
    alert("Please complete all fields correctly");
    return;
  }

  setLoading(true);

  setTimeout(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem("paymentAttempts", newAttempts)

    if (newAttempts >= MAX_ATTEMPTS) {
      localStorage.setItem("paymentLocked", "true");
      alert("Maximum attempts reached. Redirecting to support...");
      navigate("/help");
      return;
    }

 // ❌ FAIL MESSAGE (Stripe-style)
  setError(
  `${messages[newAttempts - 1] || "Payment failed"} 
   Attempt ${newAttempts} of ${MAX_ATTEMPTS}`
);
  setLoading(false);
  }, 800); // fake delay
};

 return (
  <div className="payment-container">

    <Helmet>
      <title>IHC Payment Page</title>
    </Helmet>
    

 


      {/* ✅ SUCCESS OVERLAY */}
      {success && (
        <div className="success-overlay">
          <div className="success-box">
            <h2>✔ Payment Successful</h2>
            <p>Receipt No: {receipt}</p>
          </div>
        </div>
      )}

      <div className="payment-card">

        <div className="payment-header">
          <div className="header-left">
    <img src="/assets/logo.svg" alt="LMRA Logo" className="payment-logo" /> </div>

    <div className="header-center">
    <h2 className="header-title">IHC Payment</h2>
  </div>
  

  <button className="logout-btn" onClick={logout}>
    🚪 Logout
  </button>
</div>

  

        {/* 🔒 Secure Banner */}
        <div className="secure-banner">
          🔒 Secure Payment Gateway — Your data is encrypted
        </div>



{/* 💰 PAYMENT SUMMARY */}
<div className="payment-summary">

    <div className="summary-row">
  <span>Worker</span>
  <span>{data.worker.name}</span>
</div>
  <div className="summary-row">
    <span>Permit ID</span>
    <span>{data.application.reference}</span>
  </div>

  <div className="summary-row">
    <span>IHC Fee</span>
    <span>BHD {data.ihc.fee}</span>
  </div>

  <div className="summary-total">
    <span>Total</span>
    <span>BHD {data.ihc.fee}</span>
  </div>
</div>

        {/* 💳 CARD PREVIEW */}
        <div className="card-preview">
          <div className="card-chip"></div>

          <div className="card-number">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>

          <div className="card-footer">
            <div>
              <span>Card Holder</span>
              <p>{name || "FULL NAME"}</p>
            </div>

            <div>
              <span>Expires</span>
              <p>{expiry || "MM/YY"}</p>
            </div>
          </div>

          {cardType === "Visa" && (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              className="card-brand"
              alt="visa"
            />
          )}

          {cardType === "MasterCard" && (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              className="card-brand"
              alt="mastercard"
            />
          )}
        </div>

        {/* 💳 CARD NUMBER */}
        <div className="floating-group">
          <input
            type="text"
            placeholder=" "
            value={cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setCardNumber(formatted);
              setCardType(detectCardType(formatted.replace(/\s/g, "")));
              setError("");
            }}

             onBlur={() => setTouched({ ...touched, cardNumber: true })}
  className={
    touched.cardNumber
      ? isCardValid
        ? "valid"
        : "invalid"
      : ""
  }
          />
          <label>Card Number</label>
        </div>

        {/* 👤 NAME */}
        <div className="floating-group">
          <input
            type="text"
            placeholder=" "
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");}}
            
              
             onBlur={() => setTouched({ ...touched, name: true })}
  className={
    touched.name
      ? isNameValid
        ? "valid"
        : "invalid"
      : ""
  }
          />
          <label>Card Holder Name</label>
        </div>

        {/* 📅 EXPIRY + CVV */}
        <div className="form-row">
          <div className="floating-group">
            <input
              type="text"
              placeholder=" "
              value={expiry}
      
              onChange={(e) => {
  let value = e.target.value.replace(/\D/g, ""); // only numbers

  // limit to 4 digits (MMYY)
  if (value.length > 4) value = value.slice(0, 4);

    // prevent invalid month
  if (value.length >= 2) {
    let month = parseInt(value.slice(0, 2));
    if (month > 12) value = "12" + value.slice(2);
    if (month === 0) value = "01" + value.slice(2);
  }

  // auto format MM/YY
  if (value.length >= 3) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }

  

  setExpiry(value);
  setError("");

  
}}

onBlur={() => setTouched({ ...touched, expiry: true })}
  className={
    touched.expiry
      ? isExpiryValid
        ? "valid"
        : "invalid"
      : ""
  }
            />
            <label>MM/YY</label>
          </div>

          <div className="floating-group">
            <input
              type="password"
              placeholder=" "
              value={cvv}
              maxLength={cardType === "amex" ? 4 : 3}
              onChange={(e) => {
  let value = e.target.value.replace(/\D/g, ""); // only numbers

  const maxLength = cardType === "amex" ? 4 : 3;

  if (value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  setCvv(value);
  setError("");
}}

              
              onBlur={() => setTouched({ ...touched, cvv: true })}
  className={
    touched.cvv
      ? isCvvValid
        ? "valid"
        : "invalid"
      : ""
  }
            />
            <label>CVV</label>
          </div>
        </div>

        {/* 🏠 BILLING */}
        <h4>Billing Address</h4>

        <div className="floating-group">
          <input
            placeholder=" "
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
            setError("");}}
            
          />
          <label>Street Address</label>
        </div>

        <div className="form-row">
          <div className="floating-group">
            <input
              placeholder=" "
              value={city}
              onChange={(e) =>{
                setCity(e.target.value)
              setError("");}}
            />
            <label>City</label>
          </div>

          <div className="floating-group">
            <input
              placeholder=" "
              value={state}
              onChange={(e) => {
                setState(e.target.value)
              setError("");}}
            />
            <label>State</label>
          </div>
        </div>

        <div className="form-row">
          <div className="floating-group">
            <input
              placeholder=" "
              value={zip}
              onChange={(e) => {
                setZip(e.target.value)
              setError("");}}
            />
            <label>Postal Code</label>
          </div>

          <div className="floating-group">
            <input
              placeholder=" "
              value={country}
              onChange={(e) => {
                setCountry(e.target.value)
              setError("");}}
              
            />
            <label>Country</label>
          </div>
        </div>

{error && (
  <div className="payment-error">
    <span className="error-icon">⚠</span>
    {error}
  </div>
)}
        {/* 💰 BUTTON */}
        <button
          className="pay-btn"
          onClick={handlePayment}
          disabled={!isValid || loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>
    </div>
  );
};

export default PaymentPage;