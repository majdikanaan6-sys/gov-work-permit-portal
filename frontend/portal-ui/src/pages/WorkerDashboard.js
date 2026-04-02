import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import "./WorkerDashboard.css";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const getInitials = (name) => {
  if (!name) return "W";
  const parts = name.trim().split(" ");
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (first[0] + last[0]).toUpperCase();
};

const getNotifications = (application) => {
  if (!application?.application) return [];
  const status = application.application.status;
  switch (status) {
    case "SUBMITTED":
      return [
        {
          id: 0,
          message:
            "Your work permit application has been submitted by your sponsor. Application will be reviewed in due time.",
          type: "info",
        },
      ];
    case "PRE_AUTHORIZED":
      return [
        {
          id: 1,
          message: "Your work permit application has been pre-authorized. Please complete IHC payment.",
          type: "warning",
        },
      ];
    case "IHC_REQUIRED":
      return [
        {
          id: 2,
          message: "Payment received. Proceed to medical examination.",
          type: "success",
        },
      ];
    case "under_review":
      return [
        {
          id: 3,
          message: "Your work permit application is under review. Please wait for approval.",
          type: "info",
        },
      ];
    default:
      return [];
  }
};

const WorkerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const menuRef = useRef();

  // Fetch latest application data
 useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("workerData"));

  let initialData = null;

  // ✅ Priority 1: navigation state
  if (location.state) {
    initialData = location.state;
    localStorage.setItem("workerData", JSON.stringify(location.state));
  }

  // ✅ Priority 2: localStorage
  else if (stored) {
    initialData = stored;
  }

  // ✅ Set immediately
  if (initialData) {
    setApplication(initialData);
  }

  // ❗ ALWAYS stop loading after initial check
  setLoading(false);

  // ✅ Background refresh ONLY if reference exists
  const reference = initialData?.application?.reference;

  if (!reference) return;

  const fetchApplication = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/workers/application/reference/${reference}`
      );

      setApplication(res.data);
      localStorage.setItem("workerData", JSON.stringify(res.data));

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchApplication();

}, [location.state]);

  // Update notifications when status changes
  useEffect(() => {
    if (!application?.application?.status) return;
    const newNotifs = getNotifications(application);
    setNotifications((prev) => {
      const existingIds = prev.map((n) => n.id);
      const filtered = newNotifs.filter((n) => !existingIds.includes(n.id));
      return [...prev, ...filtered];
    });
  }, [application?.application?.status]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("workerData");
    navigate("/workerverify");
  };

  const handleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, removing: true } : n))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2000);
  };

  const statusMap = {
    submitted: 0,
    under_review: 1,
    PRE_AUTHORIZED: 2,
    PAYMENT_PENDING: 3,
    IHC_REQUIRED: 4,
    medical_done: 4,
    approved: 5,
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (!application) return <div>No data available</div>;

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <Helmet>
        <title>LMRA - Worker Dashboard</title>
      </Helmet>

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="top-left">
          Worker Dashboard &nbsp; || &nbsp; Welcome: {application?.worker?.name || "Worker"}
        </div>
        <div className="top-right">
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          <div className="notification" onClick={() => setShowNotif(!showNotif)}>
            🔔
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
            {showNotif && (
              <div className="notif-dropdown">
                {notifications.length === 0 ? (
                  <p className="empty">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.type}`}
                      onClick={() => handleRead(n.id)}
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <span className={`status-badge ${application.application?.status}`}>
            {application.application?.status || "N/A"}
          </span>

          <div className="avatar-wrapper" ref={menuRef}>
            <div className="avatar small" onClick={() => setMenuOpen(!menuOpen)}>
              {getInitials(application?.worker?.name)}
            </div>
            <div className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
              <div className="dropdown-header">
                <div className="avatar small">{getInitials(application?.worker?.name)}</div>
                <div>
                  <p className="dropdown-name">{application?.worker?.name || "Worker"}</p>
                  <span className="dropdown-sub">{application?.worker?.name || "Worker"}</span>
                </div>
              </div>
              <button className="dropdown-item" onClick={() => { setShowProfile(true); setMenuOpen(false); }}>👤 Profile</button>
              <button className="dropdown-item">⚙️ Settings</button>
              <button onClick={handleLogout} className="dropdown-item logout">🚪 Logout</button>
            </div>
          </div>

          <span className="help-link">Help</span>
        </div>
      </div>

      <div className="header-banner">
        <img src="/assets/banner.png" alt="LMRA Header" />
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="profile-avatar">{getInitials(application?.worker?.name)}</div>
            <h3>Profile</h3>
            <p><strong>Name:</strong> {application.worker?.name}</p>
            <p><strong>Passport:</strong> {application.worker?.passport}</p>
            <p><strong>Permit ID:</strong> {application.application?.reference}</p>
            <p><strong>Status:</strong> {application.application?.status}</p>
            <button onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}

      {/* INFO CARDS */}
      <div className="info-grid">
        <div className="info-card">
          <p className="label">Worker Name</p>
          <p className="value">{application?.worker?.name || "N/A"}</p>
        </div>

        {/* IHC PAYMENT */}
        <div className="ihc-card">
          <h3>IHC Payment</h3>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`ihc-status ${application.ihc?.payment_status}`}>
              {application.ihc?.payment_status || "NOT GENERATED"}
            </span>
          </p>
          <p><strong>Amount:</strong> {application.ihc?.fee ? `BHD ${application.ihc.fee}` : "N/A"}</p>
          <div className="ihc-actions">
            {application.ihc?.payment_status === "PAID" ? (
              <button className="btn-success">View Receipt</button>
            ) : application.application?.status === "PRE_AUTHORIZED" ? (
              <button className="btn-primary" onClick={() => navigate("/worker/payment", { state: application })}>
                Pay Now
              </button>
            ) : application.application?.status === "PAYMENT_PENDING" ? (
              <button className="btn-disabled" disabled>Invoice Requested</button>
            ) : (
              <button disabled>No Action</button>
            )}
          </div>
        </div>

        <div className="info-card">
          <p className="label">Permit ID</p>
          <p className="value">{application.application?.reference || "N/A"}</p>
        </div>

        <div className="info-card">
          <p className="label">Sponsor</p>
          <p className="value">{application.employer?.company_name || "N/A"}</p>
        </div>
      </div>

      {/* STEPPER */}
      <div className="stepper-section">
        <h3>Application Progress</h3>
        <Stepper currentStep={statusMap[application.application?.status] || 0} />
      </div>
    </div>
  );
};

export default WorkerDashboard;