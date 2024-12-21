export default function StatsTable({ maxDots, resultsMatrix, calculateStats }) {
  const stats = calculateStats();
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Actual ↓ Guessed →</th>
            {Array.from({ length: maxDots }, (_, i) => (
              <th key={i} className="border border-gray-300 p-2">{i + 1}</th>
            ))}
            <th className="border border-gray-300 p-2 bg-gray-100">Total</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxDots }, (_, i) => (
            <tr key={i}>
              <th className="border border-gray-300 p-2">{i + 1}</th>
              {Array.from({ length: maxDots }, (_, j) => (
                <td key={j} className={`border border-gray-300 p-2 ${i === j ? "bg-green-100" : ""}`}>
                  {resultsMatrix[i + 1][j + 1]}
                </td>
              ))}
              <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                {stats.totalByActual[i + 1]}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Total</th>
            {Array.from({ length: maxDots }, (_, i) => (
              <td key={i} className="border border-gray-300 p-2 font-semibold">
                {stats.totalByGuessed[i + 1]}
              </td>
            ))}
            <td className="border border-gray-300 p-2 font-bold">{stats.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
