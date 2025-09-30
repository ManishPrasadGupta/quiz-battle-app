"use client";

import Link from "next/link";
import { Quiz } from "types/types";

export default function QuizCard({
  quiz,
  onRemove,
  onUpdate,
}: {
  quiz: Quiz;
  onRemove?: () => void;
  onUpdate?: () => void;
}) {
  return (
    <article className="card flex flex-col justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">{quiz.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{quiz.description}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="badge">{quiz.timeLimitSeconds}s</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className=" btn bg-red-500 hover:bg-red-600 "
          >
            Delete
          </button>
        )}
        {onUpdate && (
          <button
            type="button"
            onClick={onUpdate}
            className="btn bg-yellow-500 hover:bg-yellow-600 "
          >
            Update
          </button>
        )}
        <Link href={`/quiz/${quiz.id}`} className="btn btn-primary">
          Start
        </Link>
      </div>
    </article>
  );
}
