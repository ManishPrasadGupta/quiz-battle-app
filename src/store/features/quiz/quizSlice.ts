import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attempt, Quiz } from "types/types";
import {
  createQuiz,
  deleteQuiz,
  fetchQuizzes,
  updateQuizData,
} from "./quizThunks";

type QuizState = {
  quizzes: Quiz[];
  attempt: Attempt;
};

// Empty array - quizzes will be added dynamically
const initialQuizzes: Quiz[] = [];

const initialAttempt: Attempt = {
  quizId: null,
  currentIndex: 0,
  answers: [],
  remainingSeconds: 0,
  status: "idle",
  score: 0,
};

const initialState: QuizState = {
  quizzes: initialQuizzes,
  attempt: initialAttempt,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    startAttempt(state, action: PayloadAction<{ quizId: string }>) {
      const quiz = state.quizzes.find((q) => q.id === action.payload.quizId);
      if (!quiz) return;
      state.attempt = {
        quizId: quiz.id,
        currentIndex: 0,
        answers: Array(quiz.questions.length).fill(-1),
        remainingSeconds: quiz.timeLimitSeconds,
        status: "in_progress",
        score: 0,
        startedAt: new Date().getTime(),
      };
    },
    answerCurrent(state, action: PayloadAction<{ optionIndex: number }>) {
      const quiz = state.quizzes.find((q) => q.id === state.attempt.quizId);
      if (!quiz) return;
      if (state.attempt.status !== "in_progress") return;

      const idx = state.attempt.currentIndex;
      if (idx < 0 || idx >= quiz.questions.length) return;

      state.attempt.answers[idx] = action.payload.optionIndex;
    },
    nextQuestion(state) {
      const quiz = state.quizzes.find((q) => q.id === state.attempt.quizId);
      if (!quiz) return;
      if (state.attempt.status !== "in_progress") return;

      if (state.attempt.currentIndex < quiz.questions.length - 1) {
        state.attempt.currentIndex += 1;
      }
    },
    prevQuestion(state) {
      if (state.attempt.status !== "in_progress") return;
      if (state.attempt.currentIndex > 0) {
        state.attempt.currentIndex -= 1;
      }
    },

    //timer is decrementing  unless and until time is 0
    tick(state) {
      if (state.attempt.status !== "in_progress") return;
      if (state.attempt.remainingSeconds > 0) {
        state.attempt.remainingSeconds -= 1;
      }
    },

    completeAttempt(state) {
      const quiz = state.quizzes.find((q) => q.id === state.attempt.quizId);
      if (!quiz) return;
      if (state.attempt.status === "completed") return;

      const score = quiz.questions.reduce((acc, q, i) => {
        return acc + (state.attempt.answers[i] === q.correctIndex ? 1 : 0);
      }, 0);

      state.attempt.status = "completed";
      state.attempt.score = score;
      state.attempt.finishedAt = new Date().getTime();
    },
    resetAttempt(state) {
      state.attempt = initialAttempt;
    },
    clearAllQuizzes(state) {
      state.quizzes = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.quizzes.push(action.payload);
    });
    builder.addCase(fetchQuizzes.fulfilled, (state, action) => {
      state.quizzes = action.payload;
    });
    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
    });
    builder.addCase(updateQuizData.fulfilled, (state, action) => {
      const idx = state.quizzes.findIndex((q) => q.id === action.payload.id);
      if (idx !== -1) state.quizzes[idx] = action.payload;
    });
  },
});

export const {
  startAttempt,
  answerCurrent,
  nextQuestion,
  prevQuestion,
  tick,
  completeAttempt,
  resetAttempt,
  clearAllQuizzes,
} = quizSlice.actions;

export default quizSlice.reducer;
