require("dotenv").config();

console.log("🚀 NEW DEPLOY VERSION 2");
console.log("API KEY:", process.env.BREVO_API_KEY);

const express = require("express");
const cors = require("cors");
const pool = require("./src/config/database");
const path = require("path");
const invoiceRoutes = require("./src/routes/invoiceRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Routes
app.use("/api", require("./src/routes/invoiceRoutes"));
app.use("/api/ihc", require("./src/routes/ihcRoutes"));
app.use("/api/verification", require("./src/routes/verificationRoutes"));
app.use("/api/work-permits", require("./src/routes/workPermits"));
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/documents", require("./src/routes/documents"));
app.use("/api/workers", require("./src/routes/workerRoutes"));
app.use("/api", invoiceRoutes);

// Static
app.use("/uploads", express.static("uploads"));

// Root test
app.get("/", (req, res) => {
  res.status(200).send("API running ✅");
});

app.get("/health", (req, res) => res.send("OK"));
app.get("/ping", (req, res) => {
  console.log("PING HIT");
  res.send("pong");
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

// DB test
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected:", result.rows);
  }
});

// ERROR HANDLER (before listen)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Correct PORT handling
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("Listening on:", PORT);