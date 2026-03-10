const axios = require("axios");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

async function analyzeSentiment(symbol) {

  const url = `https://newsapi.org/v2/everything?q=${symbol}&apiKey=${process.env.NEWS_API_KEY}`;

  const res = await axios.get(url);

  const headlines = res.data.articles.slice(0,5).map(a => a.title);

  let score = 0;

  headlines.forEach(h => {
    score += sentiment.analyze(h).score;
  });

  return {
    score,
    headlines,
    signal: score > 0 ? "positive" : "negative"
  };
}

module.exports = { analyzeSentiment };