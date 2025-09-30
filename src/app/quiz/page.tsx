"use client";

import QuizCard from "components/QuizCard/QuizCard";
import QuizzesHeader from "components/QuizzesHeader/QuizzesHeader";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { clearAllQuizzes } from "store/features/quiz/quizSlice";
import { useEffect, useState } from "react";
import QuizCreateForm from "components/QuizCreate/QuestionCreateForm";
import { Question } from "types/types";
import {
  createQuiz,
  deleteQuiz,
  fetchQuizzes,
  updateQuizData,
} from "store/features/quiz/quizThunks";

export default function QuizListPage() {
  const quizzes = useSelector((s: RootState) => s.quiz.quizzes);
  const dispatch = useDispatch<AppDispatch>();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q-${Date.now()}`,
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    },
  ]);
  const [editQuizId, setEditQuizId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const addQuestion = () => {
    const newQuestion: Question = {
      // id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    };
    setQuestions((qs) => [...qs, newQuestion]);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTimeLimit(10);
    setQuestions([
      {
        id: `q-${Date.now()}`,
        text: "",
        options: ["", "", "", ""],
        correctIndex: 0,
      },
    ]);
    setEditQuizId(null);
  };

  const handleCreateQuiz = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    const invalidQuestions = questions.filter(
      (q) => !q.text.trim() || q.options.some((opt) => !opt.trim())
    );
    if (invalidQuestions.length > 0) {
      alert("Please fill in all question texts and options");
      return;
    }

    const newQuestions = questions.map((q) => ({
      id: q.id,
      text: q.text.trim(),
      options: q.options.map((opt) => opt.trim()),
      correctIndex: q.correctIndex,
    }));

    const newQuiz = {
      title: title.trim(),
      description: description.trim(),
      timeLimitSeconds: timeLimit,
      questions: newQuestions,
    };

    await dispatch(createQuiz(newQuiz));

    resetForm();
    setShowCreateForm(false);
  };

  const handleUpdateQuiz = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description");
      return;
    }
    const invalidQuestions = questions.filter(
      (q) => !q.text.trim() || q.options.some((opt) => !opt.trim())
    );
    if (invalidQuestions.length > 0) {
      alert("Please fill in all question texts and options");
      return;
    }
    await dispatch(
      updateQuizData({
        id: editQuizId!,
        title: title.trim(),
        description: description.trim(),
        timeLimitSeconds: timeLimit,
        questions: questions.map((q) => ({
          id: q.id,
          text: q.text.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctIndex: q.correctIndex,
        })),
      })
    );
    resetForm();
    setShowCreateForm(false);
    setEditQuizId(null);
  };

  const createDisabled =
    !title.trim() ||
    !description.trim() ||
    questions.some(
      (q) => !q.text.trim() || q.options.some((opt) => !opt.trim())
    );

  const handleToggleCreate = () => {
    if (showCreateForm) {
      resetForm();
    }
    setShowCreateForm((prev) => !prev);
  };

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const removeQuestion = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  };

  const updateQuestion = (
    id: string,
    field: keyof Question,
    value: string | number
  ) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateQuestionOption = (
    id: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id === id) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  return (
    <section className="p-10">
      <QuizzesHeader
        isOpen={showCreateForm}
        onToggleCreate={handleToggleCreate}
        onClearAll={() => dispatch(clearAllQuizzes())}
      />

      {quizzes.length === 0 && !showCreateForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-lg mb-4">No quizzes available</div>
          <p className="text-gray-400 mb-6">
            Create your first quiz to get started!
          </p>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Create Your First Quiz
          </button>
        </div>
      )}

      {showCreateForm && (
        <QuizCreateForm
          title={title}
          description={description}
          timeLimit={timeLimit}
          questions={questions}
          setTitle={setTitle}
          setDescription={setDescription}
          setTimeLimit={setTimeLimit}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
          updateQuestionOption={updateQuestionOption}
          onCreate={editQuizId ? handleUpdateQuiz : handleCreateQuiz}
          onCancel={() => {
            resetForm();
            setShowCreateForm(false);
            setEditQuizId(null);
          }}
          createDisabled={createDisabled}
          editMode={!!editQuizId}
        />
      )}

      {quizzes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quizzes.map((q) => (
            <QuizCard
              key={q.id}
              quiz={q}
              onRemove={() => dispatch(deleteQuiz(q.id))}
              onUpdate={() => {
                setTitle(q.title);
                setDescription(q.description);
                setTimeLimit(q.timeLimitSeconds);
                setQuestions(q.questions);
                setEditQuizId(q.id);
                setShowCreateForm(true);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
