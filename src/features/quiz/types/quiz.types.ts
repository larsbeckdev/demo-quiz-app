export type QuizChoice = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
};

export type QuizState = {
  status: "idle" | "running" | "finished";
  quiz: Quiz | null;
  currentIndex: number;
  answers: Record<string, string>; 
  startedAt?: number;
  finishedAt?: number;
};
