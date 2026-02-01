export type QuizStatus = "idle" | "running" | "review" | "finished";

export type QuestionType = "single" | "multi";

export type QuizChoice = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  choices: QuizChoice[];
  type?: QuestionType;
  correctChoiceIds: string[];
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
};

export type QuizAnswers = Record<string, string[]>;

export type QuizState = {
  status: QuizStatus;
  quiz: Quiz | null;
  currentIndex: number;
  answers: QuizAnswers;

  // review state
  reviewed: Record<string, boolean>;

  startedAt?: number;
  finishedAt?: number;
};
