import { computed } from "vue";
import type { QuizState, Quiz, QuizQuestion } from "../types/quiz.types";

export function useQuizFlow(state: QuizState) {
  const total = computed(() => state.quiz?.questions.length ?? 0);

  const currentQuestion = computed<QuizQuestion | null>(() => {
    if (!state.quiz) return null;
    return state.quiz.questions[state.currentIndex] ?? null;
  });

  const answeredCount = computed(() => {
    if (!state.quiz) return 0;
    return state.quiz.questions.filter(
      (q) => (state.answers[q.id]?.length ?? 0) > 0,
    ).length;
  });

  const allAnswered = computed(() => {
    const t = total.value;
    return t > 0 && answeredCount.value === t;
  });

  const progressPct = computed(() => {
    const t = total.value;
    if (!t) return 0;
    return Math.round((answeredCount.value / t) * 100);
  });

  const isLast = computed(() => {
    const t = total.value;
    return t > 0 && state.currentIndex >= t - 1;
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

  function goTo(index: number) {
    if (!state.quiz) return;
    const t = total.value;
    const next = Math.min(Math.max(index, 0), Math.max(0, t - 1));
    state.currentIndex = next;

    const q = currentQuestion.value;
    if (q) state.status = state.reviewed[q.id] ? "review" : "running";
  }

  function prev() {
    if (state.status === "idle") return;
    goTo(state.currentIndex - 1);
  }

  function goToReview() {
    const q = currentQuestion.value;
    if (!q) return;
    state.reviewed[q.id] = true;
    state.status = "review";
  }

  function next() {
    if (!state.quiz) return;
    goTo(state.currentIndex + 1);
  }

  function finishIfPossible() {
    if (!state.quiz) return;
    if (!allAnswered.value) return;

    // optional: alles als reviewed markieren, damit Result stabil ist
    for (const q of state.quiz.questions) state.reviewed[q.id] = true;

    state.status = "finished";
    state.finishedAt = Date.now();
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
    answeredCount,
    allAnswered,
    progressPct,
    start,
    goTo,
    prev,
    next,
    goToReview,
    finishIfPossible,
    reset,
  };
}
