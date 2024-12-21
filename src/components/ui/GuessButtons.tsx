export default function GuessButtons({ maxDots, handleGuess }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {Array.from({ length: maxDots }, (_, i) => (
        <button
          key={i}
          onClick={() => handleGuess(i + 1)}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 min-w-[60px]"
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => handleGuess('pass')}
        className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 min-w-[60px]"
      >
        Pass
      </button>
    </div>
  );
}
