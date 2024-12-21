import { calculateStats } from "../../utils/gameUtils";

export default function ScoreDisplay({ resultsMatrix, maxDots }) {
  const stats = calculateStats(resultsMatrix, maxDots);
  const correct = stats.correct;
  const total = stats.total;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <p className="text-lg">
      Score: {correct}/{total} ({percentage}%)
    </p>
  );
}
