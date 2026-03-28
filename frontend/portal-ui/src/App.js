import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import PaymentPage from "./pages/PaymentPage";
import HelpPage from "./pages/HelpPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import WorkerVerify from "./pages/WorkerVerify";

// ✅ Payment Guard (must be OUTSIDE component or above return)
const PaymentGuard = ({ application, children }) => {
  if (!application) return null;

  if (application.status !== "PRE_AUTHORIZED") {
    return <Navigate to="/worker/dashboard" replace />;
  }

  return children;
};

function App() {
  // ⚠️ Replace this with real state later
  const application = JSON.parse(localStorage.getItem("application"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<h2>Work Permit Portal</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/workerverify" element={<WorkerVerify />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />

        {/* ✅ Protected Payment Route */}
        <Route
          path="/worker/payment"
          element={
            <PaymentGuard application={application}>
              <PaymentPage />
            </PaymentGuard>
          }
        />

        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
}

export default App;