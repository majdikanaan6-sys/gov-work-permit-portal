const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const documentController = require("../controllers/documentController");

// POST /api/documents/upload
router.post(
    "/upload",
    upload.single("file"),
    documentController.uploadDocument
);

module.exports = router;