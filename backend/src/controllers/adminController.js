const WorkerApplication = require("../models/WorkPermitModel");

exports.uploadInvoice = async (req, res) => {
  try {
    const { permitId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: "No invoice uploaded",
      });
    }

    const invoiceUrl =
      `/uploads/invoices/${req.file.filename}`;

    const updated =
      await WorkerApplication.findOneAndUpdate(
        {
          "application.reference": permitId,
        },
        {
          invoice_uploaded: true,
          invoice_url: invoiceUrl,
        },
        { new: true }
      );

    if (!updated) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json({
      success: true,
      invoice_url: invoiceUrl,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
};