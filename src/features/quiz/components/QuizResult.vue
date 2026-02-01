<!-- src/features/quiz/components/QuizResult.vue -->
<script setup lang="ts">
import type { Quiz } from "../types/quiz.types";

const props = defineProps<{
  score: number;
  scorePct: number;
  total: number;
  quiz: Quiz | null;
  answers: Record<string, string>;
}>();

defineEmits<{ (e: "restart"): void; (e: "save"): void }>();

function verdict(pct: number) {
  if (pct >= 90) return "Sehr stark!";
  if (pct >= 70) return "Gut!";
  if (pct >= 50) return "Solide Basis.";
  return "Nochmal üben 🙂";
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 mb-2">Ergebnis</h2>

      <div class="display-6 mb-1">{{ props.score }} / {{ props.total }}</div>
      <div class="text-muted mb-3">
        {{ props.scorePct }}% · {{ verdict(props.scorePct) }}
      </div>

      <div class="d-flex gap-2 mb-4">
        <button class="btn btn-primary" @click="$emit('restart')">
          Nochmal
        </button>
        <button class="btn btn-outline-secondary" @click="$emit('save')">
          Ergebnis speichern
        </button>
      </div>

      <div v-if="props.quiz" class="accordion" id="quizReview">
        <div
          class="accordion-item"
          v-for="(q, i) in props.quiz.questions"
          :key="q.id">
          <h2 class="accordion-header" :id="`h-${q.id}`">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#c-${q.id}`">
              {{ i + 1 }}. {{ q.question }}
            </button>
          </h2>

          <div
            :id="`c-${q.id}`"
            class="accordion-collapse collapse"
            :data-bs-parent="'#quizReview'">
            <div class="accordion-body">
              <div class="mb-2">
                <div class="small text-muted">Deine Antwort</div>
                <div class="fw-semibold">
                  {{
                    q.choices.find((c) => c.id === props.answers[q.id])?.text ??
                    "—"
                  }}
                </div>
              </div>

              <div class="mb-2">
                <div class="small text-muted">Richtig</div>
                <div class="fw-semibold">
                  {{ q.choices.find((c) => c.id === q.correctChoiceId)?.text }}
                </div>
              </div>

              <div v-if="q.explanation" class="alert alert-light border mb-0">
                {{ q.explanation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
