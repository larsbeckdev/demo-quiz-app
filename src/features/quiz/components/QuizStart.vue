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
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5">Bereit?</h2>
      <p class="text-muted mb-3">
        Starte das Quiz und beantworte die Fragen nacheinander.
      </p>

      <div v-if="props.lastRun" class="alert alert-light border">
        <div class="small text-muted">Letzter Lauf</div>
        <div class="fw-semibold">
          {{ props.lastRun.score }} / {{ props.lastRun.total }} Punkte
          <span class="text-muted fw-normal"
            >· {{ formatDate(props.lastRun.finishedAt) }}</span
          >
        </div>
      </div>

      <button class="btn btn-primary" @click="$emit('start')">
        Quiz starten
      </button>
    </div>
  </div>
</template>
