import React, { useState, useEffect } from "react";
import "./workerverify.css";
import { useNavigate } from "react-router-dom";
import { verifyWorker } from "../services/workerService";
import { Helmet } from "react-helmet-async";


const WorkerVerify = () => {
  const [permitId, setPermitId] = useState("");
  const [passport, setPassport] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDate(formatted);
  }, []);

  const handleVerify = async () => {
    if (!permitId || !passport) {
      setError("Please enter both Permit ID and Passport Number");
      return;
    }

    try {
      setError("");
      const data = await verifyWorker(permitId, passport);
      localStorage.setItem("workerData", JSON.stringify(data));
      navigate("/worker/dashboard", { state: data });
    } catch (err) {
      setError("Invalid Permit ID or Passport Number");
    }
  };

  return (
    <div className="verify-page">

      <Helmet>
  <title>LMRA - Worker Verification System</title>
</Helmet>


      {/* 🔷 TOP BAR */}
      <div className="top-bar">
        <div>
          Worker Verification System &nbsp; || &nbsp;
          Today’s Date: {date}
        </div>
        <div className="help-link">Help</div>
      </div>

      {/* 🟦 HEADER BANNER */}
<div className="header-banner">
  <img src="/assets/banner.png" alt="LMRA Header" />
</div>

      

      {/* 🔴 VERSION NOTICE */}
      <div className="version-bar">
        <span className="red-dot"></span>
        Worker Verification Version Release "23.2.2"
      </div>

      {/* 📦 LOGIN PANEL */}
      <div className="login-wrapper">
        <div className="login-box">

          {/* Tabs (visual only) */}
          <div className="login-tabs">
            <div className="tab active">Worker Verification</div>
          </div>

          {/* Form */}
          <div className="login-body">
            <div className="form-group-wrapper">

            <label>Entry Permit Reference Number</label>
            <input
              type="text"
              value={permitId}
              onChange={(e) => setPermitId(e.target.value)}
            />

            <label>Passport Number</label>
            <input
              type="text"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
            />

            {error && <div className="error-box">{error}</div>}

            <button className="login-btn" onClick={handleVerify}>
              Verify
            </button>

          

            <p className="note">
              Note: Ensure that the Permit ID and Passport Number provided are accurate. Users are advised not to disclose personal information to unauthorized parties. This service is intended solely for worker verification purposes.
            </p>

          </div>
        </div>
      </div>
      </div>

      {/* 🔻 FOOTER */}
      <div className="footer">
        © 2023 Labour Market Regulatory Authority, Kingdom of Bahrain. All rights reserved.
      </div>

    </div>
  );
};

export default WorkerVerify;