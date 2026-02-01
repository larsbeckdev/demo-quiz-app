import { computed } from "vue";
import type { QuizState, QuizQuestion } from "../types/quiz.types";

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

export function useQuizAnswers(
  state: QuizState,
  currentQuestion: { value: QuizQuestion | null },
) {
  const selectedIds = computed<string[]>(() => {
    const q = currentQuestion.value;
    if (!q) return [];
    return state.answers[q.id] ?? [];
  });

  function setSingle(choiceId: string) {
    const q = currentQuestion.value;
    if (!q) return;
    state.answers[q.id] = [choiceId];
  }

  function toggleMulti(choiceId: string) {
    const q = currentQuestion.value;
    if (!q) return;
    const current = state.answers[q.id] ?? [];
    const next = current.includes(choiceId)
      ? current.filter((id) => id !== choiceId)
      : uniq([...current, choiceId]);
    state.answers[q.id] = next;
  }

  const canCheck = computed(() => selectedIds.value.length > 0);

  return { selectedIds, setSingle, toggleMulti, canCheck };
}
