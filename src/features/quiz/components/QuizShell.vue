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
        <n-h2 style="margin: 0">{{ quiz.state.quiz?.title ?? "" }}</n-h2>
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
      :percentage="quiz.progressPct.value"
      :height="10"
      :border-radius="6"
      :show-indicator="false" />

    <!-- Jump / Finish UI -->
    <n-card
      v-if="quiz.state.status !== 'idle' && quiz.state.quiz"
      size="small"
      style="margin-top: -4px">
      <n-space align="center" justify="space-between">
        <n-text depth="3" style="font-size: 12px">
          Beantwortet: {{ quiz.answeredCount.value }} / {{ quiz.total.value }}
        </n-text>

        <n-button
          type="primary"
          :disabled="!quiz.allAnswered.value"
          @click="quiz.finishIfPossible()">
          Ergebnis anzeigen
        </n-button>
      </n-space>

      <n-space wrap :size="8" style="margin-top: 10px">
        <n-button
          v-for="(q, i) in quiz.state.quiz.questions"
          :key="q.id"
          size="small"
          :type="i === quiz.state.currentIndex ? 'primary' : 'default'"
          :secondary="i !== quiz.state.currentIndex"
          @click="quiz.goTo(i)">
          {{ i + 1 }}
        </n-button>
      </n-space>
    </n-card>

    <QuizStart
      v-if="quiz.state.status === 'idle'"
      :last-run="quiz.lastRun.value"
      @start="onStart"
      @open-last="quiz.openLastResult()" />

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
