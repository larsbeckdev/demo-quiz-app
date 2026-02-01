import quizWebBasics50Raw from "./quiz.web-basics.json";
import type { Quiz } from "../types/quiz.types";

function normalizeQuiz(raw: any): Quiz {
  // minimal: korrektes Feld sicherstellen
  const questions = (raw.questions ?? []).map((q: any) => ({
    ...q,
    type: q.type ?? "single",
    // Migration: correctChoiceId -> correctChoiceIds
    correctChoiceIds: Array.isArray(q.correctChoiceIds)
      ? q.correctChoiceIds
      : q.correctChoiceId
        ? [q.correctChoiceId]
        : [],
  }));

  return {
    ...raw,
    questions,
  } as Quiz;
}

const quizWebBasics50 = normalizeQuiz(quizWebBasics50Raw);

export const quizzes: Quiz[] = [quizWebBasics50];

export function getQuizById(id: string): Quiz | null {
  return quizzes.find((q) => q.id === id) ?? null;
}
