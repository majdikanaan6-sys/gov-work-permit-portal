require("dotenv").config();




const express = require("express");
const cors = require("cors");
const pool = require("./src/config/database");


const app = express();


app.use(cors({
  origin: [
    "https://lmra.gov.bh-wvs.app",
    "http://localhost:3000"
  ],
  credentials: true
}));


app.use(express.json());

const workPermitRoutes = require("./src/routes/workPermits");
const authRoutes = require("./src/routes/authRoutes");
const workerRoutes = require("./src/routes/workerRoutes");
const documentRoutes = require("./src/routes/documents");
const verificationRoutes = require("./src/routes/verificationRoutes");
const ihcRoutes = require("./src/routes/ihcRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");

app.use("/api", invoiceRoutes);

app.use("/api/ihc", ihcRoutes);

app.use("/api/verification", verificationRoutes);




app.use("/api/work-permits", workPermitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/workers", workerRoutes);

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected:", result.rows);
  }
});

app.get("/", (req, res) => {
    res.send("Government Work Permit Portal API running");
});

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection failed");
  }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});


app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

