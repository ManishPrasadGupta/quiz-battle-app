"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "store";
import {
  answerCurrent,
  completeAttempt,
  nextQuestion,
  prevQuestion,
  startAttempt,
  tick,
} from "store/features/quiz/quizSlice";
import Question from "components/Question/Question";
import Timer from "components/Timer/Timer";
import {
  fetchQuestionsByQuizId,
  updateQuizData,
} from "store/features/quiz/quizThunks";

export default function AttemptQuizPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const quiz = useSelector((s: RootState) =>
    s.quiz.quizzes.find((q) => q.id === params.id)
  );
  const attempt = useSelector((s: RootState) => s.quiz.attempt);

  useEffect(() => {
    if (!quiz) return;
    // Hydrate questions from backend if not loaded yet
    if (!quiz.questions || quiz.questions.length === 0) {
      dispatch(fetchQuestionsByQuizId(quiz.id)).then((action) => {
        if (action.payload && Array.isArray(action.payload)) {
          dispatch(
            updateQuizData({
              ...quiz,
              questions: action.payload,
            })
          );
        }
      });
    }
  }, [quiz, dispatch]);

  useEffect(() => {
    if (!quiz) return;
    if (attempt.quizId !== quiz.id || attempt.status === "idle") {
      dispatch(startAttempt({ quizId: quiz.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.id]);

  useEffect(() => {
    if (!quiz) return;
    if (attempt.status !== "in_progress") return;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, attempt.status, quiz]);

  useEffect(() => {
    if (!quiz) return;
    if (attempt.remainingSeconds <= 0 && attempt.status === "in_progress") {
      dispatch(completeAttempt());
      router.push("/results");
    }
  }, [attempt.remainingSeconds, attempt.status, dispatch, router, quiz]);

  if (!quiz) {
    return <p className="text-gray-600">Quiz not found.</p>;
  }

  const q = quiz.questions[attempt.currentIndex];

  const onSelect = (idx: number) => {
    dispatch(answerCurrent({ optionIndex: idx }));
  };

  const onNext = () => {
    if (attempt.currentIndex === quiz.questions.length - 1) {
      dispatch(completeAttempt());
      router.push("/results");
    } else {
      dispatch(nextQuestion());
    }
  };

  const onPrev = () => dispatch(prevQuestion());

  const selected = attempt.answers[attempt.currentIndex];

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{quiz.title}</h2>
          <p className="text-gray-600">{quiz.description}</p>
        </div>
        <div className="badge">
          <Timer seconds={attempt.remainingSeconds} />
        </div>
      </div>

      <div className="card">
        <div className="mb-3 text-sm text-gray-500">
          Question {attempt.currentIndex + 1} of {quiz.questions.length}
        </div>

        <Question question={q} selectedIndex={selected} onSelect={onSelect} />

        <div className="mt-6 flex justify-between">
          <button
            className="btn btn-outline"
            onClick={onPrev}
            disabled={attempt.currentIndex === 0}
          >
            Previous
          </button>
          <button className="btn btn-primary" onClick={onNext}>
            {attempt.currentIndex === quiz.questions.length - 1
              ? "Finish"
              : "Next"}
          </button>
        </div>
      </div>
    </section>
  );
}
