<script setup lang="ts">
import type { QuizQuestion } from "../types/quiz.types";

const props = defineProps<{
  question: QuizQuestion | null;
  index: number;
  total: number;
  answers: Record<string, string>;
  canGoNext: boolean;
  isLast: boolean;
}>();

const emit = defineEmits<{
  (e: "select", questionId: string, choiceId: string): void;
  (e: "prev"): void;
  (e: "next"): void;
}>();

function selected(choiceId: string) {
  if (!props.question) return false;
  return props.answers[props.question.id] === choiceId;
}
</script>

<template>
  <div v-if="props.question" class="card shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="text-muted small">
          Frage {{ props.index + 1 }} / {{ props.total }}
        </div>
      </div>

      <h2 class="h5 mb-3">{{ props.question.question }}</h2>

      <div class="list-group mb-3">
        <button
          v-for="c in props.question.choices"
          :key="c.id"
          type="button"
          class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
          :class="{ active: selected(c.id) }"
          @click="emit('select', props.question!.id, c.id)">
          <span>{{ c.text }}</span>
          <span v-if="selected(c.id)" class="badge text-bg-light">✓</span>
        </button>
      </div>

      <div class="d-flex gap-2">
        <button
          class="btn btn-outline-secondary"
          :disabled="props.index === 0"
          @click="emit('prev')">
          Zurück
        </button>

        <button
          class="btn btn-primary ms-auto"
          :disabled="!props.canGoNext"
          @click="emit('next')">
          {{ props.isLast ? "Auswerten" : "Weiter" }}
        </button>
      </div>
    </div>
  </div>

  <div v-else class="alert alert-warning">Keine Frage gefunden.</div>
</template>
