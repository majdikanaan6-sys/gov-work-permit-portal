const express = require("express");
const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("ROOT OK");
});

app.get("/ping", (req, res) => {
  console.log("PING HIT");
  res.send("pong");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 MINIMAL SERVER RUNNING ON", PORT);
});