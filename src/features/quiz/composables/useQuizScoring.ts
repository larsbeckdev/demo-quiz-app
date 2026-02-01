import { computed } from "vue";
import type { QuizState, QuizQuestion } from "../types/quiz.types";

function sameSet(a: string[], b: string[]) {
  const aa = [...a].sort();
  const bb = [...b].sort();
  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
  return true;
}

export function useQuizScoring(state: QuizState) {
  function isQuestionCorrect(q: QuizQuestion): boolean {
    const chosen = state.answers[q.id] ?? [];
    return sameSet(chosen, q.correctChoiceIds);
  }

  const correctCount = computed(() => {
    if (!state.quiz) return 0;
    let c = 0;
    for (const q of state.quiz.questions) {
      if (state.reviewed[q.id] && isQuestionCorrect(q)) c++;
    }
    return c;
  });

  const wrongCount = computed(() => {
    if (!state.quiz) return 0;
    let w = 0;
    for (const q of state.quiz.questions) {
      if (state.reviewed[q.id] && !isQuestionCorrect(q)) w++;
    }
    return w;
  });

  const total = computed(() => state.quiz?.questions.length ?? 0);

  const scorePct = computed(() => {
    const t = total.value;
    if (!t) return 0;
    // Score bezogen auf Gesamtfragen (nicht nur reviewed), bei finished sind alle reviewed
    return Math.round((correctCount.value / t) * 100);
  });

  return { isQuestionCorrect, correctCount, wrongCount, scorePct };
}
