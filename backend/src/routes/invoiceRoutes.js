// src/routes/invoiceRoutes.js

const express = require("express");
const router = express.Router();

const {
  sendCode,
  verifyCodeAndRequest,
} = require("../controllers/invoiceController");

router.post("/send-code", sendCode);
router.post("/verify-code", verifyCodeAndRequest);

module.exports = router;