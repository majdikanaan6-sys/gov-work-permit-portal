const express = require("express");
const router = express.Router();

const ihcController = require("../controllers/ihcController");

// ✅ Payment endpoint
router.post("/pay/:applicationId", ihcController.payIHC);

module.exports = router;