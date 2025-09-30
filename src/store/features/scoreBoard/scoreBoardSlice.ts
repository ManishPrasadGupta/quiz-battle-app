import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ScoreEntry = {
  id: string;
  name: string;
  quizId: string;
  score: number;
  total: number;
  date: string; // ISO
};

type ScoreboardState = {
  entries: ScoreEntry[];
};

const initialState: ScoreboardState = {
  entries: [], // Empty array - entries will be added dynamically
};

const scoreboardSlice = createSlice({
  name: "scoreboard",
  initialState,
  reducers: {
    addEntry(
      state,
      action: PayloadAction<{
        name: string;
        quizId: string;
        score: number;
        total: number;
      }>
    ) {
      const id = `e${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      state.entries.unshift({
        id,
        name: action.payload.name,
        quizId: action.payload.quizId,
        score: action.payload.score,
        total: action.payload.total,
        date: new Date().toISOString(),
      });
    },
    removeEntry(state, action: PayloadAction<{ entryId: string }>) {
      state.entries = state.entries.filter(
        (entry) => entry.id !== action.payload.entryId
      );
    },
    updateEntry(state, action: PayloadAction<ScoreEntry>) {
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload.id
      );
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    clearAllEntries(state) {
      state.entries = [];
    },
    clearEntriesForQuiz(state, action: PayloadAction<{ quizId: string }>) {
      state.entries = state.entries.filter(
        (entry) => entry.id !== action.payload.quizId
      );
    },
  },
});

export const {
  addEntry,
  removeEntry,
  updateEntry,
  clearAllEntries,
  clearEntriesForQuiz,
} = scoreboardSlice.actions;
export default scoreboardSlice.reducer;
