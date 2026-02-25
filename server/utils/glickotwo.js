import Product from "../models/Product.js";

// ---------------- Glicko-2 constants & functions ----------------
const Q = 173.7178;
const PI = Math.PI;
const tau = 0.5;

const mu = (rating) => (rating - 1500) / Q;
const phi = (rd) => rd / Q;

const g = (phiVal) =>
  1 / Math.sqrt(1 + (3 * phiVal * phiVal) / (PI * PI));

const expectedScore = (muA, muB, gB) =>
  1 / (1 + Math.exp(-gB * (muA - muB)));

const safeExpected = (e) =>
  Math.min(0.999999, Math.max(0.000001, e));

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
    while (
      volatilityFunction(A - k * tau, delta, phi, v, sigma, tau) < 0
    )
      k++;
    B = A - k * tau;
  }

  let fA = volatilityFunction(A, delta, phi, v, sigma, tau);
  let fB = volatilityFunction(B, delta, phi, v, sigma, tau);

  while (Math.abs(B - A) > 1e-6) {
    const C = A + ((A - B) * fA) / (fB - fA);
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

// ---------------- MAIN MONGODB UPDATE FUNCTION ----------------
const glickoTwo = async ({
  winnerId,
  loserIds,
  weightForWin,
  weightForLoss,
  userId,
  from,
}) => {
  try {
    const winner = await Product.findById(winnerId);
    if (!winner) return false;

    const losers = await Product.find({ _id: { $in: loserIds } });
    if (losers.length === 0) return false;

    const sigmaWinner = winner.sigma ?? 0.06;

    // ---------------- Winner calculation ----------------
    const muWinner = mu(winner.rating);
    const phiWinner = phi(winner.rd);

    let varianceInv = 0;
    let deltaSum = 0;

    losers.forEach((loser) => {
      const muOpp = mu(loser.rating);
      const phiOpp = phi(loser.rd);
      const gOpp = g(phiOpp);

      const expected = safeExpected(
        expectedScore(muWinner, muOpp, gOpp)
      );

      // weight applied properly here
      varianceInv +=
        weightForWin *
        gOpp *
        gOpp *
        expected *
        (1 - expected);

      deltaSum +=
        weightForWin *
        gOpp *
        (1 - expected);
    });

    if (!isFinite(varianceInv) || varianceInv <= 0)
      return false;

    const vWinner = 1 / varianceInv;
    const deltaWinner = vWinner * deltaSum;

    const newSigmaWinner = solveVolatility(
      deltaWinner,
      phiWinner,
      vWinner,
      sigmaWinner,
      tau
    );

    const phiStarWinner = Math.sqrt(
      phiWinner * phiWinner +
        newSigmaWinner * newSigmaWinner
    );

    const newPhiWinner = Math.sqrt(
      1 /
        (1 / (phiStarWinner * phiStarWinner) +
          1 / vWinner)
    );

    const newMuWinner =
      muWinner +
      newPhiWinner * newPhiWinner * deltaWinner;

    const updateData = {
      rating: +(1500 + Q * newMuWinner).toFixed(2),
      rd: +(Q * newPhiWinner).toFixed(2),
      sigma: +newSigmaWinner.toFixed(6),
    };

    if (userId && from !== "click") {
      updateData[`addToCartFlag.${userId}`] = true;
    }

    if (userId && from === "click") {
      updateData[`clickFlag.${userId}`] = true;
    }

    await Product.findByIdAndUpdate(
      winnerId,
      { $set: updateData },
      { new: true }
    );

    // ---------------- Losers calculation ----------------
    for (const loser of losers) {
      const sigmaLoser = loser.sigma ?? 0.06;

      const muLoser = mu(loser.rating);
      const phiLoser = phi(loser.rd);

      // use updated winner values
      const gOpp = g(newPhiWinner);

      const expected = safeExpected(
        expectedScore(muLoser, newMuWinner, gOpp)
      );

      const variance =
        1 /
        (weightForLoss *
          gOpp *
          gOpp *
          expected *
          (1 - expected));

      const delta =
        variance *
        (weightForLoss *
          gOpp *
          (0 - expected));

      const newSigma = solveVolatility(
        delta,
        phiLoser,
        variance,
        sigmaLoser,
        tau
      );

      const phiStar = Math.sqrt(
        phiLoser * phiLoser +
          newSigma * newSigma
      );

      const newPhi = Math.sqrt(
        1 /
          (1 / (phiStar * phiStar) +
            1 / variance)
      );

      const newMu =
        muLoser +
        newPhi * newPhi * gOpp * (0 - expected);

      await Product.findByIdAndUpdate(
        loser._id,
        {
          rating: +(1500 + Q * newMu).toFixed(2),
          rd: +(Q * newPhi).toFixed(2),
          sigma: +newSigma.toFixed(6),
        },
        { new: true }
      );
    }

    return true;
  } catch (err) {
    console.error("Glicko-2 MongoDB update failed:", err);
    return false;
  }
};

export default glickoTwo;