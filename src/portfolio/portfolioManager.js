const db = require("../../db/database");
const { getLivePrice } = require("../market/marketData");

function placeTrade(symbol, qty, side, price) {

  return new Promise((resolve) => {

    db.run(
      `INSERT INTO portfolio(symbol, qty, side, price)
       VALUES (?, ?, ?, ?)`,
      [symbol, qty, side, price],
      function() {
        resolve({ order_id: this.lastID });
      }
    );

  });
}

async function getPortfolioPNL() {

  return new Promise((resolve) => {

    db.all(`SELECT * FROM portfolio`, async (err, rows) => {

      let total = 0;

      for (let r of rows) {

        const price = await getLivePrice(r.symbol);

        const pnl = (price.price - r.price) * r.qty;

        total += pnl;
      }

      resolve({ positions: rows, total_pnl: total });
    });

  });
}

module.exports = { placeTrade, getPortfolioPNL };