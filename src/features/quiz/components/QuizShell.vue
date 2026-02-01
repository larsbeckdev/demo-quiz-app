
<script setup lang="ts">
import { useQuiz } from "../composables/useQuiz";

import QuizStart from "./QuizStart.vue";
import QuizQuestion from "./QuizQuestion.vue";
import QuizResult from "./QuizResult.vue";

const quiz = useQuiz();

const DEFAULT_QUIZ_ID = "web-basics-50";

function onStart() {
  quiz.startById(DEFAULT_QUIZ_ID);
}
</script>

<template>
  <n-space
    vertical
    :size="16"
    style="max-width: 900px; margin: 0 auto; padding: 16px">
    <n-space align="start" justify="space-between">
      <div>
        <n-h2 style="margin: 0">
          {{ quiz.state.quiz?.title ?? "Quiz App" }}
        </n-h2>
        <n-text v-if="quiz.state.quiz?.description" depth="3">
          {{ quiz.state.quiz.description }}
        </n-text>
      </div>

      <n-button
        v-if="quiz.state.status !== 'idle'"
        secondary
        size="small"
        @click="quiz.reset()">
        Reset
      </n-button>
    </n-space>

    <n-progress
      v-if="quiz.state.status !== 'idle'"
      type="line"
      :percentage="quiz.progressPct"
      :height="10"
      :border-radius="6"
      :show-indicator="false" />

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
  </n-space>
</template>
