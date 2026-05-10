const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const cloudinary = require("../config/cloudinary");

const { CloudinaryStorage } =
  require("multer-storage-cloudinary");

  
const {
  uploadInvoice,
} = require("../controllers/adminController");



// Create folder if missing
if (!fs.existsSync(uploadPath)) {
  ;
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "invoices",
    resource_type: "raw",
    format: async () => "pdf",
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

    const fs = require("fs");

    const filePath = path.resolve(
      "uploads",
      "invoices",
      req.params.filename
    );

    console.log("DOWNLOAD PATH:", filePath);

    const exists = fs.existsSync(filePath);

    console.log("FILE EXISTS?", exists);

    if (!exists) {
      return res.status(404).json({
        error: "File not found"
      });
    }

    return res.download(filePath);

  } catch (err) {

    console.error("DOWNLOAD ERROR:", err);

    return res.status(500).json({
      error: "Internal Server Error"
    });

  }

});
module.exports = router;