import React from 'react';

export default function GuessButtons({ maxDots, handleGuess }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {Array.from({ length: maxDots }, (_, i) => (
        <button
          key={i}
          onClick={() => handleGuess(i + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 min-w-[50px]"
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => handleGuess('pass')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 min-w-[50px]"
      >
        Pass
      </button>
    </div>
  );
}
