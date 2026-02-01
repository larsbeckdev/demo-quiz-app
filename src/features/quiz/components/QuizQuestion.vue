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

function choiceClass(choiceId: string) {
  // Während running: selected deutlich
  if (props.status === "running") {
    return isSelected(choiceId) ? "choice--selected" : "";
  }

  // Review-Farben wie gehabt
  if (isCorrectChoice(choiceId)) return "choice--correct";
  if (isSelected(choiceId) && !isCorrectChoice(choiceId))
    return "choice--wrong";
  return "choice--neutral";
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
          <n-tag type="error" size="small"
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
          :type="
            props.status === 'running' && isSelected(c.id)
              ? 'primary'
              : 'default'
          "
          :secondary="!(props.status === 'running' && isSelected(c.id))"
          style="width: 100%; justify-content: space-between"
          :class="choiceClass(c.id)"
          @click="onPick(c.id)">
          <span>{{ c.text }}</span>
        </n-button>
      </n-space>

      <!-- Review hint -->
      <n-alert
        v-if="props.status === 'review'"
        :bordered="true"
        :show-icon="false"
        :type="props.isCorrect ? 'success' : 'error'">
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
.choice--selected,
.choice--correct,
.choice--wrong,
.choice--neutral {
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease,
    opacity 120ms ease;
}

/* RUNNING: ausgewählt */
.choice--selected {
  border-color: var(--n-color-target);
  /* nutzt primary-farbige “soft” Fläche – passt zu light/dark */
  background-color: var(--n-color-target);
  box-shadow: 0 0 0 2px var(--n-color-target);
}

/* REVIEW: correct */
.choice--correct {
  border-color: var(--n-color-target);
  background-color: var(--n-color-target);
  box-shadow: 0 0 0 2px var(--n-color-target);
}

/* REVIEW: wrong */
.choice--wrong {
  border-color: var(--n-color-target);
  background-color: var(--n-color-target);
  box-shadow: 0 0 0 2px var(--n-color-target);
}

/* Neutral: leicht zurücknehmen, aber nicht “grau kaputt” in dark */
.choice--neutral {
  opacity: 0.95;
}

/* Content emphasis */
.choice--selected :deep(.n-button__content),
.choice--correct :deep(.n-button__content),
.choice--wrong :deep(.n-button__content) {
  font-weight: 800;
}

/* Optional: bessere Lesbarkeit bei farbigem Hintergrund */
.choice--selected :deep(.n-button__content),
.choice--correct :deep(.n-button__content),
.choice--wrong :deep(.n-button__content) {
  color: var(--n-text-color);
}
</style>
