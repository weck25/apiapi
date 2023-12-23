const express = require("express");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json()); // Untuk parsing JSON
const db = new sqlite3.Database("./wallets.db");
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
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
      "2792e2ad90d216092e08cf7e70b23fdcd84fbd757343f982fc0d3f5f27f1034bd99b07049e6002c662acb454cef7aeeecdaf028b8250c95f3ef78ca250a4828fc206cc9606cee4754f7d560744811d2dcbfac33a55643062d62cecf8f103b5d51f7b763c1977181e27c9762782bee835822c72df5283431b50678a9591c03892",
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
