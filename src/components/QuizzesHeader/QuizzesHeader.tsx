"use client";

import Link from "next/link";

type Props = {
  isOpen: boolean;
  onToggleCreate: () => void;
  onClearAll?: () => void;
};

export default function QuizzesHeader({
  isOpen,
  onToggleCreate,
  onClearAll,
}: Props) {
  return (
    <div className="flex justify-between items-center mb-4 p-6">
      <Link href="/" className="text-2xl font-semibold">
        Available Quizzes
      </Link>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onToggleCreate}
          aria-expanded={isOpen}
          className={
            isOpen
              ? "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              : "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          }
        >
          {isOpen ? "- Close Quiz" : "+ Create Quiz"}
        </button>

        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear All Quizzes
          </button>
        )}
      </div>
    </div>
  );
}
