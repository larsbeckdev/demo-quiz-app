<script setup lang="ts">
import { computed } from "vue";
import type { QuizQuestion } from "../types/quiz.types";

const props = defineProps<{
  status: "running" | "review";
  question: QuizQuestion | null;
  index: number;
  total: number;

  selectedIds: string[];
  canCheck: boolean;

  correctCount: number;
  wrongCount: number;

  isCorrect: boolean;
}>();

const emit = defineEmits<{
  (e: "setSingle", choiceId: string): void;
  (e: "toggleMulti", choiceId: string): void;
  (e: "prev"): void;
  (e: "check"): void;
  (e: "next"): void;
}>();

const qType = computed(() => props.question?.type ?? "single");

function isSelected(choiceId: string) {
  return props.selectedIds.includes(choiceId);
}

function isCorrectChoice(choiceId: string) {
  return Boolean(props.question?.correctChoiceIds.includes(choiceId));
}

/**
 * Review-Status pro Choice:
 * - "correct-picked": korrekt & gewählt
 * - "wrong-picked": falsch & gewählt
 * - "missed-correct": korrekt aber NICHT gewählt
 * - "not-picked": nicht gewählt & nicht korrekt
 */
type ReviewState =
  | "correct-picked"
  | "wrong-picked"
  | "missed-correct"
  | "not-picked";

function getReviewState(choiceId: string): ReviewState {
  const picked = isSelected(choiceId);
  const correct = isCorrectChoice(choiceId);

  if (picked && correct) return "correct-picked";
  if (picked && !correct) return "wrong-picked";
  if (!picked && correct) return "missed-correct";
  return "not-picked";
}

function buttonType(choiceId: string) {
  if (props.status === "running") {
    return isSelected(choiceId) ? "primary" : "default";
  }

  // REVIEW: Naive-Standardfarben
  const s = getReviewState(choiceId);
  if (s === "correct-picked") return "success";
  if (s === "wrong-picked") return "warning"; // <- statt error
  if (s === "missed-correct") return "success"; // richtig, aber nicht gewählt
  return "default";
}

function buttonSecondary(choiceId: string) {
  if (props.status === "running") return true;

  // REVIEW: Unterscheidung „gewählt“ vs „nur korrekt“
  const s = getReviewState(choiceId);
  if (s === "correct-picked") return true; // voll sichtbar
  if (s === "wrong-picked") return true; // voll sichtbar (warning)
  if (s === "missed-correct") return true; // sichtbar, aber per Klasse abgeschwächt
  return true;
}

function choiceClass(choiceId: string) {
  if (props.status === "running") {
    return isSelected(choiceId) ? "choice--picked" : "choice--idle";
  }

  const s = getReviewState(choiceId);
  return {
    "choice--picked": s === "correct-picked" || s === "wrong-picked",
    "choice--missed": s === "missed-correct",
    "choice--idle": s === "not-picked",
  };
}

function onPick(choiceId: string) {
  if (props.status !== "running" || !props.question) return;
  if (qType.value === "single") emit("setSingle", choiceId);
  else emit("toggleMulti", choiceId);
}
</script>

<template>
  <n-card v-if="props.question">
    <n-space vertical :size="14">
      <n-space align="center" justify="space-between">
        <n-text depth="3" style="font-size: 12px">
          Frage {{ props.index + 1 }} / {{ props.total }}
        </n-text>

        <n-space :size="10">
          <n-tag type="success" size="small"
            >Richtig: {{ props.correctCount }}</n-tag
          >
          <n-tag type="warning" size="small"
            >Falsch: {{ props.wrongCount }}</n-tag
          >
        </n-space>
      </n-space>

      <n-h3 style="margin: 0">{{ props.question.question }}</n-h3>

      <n-space vertical :size="10" style="width: 100%">
        <n-button
          v-for="c in props.question.choices"
          :key="c.id"
          strong
          :type="buttonType(c.id)"
          :secondary="buttonSecondary(c.id)"
          style="width: 100%; justify-content: space-between"
          :class="choiceClass(c.id)"
          @click="onPick(c.id)">
          <span>{{ c.text }}</span>

          <!-- kleine Status-Hints nur im Review -->
          <template v-if="props.status === 'review'">
            <n-text depth="3" style="font-size: 12px">
              <template v-if="getReviewState(c.id) === 'correct-picked'"
                >✓ gewählt</template
              >
              <template v-else-if="getReviewState(c.id) === 'wrong-picked'"
                >✕ gewählt</template
              >
              <template v-else-if="getReviewState(c.id) === 'missed-correct'"
                >✓ nicht gewählt</template
              >
              <template v-else>nicht gewählt</template>
            </n-text>
          </template>
        </n-button>
      </n-space>

      <n-alert
        v-if="props.status === 'review'"
        :show-icon="false"
        :type="props.isCorrect ? 'success' : 'warning'">
        <n-space vertical :size="6">
          <div>
            <n-text strong>
              {{ props.isCorrect ? "Richtig!" : "Leider falsch." }}
            </n-text>
          </div>
          <n-text depth="3" v-if="props.question.explanation">
            {{ props.question.explanation }}
          </n-text>
        </n-space>
      </n-alert>

      <n-space justify="space-between">
        <n-button secondary :disabled="props.index === 0" @click="emit('prev')">
          Zurück
        </n-button>

        <n-space>
          <n-button
            v-if="props.status === 'running'"
            type="primary"
            :disabled="!props.canCheck"
            @click="emit('check')">
            Antwort prüfen
          </n-button>

          <n-button v-else type="primary" @click="emit('next')"
            >Weiter</n-button
          >
        </n-space>
      </n-space>
    </n-space>
  </n-card>

  <n-alert v-else type="warning" :bordered="true"
    >Keine Frage gefunden.</n-alert
  >
</template>

<style scoped>
/* ein bisschen „Interpretation“ über Gewicht/Opacity – Farben kommen von Naive (type=...) */

.choice--picked :deep(.n-button__content) {
  font-weight: 800;
}

.choice--missed {
  opacity: 0.78; /* korrekt, aber nicht gewählt -> sichtbar, aber klar „nicht aktiv“ */
}

.choice--idle {
  opacity: 0.95;
}
</style>
