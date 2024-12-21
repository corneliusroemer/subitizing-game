import { useState, useEffect } from "react";

function generateRandomDots(minDots, maxDots) {
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

function initializeMatrix() {
  return Array(21)
    .fill(0)
    .map(() => Array(21).fill(0));
}

export default function SubitizingGame() {
  const [dots, setDots] = useState([]);
  const [gameState, setGameState] = useState("ready");
  const [showDots, setShowDots] = useState(false);
  const [lastGuess, setLastGuess] = useState(null);
  const [displayTime, setDisplayTime] = useState(500);
  const [feedbackTime, setFeedbackTime] = useState(1000);
  const minDots = 1;
  const maxDots = 10;
  const [readyTime] = useState(500);
  const [resultsMatrix, setResultsMatrix] = useState(initializeMatrix);

  function startNewRound() {
    setGameState("ready");
    setDots(generateRandomDots(minDots, maxDots));
    setLastGuess(null);
  }

  function handleRestart() {
    setResultsMatrix(initializeMatrix());
    startNewRound();
  }

  function calculateStats() {
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

  function handleGuess(guess) {
    if (gameState !== "guessing") return;
    setLastGuess(guess);
    if (guess === "pass") {
      setGameState("feedback");
      return;
    }
    setResultsMatrix((prev) => {
      const newMatrix = prev.map((row) => [...row]);
      if (dots.length <= maxDots && guess <= maxDots) {
        newMatrix[dots.length][guess]++;
      }
      return newMatrix;
    });
    setGameState("feedback");
  }

  useEffect(() => {
    let timer;
    if (gameState === "ready") {
      timer = setTimeout(() => {
        setGameState("showing");
        setShowDots(true);
      }, readyTime);
    } else if (gameState === "showing") {
      timer = setTimeout(() => {
        setShowDots(false);
        setGameState("guessing");
      }, displayTime);
    } else if (gameState === "feedback") {
      timer = setTimeout(() => {
        startNewRound();
      }, feedbackTime);
    }
    return () => clearTimeout(timer);
  }, [gameState, displayTime, feedbackTime, readyTime]);

  useEffect(() => {
    startNewRound();
  }, [minDots, maxDots]);

  const stats = calculateStats();

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Subitizing Test</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Display Time (ms)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                step="100"
                value={displayTime}
                onChange={(e) => {
                  setDisplayTime(Number(e.target.value));
                  startNewRound();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Feedback Time (ms)
              </label>
              <input
                type="number"
                min="500"
                max="10000"
                step="100"
                value={feedbackTime}
                onChange={(e) => {
                  setFeedbackTime(Number(e.target.value));
                  startNewRound();
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative w-96 h-96 mx-auto bg-gray-50">
              {showDots &&
                dots.map((dot, index) => (
                  <div
                    key={index}
                    className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  />
                ))}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <p className="text-lg">
                  Score: {stats.correct}/{stats.total} (
                  {stats.total > 0
                    ? Math.round((stats.correct / stats.total) * 100)
                    : 0}
                  %)
                </p>
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Reset Stats
                </button>
              </div>
              <div className="min-h-[200px] flex flex-col items-center justify-center">
                {gameState === "guessing" ? (
                  <>
                    <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto mb-4">
                      {Array.from({ length: maxDots }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handleGuess(i + 1)}
                          className="w-full p-2 border rounded hover:bg-gray-100"
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleGuess("pass")}
                      className="w-32 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Pass
                    </button>
                  </>
                ) : (
                  <div className="h-[108px] flex items-center justify-center">
                    {gameState === "ready" && (
                      <p className="text-lg font-semibold text-blue-600">
                        Ready...
                      </p>
                    )}
                    {gameState === "showing" && (
                      <p className="text-lg font-semibold">Count the dots!</p>
                    )}
                    {gameState === "feedback" && (
                      <p className="text-lg font-semibold text-blue-600">
                        {lastGuess === "pass"
                          ? `There were ${dots.length} dots.`
                          : `You guessed ${lastGuess}. There were ${dots.length} dots.`}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">
                        Actual ↓ Guessed →
                      </th>
                      {Array.from({ length: maxDots }, (_, i) => (
                        <th key={i} className="border border-gray-300 p-2">
                          {i + 1}
                        </th>
                      ))}
                      <th className="border border-gray-300 p-2 bg-gray-100">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: maxDots }, (_, i) => (
                      <tr key={i}>
                        <th className="border border-gray-300 p-2">{i + 1}</th>
                        {Array.from({ length: maxDots }, (_, j) => (
                          <td
                            key={j}
                            className={`border border-gray-300 p-2 ${
                              i === j ? "bg-green-100" : ""
                            }`}
                          >
                            {resultsMatrix[i + 1][j + 1]}
                          </td>
                        ))}
                        <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                          {calculateStats().totalByActual[i + 1]}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Total</th>
                      {Array.from({ length: maxDots }, (_, i) => (
                        <td
                          key={i}
                          className="border border-gray-300 p-2 font-semibold"
                        >
                          {calculateStats().totalByGuessed[i + 1]}
                        </td>
                      ))}
                      <td className="border border-gray-300 p-2 font-bold">
                        {calculateStats().total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
