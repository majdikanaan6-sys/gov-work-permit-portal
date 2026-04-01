


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import PaymentPage from "./pages/PaymentPage";
import HelpPage from "./pages/HelpPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import WorkerVerify from "./pages/WorkerVerify";

// ✅ Payment Guard (must be OUTSIDE component or above return)
const PaymentGuard = ({ children }) => {
  const stored = localStorage.getItem("workerData");
  const parsed = stored ? JSON.parse(stored) : null;

  console.log("Guard data:", parsed);

  if (!parsed || !parsed.application) {
    return <Navigate to="/workerverify" replace />;
  }

  if (parsed.application.status !== "PRE_AUTHORIZED") {
    return <Navigate to="/worker/dashboard" replace />;
  }

  return children;
};
function App() {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/workerverify" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/workerverify" element={<WorkerVerify />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        

        {/* ✅ Protected Payment Route */}
       <Route
  path="/worker/payment"
  element={
    <PaymentGuard>
      <PaymentPage />
    </PaymentGuard>
  }
/>

        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/workerverify" replace />} />
      </Routes>
    </Router>
  );
}

export default App;