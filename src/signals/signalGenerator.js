const YahooFinance = require("yahoo-finance2").default;
const { RSI } = require("technicalindicators");

const yf = new YahooFinance();

async function generateSignal(symbol) {

  const data = await yf.historical(symbol, {
    period1: new Date("2023-01-01"),
    period2: new Date(),
    interval: "1d"
  });

  const closes = data.map(d => d.close);

  const rsi = RSI.calculate({
    values: closes,
    period: 14
  });

  const lastRSI = rsi[rsi.length - 1];

  let signal = "HOLD";

  if (lastRSI < 30) signal = "BUY";
  if (lastRSI > 70) signal = "SELL";

  return {
    signal,
    confidence: Math.abs(50 - lastRSI) * 2,
    rsi: lastRSI
  };

}

module.exports = { generateSignal };