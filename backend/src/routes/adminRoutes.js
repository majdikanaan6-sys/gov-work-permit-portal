const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const {
  uploadInvoice,
} = require("../controllers/adminController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/invoices");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post(
  "/upload-invoice",
  upload.single("invoice"),
  uploadInvoice
);

module.exports = router;