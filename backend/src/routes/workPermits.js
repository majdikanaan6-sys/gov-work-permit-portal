const express = require("express");
const router = express.Router();

const workPermitController = require("../controllers/workPermitController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit application (protected)
router.post("/apply", authMiddleware, workPermitController.submitApplication);

// Get employer applications
router.get(
    "/my-applications",
    authMiddleware,
    workPermitController.getEmployerApplications
);

router.put(
    "/:id/status",
    authMiddleware, // later replace with adminMiddleware
    workPermitController.updateApplicationStatus
);

module.exports = router;