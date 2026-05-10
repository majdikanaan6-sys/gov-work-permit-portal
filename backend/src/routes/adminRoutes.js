const express = require("express");
const multer = require("multer");
const path = require("path");


const router = express.Router();

const cloudinary = require("../config/cloudinary");

const { CloudinaryStorage } =
  require("multer-storage-cloudinary");


const {
  uploadInvoice,
} = require("../controllers/adminController");




const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "invoices",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

router.post(
  "/upload-invoice",
  upload.single("invoice"),
  uploadInvoice
);


module.exports = router;