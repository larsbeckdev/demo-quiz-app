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
  <n-card title="Ergebnis">
    <n-space vertical :size="12">
      <div>
        <n-text style="font-size: 32px; font-weight: 700">
          {{ props.score }} / {{ props.total }}
        </n-text>
        <div>
          <n-text depth="3">
            {{ props.scorePct }}% · {{ verdict(props.scorePct) }}
          </n-text>
        </div>
      </div>

      <n-space :size="8">
        <n-button type="primary" @click="$emit('restart')">Nochmal</n-button>
        <n-button secondary @click="$emit('save')">Ergebnis speichern</n-button>
      </n-space>

      <div v-if="props.quiz">
        <n-collapse accordion>
          <n-collapse-item
            v-for="(q, i) in props.quiz.questions"
            :key="q.id"
            :title="`${i + 1}. ${q.question}`"
            :name="q.id">
            <n-space vertical :size="10">
              <div>
                <n-text depth="3" style="font-size: 12px">Deine Antwort</n-text>
                <div>
                  <n-text strong>
                    {{
                      q.choices.find((c) => c.id === props.answers[q.id])
                        ?.text ?? "—"
                    }}
                  </n-text>
                </div>
              </div>

              <div>
                <n-text depth="3" style="font-size: 12px">Richtig</n-text>
                <div>
                  <n-text strong>
                    {{
                      q.choices.find((c) => c.id === q.correctChoiceId)?.text
                    }}
                  </n-text>
                </div>
              </div>

              <n-alert
                v-if="q.explanation"
                type="info"
                :bordered="true"
                :show-icon="false">
                {{ q.explanation }}
              </n-alert>
            </n-space>
          </n-collapse-item>
        </n-collapse>
      </div>
    </n-space>
  </n-card>
</template>
