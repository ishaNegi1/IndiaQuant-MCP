const { getLivePrice } = require("../market/marketData");
const { analyzeSentiment } = require("../sentiment/sentimentAnalyzer");
const { generateSignal } = require("../signals/signalGenerator");
const { getOptionsChain } = require("../options/optionsAnalyzer");
const {
  placeTrade,
  getPortfolioPNL,
} = require("../portfolio/portfolioManager");
const { calculateGreeks } = require("../options/blackScholes");

const YahooFinance = require("yahoo-finance2").default;
const { RSI } = require("technicalindicators");

const yf = new YahooFinance();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 });

module.exports = {
  // Get live stock price
  async get_live_price(req, res) {
    try {
      const data = await getLivePrice(req.query.symbol);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get options chain
  async get_options_chain(req, res) {
    try {
      const data = await getOptionsChain(req.query.symbol);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Sentiment analysis
  async analyze_sentiment(req, res) {
    try {
      const data = await analyzeSentiment(req.query.symbol);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Generate trading signal
  async generate_signal(req, res) {
    try {
      const data = await generateSignal(req.query.symbol);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Place virtual trade
  async place_virtual_trade(req, res) {
    try {
      const { symbol, qty, side, price } = req.body;
      const data = await placeTrade(symbol, qty, side, price);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Portfolio PnL
  async get_portfolio_pnl(req, res) {
    try {
      const data = await getPortfolioPNL();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Calculate Greeks
  async calculate_greeks(req, res) {
    try {
      const { S, K, T, r, sigma } = req.query;

      const greeks = calculateGreeks(
        Number(S),
        Number(K),
        Number(T),
        Number(r),
        Number(sigma),
      );

      res.json(greeks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Detect unusual options activity
  async detect_unusual_activity(req, res) {
    try {
      const { symbol } = req.query;

      const options = await getOptionsChain(symbol);

      const alerts = [];

      if (!options) {
        return res.json({ alerts: [] });
      }

      options.calls.forEach((call) => {
        if (
          call.volume &&
          call.openInterest &&
          call.volume > call.openInterest * 2
        ) {
          alerts.push({
            strike: call.strike,
            type: "CALL",
            volume: call.volume,
            openInterest: call.openInterest,
          });
        }
      });

      options.puts.forEach((put) => {
        if (
          put.volume &&
          put.openInterest &&
          put.volume > put.openInterest * 2
        ) {
          alerts.push({
            strike: put.strike,
            type: "PUT",
            volume: put.volume,
            openInterest: put.openInterest,
          });
        }
      });

      res.json({
        symbol,
        alerts,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scan market for oversold stocks
  async scan_market(req, res) {

  try {

    const cached = cache.get("scan_market");
    if (cached) return res.json(cached);

    const symbols = [
      "RELIANCE.NS",
      "TCS.NS",
      "INFY.NS",
      "HDFCBANK.NS",
      "ICICIBANK.NS",
      "SBIN.NS"
    ];

    const results = [];

    for (const symbol of symbols) {

      const hist = await yf.historical(symbol, {
        period1: new Date("2023-01-01"),
        period2: new Date(),
        interval: "1d"
      });

      if (!hist || hist.length === 0) continue;

      const closes = hist.map(d => d.close);

      const rsi = RSI.calculate({
        values: closes,
        period: 14
      });

      const lastRSI = rsi[rsi.length - 1];

      if (lastRSI < 30) {

        results.push({
          symbol,
          rsi: lastRSI
        });

      }

    }

    cache.set("scan_market", results);

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

},

  // Sector heatmap
  async get_sector_heatmap(req, res) {
    try {
      const sectors = {
        IT: ["TCS.NS", "INFY.NS", "WIPRO.NS"],
        BANK: ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS"],
        ENERGY: ["RELIANCE.NS", "ONGC.NS"],
      };

      const heatmap = {};

      for (const sector in sectors) {
        let change = 0;

        for (const symbol of sectors[sector]) {
          const quote = await yf.quote(symbol);

          change += quote.regularMarketChangePercent || 0;
        }

        heatmap[sector] = change / sectors[sector].length;
      }

      res.json(heatmap);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
