"use client";

import { Question } from "types/types";
import OptionRow from "./OptionsRow";

type Props = {
  question: Question;
  index: number;
  canRemove: boolean;
  onRemove: (id: string) => void;
  onUpdateField: (
    id: string,
    field: keyof Question,
    value: string | number
  ) => void;
  onUpdateOption: (id: string, optionIndex: number, value: string) => void;
};

export default function QuestionCard({
  question,
  index,
  canRemove,
  onRemove,
  onUpdateField,
  onUpdateOption,
}: Props) {
  const radioName = `correct-${question.id}`;
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => question.id && onRemove(question.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Question Text *
        </label>
        <input
          type="text"
          value={question.text}
          onChange={(e) =>
            question.id && onUpdateField(question.id, "text", e.target.value)
          }
          placeholder="Enter your question..."
          className="w-full px-3 py-2 border text-black border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-black mb-2">
          Options * (Select the correct answer)
        </label>
        <div className="space-y-2">
          {question.options.map((opt, optIndex) => (
            <OptionRow
              key={optIndex}
              name={radioName}
              label={String.fromCharCode(65 + optIndex)}
              checked={question.correctIndex === optIndex}
              value={opt}
              onCheck={() =>
                question.id &&
                onUpdateField(question.id, "correctIndex", optIndex)
              }
              onChange={(v) =>
                question.id && onUpdateOption(question.id, optIndex, v)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
