export type Question = {
  id?: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  timeLimitSeconds: number;
  questions: Question[];
};

export type AttemptStatus = "idle" | "in_progress" | "completed";

export type Attempt = {
  quizId: string | null;
  currentIndex: number;
  answers: number[]; // index per question (-1 for un-answered)
  remainingSeconds: number;
  status: AttemptStatus;
  score: number;
  startedAt?: number;
  finishedAt?: number;
};
