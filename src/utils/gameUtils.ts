export function generateRandomDots(minDots, maxDots) {
  const count = Math.floor(Math.random() * (maxDots - minDots + 1)) + minDots;
  const newDots = [];
  const minDistance = 10;
  const padding = 20;

  for (let i = 0; i < count; i++) {
    let validPosition = false;
    let attempts = 0;
    let newDot;
    while (!validPosition && attempts < 10000) {
      const x = padding + Math.random() * (100 - 2 * padding);
      const y = padding + Math.random() * (100 - 2 * padding);
      newDot = { x, y };
      validPosition = newDots.every((existingDot) => {
        const dx = existingDot.x - newDot.x;
        const dy = existingDot.y - newDot.y;
        return Math.sqrt(dx * dx + dy * dy) >= minDistance;
      });
      attempts++;
    }
    if (validPosition) newDots.push(newDot);
  }
  return newDots;
}

export function initializeMatrix() {
  return Array(21)
    .fill(0)
    .map(() => Array(21).fill(0));
}

export function calculateStats(resultsMatrix, maxDots) {
  const stats = {
    totalByActual: Array(maxDots + 1).fill(0),
    totalByGuessed: Array(maxDots + 1).fill(0),
    correct: 0,
    total: 0,
  };
  for (let i = 1; i <= maxDots; i++) {
    for (let j = 1; j <= maxDots; j++) {
      const count = resultsMatrix[i][j];
      stats.totalByActual[i] += count;
      stats.totalByGuessed[j] += count;
      if (i === j) stats.correct += count;
      stats.total += count;
    }
  }
  return stats;
}

export function startNewRound(setGameState, setDots, generateRandomDots, minDots, maxDots, setLastGuess) {
  setGameState("ready");
  setDots(generateRandomDots(minDots, maxDots));
  setLastGuess(null);
}

export function handleRestart(setResultsMatrix, initializeMatrix, startNewRound) {
  setResultsMatrix(initializeMatrix());
  startNewRound();
}
