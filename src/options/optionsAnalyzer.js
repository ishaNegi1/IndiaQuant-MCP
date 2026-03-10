const YahooFinance = require("yahoo-finance2").default;

const yf = new YahooFinance();

function calculateMaxPain(calls, puts) {

  const strikes = calls.map(c => c.strike);

  let minLoss = Infinity;
  let maxPain = null;

  strikes.forEach(strike => {

    let totalLoss = 0;

    calls.forEach(call => {
      if (strike > call.strike) {
        totalLoss += (strike - call.strike) * call.openInterest;
      }
    });

    puts.forEach(put => {
      if (strike < put.strike) {
        totalLoss += (put.strike - strike) * put.openInterest;
      }
    });

    if (totalLoss < minLoss) {
      minLoss = totalLoss;
      maxPain = strike;
    }

  });

  return maxPain;

}

async function getOptionsChain(symbol) {

  const result = await yf.options(symbol);

  if (!result || !result.options || result.options.length === 0) {
    return null;
  }

  const chain = result.options[0];

  const maxPain = calculateMaxPain(chain.calls, chain.puts);

  return {
    expiry: chain.expirationDate,
    calls: chain.calls,
    puts: chain.puts,
    maxPain
  };

}

module.exports = { getOptionsChain };