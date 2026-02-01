import { computed } from "vue";
import type { QuizState } from "../types/quiz.types";

const STORAGE_KEY = "quizapp:lastRun";

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function useQuizPersistence(
  state: QuizState,
  correctCount: { value: number },
  total: { value: number },
) {
  function saveRun() {
    if (!state.quiz) return;
    const payload = {
      quizId: state.quiz.id,
      score: correctCount.value,
      total: total.value,
      finishedAt: state.finishedAt ?? Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  const lastRun = computed(() =>
    safeJsonParse<{
      quizId: string;
      score: number;
      total: number;
      finishedAt: number;
    }>(localStorage.getItem(STORAGE_KEY)),
  );

  return { saveRun, lastRun };
}
