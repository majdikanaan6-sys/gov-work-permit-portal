const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.registerEmployer);
router.post("/login", authController.loginEmployer);

module.exports = router;