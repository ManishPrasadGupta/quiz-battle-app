"use client";

import clsx from "clsx";
import { Question as Q } from "types/types";

export default function Question({
  question,
  selectedIndex,
  onSelect,
}: {
  question: Q;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div>
      <h4 className="mb-4 text-lg font-medium">{question.text}</h4>
      <ul className="grid gap-3">
        {question.options.map((opt, i) => {
          const active = selectedIndex === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={clsx(
                  "w-full rounded-md border px-4 py-3 text-left transition-colors",
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-gray-300 hover:bg-gray-50"
                )}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
