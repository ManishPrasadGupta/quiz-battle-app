"use client";

type props = {
  value: string;
  onChange: (value: string) => void;
};

const TitleField = ({ value, onChange }: props) => {
  return (
    <div>
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quiz Title *
        </label>
        <input
          id="title"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter quiz title..."
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
};

export default TitleField;
