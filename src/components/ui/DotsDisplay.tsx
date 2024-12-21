import React from "react";

export default function DotsDisplay({ showDots, dots, gameState, feedback }) {
  return (
    <div className="relative w-96 h-96 mx-auto bg-gray-50">
      {(gameState === "ready" || gameState === "feedback") && (
        <div className="absolute inset-0 flex items-center justify-center text-blue-600">
          {gameState === "ready" ? "Get ready!" : feedback.message}
        </div>
      )}
      {showDots &&
        dots.map((dot, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          />
        ))}
    </div>
  );
}
