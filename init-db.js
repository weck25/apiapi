const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wallets.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the wallets database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        walletAddress TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

db.close();
