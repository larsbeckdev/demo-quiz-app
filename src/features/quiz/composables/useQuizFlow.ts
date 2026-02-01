import { computed } from "vue";
import type { QuizState, Quiz, QuizQuestion } from "../types/quiz.types";

export function useQuizFlow(state: QuizState) {
  const total = computed(() => state.quiz?.questions.length ?? 0);

  const currentQuestion = computed<QuizQuestion | null>(() => {
    if (!state.quiz) return null;
    return state.quiz.questions[state.currentIndex] ?? null;
  });

  const isLast = computed(() => {
    const t = total.value;
    return t > 0 && state.currentIndex >= t - 1;
  });

  const progressPct = computed(() => {
    const t = total.value;
    if (!t) return 0;

    const q = currentQuestion.value;
    const reviewed = q ? Boolean(state.reviewed[q.id]) : false;

    const base = state.currentIndex;
    const add = reviewed ? 0.8 : 0.2;
    return Math.min(100, Math.round(((base + add) / t) * 100));
  });

  function start(quiz: Quiz) {
    state.quiz = quiz;
    state.status = "running";
    state.currentIndex = 0;
    state.answers = {};
    state.reviewed = {};
    state.startedAt = Date.now();
    state.finishedAt = undefined;
  }

  function prev() {
    if (state.status === "idle") return;
    state.currentIndex = Math.max(0, state.currentIndex - 1);
    const q = currentQuestion.value;
    if (q) state.status = state.reviewed[q.id] ? "review" : "running";
  }

  function goToReview() {
    const q = currentQuestion.value;
    if (!q) return;
    state.reviewed[q.id] = true;
    state.status = "review";
  }

  function next() {
    if (!state.quiz) return;

    if (isLast.value) {
      const q = currentQuestion.value;
      if (!q) return;

      if (!state.reviewed[q.id]) {
        goToReview();
        return;
      }

      state.status = "finished";
      state.finishedAt = Date.now();
      return;
    }

    state.currentIndex++;
    const q = currentQuestion.value;
    if (q) state.status = state.reviewed[q.id] ? "review" : "running";
    else state.status = "running";
  }

  function reset() {
    state.status = "idle";
    state.quiz = null;
    state.currentIndex = 0;
    state.answers = {};
    state.reviewed = {};
    state.startedAt = undefined;
    state.finishedAt = undefined;
  }

  return {
    total,
    currentQuestion,
    isLast,
    progressPct,
    start,
    prev,
    next,
    goToReview,
    reset,
  };
}
