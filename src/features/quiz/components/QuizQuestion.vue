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

function buttonType(choiceId: string) {
  // RUNNING: nur Auswahl hervorheben
  if (props.status === "running") {
    return isSelected(choiceId) ? "primary" : "default";
  }

  // REVIEW:
  const picked = isSelected(choiceId);
  const correct = isCorrectChoice(choiceId);

  // richtig gewählt
  if (picked && correct) return "success";

  // falsch gewählt
  if (picked && !correct) return "error";

  // richtig, aber NICHT gewählt -> trotzdem success (soft per CSS)
  if (!picked && correct) return "success";

  // falsch & nicht gewählt
  return "default";
}

function buttonSecondary(choiceId: string) {
  if (props.status === "running") return true;

  const picked = isSelected(choiceId);
  const correct = isCorrectChoice(choiceId);

  // richtig, aber nicht gewählt -> „soft“ (secondary) + opacity via class
  if (!picked && correct) return true;

  // rest normal ebenfalls secondary, damit es wie "filled soft" aussieht
  return true;
}

function choiceClass(choiceId: string) {
  if (props.status === "running") {
    return isSelected(choiceId) ? "choice--picked" : "choice--idle";
  }

  const picked = isSelected(choiceId);
  const correct = isCorrectChoice(choiceId);

  if (!picked && correct) return "choice--missed-correct";
  if (!picked && !correct) return "choice--neutral";

  // picked (correct/wrong) -> stärker
  return "choice--picked";
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
          :type="buttonType(c.id)"
          :secondary="buttonSecondary(c.id)"
          style="width: 100%; justify-content: space-between"
          :class="choiceClass(c.id)"
          @click="onPick(c.id)">
          <span>{{ c.text }}</span>
        </n-button>
      </n-space>

      <!-- Review hint -->
      <n-alert
        v-if="props.status === 'review'"
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
/* smoother transitions */
.choice--picked,
.choice--missed-correct,
.choice--neutral,
.choice--idle {
  transition: opacity 120ms ease;
}

/* RUNNING/REVIEW: ausgewählte Antworten mehr Gewicht */
.choice--picked :deep(.n-button__content) {
  font-weight: 800;
}

/* REVIEW: korrekt aber NICHT gewählt -> grün, aber softer */
.choice--missed-correct {
  opacity: 0.72;
}

/* REVIEW: falsch & nicht gewählt -> neutral, leicht zurück */
.choice--neutral {
  opacity: 0.9;
}

/* RUNNING: nicht gewählt normal */
.choice--idle {
  opacity: 1;
}
</style>
