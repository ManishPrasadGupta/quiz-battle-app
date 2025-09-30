"use client";

type props = {
  value: number;
  onChange: (value: number) => void;
};

const TimeLimitField = ({ value, onChange }: props) => {
  return (
    //  Time Limit Input
    <div>
      <label
        htmlFor="timeLimit"
        className="block text-sm font-medium text-black mb-1"
      >
        Time Limit (seconds)
      </label>
      <input
        id="timeLimit"
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 10))}
        min="1"
        max="3600"
        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className="text-xs text-gray-500 mt-1">Recommended: 60-300 seconds</p>
    </div>
  );
};

export default TimeLimitField;
