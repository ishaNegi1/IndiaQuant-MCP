const YahooFinance = require("yahoo-finance2").default;

const yf = new YahooFinance();

async function getOptionsChain(symbol) {

  const result = await yf.options(symbol);

  if (!result || !result.options || result.options.length === 0) {
    return null;
  }

  return {
    expiry: result.options[0].expirationDate,
    calls: result.options[0].calls,
    puts: result.options[0].puts
  };

}

module.exports = { getOptionsChain };