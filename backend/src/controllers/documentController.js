const documentModel = require("../models/documentModel");
const pool = require("../config/database");

exports.uploadDocument = async (req, res) => {

    try {

        const { application_id, document_type } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;

        // 1️⃣ Save document
        const document = await documentModel.saveDocument({
            application_id,
            document_type,
            file_path: filePath
        });

        // 2️⃣ Check uploaded documents
        const docsResult = await pool.query(
            "SELECT document_type FROM application_documents WHERE application_id = $1",
            [application_id]
        );

        const uploadedTypes = docsResult.rows.map(d => d.document_type);

        const hasPassport = uploadedTypes.includes("passport");
        const hasContract = uploadedTypes.includes("contract");

        let newStatus = "DOCUMENTS_PENDING";

        if (hasPassport && hasContract) {
            newStatus = "UNDER_REVIEW";
        }

        // 3️⃣ Update application status
        await pool.query(
            "UPDATE work_permit_applications SET status = $1 WHERE id = $2",
            [newStatus, application_id]
        );

        res.status(201).json({
            message: "Document uploaded successfully",
            document,
            status: newStatus
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

};