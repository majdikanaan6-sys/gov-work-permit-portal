const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadPath = "uploads/invoices";

const {
  uploadInvoice,
} = require("../controllers/adminController");



// Create folder if missing
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

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

router.get("/download-invoice/:filename", (req, res) => {

  try {

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "invoices",
      req.params.filename
    );

    console.log("DOWNLOAD PATH:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    res.download(filePath);

  } catch (err) {

    console.error("DOWNLOAD ERROR:", err);

    res.status(500).json({
      error: "Internal Server Error",
    });

  }

});
module.exports = router;