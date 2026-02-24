const Q = 173.7178;
const PI = Math.PI;
const tau = 0.5;

const mu = (rating) => (rating - 1500) / Q;
const phi = (rd) => rd / Q;

const g = (phiVal) => 1 / Math.sqrt(1 + (3 * phiVal * phiVal) / (PI * PI));
const expectedScore = (muA, muB, gB) => 1 / (1 + Math.exp(-gB * (muA - muB)));

const volatilityFunction = (x, delta, phi, v, sigma, tau) => {
  const ex = Math.exp(x);
  return (
    (ex * (delta * delta - phi * phi - v - ex)) /
      (2 * Math.pow(phi * phi + v + ex, 2)) -
    (x - Math.log(sigma * sigma)) / (tau * tau)
  );
};

const solveVolatility = (delta, phi, v, sigma, tau) => {
  let A = Math.log(sigma * sigma);
  let B;
  if (delta * delta > phi * phi + v) {
    B = Math.log(delta * delta - phi * phi - v);
  } else {
    let k = 1;
    while (volatilityFunction(A - k * tau, delta, phi, v, sigma, tau) < 0) k++;
    B = A - k * tau;
  }

  let fA = volatilityFunction(A, delta, phi, v, sigma, tau);
  let fB = volatilityFunction(B, delta, phi, v, sigma, tau);

  while (Math.abs(B - A) > 1e-6) {
    const C = A + (A - B) * fA / (fB - fA);
    const fC = volatilityFunction(C, delta, phi, v, sigma, tau);

    if (fC * fB < 0) {
      A = B;
      fA = fB;
    } else {
      fA /= 2;
    }

    B = C;
    fB = fC;
  }

  return Math.exp(A / 2);
};

// ---------------- MAIN FUNCTION ----------------
// Winner + all losers at once
const GlickoTwoMatch = ({ winner, matches = [], weight = 1 }) => {
  // ---------------- UPDATE WINNER ----------------
  const muWinner = mu(winner.rating);
  const phiWinner = phi(winner.rd);

  let varianceInv = 0;
  let deltaSum = 0;

  matches.forEach((loser) => {
    const muOpp = mu(loser.rating);
    const phiOpp = phi(loser.rd);
    const gOpp = g(phiOpp);
    const expected = expectedScore(muWinner, muOpp, gOpp);

    const adjustedScore = expected + weight * (1 - expected); // winner score = 1

    varianceInv += gOpp * gOpp * expected * (1 - expected);
    deltaSum += gOpp * (adjustedScore - expected);
  });

  const vWinner = 1 / varianceInv;
  const deltaWinner = vWinner * deltaSum;
  const newSigmaWinner = solveVolatility(deltaWinner, phiWinner, vWinner, winner.sigma, tau);
  const phiStarWinner = Math.sqrt(phiWinner * phiWinner + newSigmaWinner * newSigmaWinner);
  const newPhiWinner = Math.sqrt(1 / (1 / (phiStarWinner * phiStarWinner) + 1 / vWinner));
  const newMuWinner = muWinner + newPhiWinner * newPhiWinner * deltaSum;

  const updatedWinner = {
    newRating: +(1500 + Q * newMuWinner).toFixed(2),
    newRD: +(Q * newPhiWinner).toFixed(2),
    newSigma: +newSigmaWinner.toFixed(6)
  };

  // ---------------- UPDATE LOSERS ----------------
  const updatedLosers = matches.map((loser) => {
    const muLoser = mu(loser.rating);
    const phiLoser = phi(loser.rd);

    const muOpp = muWinner;
    const phiOpp = phiWinner;
    const gOpp = g(phiOpp);
    const expected = expectedScore(muLoser, muOpp, gOpp);

    // Loser score = 0
    const adjustedScore = expected + weight * (0 - expected);

    const variance = 1 / (gOpp * gOpp * expected * (1 - expected));
    const delta = variance * (gOpp * (adjustedScore - expected));

    const newSigma = solveVolatility(delta, phiLoser, variance, loser.sigma, tau);
    const phiStar = Math.sqrt(phiLoser * phiLoser + newSigma * newSigma);
    const newPhi = Math.sqrt(1 / (1 / (phiStar * phiStar) + 1 / variance));
    const newMu = muLoser + newPhi * newPhi * gOpp * (adjustedScore - expected);

    return {
      ...loser,
      newRating: +(1500 + Q * newMu).toFixed(2),
      newRD: +(Q * newPhi).toFixed(2),
      newSigma: +newSigma.toFixed(6)
    };
  });

  return { updatedWinner, updatedLosers };
};

export default GlickoTwoMatch;