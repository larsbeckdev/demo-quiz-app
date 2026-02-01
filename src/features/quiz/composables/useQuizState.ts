import { reactive } from "vue";
import type { QuizState } from "../types/quiz.types";

export function createInitialQuizState(): QuizState {
  return {
    status: "idle",
    quiz: null,
    currentIndex: 0,
    answers: {},
    reviewed: {},
    startedAt: undefined,
    finishedAt: undefined,
  };
}

export function useQuizState() {
  const state = reactive<QuizState>(createInitialQuizState());
  return { state };
}
