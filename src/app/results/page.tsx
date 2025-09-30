"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { AppDispatch, RootState } from "store";
import { addEntry } from "store/features/scoreBoard/scoreBoardSlice";
import { resetAttempt } from "store/features/quiz/quizSlice";

export default function ResultsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { attempt, quizzes } = useSelector((s: RootState) => s.quiz);

  const quiz = useMemo(
    () => quizzes.find((q) => q.id === attempt.quizId) ?? null,
    [attempt.quizId, quizzes]
  );

  // On load, persist result to scoreboard (only once per completion)
  useEffect(() => {
    if (!quiz) return;
    if (attempt.status !== "completed") return;

    // we can key with finishedAt to avoid duplicates if user refreshes rapidly
    const key = `score-saved-${attempt.finishedAt ?? "x"}`;
    if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      dispatch(
        addEntry({
          name: "You",
          quizId: quiz.id,
          score: attempt.score,
          total: quiz.questions.length,
        })
      );
    }
  }, [attempt.status, attempt.finishedAt, dispatch, quiz, attempt.score]);

  if (!quiz) {
    return (
      <section className="text-center">
        <p className="mb-6 text-gray-600">No result found.</p>
        <Link href="/quiz" className="btn btn-primary">
          Back to Quizzes
        </Link>
      </section>
    );
  }

  const total = quiz.questions.length;
  const correct = attempt.score;

  const details = quiz.questions.map((q, i) => {
    const picked = attempt.answers[i];
    return {
      id: q.id,
      text: q.text,
      correctIndex: q.correctIndex,
      pickedIndex: picked,
    };
  });

  return (
    <section className="space-y-6">
      <div className="card">
        <h2 className="mb-2 text-2xl font-semibold">Results</h2>
        <p className="text-gray-600">{quiz.title}</p>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-4xl font-bold">{correct}</span>
          <span className="text-gray-500">/ {total} correct</span>
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            href="/quiz"
            className="btn btn-outline"
            onClick={() => dispatch(resetAttempt())}
          >
            Back to Quizzes
          </Link>
          <Link
            href={`/quiz/${quiz.id}`}
            className="btn btn-primary"
            onClick={() => dispatch(resetAttempt())}
          >
            Retry
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 text-lg font-semibold">Answer Review</h3>
        <ol className="space-y-4">
          {details.map((d, idx) => (
            <li key={d.id}>
              <div className="mb-2 font-medium">
                {idx + 1}. {d.text}
              </div>
              <div className="ml-4 text-sm">
                <div className="text-gray-600">
                  Your answer:{" "}
                  {d.pickedIndex >= 0
                    ? quiz.questions[idx].options[d.pickedIndex]
                    : "No answer"}
                </div>
                <div className="text-gray-600">
                  Correct answer: {quiz.questions[idx].options[d.correctIndex]}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
