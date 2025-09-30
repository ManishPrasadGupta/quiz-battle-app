"use client";

import TitleField from "./TitleField";
import DescriptionField from "./DescriptionField";
import TimeLimitField from "./TimeLimitField";
import QuestionsEditor from "./QuestionEditor";
import { Question } from "types/types";

type Props = {
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  editMode?: boolean;

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setTimeLimit: (v: number) => void;

  addQuestion: () => void;
  removeQuestion: (id: string) => void;
  updateQuestion: (
    id: string,
    field: keyof Question,
    value: string | number
  ) => void;
  updateQuestionOption: (
    id: string,
    optionIndex: number,
    value: string
  ) => void;

  onCreate: () => void;
  onCancel: () => void;
  createDisabled: boolean;
};

export default function QuizCreateForm({
  title,
  description,
  timeLimit,
  questions,
  setTitle,
  setDescription,
  setTimeLimit,
  addQuestion,
  removeQuestion,
  updateQuestion,
  updateQuestionOption,
  onCreate,
  onCancel,
  createDisabled,
  editMode,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6 shadow-sm">
      <h3 className="text-lg text-black  font-semibold mb-4">
        {editMode ? "Update Quiz" : "Create New Quiz"}
      </h3>

      <div className="space-y-4">
        <TitleField value={title} onChange={setTitle} />
        <DescriptionField value={description} onChange={setDescription} />
        <TimeLimitField value={timeLimit} onChange={setTimeLimit} />
        <QuestionsEditor
          questions={questions}
          onAdd={addQuestion}
          onRemove={removeQuestion}
          onUpdateField={updateQuestion}
          onUpdateOption={updateQuestionOption}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCreate}
          disabled={createDisabled}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors font-medium"
        >
          {editMode ? "Update Quiz" : "Create Quiz"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
