<!-- src/features/quiz/components/QuizShell.vue -->
<script setup lang="ts">
import { useQuiz } from "../composables/useQuiz";

import QuizStart from "./QuizStart.vue";
import QuizQuestion from "./QuizQuestion.vue";
import QuizResult from "./QuizResult.vue";

const quiz = useQuiz();

// Default Quiz ID (aus deiner JSON)
const DEFAULT_QUIZ_ID = "web-basics-50";

function onStart() {
  quiz.startById(DEFAULT_QUIZ_ID);
}
</script>

<template>
  <div class="container py-4" style="max-width: 900px">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h1 class="h4 mb-1">{{ quiz.state.quiz?.title ?? "Quiz App" }}</h1>
        <p class="text-muted mb-0" v-if="quiz.state.quiz?.description">
          {{ quiz.state.quiz.description }}
        </p>
      </div>

      <button
        v-if="quiz.state.status !== 'idle'"
        class="btn btn-outline-secondary btn-sm"
        @click="quiz.reset()">
        Reset
      </button>
    </div>

    <div
      class="progress mb-3"
      style="height: 10px"
      v-if="quiz.state.status !== 'idle'">
      <div
        class="progress-bar"
        role="progressbar"
        :style="{ width: quiz.progressPct + '%' }" />
    </div>

    <QuizStart
      v-if="quiz.state.status === 'idle'"
      :last-run="quiz.lastRun.value"
      @start="onStart" />

    <QuizQuestion
      v-else-if="quiz.state.status === 'running'"
      :question="quiz.currentQuestion.value"
      :index="quiz.state.currentIndex"
      :total="quiz.total.value"
      :answers="quiz.state.answers"
      :can-go-next="quiz.canGoNext.value"
      :is-last="quiz.isLast.value"
      @select="quiz.selectAnswer"
      @prev="quiz.prev"
      @next="quiz.next" />

    <QuizResult
      v-else
      :score="quiz.score.value"
      :score-pct="quiz.scorePct.value"
      :total="quiz.total.value"
      :quiz="quiz.state.quiz"
      :answers="quiz.state.answers"
      @restart="onStart"
      @save="quiz.saveRun" />
  </div>
</template>
