const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");

// Public endpoint (no auth)
router.get("/check", verificationController.verifyApplication);

router.post("/send-code", verificationController.sendCode);
router.post("/verify-code", verificationController.verifyCode);


module.exports = router;