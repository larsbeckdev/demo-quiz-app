import type { Quiz } from "../types/quiz.types";
import { getQuizById } from "../data";

import { useQuizState } from "./quiz/useQuizState";
import { useQuizFlow } from "./quiz/useQuizFlow";
import { useQuizAnswers } from "./quiz/useQuizAnswers";
import { useQuizScoring } from "./quiz/useQuizScoring";
import { useQuizPersistence } from "./quiz/useQuizPersistence";

export function useQuiz() {
  const { state } = useQuizState();

  const flow = useQuizFlow(state);
  const scoring = useQuizScoring(state);
  const answers = useQuizAnswers(state, flow.currentQuestion);
  const persistence = useQuizPersistence(state, scoring.correctCount, flow.total);

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

  return {
    // state
    state,

    // flow
    total: flow.total,
    currentQuestion: flow.currentQuestion,
    isLast: flow.isLast,
    progressPct: flow.progressPct,
    start,
    startById,
    prev: flow.prev,
    next: flow.next,
    goToReview: flow.goToReview,
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

    // data
    loadQuiz,
  };
}
