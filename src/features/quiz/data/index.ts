import quizWebBasics50 from "./quiz.web-basics.json";
import type { Quiz } from "../types/quiz.types";

export const quizzes: Quiz[] = [quizWebBasics50 as Quiz];

export function getQuizById(id: string): Quiz | null {
  return quizzes.find((q) => q.id === id) ?? null;
}
