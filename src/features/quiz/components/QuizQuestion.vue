<script setup lang="ts">
import { computed } from "vue";
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

const selectedChoiceId = computed<string | null>(() => {
  if (!props.question) return null;
  return props.answers[props.question.id] ?? null;
});

function onSelect(choiceId: string | null) {
  if (!props.question || !choiceId) return;
  emit("select", props.question.id, choiceId);
}
</script>

<template>
  <n-card v-if="props.question">
    <n-space vertical :size="14">
      <n-text depth="3" style="font-size: 12px">
        Frage {{ props.index + 1 }} / {{ props.total }}
      </n-text>

      <n-h3 style="margin: 0">{{ props.question.question }}</n-h3>

      <n-radio-group
        :value="selectedChoiceId"
        @update:value="onSelect"
        style="width: 100%">
        <n-space vertical :size="10" style="width: 100%">
          <n-radio-button
            v-for="c in props.question.choices"
            :key="c.id"
            :value="c.id"
            style="
              width: 100%;
              text-align: left;
              justify-content: space-between;
            ">
            <n-space align="center" justify="space-between" style="width: 100%">
              <span>{{ c.text }}</span>
              <n-tag
                v-if="selectedChoiceId === c.id"
                size="small"
                type="success">
                ✓
              </n-tag>
            </n-space>
          </n-radio-button>
        </n-space>
      </n-radio-group>

      <n-space justify="space-between">
        <n-button secondary :disabled="props.index === 0" @click="emit('prev')">
          Zurück
        </n-button>

        <n-button
          type="primary"
          :disabled="!props.canGoNext"
          @click="emit('next')">
          {{ props.isLast ? "Auswerten" : "Weiter" }}
        </n-button>
      </n-space>
    </n-space>
  </n-card>

  <n-alert v-else type="warning" :bordered="true">
    Keine Frage gefunden.
  </n-alert>
</template>
