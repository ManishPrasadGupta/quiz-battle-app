"use client";

import { Question } from "types/types";
import QuestionCard from "./QuestionCard";

type Props = {
  questions: Question[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdateField: (
    id: string,
    field: keyof Question,
    value: string | number
  ) => void;
  onUpdateOption: (id: string, optionIndex: number, value: string) => void;
};

export default function QuestionsEditor({
  questions,
  onAdd,
  onRemove,
  onUpdateField,
  onUpdateOption,
}: Props) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Questions *
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          + Add Question
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            canRemove={questions.length > 1}
            onRemove={onRemove}
            onUpdateField={onUpdateField}
            onUpdateOption={onUpdateOption}
          />
        ))}
      </div>
    </div>
  );
}
