import { useState } from "react";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://lucky-adaptation-production-1a1b.up.railway.app/";

export default function AdminInvoiceUpload() {
  const [permitId, setPermitId] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!permitId || !file) {
      alert("Permit ID and invoice required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("invoice", file);
      formData.append("permitId", permitId);

      await axios.post(
        `${API_URL}/api/admin/upload-invoice`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Invoice uploaded successfully");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Upload Worker Invoice</h2>

      <input
        type="text"
        placeholder="Permit ID"
        value={permitId}
        onChange={(e) => setPermitId(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Invoice"}
      </button>
    </div>
  );
}