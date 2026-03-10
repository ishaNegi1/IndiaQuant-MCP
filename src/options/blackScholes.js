function erf(x) {
  const sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1/(1+p*x);
  const y = 1 - (((((a5*t + a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);

  return sign*y;
}

function normCDF(x) {
  return 0.5 * (1 + erf(x/Math.sqrt(2)));
}

function calculateGreeks(S, K, T, r, sigma) {

  const d1 = (Math.log(S/K) + (r + sigma*sigma/2)*T) /
             (sigma*Math.sqrt(T));

  const d2 = d1 - sigma*Math.sqrt(T);

  const delta = normCDF(d1);

  const gamma = Math.exp(-d1*d1/2) /
               (S*sigma*Math.sqrt(2*Math.PI*T));

  const theta = -(S*sigma*Math.exp(-d1*d1/2)) /
                (2*Math.sqrt(2*Math.PI*T));

  const vega = S*Math.sqrt(T)*Math.exp(-d1*d1/2) /
               Math.sqrt(2*Math.PI);

  return { delta, gamma, theta, vega };
}

module.exports = { calculateGreeks };