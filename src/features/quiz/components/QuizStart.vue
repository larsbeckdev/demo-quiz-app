<!-- src/features/quiz/components/QuizStart.vue -->
<script setup lang="ts">
const props = defineProps<{
  lastRun: {
    quizId: string;
    score: number;
    total: number;
    finishedAt: number;
  } | null;
}>();

defineEmits<{ (e: "start"): void }>();

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}
</script>

<template>
  <n-card title="Bereit?">
    <n-space vertical :size="12">
      <n-text depth="3">
        Starte das Quiz und beantworte die Fragen nacheinander.
      </n-text>

      <n-alert v-if="props.lastRun" type="default" :bordered="true">
        <n-space vertical :size="4">
          <n-text depth="3" style="font-size: 12px">Letzter Lauf</n-text>
          <n-text strong>
            {{ props.lastRun.score }} / {{ props.lastRun.total }} Punkte
            <n-text depth="3" style="font-weight: 400">
              · {{ formatDate(props.lastRun.finishedAt) }}
            </n-text>
          </n-text>
        </n-space>
      </n-alert>

      <div>
        <n-button type="primary" @click="$emit('start')">
          Quiz starten
        </n-button>
      </div>
    </n-space>
  </n-card>
</template>
