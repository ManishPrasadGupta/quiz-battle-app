import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Question, Quiz } from "types/types";

const API_BASE = "https://68daf43523ebc87faa31aa88.mockapi.io/api/v1";

type props = {
  title: string;
  description: string;
  timeLimitSeconds: number;
  questions: Omit<Question, "id">[];
};

//create quiz
export const createQuiz = createAsyncThunk<Quiz, props>(
  "createQuiz",
  async ({ title, description, timeLimitSeconds, questions }) => {
    // 1. Create the quiz (no questionIds yet)
    const quizRes = await axios.post(`${API_BASE}/quizzes`, {
      title,
      description,
      timeLimitSeconds,
      questionIds: [],
    });
    const quiz = quizRes.data;
    const quizId = quiz.id;

    // 2. Create each question, now with quizId
    const questionPromises = questions.map((q) =>
      axios.post(`${API_BASE}/questions`, {
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        quizId,
      })
    );
    // All requests are sent at the same time (much faster) by using promize
    const questionResponses = await Promise.all(questionPromises);
    const createdQuestions = questionResponses.map((res) => res.data);
    const questionIds = createdQuestions.map((q) => q.id);

    // 3. Update quiz with its questionIds
    await axios.put(`${API_BASE}/quizzes/${quizId}`, {
      ...quiz,
      questionIds,
    });

    // 4. Return hydrated quiz for Redux
    return {
      ...quiz,
      questions: createdQuestions,
    } as Quiz;
  }
);

// fetch all the quizzes from the API ( Read Quizzes )
export const fetchQuizzes = createAsyncThunk<Quiz[]>(
  "fetchQuizzes",
  async () => {
    //Fetch All quizzes
    const response = await axios.get(`${API_BASE}/quizzes`);
    const quizzes: Quiz[] = response.data;

    const fetchQuestions = await Promise.all(
      quizzes.map(async (quiz) => {
        // Fetch only questions for this quiz using query param
        const res = await axios.get(`${API_BASE}/questions/?quizId=${quiz.id}`);
        const questions: Question[] = res.data;
        return { ...quiz, questions };
      })
    );
    return fetchQuestions;
  }
);

// Fetch all questions for a quiz by quizId
export const fetchQuestionsByQuizId = createAsyncThunk<Question[], string>(
  "fetchQuestionsByQuizId",
  async (quizId) => {
    const res = await axios.get(`${API_BASE}/questions/?quizId=${quizId}`);
    console.log("Fetched questions:", res.data);
    return res.data;
  }
);

// Delete a quiz and its questions
export const deleteQuiz = createAsyncThunk<string, string>(
  "deleteQuiz",
  async (quizId) => {
    // 1. Get all questions for this quiz from backend
    const questionsRes = await axios.get(
      `${API_BASE}/questions?quizId=${quizId}`
    );
    const questions = questionsRes.data;
    // 2. Delete all questions
    await Promise.all(
      questions.map((q: Question) =>
        axios.delete(`${API_BASE}/questions/${q.id}`)
      )
    );
    // 3. Delete the quiz itself
    await axios.delete(`${API_BASE}/quizzes/${quizId}`);
    // 4. Return quizId to remove from frontend state
    return quizId;
  }
);

//update the form
export const updateQuizData = createAsyncThunk<Quiz, Quiz>(
  "updateQuizData",
  async (quiz) => {
    // 1. Update quiz details and questionIds
    await axios.put(`${API_BASE}/quizzes/${quiz.id}`, {
      title: quiz.title,
      description: quiz.description,
      timeLimitSeconds: quiz.timeLimitSeconds,
      questionIds: quiz.questions.map((q) => q.id),
    });

    // 2. Update each question
    await Promise.all(
      quiz.questions.map((q) =>
        axios.put(`${API_BASE}/questions/${q.id}`, {
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          quizId: quiz.id,
        })
      )
    );
    // 3. Return updated quiz for Redux
    return quiz;
  }
);
