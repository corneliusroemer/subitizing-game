export default function GameControls({ displayTime, setDisplayTime, feedbackTime, setFeedbackTime, startNewRound }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium mb-1">Display Time (ms)</label>
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

        <label className="block text-sm font-medium mb-1">Feedback Time (ms)</label>
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
  );
}
