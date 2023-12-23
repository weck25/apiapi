const express = require("express");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Untuk parsing JSON
const db = new sqlite3.Database("./wallets.db");

app.post("/api/claims", verifyToken, (req, res) => {
  const walletAddress = req.body.data.walletAddress;

  db.run(
    "INSERT INTO wallets (walletAddress) VALUES (?)",
    [walletAddress],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      res.json({
        message: "Claim berhasil diproses",
        walletAddress,
        id: this.lastID,
      });
    }
  );
});
app.get("/api/claims", verifyToken, (req, res) => {
  db.all("SELECT * FROM wallets", [], (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(
      req.token,
      process.env.SECRET_KEY,
      (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          next();
        }
      }
    );
  } else {
    res.sendStatus(401);
  }
}
const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

module.exports = app