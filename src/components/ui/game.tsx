import { useState, useEffect } from "react";
import GameControls from "./GameControls";
import DotsDisplay from "./DotsDisplay";
import GuessButtons from "./GuessButtons";
import StatsTable from "./StatsTable";
import ScoreDisplay from "./ScoreDisplay";
import {
  generateRandomDots,
  initializeMatrix,
  calculateStats,
  startNewRound,
  handleRestart,
} from "../../utils/gameUtils";

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
  const [feedback, setFeedback] = useState({ message: "", color: "" });

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
        startNewRound(
          setGameState,
          setDots,
          generateRandomDots,
          minDots,
          maxDots,
          setLastGuess
        );
      }, feedbackTime);
    }
    return () => clearTimeout(timer);
  }, [gameState, displayTime, feedbackTime, readyTime]);

  useEffect(() => {
    startNewRound(
      setGameState,
      setDots,
      generateRandomDots,
      minDots,
      maxDots,
      setLastGuess
    );
  }, [minDots, maxDots]);

  useEffect(() => {
    if (gameState === "feedback") {
      if (lastGuess === dots.length) {
        setFeedback({
          message: `Correct! 👍 There were ${dots.length} dots.`,
          color: "text-green-600",
        });
      } else {
        setFeedback({
          message: `Incorrect. ❌ There were ${dots.length} dots.`,
          color: "text-orange-600",
        });
      }
    }
  }, [gameState, lastGuess, dots]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow w-full overflow-x-auto p-4 sm:p-2">
      <div className="p-6 sm:p-4">
        <h2 className="text-2xl font-bold mb-6">Subitizing Test</h2>
        <GameControls
          displayTime={displayTime}
          setDisplayTime={setDisplayTime}
          feedbackTime={feedbackTime}
          setFeedbackTime={setFeedbackTime}
          startNewRound={() =>
            startNewRound(
              setGameState,
              setDots,
              generateRandomDots,
              minDots,
              maxDots,
              setLastGuess
            )
          }
        />
        <div className="space-y-6">
          <DotsDisplay
            showDots={showDots}
            dots={dots}
            gameState={gameState}
            feedback={feedback}
          />
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <ScoreDisplay resultsMatrix={resultsMatrix} maxDots={maxDots} />
              <button
                onClick={() =>
                  handleRestart(setResultsMatrix, initializeMatrix, () =>
                    startNewRound(
                      setGameState,
                      setDots,
                      generateRandomDots,
                      minDots,
                      maxDots,
                      setLastGuess
                    )
                  )
                }
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Reset Stats
              </button>
            </div>
            <div className="min-h-[200px] flex flex-col items-center justify-center w-full">
              <GuessButtons maxDots={maxDots} handleGuess={handleGuess} />
            </div>
            <StatsTable
              maxDots={maxDots}
              resultsMatrix={resultsMatrix}
              calculateStats={() => calculateStats(resultsMatrix, maxDots)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
