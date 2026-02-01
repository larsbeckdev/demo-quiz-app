import type { Quiz } from "../types/quiz.types";
import { getQuizById } from "../data";

import { useQuizState } from "./useQuizState";
import { useQuizFlow } from "./useQuizFlow";
import { useQuizAnswers } from "./useQuizAnswers";
import { useQuizScoring } from "./useQuizScoring";
import { useQuizPersistence } from "./useQuizPersistence";

export function useQuiz() {
  const { state } = useQuizState();

  const flow = useQuizFlow(state);
  const scoring = useQuizScoring(state);
  const answers = useQuizAnswers(state, flow.currentQuestion);
  const persistence = useQuizPersistence(
    state,
    scoring.correctCount,
    flow.total,
  );

  function loadQuiz(quizId: string) {
    const quiz = getQuizById(quizId);
    if (!quiz) throw new Error(`Quiz not found: ${quizId}`);
    return quiz;
  }

  function startById(quizId: string) {
    const quiz = loadQuiz(quizId);
    flow.start(quiz);
  }

  function start(quiz: Quiz) {
    flow.start(quiz);
  }

  function openLastResult() {
    const last = persistence.loadLastRun();
    if (!last) return;

    const quiz = loadQuiz(last.quizId);

    state.quiz = quiz;
    state.answers = last.answers ?? {};
    state.reviewed = last.reviewed ?? {};
    state.currentIndex = 0;
    state.startedAt = undefined;
    state.finishedAt = last.finishedAt ?? Date.now();
    state.status = "finished";
  }

  return {
    // state
    state,

    // flow
    total: flow.total,
    currentQuestion: flow.currentQuestion,
    isLast: flow.isLast,
    progressPct: flow.progressPct,
    answeredCount: flow.answeredCount,
    allAnswered: flow.allAnswered,
    start,
    startById,
    goTo: flow.goTo,
    prev: flow.prev,
    next: flow.next,
    goToReview: flow.goToReview,
    finishIfPossible: flow.finishIfPossible,
    reset: flow.reset,

    // answers
    selectedIds: answers.selectedIds,
    canCheck: answers.canCheck,
    setSingle: answers.setSingle,
    toggleMulti: answers.toggleMulti,

    // scoring
    isQuestionCorrect: scoring.isQuestionCorrect,
    correctCount: scoring.correctCount,
    wrongCount: scoring.wrongCount,
    scorePct: scoring.scorePct,

    // persistence
    saveRun: persistence.saveRun,
    lastRun: persistence.lastRun,
    openLastResult,

    // data
    loadQuiz,
  };
}
