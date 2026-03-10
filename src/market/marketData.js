const YahooFinance = require("yahoo-finance2").default;

const yf = new YahooFinance();

async function getLivePrice(symbol) {

  const quote = await yf.quote(symbol);

  return {
    symbol,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChangePercent,
    volume: quote.regularMarketVolume
  };

}

async function getHistoricalData(symbol) {

  const result = await yf.historical(symbol, {
    period1: "2023-01-01",
    interval: "1d"
  });

  return result;

}

module.exports = {
  getLivePrice,
  getHistoricalData
};