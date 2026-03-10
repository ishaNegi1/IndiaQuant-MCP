const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./portfolio.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT,
      qty INTEGER,
      side TEXT,
      price REAL
    )
  `);
});

module.exports = db;