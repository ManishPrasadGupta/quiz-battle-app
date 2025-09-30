import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./features/quiz/quizSlice";
import scoreboardReducer from "./features/scoreBoard/scoreBoardSlice";

export const store = () => {
  return configureStore({
    reducer: {
      quiz: quizReducer,
      scoreboard: scoreboardReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof store>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
