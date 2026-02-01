<script setup lang="ts">
import { computed } from "vue";
import { useQuiz } from "../composables/useQuiz";

import QuizStart from "./QuizStart.vue";
import QuizQuestion from "./QuizQuestion.vue";
import QuizResult from "./QuizResult.vue";

const quiz = useQuiz();
const DEFAULT_QUIZ_ID = "web-basics-50";

function onStart() {
  quiz.startById(DEFAULT_QUIZ_ID);
}

const currentIsCorrect = computed(() => {
  const q = quiz.currentQuestion.value;
  if (!q) return false;
  return quiz.isQuestionCorrect(q);
});
</script>

<template>
  <n-space
    vertical
    :size="16"
    style="max-width: 900px; margin: 0 auto; padding: 16px">
    <n-space align="start" justify="space-between">
      <div>
        <n-h2 style="margin: 0">{{
          quiz.state.quiz?.title ?? "Quiz App"
        }}</n-h2>
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
      v-else-if="
        quiz.state.status === 'running' || quiz.state.status === 'review'
      "
      :status="quiz.state.status"
      :question="quiz.currentQuestion.value"
      :index="quiz.state.currentIndex"
      :total="quiz.total.value"
      :selected-ids="quiz.selectedIds.value"
      :can-check="quiz.canCheck.value"
      :correct-count="quiz.correctCount.value"
      :wrong-count="quiz.wrongCount.value"
      :is-correct="currentIsCorrect"
      @setSingle="quiz.setSingle"
      @toggleMulti="quiz.toggleMulti"
      @prev="quiz.prev"
      @check="quiz.goToReview"
      @next="quiz.next" />

    <QuizResult
      v-else
      :score="quiz.correctCount.value"
      :wrong="quiz.wrongCount.value"
      :score-pct="quiz.scorePct.value"
      :total="quiz.total.value"
      :quiz="quiz.state.quiz"
      :answers="quiz.state.answers"
      @restart="onStart"
      @save="quiz.saveRun" />
  </n-space>
</template>
