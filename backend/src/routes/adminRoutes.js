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

  const path = require("path");

  const filePath = path.join(
    __dirname,
    "../../uploads/invoices",
    req.params.filename
  );

  res.download(filePath);

});
module.exports = router;