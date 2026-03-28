const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");

// Public endpoint (no auth)
router.get("/check", verificationController.verifyApplication);

module.exports = router;