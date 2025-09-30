import React from "react";
type Props = {
  value: string;
  onChange: (value: string) => void;
};

const DescriptionField = ({ value, onChange }: Props) => {
  return (
    <div>
      {/* Description Input */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter quiz description..."
          rows={3}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>
    </div>
  );
};

export default DescriptionField;
