import { computed, reactive } from "vue";
import type { Quiz, QuizState } from "../types/quiz.types";
import { getQuizById } from "../data";

const STORAGE_KEY = "quizapp:lastRun";

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function useQuiz() {
  const state = reactive<QuizState>({
    status: "idle",
    quiz: null,
    currentIndex: 0,
    answers: {},
  });

  const total = computed(() => state.quiz?.questions.length ?? 0);

  const currentQuestion = computed(() => {
    const q = state.quiz?.questions[state.currentIndex];
    return q ?? null;
  });

  const answeredCount = computed(() => Object.keys(state.answers).length);

  const progressPct = computed(() => {
    const t = total.value;
    if (!t) return 0;
    return Math.round((answeredCount.value / t) * 100);
  });

  const isLast = computed(() => state.currentIndex >= total.value - 1);

  const canGoNext = computed(() => {
    const q = currentQuestion.value;
    if (!q) return false;
    return Boolean(state.answers[q.id]);
  });

  const score = computed(() => {
    if (!state.quiz) return 0;
    let s = 0;
    for (const q of state.quiz.questions) {
      if (state.answers[q.id] === q.correctChoiceId) s++;
    }
    return s;
  });

  const scorePct = computed(() => {
    if (total.value === 0) return 0;
    return Math.round((score.value / total.value) * 100);
  });

  function loadQuiz(quizId: string) {
    const quiz = getQuizById(quizId);
    if (!quiz) throw new Error(`Quiz not found: ${quizId}`);
    return quiz;
  }

  function startById(quizId: string) {
    const quiz = loadQuiz(quizId);
    start(quiz);
  }

  function start(quiz: Quiz) {
    state.quiz = quiz;
    state.status = "running";
    state.currentIndex = 0;
    state.answers = {};
    state.startedAt = Date.now();
    state.finishedAt = undefined;
  }

  function selectAnswer(questionId: string, choiceId: string) {
    state.answers[questionId] = choiceId;
  }

  function next() {
    if (!canGoNext.value) return;
    if (isLast.value) {
      finish();
      return;
    }
    state.currentIndex++;
  }

  function prev() {
    if (state.status !== "running") return;
    state.currentIndex = Math.max(0, state.currentIndex - 1);
  }

  function finish() {
    state.status = "finished";
    state.finishedAt = Date.now();
  }

  function reset() {
    state.status = "idle";
    state.quiz = null;
    state.currentIndex = 0;
    state.answers = {};
    state.startedAt = undefined;
    state.finishedAt = undefined;
  }

  function saveRun() {
    if (!state.quiz) return;
    const payload = {
      quizId: state.quiz.id,
      score: score.value,
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

  return {
    state,
    total,
    currentQuestion,
    progressPct,
    isLast,
    canGoNext,
    score,
    scorePct,
    lastRun,
    loadQuiz,
    start,
    startById,
    selectAnswer,
    next,
    prev,
    finish,
    reset,
    saveRun,
  };
}
