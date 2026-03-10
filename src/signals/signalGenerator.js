const YahooFinance = require("yahoo-finance2").default;
const { RSI, MACD } = require("technicalindicators");
const { analyzeSentiment } = require("../sentiment/sentimentAnalyzer");

const yf = new YahooFinance();

async function generateSignal(symbol) {

  const data = await yf.historical(symbol, {
    period1: new Date("2023-01-01"),
    period2: new Date(),
    interval: "1d"
  });

  if (!data || data.length === 0) {
    return { signal: "HOLD", confidence: 0, reason: "No historical data" };
  }

  const closes = data.map(d => d.close);

  const rsiValues = RSI.calculate({
    values: closes,
    period: 14
  });

  const macdValues = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9
  });

  const lastRSI = rsiValues[rsiValues.length - 1];
  const lastMACD = macdValues[macdValues.length - 1];

  const sentiment = await analyzeSentiment(symbol);

  let rsiScore = 0;
  if (lastRSI < 30) rsiScore = 1;
  if (lastRSI > 70) rsiScore = -1;

  let macdScore = 0;
  if (lastMACD.MACD > lastMACD.signal) macdScore = 1;
  else macdScore = -1;

  let sentimentScore = sentiment.score > 0 ? 1 : -1;

  const confidence =
    (rsiScore * 0.4) +
    (macdScore * 0.4) +
    (sentimentScore * 0.2);

  let signal = "HOLD";
  if (confidence > 0.3) signal = "BUY";
  if (confidence < -0.3) signal = "SELL";

  return {
    signal,
    confidence: Math.abs(confidence * 100),
    indicators: {
      rsi: lastRSI,
      macd: lastMACD.MACD,
      sentiment: sentiment.score
    }
  };

}

module.exports = { generateSignal };